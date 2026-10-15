import type { AstroIntegration } from "astro";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { sanity } from "../sanity/client.ts";
import {
  BANNED_WORDS,
  COPY_EXCEPTIONS,
  FOOTER_ONLY_PLACES,
  type CopyRule,
} from "../data/copy-rules.ts";

/**
 * Checks every build, once the pages are written:
 *
 * - claims (figures, client logos, case-study quotes and client names, the
 *   ecosystem company) that aren't confirmed yet, the same list as Studio's
 *   "Proof & claims → Not confirmed yet";
 * - `[placeholders]` left on a page;
 * - the copy rules in `src/data/copy-rules.ts`: banned words, and the
 *   office cities outside the footer;
 * - office addresses that differ from the ones the legal notices give;
 * - two published items of one type sharing a page address.
 *
 * Review builds list what it finds and carry on. With STRICT_CONTENT=1, set
 * for the live site, anything it finds stops the build, so the version
 * already live stays up. A shared page address stops every build, because
 * one of the two pages would be lost.
 *
 * The legal notices are counsel's wording, so the copy rules skip them;
 * placeholders are still caught there.
 */
export default function contentCheck(): AstroIntegration {
  let root: URL;
  return {
    name: "content-check",
    hooks: {
      "astro:config:done": ({ config }) => {
        root = config.root;
      },
      "astro:build:done": async ({ dir, logger }) => {
        const strict = process.env.STRICT_CONTENT === "1";
        const pages = await readPages(fileURLToPath(dir));
        const content = await sanity.fetch<Content>(CONTENT_QUERY);

        const findings = [
          ...checkClaims(content, strict),
          ...checkPlaceholders(pages),
          ...checkCopy(pages),
          ...checkAddresses(content, pages),
        ];
        const blocking = checkSlugs(content);

        for (const note of await studioListDrift(root)) logger.warn(note);
        for (const note of unusedExceptions(pages)) logger.warn(note);
        if (!content.imported && !strict) {
          logger.info(
            "Sanity has no content yet; claims are checked once it's imported.",
          );
        }

        for (const finding of findings) logger.warn(finding);

        if (blocking.length) {
          throw new Error(
            `content-check: ${blocking.length} problem(s) stop this build${strict ? " (STRICT_CONTENT=1)" : ""}:\n  ${blocking.join("\n  ")}`,
          );
        }
        logger.info(
          findings.length
            ? `${findings.length} to fix before launch; the live build (STRICT_CONTENT=1) stops on these.`
            : "Nothing to fix.",
        );
      },
    },
  };
}

/* ---------------------------------------------------------------------------
 * Published content
 */

type Stat = { value?: string; label?: string };
type Content = {
  imported: boolean;
  figures: { _type: string; name: string; open: Stat[] }[];
  logos: string[];
  companies: string[];
  quotes: { title: string; count: number }[];
  clientNames: string[];
  slugs: { _id: string; _type: string; slug: string }[];
  locations: { _id: string; short?: string; address: string }[];
};

/* The claims match studio/structure/index.ts (UNCONFIRMED_FILTER): change
   the two together. Drafts aren't published, so they never count. */
const CONTENT_QUERY = /* groq */ `{
  "imported": defined(*[_id == "homePage"][0]._id),
  "figures": *[_type in ["homePage", "capability", "industry", "caseStudy"]]{
    _type,
    "name": coalesce(title, "Homepage"),
    "open": coalesce(stats, [])[confirmed != true]{ value, label }
      + coalesce(outcomes, [])[confirmed != true]{ value, label }
      + select(
          defined(metric) && metric.confirmed != true => [metric{ value, label }],
          []
        )
  }[count(open) > 0],
  "logos": *[_type == "clientLogo" && permissionConfirmed != true].name,
  "companies": *[_type == "ecosystemCompany" && relationshipConfirmed != true].name,
  "quotes": *[_type == "caseStudy" && count(quotes[confirmed != true]) > 0]{
    title,
    "count": count(quotes[confirmed != true])
  },
  "clientNames": *[_type == "caseStudy"
    && defined(clientPermission.clientName)
    && clientPermission.confirmed != true].title,
  "slugs": *[defined(slug.current)]{ _id, _type, "slug": slug.current },
  "locations": *[_type == "location" && defined(address)]{ _id, short, address }
}`;

