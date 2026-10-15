import { defineField, defineType } from "sanity";
import { SearchIcon } from "@sanity/icons/Search";

/** Search and social settings for one page. Empty fields use the defaults. */
export const seo = defineType({
  name: "seo",
  title: "Search and social",
  type: "object",
  icon: SearchIcon,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      description:
        "Shown in browser tabs and search results. Leave empty to use the page heading. Best under 60 characters.",
      validation: (rule) =>
        rule
          .max(60)
          .warning("Search results usually cut titles at about 60 characters."),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "One or two sentences for search results and link previews.",
      validation: (rule) =>
        rule
          .max(160)
          .warning(
            "Search results usually cut descriptions at about 160 characters.",
          ),
    }),
    defineField({
      name: "image",
      title: "Social image",
      type: "image",
      description:
        "Shown when the page is shared on LinkedIn, X and elsewhere. Cropped to 1200 × 630.",
    }),
    defineField({
      name: "noindex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
