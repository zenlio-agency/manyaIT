import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { TagIcon } from "@sanity/icons/Tag";
import { copy } from "../../lib/fields";
import { slugGuard } from "../../lib/validation";
import { CONTACT_TOPICS } from "../../lib/constants";

/** A category on the Insights grid. The grid's filters come from these. */
export const insightCategory = defineType({
  name: "insightCategory",
  title: "Insight category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      validation: copy(true),
    }),
    defineField({
      name: "slug",
      title: "Filter key",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers come first.",
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});

/** An article on /insights. */
export const insight = defineType({
  name: "insight",
  title: "Insight",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Article", default: true },
    { name: "card", title: "Card and listing" },
    { name: "links", title: "Related" },
    { name: "seo", title: "Search" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: copy(true),
    }),
    defineField({
      name: "slug",
      title: "Page address",
      type: "slug",
      group: "content",
      description:
        "The article lives at /insights/<this>. Don't change it once published.",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => [rule.required(), rule.custom(slugGuard)],
    }),
    defineField({
      name: "allowSlugChange",
      title: "Allow address change",
      type: "boolean",
      group: "content",
      description:
        "Administrators only. A developer must add a redirect from the old address.",
      hidden: ({ currentUser }) =>
        !currentUser?.roles.some((role) => role.name === "administrator"),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "string",
      group: "content",
      description: "One line under the title, also shown on the card.",
      validation: copy(true),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "content",
      to: [{ type: "insightCategory" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      group: "content",
      options: {
        list: ["Perspective", "Guide", "Explainer", "Field notes"],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "date",
      group: "content",
      description:
        'Shown on the article. Leave empty to show "[Publish date]" while in review.',
    }),
    defineField({
      name: "author",
      title: "Byline",
      type: "string",
      group: "content",
      initialValue: "The ManyaIT team",
      validation: copy(true),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "imageWithAlt",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "takeaways",
      title: "In short",
      type: "array",
      group: "content",
      description: "Three or four short points shown at the top.",
      of: [defineArrayMember({ type: "string", validation: copy() })],
      validation: (rule) => rule.min(1).max(4),
    }),
    defineField({
      name: "body",
      title: "Article",
      type: "articleBody",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Feature on the grid",
      type: "boolean",
      group: "card",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order on the grid",
      type: "number",
      group: "card",
      description: "Lower numbers come first.",
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities it covers",
      type: "array",
      group: "links",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "capability" }] }),
      ],
    }),
    defineField({
      name: "industries",
      title: "Industries it covers",
      type: "array",
      group: "links",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "industry" }] }),
      ],
    }),
    defineField({
      name: "contactTopic",
      title: "Contact topic",
      type: "string",
      group: "links",
      description:
        "Which topic the article's 'Share your skills brief' button preselects.",
      options: { list: CONTACT_TOPICS },
    }),
    defineField({
      name: "related",
      title: "Related page button",
      type: "linkItem",
      group: "links",
      description: 'The second button at the end, e.g. "Explore Applied AI".',
    }),
    defineField({
      name: "seo",
      title: "Search and social",
      type: "seo",
      group: "seo",
    }),
  ],
  orderings: [
    {
      title: "Grid order",
      name: "order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category.title",
      date: "publishedAt",
      media: "photo",
    },
    prepare: ({ title, category, date, media }) => ({
      title,
      subtitle: [category, date ?? "No publish date"]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
