import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";
import { copy } from "../../lib/fields";

const section = (name: string, title: string, group = "sections") =>
  defineField({
    name,
    title,
    type: "sectionIntro",
    group,
    options: { collapsible: true, collapsed: true },
  });

/**
 * The homepage's words and photos. The order of sections, the layout and the
 * animations stay in the website code.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Top of page", default: true },
    { name: "proof", title: "Proof" },
    { name: "sections", title: "Sections" },
    { name: "seo", title: "Search" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Top of page",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "badge",
          title: "Badge",
          type: "string",
          validation: copy(true),
        }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          description:
            'The start of the heading, e.g. "Build the capabilities your enterprise".',
          validation: copy(true),
        }),
        defineField({
          name: "highlight",
          title: "Highlighted end of the heading",
          type: "string",
          description: 'Shown in Manya Blue, e.g. "needs next."',
          validation: copy(true),
        }),
        defineField({
          name: "lede",
          title: "Intro",
          type: "text",
          rows: 3,
          validation: copy(true),
        }),
        defineField({
          name: "points",
          title: "Short points",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          validation: (rule) => rule.max(3),
        }),
        defineField({
          name: "careersPrompt",
          title: "Careers prompt",
          type: "string",
          description: 'e.g. "Building your career?"',
        }),
      ],
    }),
    defineField({
      name: "reel",
      title: "Photo reel",
      type: "array",
      group: "hero",
      description:
        "Five photos that scroll beside the heading, each with a short caption.",
      of: [
        defineArrayMember({
          name: "reelPhoto",
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Photo",
              type: "imageWithAlt",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              validation: copy(true),
            }),
          ],
          preview: { select: { title: "caption", media: "image" } },
        }),
      ],
      validation: (rule) =>
        rule.length(5).warning("The reel is designed for five photos."),
    }),
    defineField({
      name: "logosHeading",
      title: "Client logos heading",
      type: "object",
      group: "proof",
      fields: [
        defineField({
          name: "start",
          title: "Heading",
          type: "string",
          validation: copy(),
        }),
        defineField({
          name: "emphasis",
          title: "Emphasised end",
          type: "string",
          validation: copy(),
        }),
      ],
    }),
    defineField({
      name: "why",
      title: "Why ManyaIT",
      type: "object",
      group: "proof",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Label",
          type: "string",
          validation: copy(),
        }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          validation: copy(),
        }),
        defineField({
          name: "emphasis",
          title: "Emphasised end",
          type: "string",
          validation: copy(),
        }),
        defineField({
          name: "statement",
          title: "Statement",
          type: "text",
          rows: 4,
          description:
            "Plain text: the words light up one by one as the page scrolls.",
          validation: copy(true),
        }),
        defineField({
          name: "buttons",
          title: "Buttons",
          type: "array",
          description: "The first is solid, the second outlined.",
          of: [defineArrayMember({ type: "linkItem" })],
          validation: (rule) => rule.max(2),
        }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Figures",
      type: "array",
      group: "proof",
      description:
        "Up to six, three to a row. Each figure is a claim and needs evidence before launch.",
      of: [defineArrayMember({ type: "stat" })],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "standards",
      title: "Engineering standards",
      type: "object",
      group: "proof",
      description: "Shown under the figures.",
      fields: [
        defineField({
          name: "title",
          title: "Heading",
          type: "string",
          validation: copy(),
        }),
        defineField({
          name: "items",
          title: "Standards",
          type: "array",
          of: [defineArrayMember({ type: "string", validation: copy() })],
        }),
      ],
    }),
    section("capabilities", "Capabilities"),
    section("industries", "Industries"),
    section("careers", "Careers"),
    section("insights", "Insights"),
    section("locations", "Global presence"),
    section("ecosystem", "Ecosystem"),
    section("contact", "Contact"),
    defineField({
      name: "featuredInsight",
      title: "Featured insight",
      type: "reference",
      group: "sections",
      to: [{ type: "insight" }],
      description:
        "Shown large on the Insights grid. Leave empty to use the article marked as featured.",
    }),
    defineField({
      name: "seo",
      title: "Search and social",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});
