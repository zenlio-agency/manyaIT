import { tbc } from "@/data/site.ts";
import { SITE_LOCALE } from "@/consts.ts";

/** Lets each table scroll sideways inside its own box on narrow screens. */
export const wrapTables = (html: string) =>
  html
    .replace(
      /<table>/g,
      '<div class="table-scroll" role="region" aria-label="Table" tabindex="0"><table>',
    )
    .replace(/<\/table>/g, "</table></div>");

/** Marks `[placeholder]` runs in text, leaving tags and attributes alone. */
export const markPlaceholders = (html: string) =>
  html.replace(/>([^<]+)</g, (_, text: string) => `>${tbc(text)}<`);

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** An ISO date as a `<time>`, or a placeholder marked for review. */
export function dateOrPlaceholder(value: string): string {
  if (!ISO_DATE.test(value)) return tbc(value);
  const label = new Date(`${value}T00:00:00Z`).toLocaleDateString(SITE_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return `<time datetime="${value}">${label}</time>`;
}
