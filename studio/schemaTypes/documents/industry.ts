import { defineArrayMember, defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";
import { copy } from "../../lib/fields";
import { pageSections } from "../objects/sections";

/**
 * One of the industries, shown on the homepage, in the menu and at
 * /industries/<address>. The set is fixed, like capabilities.
 */
export const industry = defineType({
  name: "industry",
  title: "Industry",
  type: "document",
  icon: EarthGlobeIcon,
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "page", title: "Page" },
    { name: "capabilities", title: "By capability" },
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
      name: "short",
      title: "Short name",
      type: "string",
      group: "overview",
      description: 'Used in phrases like "Talk to us about Banking & Finance".',
      validation: copy(true),
    }),
    defineField({
      name: "summary",
      title: "One-line summary",
      type: "string",
      group: "overview",
      description: "Shown on the Industries page and in related tiles.",
      validation: copy(true),
    }),
    defineField({
      name: "line",
      title: "Homepage line",
      type: "string",
      group: "overview",
      description: "Shown on the industry's tile on the homepage.",
      validation: copy(true),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "imageWithAlt",
      group: "overview",
    }),
    defineField({
      name: "hero",
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
    defineField({
      name: "challenge",
      title: "The challenge (overview page)",
      type: "text",
      rows: 3,
      group: "page",
      validation: copy(true),
    }),
    defineField({
      name: "build",
      title: "What our teams build (overview page)",
      type: "text",
      rows: 3,
      group: "page",
      validation: copy(true),
    }),
    defineField({
      name: "outcome",
      title: "Headline outcome",
      type: "string",
      group: "proof",
      validation: copy(true),
    }),
    defineField({
      name: "metric",
      title: "Headline figure",
      type: "stat",
      group: "proof",
      description: "Shown on the industries overview page.",
    }),
    ...pageSections,
    defineField({
      name: "capabilityNotes",
      title: "Each capability here",
      type: "array",
      group: "capabilities",
      description: "One line on what each capability brings to this industry.",
      of: [
        defineArrayMember({
          name: "capabilityNote",
          type: "object",
          fields: [
            defineField({
              name: "capability",
              title: "Capability",
              type: "reference",
              to: [{ type: "capability" }],
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
          preview: { select: { title: "capability.title", subtitle: "text" } },
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
  preview: { select: { title: "title", subtitle: "summary", media: "photo" } },
});
