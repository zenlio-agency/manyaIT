/**
 * Every fact the brief leaves open lives here, so it can be confirmed and
 * replaced in one place. Each value renders on the site exactly as written,
 * in square brackets, until it is replaced with approved copy.
 *
 * Never replace a value with a guess. When a value is confirmed, write the
 * approved value here; `open` below then stops listing it.
 */

/** True while a value is still an unconfirmed placeholder. */
export function isPlaceholder(value: string): boolean {
  return value.includes("[");
}

/** A metric figure not yet supplied, e.g. "[X]%" in a result line. */
export const figure = "[X]";

export const placeholders = {
  /** Legal entity suffix in the footer copyright line. */
  legalEntity: "[LLC — confirm]",
  /** Company LinkedIn page. Rendered as text, not a link, until it is a URL. */
  linkedinUrl: "[company page URL]",
  /** Logo row on the home page. Only approved client logos go live. */
  clientLogo: "[Client logo]",
} as const;

/** Open placeholders, for the pre-launch checklist. */
export const open = Object.entries(placeholders)
  .filter(([, value]) => isPlaceholder(value))
  .map(([key, value]) => ({ key, value }));
