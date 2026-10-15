/**
 * When each page's content last changed, for `<lastmod>` in the sitemap.
 * Dates come from the content itself: the Sanity documents a page shows,
 * and the `updated` date in each legal page's front matter. A page whose
 * words live only in code gets no date, so a redeploy never makes every
 * page look new. Bing reads these dates; Google uses them once it finds
 * them accurate.
 */
import { readdir, readFile } from "node:fs/promises";
import { sanity } from "../sanity/client.ts";
import { canonicalPath } from "./seo.ts";

type Doc = {
  _id: string;
  _type: string;
  slug: string | null;
  _updatedAt: string;
};

const QUERY = `*[_type in ["homePage", "pageSettings", "capability", "industry", "insight", "opportunity"]]{
  _id, _type, "slug": slug.current, _updatedAt
}`;

/** Pages edited as one Sanity document, by document id. */
const PAGE_DOCS: Record<string, string> = {
  homePage: "/",
  "page-about": "/about",
  "page-contact": "/contact",
  "page-careers": "/careers",
  "page-capabilities": "/capabilities",
  "page-industries": "/industries",
  "page-insights": "/insights",
};

/** Where each content type has a page of its own. */
const DETAIL_PAGES: Record<string, string> = {
  capability: "/capabilities",
  industry: "/industries",
  insight: "/insights",
};

/** The listing page that shows every document of a type. */
const LISTED_ON: Record<string, string> = {
  capability: "/capabilities",
  industry: "/industries",
  insight: "/insights",
  opportunity: "/careers",
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

/** Keeps the later of two dates for a page. */
function touch(dates: Map<string, string>, path: string, date: string) {
  if (!ISO_DATE.test(date) || Number.isNaN(Date.parse(date))) return;
  const current = dates.get(path);
  if (!current || Date.parse(date) > Date.parse(current)) {
    dates.set(path, date);
  }
}

async function load(legalDir: URL): Promise<Map<string, string>> {
  const dates = new Map<string, string>();

  for (const doc of await sanity.fetch<Doc[]>(QUERY)) {
    const own = PAGE_DOCS[doc._id];
    if (own) touch(dates, own, doc._updatedAt);
    if (DETAIL_PAGES[doc._type] && doc.slug) {
      touch(dates, `${DETAIL_PAGES[doc._type]}/${doc.slug}`, doc._updatedAt);
    }
    const listing = LISTED_ON[doc._type];
    if (listing) touch(dates, listing, doc._updatedAt);
  }

  /* Legal pages carry their own date once counsel has set one; until then
     it is a [placeholder] and the page gets no date. The hub shows them
     all, so it takes the latest. */
  for (const file of await readdir(legalDir)) {
    if (!file.endsWith(".md")) continue;
    const text = await readFile(new URL(file, legalDir), "utf8");
    const updated = /^updated:\s*["']?([^"'\n]+)/m.exec(text)?.[1]?.trim();
    if (!updated) continue;
    touch(dates, `/legal/${file.replace(/\.md$/, "")}`, updated);
    touch(dates, "/legal", updated);
  }

  return dates;
}

let cached: Promise<Map<string, string>> | undefined;

/**
 * The last-modified date of every page that has one, keyed by canonical
 * path. If the dates can't be read, the sitemap is written without them.
 */
export function pageDates(legalDir: URL): Promise<Map<string, string>> {
  cached ??= load(legalDir).catch((error: unknown) => {
    console.warn(`[sitemap] Pages listed without dates: ${String(error)}`);
    return new Map<string, string>();
  });
  return cached;
}

/** The date for one sitemap address, if the page has one. */
export async function lastmodFor(
  url: string,
  legalDir: URL,
): Promise<string | undefined> {
  return (await pageDates(legalDir)).get(canonicalPath(new URL(url).pathname));
}
