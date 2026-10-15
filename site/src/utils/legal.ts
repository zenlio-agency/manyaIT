import {
  dateOrPlaceholder,
  markPlaceholders,
  wrapTables,
} from "@/utils/html.ts";
import { LEGAL_TOKENS } from "@/data/legal.ts";

/** An ISO date as a `<time>`, or a placeholder marked for review. */
export const legalDate = dateOrPlaceholder;

const plain = (html: string) => html.replace(/<[^>]+>/g, "").trim();

/**
 * Finishes the HTML rendered from a legal Markdown file. It fills the
 * `{{key}}` tokens from `LEGAL_TOKENS`, numbers each H2 and gives it a link
 * to itself, lets tables scroll sideways inside their own box, and marks
 * bracketed placeholders. An unknown token fails the build.
 */
export function finishLegalHtml(html: string): string {
  let section = 0;
  const numbered = html
    .replace(/\{\{\s*(\w+)\s*\}\}/g, (token, key: string) => {
      const value = LEGAL_TOKENS[key];
      if (value === undefined) throw new Error(`Unknown legal token ${token}`);
      return value;
    })
    .replace(
      /<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g,
      (_, id: string, text: string) => {
        section += 1;
        return `<h2 id="${id}"><span class="legal_num">${section}.</span> ${text}<a class="legal_anchor" href="#${id}" aria-label="Link to section ${section}, ${plain(text)}">#</a></h2>`;
      },
    );
  return markPlaceholders(wrapTables(numbered));
}
