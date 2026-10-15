import {
  escapeHTML,
  toHTML,
  uriLooksSafe,
  type PortableTextBlockComponent,
  type PortableTextMarkComponent,
} from "@portabletext/to-html";
import GithubSlugger from "github-slugger";
import { sanityPhoto, type SanityImage } from "./image.ts";

/*
 * Rich text from Sanity (Portable Text) as the same HTML Astro makes from
 * Markdown, with the same heading ids, so RichText, ArticleText and FaqList
 * take it unchanged. As with Markdown, those components then wrap tables in
 * their scroll box and mark `[placeholders]` for review.
 */

type Block = { _type: string; _key?: string };
type Span = { _type: string; text?: string };
type TableRow = { cells?: string[] | null };
/** The fields of the block types the plain text reads. */
type Readable = Block & {
  children?: Span[];
  rows?: TableRow[] | null;
  text?: string;
};

/** The words of rich text, for read times and checks. */
export function plainText(blocks: Block[] | null | undefined): string {
  return ((blocks ?? []) as Readable[])
    .map((block) => {
      if (block._type === "block")
        return (block.children ?? []).map((span) => span.text ?? "").join("");
      if (block._type === "table")
        return (block.rows ?? [])
          .map((row) => (row.cells ?? []).join(" "))
          .join("\n");
      if (block._type === "callout") return block.text ?? "";
      return "";
    })
    .join("\n\n");
}

/** Links in rich text, kept only when the address looks safe. */
const link: PortableTextMarkComponent = ({ value, children }) => {
  const href = String(value?.href ?? "");
  return uriLooksSafe(href)
    ? `<a href="${escapeHTML(href)}">${children}</a>`
    : children;
};

/**
 * Short rich text, such as an FAQ answer, as inline HTML for a component
 * that sets its own paragraph: each paragraph's words with their links and
 * emphasis, with a blank line between paragraphs.
 */
export function inlineHtml(blocks: Block[] | null | undefined): string {
  return (blocks ?? [])
    .map((block) =>
      toHTML([block], {
        components: {
          block: { normal: ({ children }) => children ?? "" },
          marks: { link },
        },
        onMissingComponent: (message) => {
          throw new Error(`Portable Text: ${message}`);
        },
      }),
    )
    .filter(Boolean)
    .join("<br /><br />");
}

/** The first row is the header, as in the Markdown tables. */
function tableHtml(rows: TableRow[]): string {
  const [head, ...body] = rows.map((row) =>
    (row.cells ?? []).map((cell) => escapeHTML(cell)),
  );
  if (!head) return "";
  const cells = (tag: string, values: string[]) =>
    values.map((value) => `<${tag}>${value}</${tag}>`).join("");
  return `<table><thead><tr>${cells("th", head)}</tr></thead><tbody>${body
    .map((row) => `<tr>${cells("td", row)}</tr>`)
    .join("")}</tbody></table>`;
}

/**
 * Rich text as HTML. Images in the text are copied into the build first,
 * `imageWidth` wide at most.
 */
export async function portableTextToHtml(
  blocks: Block[] | null | undefined,
  { imageWidth = 1200 }: { imageWidth?: number } = {},
): Promise<string> {
  if (!blocks?.length) return "";

  const photos = new Map<string, Awaited<ReturnType<typeof sanityPhoto>>>();
  for (const block of blocks) {
    if (block._type === "imageWithAlt" && block._key) {
      photos.set(
        block._key,
        await sanityPhoto(block as unknown as SanityImage, {
          width: imageWidth,
        }),
      );
    }
  }

  /* Ids as Astro's Markdown makes them, so links to a section keep working. */
  const slugger = new GithubSlugger();
  const heading =
    (tag: "h2" | "h3"): PortableTextBlockComponent =>
    ({ value, children }) =>
      `<${tag} id="${slugger.slug(plainText([value]))}">${children}</${tag}>`;

  return toHTML(blocks, {
    components: {
      block: { h2: heading("h2"), h3: heading("h3") },
      marks: { link },
      types: {
        imageWithAlt: ({ value }) => {
          const photo = photos.get(value._key);
          if (!photo) return "";
          return `<figure><img src="${photo.src}" alt="${escapeHTML(
            photo.alt,
          )}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async" /></figure>`;
        },
        table: ({ value }) => tableHtml(value.rows ?? []),
        callout: ({ value }) =>
          `<aside class="callout"><p>${escapeHTML(String(value.text ?? ""))}</p></aside>`,
      },
    },
    /* Content the site doesn't know how to show stops the build, rather
       than quietly going missing. */
    onMissingComponent: (message) => {
      throw new Error(`Portable Text: ${message}`);
    },
  });
}
