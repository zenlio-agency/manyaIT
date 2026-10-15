import { defineArrayMember, defineField, defineType } from "sanity";
import { BulbOutlineIcon } from "@sanity/icons/BulbOutline";
import { copy } from "../../lib/fields";
import { pageSections } from "../objects/sections";

/**
 * One of the five capability areas, shown on the homepage grid, in the menu
 * and at /capabilities/<address>. The set is fixed: editors change the
 * words and photos, a developer adds or removes a capability.
 */
export const capability = defineType({
  name: "capability",
  title: "Capability",
  type: "document",
  icon: BulbOutlineIcon,
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "page", title: "Page" },
    { name: "industries", title: "By industry" },
    { name: "proof", title: "Outcomes" },
    { name: "faq", title: "Questions" },
    { name: "seo", title: "Search" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      group: "overview",
      validation: copy(true),
    }),
    defineField({
      name: "slug",
      title: "Page address",
      type: "slug",
      group: "overview",
      readOnly: true,
      description: "Fixed, so links and search results keep working.",
    }),
    defineField({
      name: "line",
      title: "One-line summary",
      type: "string",
      group: "overview",
      description: "Shown on the homepage grid and in related tiles.",
      validation: copy(true),
    }),
    defineField({
      name: "focus",
      title: "Focus areas",
      type: "array",
      group: "overview",
      description: "Listed under the capability on the Capabilities page.",
      of: [defineArrayMember({ type: "string", validation: copy() })],
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "imageWithAlt",
      group: "overview",
    }),
    defineField({
      name: "pageTitle",
      title: "Page heading",
      type: "string",
      group: "page",
      validation: copy(true),
    }),
    defineField({
      name: "lede",
      title: "Intro",
      type: "text",
      rows: 3,
      group: "page",
      validation: copy(true),
    }),
    defineField({
      name: "points",
      title: "Short points",
      type: "array",
      group: "page",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.max(3),
    }),
    ...pageSections,
    defineField({
      name: "team",
      title: "Team behind the work",
      type: "text",
      rows: 2,
      group: "page",
      description:
        "One line on the roles behind the work, under the platforms.",
      validation: copy(),
    }),
    defineField({
      name: "howItWorks",
      title: "How it works",
      type: "object",
      group: "page",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          validation: copy(),
        }),
        defineField({
          name: "intro",
          title: "Intro",
          type: "text",
          rows: 3,
          validation: copy(),
        }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          description: "In order. Designed for four.",
          of: [
            defineArrayMember({
              name: "processStep",
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                  validation: copy(true),
                }),
                defineField({
                  name: "text",
                  title: "Text",
                  type: "text",
                  rows: 3,
                  validation: copy(true),
                }),
                defineField({
                  name: "note",
                  title: "Result",
                  type: "string",
                  description: "A short result shown under the step.",
                  validation: copy(),
                }),
              ],
              preview: { select: { title: "title", subtitle: "note" } },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "industryNotes",
      title: "In each industry",
      type: "array",
      group: "industries",
      description: "One line on what this capability does in each industry.",
      of: [
        defineArrayMember({
          name: "industryNote",
          type: "object",
          fields: [
            defineField({
              name: "industry",
              title: "Industry",
              type: "reference",
              to: [{ type: "industry" }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "text",
              rows: 2,
              validation: copy(true),
            }),
          ],
          preview: { select: { title: "industry.title", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "Search and social",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: { select: { title: "title", subtitle: "line", media: "photo" } },
});
