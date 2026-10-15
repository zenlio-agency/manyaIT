import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons/Documents";

/**
 * Words for a page whose layout lives in code: About, Careers, Locations,
 * Contact and the overview pages. One fixed document per page.
 */
export const pageSettings = defineType({
  name: "pageSettings",
  title: "Page",
  type: "document",
  icon: DocumentsIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "faq", title: "Questions" },
    { name: "seo", title: "Search" },
  ],
  fields: [
    defineField({
      name: "page",
      title: "Page",
      type: "string",
      group: "content",
      readOnly: true,
      description: "Which page this is. Set by the developer.",
    }),
    defineField({
      name: "hero",
      title: "Page header",
      type: "pageHero",
      group: "content",
    }),
    defineField({
      name: "faqIntro",
      title: "Questions section",
      type: "sectionIntro",
      group: "faq",
    }),
    defineField({
      name: "faq",
      title: "Questions",
      type: "array",
      group: "faq",
      of: [defineArrayMember({ type: "faqItem" })],
    }),
    defineField({
      name: "seo",
      title: "Search and social",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: { select: { title: "page" } },
});
