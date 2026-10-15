import { defineArrayMember, defineField, defineType } from "sanity";
import { BlockquoteIcon } from "@sanity/icons/Blockquote";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { ThListIcon } from "@sanity/icons/ThList";
import { noBannedWords } from "../../lib/validation";

/** Links inside text: to another page of the site, or a full web address. */
const linkAnnotation = defineArrayMember({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "href",
      title: "Address",
      type: "string",
      description:
        'A page on this site, e.g. "/careers", or a full address starting with https://',
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            typeof value === "string" &&
            (/^\/[^\s]*$/.test(value) ||
              /^https:\/\/[^\s]+$/.test(value) ||
              /^mailto:[^\s]+$/.test(value))
              ? true
              : 'Start with "/" for a page on this site, or "https://" or "mailto:".',
          ),
    }),
  ],
});

/** Short formatted text: paragraphs with bold, italic and links. */
export const textBlock = defineType({
  name: "textBlock",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Paragraph", value: "normal" }],
      lists: [],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [linkAnnotation],
      },
    }),
  ],
  validation: (rule) => rule.custom(noBannedWords).warning(),
});

/** A simple table: the first row is the header. */
export const table = defineType({
  name: "table",
  title: "Table",
  type: "object",
  icon: ThListIcon,
  fields: [
    defineField({
      name: "rows",
      title: "Rows",
      description: "The first row is the header row.",
      type: "array",
      of: [
        defineArrayMember({
          name: "tableRow",
          title: "Row",
          type: "object",
          fields: [
            defineField({
              name: "cells",
              title: "Cells",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: { cells: "cells" },
            prepare: ({ cells }) => ({
              title:
                (cells as string[] | undefined)?.join(" | ") ?? "Empty row",
            }),
          },
        }),
      ],
      validation: (rule) =>
        rule
          .min(2)
          .error("A table needs a header row and at least one more row."),
    }),
  ],
  preview: {
    select: { rows: "rows" },
    prepare: ({ rows }) => ({
      title: "Table",
      subtitle: `${(rows as unknown[] | undefined)?.length ?? 0} rows`,
    }),
  },
});

/** A highlighted note inside an article. */
export const callout = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 3,
      validation: (rule) => [
        rule.required(),
        rule.custom(noBannedWords).warning(),
      ],
    }),
  ],
  preview: {
    select: { title: "text" },
    prepare: ({ title }) => ({ title, subtitle: "Callout" }),
  },
});

/** Article text: headings, lists, quotes, links, images, tables and callouts. */
export const articleBody = defineType({
  name: "articleBody",
  title: "Article",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Section heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote", icon: BlockquoteIcon },
      ],
      lists: [
        { title: "Bullets", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [linkAnnotation],
      },
    }),
    defineArrayMember({ type: "imageWithAlt" }),
    defineArrayMember({ type: "table" }),
    defineArrayMember({ type: "callout" }),
  ],
  validation: (rule) => rule.custom(noBannedWords).warning(),
});