const TYPE_NAMES: Record<string, string> = {
  homePage: "Homepage",
  capability: "Capability",
  industry: "Industry",
  caseStudy: "Case study",
};

function checkClaims(content: Content, strict: boolean): string[] {
  const found: string[] = [];
  /* Without the content, nothing says whether the claims on the site are
     confirmed, so the live build can't go ahead. */
  if (strict && !content.imported) {
    found.push(
      "Sanity has no homepage yet, so the claims on the site can't be checked. Import the content first.",
    );
  }
  for (const { _type, name, open } of content.figures) {
    const where =
      _type === "homePage" ? "Homepage" : `${TYPE_NAMES[_type]} "${name}"`;
    for (const { value, label } of open) {
      found.push(`claim: ${where}, figure "${value} ${label}" isn't confirmed`);
    }
  }
  for (const name of content.logos) {
    found.push(`claim: client logo "${name}" has no confirmed permission`);
  }
  for (const name of content.companies) {
    found.push(
      `claim: ecosystem company "${name}" has no confirmed relationship`,
    );
  }
  for (const { title, count } of content.quotes) {
    found.push(
      `claim: case study "${title}" has ${count} quote(s) not approved`,
    );
  }
  for (const title of content.clientNames) {
    found.push(
      `claim: case study "${title}" names its client without confirmed permission`,
    );
  }
  return found;
}

function checkSlugs(content: Content): string[] {
  const seen = new Map<string, string[]>();
  for (const { _id, _type, slug } of content.slugs) {
    const key = `${_type} "${slug}"`;
    seen.set(key, [...(seen.get(key) ?? []), _id]);
  }
  return [...seen]
    .filter(([, ids]) => ids.length > 1)
    .map(
      ([key, ids]) =>
        `address: ${ids.length} published items (${ids.join(", ")}) share the ${key} page address`,
    );
}

/** One line, as the legal notices print an address. */
const oneLine = (address: string) =>
  squash(
    address
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join(", "),
  );

function checkAddresses(content: Content, pages: Page[]): string[] {
  const legal = pages
    .filter((page) => isLegal(page.route))
    .map((page) => page.main)
    .join(" ");
  if (!legal) return [];
  return content.locations
    .filter(({ address }) => !legal.includes(oneLine(address)))
    .map(
      ({ _id, short, address }) =>
        `legal: the ${short ?? _id} address in Studio ("${oneLine(address)}") isn't the one the legal notices give. Correct it in Studio, or have counsel update src/data/legal.ts.`,
    );
}

/* ---------------------------------------------------------------------------
 * Built pages
 */

type Page = {
  route: string;
  /** Visible text, plus alt text, labels and the meta title and description. */
  text: string;
  /** The same without the footer. */
  main: string;
};

const isLegal = (route: string) => route.startsWith("/legal/");

async function readPages(dist: string): Promise<Page[]> {
  const pages: Page[] = [];
  for (const entry of await readdir(dist, {
    recursive: true,
    withFileTypes: true,
  })) {
    if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
    const path = join(entry.parentPath, entry.name);
    const html = (await readFile(path, "utf8")).replace(
      /<(script|style)\b[\s\S]*?<\/\1>/g,
      "",
    );
    /* Redirect stubs have no content of their own. */
    if (/<meta\s+http-equiv="refresh"/i.test(html)) continue;
    const route = `/${relative(dist, path)
      .split("\\")
      .join("/")
      .replace(/(^|\/)index\.html$/, "$1")}`;
    pages.push({
      route,
      text: readable(html),
      main: readable(html.replace(/<footer\b[\s\S]*?<\/footer>/g, "")),
    });
  }
  return pages;
}

const META =
  /^(description|og:title|og:description|twitter:title|twitter:description)$/;

function readable(html: string) {
  const attributes = [
    ...html.matchAll(/\s(?:alt|title|aria-label|placeholder)="([^"]*)"/g),
  ].map(([, value]) => value);
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/g)) {
    const name = tag.match(/\s(?:name|property)="([^"]*)"/)?.[1] ?? "";
    const value = tag.match(/\scontent="([^"]*)"/)?.[1];
    if (META.test(name) && value) attributes.push(value);
  }
  return squash(
    decode(`${html.replace(/<[^>]+>/g, " ")} ${attributes.join(" ")}`),
  );
}

