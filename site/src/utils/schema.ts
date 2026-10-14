/**
 * Schema.org structured data (JSON-LD). Every node describes what the page
 * already shows; nothing here adds a claim the page doesn't make.
 * Rendered by `components/utility/JsonLd.astro`.
 */
import { SITE_NAME, SITE_URL } from "../consts.ts";
import { canonicalPath } from "./seo.ts";

type Node = Record<string, unknown>;

/** An absolute URL on the canonical host, in canonical form. */
export const absolute = (path: string) =>
  new URL(canonicalPath(path), SITE_URL).href;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** A published contact value, or nothing while it is empty or still a
    `[placeholder]`. */
const confirmed = (value?: string) =>
  value && !/\[|\]/.test(value) ? value.trim() : undefined;

/** The company and the site, on every page. `sameAs` takes only profiles
    with a real address (Site settings → Social); the contact point uses the
    company email and phone shown beside the contact form. */
export function siteGraph(
  sameAs: string[],
  description?: string,
  contact: { email?: string; phone?: string } = {},
): Node[] {
  const email = confirmed(contact.email);
  const telephone = confirmed(contact.phone);
  return [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: absolute("/"),
      logo: {
        "@type": "ImageObject",
        url: new URL("/images/logo-brand.png", SITE_URL).href,
        width: 700,
        height: 110,
      },
      ...(description && { description }),
      ...(sameAs.length > 0 && { sameAs }),
      ...((email || telephone) && {
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          url: absolute("/contact"),
          ...(email && { email }),
          ...(telephone && { telephone }),
        },
      }),
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: SITE_NAME,
      url: absolute("/"),
      inLanguage: "en-US",
      ...(description && { description }),
      publisher: { "@id": ORGANIZATION_ID },
    },
  ];
}

/** Section names for the first path segment, as the nav labels them. */
const SECTIONS: Record<string, string> = {
  about: "About",
  capabilities: "Capabilities",
  industries: "Industries",
  careers: "Careers",
  insights: "Insights",
  legal: "Legal",
  contact: "Contact",
};

/** Home → section → page, from the path. `name` is the current page's. */
export function breadcrumbs(pathname: string, name: string): Node | undefined {
  const segments = canonicalPath(pathname).split("/").filter(Boolean);
  if (segments.length === 0) return undefined;
  const trail = [{ name: "Home", path: "/" }];
  if (segments.length > 1 && SECTIONS[segments[0]]) {
    trail.push({ name: SECTIONS[segments[0]], path: `/${segments[0]}` });
  }
  /* A section's own page goes by its nav label, not its long title. */
  const own = segments.length === 1 ? SECTIONS[segments[0]] : undefined;
  trail.push({ name: own ?? name, path: `/${segments.join("/")}` });
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}

/** A capability page, as a service ManyaIT provides. */
export function service(input: {
  name: string;
  description?: string;
  pathname: string;
}): Node {
  return {
    "@type": "Service",
    name: input.name,
    serviceType: input.name,
    ...(input.description && { description: input.description }),
    url: absolute(input.pathname),
    provider: { "@id": ORGANIZATION_ID },
  };
}

const plain = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** The FAQ shown on the page. Questions still holding a `[placeholder]`
    are left out, so nothing unconfirmed is marked up. */
export function faqPage(
  items: { question: string; answer: string }[],
): Node | undefined {
  const entries = items
    .map((item) => ({ question: item.question.trim(), answer: plain(item.answer) }))
    .filter(
      (item) =>
        item.question &&
        item.answer &&
        !/\[[^\]]*\]/.test(item.question + item.answer),
    );
  if (entries.length === 0) return undefined;
  return {
    "@type": "FAQPage",
    mainEntity: entries.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** A blog article. Dates are left out until they are real ISO dates. */
export function blogPosting(input: {
  title: string;
  description: string;
  pathname: string;
  image: string;
  published?: string;
  updated?: string;
  author: string;
}): Node {
  const url = absolute(input.pathname);
  const isDate = (value?: string) =>
    value && !Number.isNaN(Date.parse(value)) ? value : undefined;
  const published = isDate(input.published);
  const updated = isDate(input.updated);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: url,
    image: new URL(input.image, SITE_URL).href,
    inLanguage: "en-US",
    ...(published && { datePublished: published }),
    /* Only a real edit after publishing counts as a modification. */
    ...(published &&
      updated &&
      Date.parse(updated) > Date.parse(published) && {
        dateModified: updated,
      }),
    /* Articles credited to the company's team are authored by ManyaIT. */
    author: input.author.includes(SITE_NAME)
      ? { "@id": ORGANIZATION_ID }
      : { "@type": "Person", name: input.author },
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}
