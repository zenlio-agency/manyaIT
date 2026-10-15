import type {
  CustomValidator,
  PortableTextBlock,
  SlugValidationContext,
} from "sanity";
import { API_VERSION } from "./constants";

/**
 * Words the site's copy rules never use (see site/README.md, "Copy rules").
 * Studio shows a warning, and the website build checks every page again with
 * its own copy of this list, site/src/data/copy-rules.ts: change the two
 * together.
 */
export const BANNED_WORDS: { word: string; pattern: RegExp }[] = [
  { word: "recruiting / recruitment", pattern: /recruit/i },
  { word: "staffing", pattern: /staffing/i },
  { word: "staff augmentation", pattern: /staff aug/i },
  { word: "hire / hired / hiring", pattern: /\bhir(e|ed|es|ing)\b/i },
  { word: "placement", pattern: /placement/i },
  { word: "headhunting", pattern: /headhunt/i },
  { word: "outsourcing", pattern: /outsourc/i },
  { word: "consulting / consultant", pattern: /consult/i },
  { word: "agency", pattern: /agenc(y|ies)/i },
  { word: "contractor", pattern: /contractor/i },
  { word: "engagement", pattern: /engagement/i },
  { word: "bench", pattern: /\bbench\b/i },
  { word: "resources", pattern: /\bresources?\b/i },
  { word: "manpower", pattern: /manpower/i },
  { word: "vendor", pattern: /vendor/i },
  { word: "GCC", pattern: /\bGCCs?\b/ },
  { word: "capability center", pattern: /capabilit(y|ies) cent(er|re)s?/i },
  {
    word: "build-operate-transfer",
    pattern: /build[-,\s]+operate[-,\s]+(and\s+)?transfer/i,
  },
  { word: "BOT", pattern: /\bBOT\b/ },
  { word: "headcount", pattern: /headcount/i },
  { word: "skills brief", pattern: /skills? brief/i },
];

/** Plain text of a value: a string, a string list or Portable Text. */
export function plainText(value: unknown): string {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      const block = item as PortableTextBlock & {
        children?: { text?: string }[];
      };
      return (block.children ?? []).map((child) => child.text ?? "").join("");
    })
    .join(" ");
}

/** Warns when text uses a word the copy rules ban. */
export const noBannedWords: CustomValidator<unknown> = (value) => {
  const text = plainText(value);
  const found = BANNED_WORDS.filter(({ pattern }) => pattern.test(text)).map(
    ({ word }) => word,
  );
  return found.length
    ? `The site's copy rules don't use: ${found.join(", ")}. See the copy rules in the editor guide.`
    : true;
};

/**
 * A confirmed claim needs who confirmed it, when, and the evidence. Used on
 * stats, client logos, quotes and ecosystem companies.
 */
export const confirmationComplete =
  (flag: string): CustomValidator<Record<string, unknown> | undefined> =>
  (value) => {
    if (!value?.[flag]) return true;
    const missing = ["confirmedBy", "confirmedOn", "evidence"].filter(
      (key) => !value[key],
    );
    return missing.length
      ? `Add who confirmed this, when, and the evidence before marking it confirmed (missing: ${missing.join(", ")}).`
      : true;
  };

/**
 * Stops a published page's address from changing by accident: changing it
 * breaks links and search results. An administrator can allow a change with
 * "Allow address change", and a developer then adds a redirect.
 */
export const slugGuard: CustomValidator<
  { current?: string } | undefined
> = async (value, context) => {
  const document = context.document as
    { _id?: string; allowSlugChange?: boolean } | undefined;
  if (!document?._id || document.allowSlugChange) return true;
  const publishedId = document._id.replace(/^drafts\./, "");
  const client = (context as unknown as SlugValidationContext).getClient({
    apiVersion: API_VERSION,
  });
  const published = await client.fetch<string | null>(
    `*[_id == $id][0].slug.current`,
    { id: publishedId },
  );
  if (published && value?.current && value.current !== published) {
    return `This page is live at "${published}". Changing its address breaks existing links. Ask an administrator to allow the change, and a developer to add a redirect.`;
  }
  return true;
};