function checkPlaceholders(pages: Page[]): string[] {
  return group(
    pages.flatMap(({ route, text }) =>
      [...text.matchAll(/\[[^\]]{1,80}\]/g)].map((match) => ({
        route,
        issue: `placeholder: "${match[0]}" in "${around(text, match)}"`,
      })),
    ),
  );
}

function checkCopy(pages: Page[]): string[] {
  const hits: { route: string; issue: string }[] = [];
  for (const page of pages) {
    if (isLegal(page.route)) continue;
    const scan = (
      what: string,
      rules: CopyRule[],
      text: string,
      allowed: [number, number][] = [],
    ) => {
      for (const { word, pattern } of rules) {
        for (const match of text.matchAll(everywhere(pattern))) {
          const start = match.index;
          const end = start + match[0].length;
          if (allowed.some(([from, to]) => from <= start && end <= to)) {
            continue;
          }
          hits.push({
            route: page.route,
            issue: `${what}: "${word}" in "${around(text, match)}"`,
          });
        }
      }
    };
    scan("banned word", BANNED_WORDS, page.text, exceptionSpans(page));
    scan("city outside the footer", FOOTER_ONLY_PLACES, page.main);
  }
  return group(hits);
}

/** Where on a page the exceptions' phrases appear, as [start, end] spans. */
function exceptionSpans(page: Page): [number, number][] {
  const spans: [number, number][] = [];
  for (const { page: route, phrase } of COPY_EXCEPTIONS) {
    if (route !== page.route) continue;
    for (
      let at = page.text.indexOf(phrase);
      at !== -1;
      at = page.text.indexOf(phrase, at + 1)
    ) {
      spans.push([at, at + phrase.length]);
    }
  }
  return spans;
}

function unusedExceptions(pages: Page[]): string[] {
  return COPY_EXCEPTIONS.filter(
    ({ page: route, phrase }) =>
      !pages.some((page) => page.route === route && page.text.includes(phrase)),
  ).map(
    ({ page, phrase }) =>
      `The copy exception for "${phrase}" on ${page} is no longer needed: remove it from src/data/copy-rules.ts.`,
  );
}

/**
 * The Studio warns editors about the same banned words. It's a separate
 * app, so it keeps its own copy of the list; this compares the two when the
 * Studio is in the checkout.
 */
async function studioListDrift(root: URL): Promise<string[]> {
  let source: string;
  try {
    source = await readFile(
      new URL("../studio/lib/validation.ts", root),
      "utf8",
    );
  } catch {
    return [];
  }
  const studio = new Set(
    [...source.matchAll(/pattern:\s*(\/(?:\\.|[^/\\\n])+\/[a-z]*)/g)].map(
      ([, pattern]) => pattern,
    ),
  );
  const site = new Set(BANNED_WORDS.map(({ pattern }) => String(pattern)));
  const differ = [
    ...[...site].filter((pattern) => !studio.has(pattern)),
    ...[...studio].filter((pattern) => !site.has(pattern)),
  ];
  return differ.length
    ? [
        `The banned words in studio/lib/validation.ts and src/data/copy-rules.ts differ (${differ.join(", ")}). Keep them the same.`,
      ]
    : [];
}

/* ---------------------------------------------------------------------------
 * Helpers
 */

/** One line per issue, with the pages it's on. */
function group(hits: { route: string; issue: string }[]): string[] {
  const routes = new Map<string, Set<string>>();
  for (const { route, issue } of hits) {
    routes.set(issue, (routes.get(issue) ?? new Set()).add(route));
  }
  return [...routes].map(([issue, on]) => {
    const list = [...on].sort();
    const shown =
      list.length > 3
        ? `${list.slice(0, 3).join(", ")} and ${list.length - 3} more`
        : list.join(", ");
    return `${issue} (${shown})`;
  });
}

const everywhere = (pattern: RegExp) =>
  new RegExp(
    pattern.source,
    pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`,
  );

const around = (text: string, match: RegExpMatchArray) => {
  const start = match.index ?? 0;
  return `…${text.slice(Math.max(0, start - 40), start + match[0].length + 40).trim()}…`;
};

const squash = (text: string) => text.replace(/\s+/g, " ").trim();

function decode(text: string) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}
