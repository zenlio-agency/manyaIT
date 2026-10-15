import { defineField, defineType } from "sanity";

/**
 * An image with alt text. The website copies every image onto its own
 * domain at build time, so visitors never load it from Sanity.
 */
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description:
        "Describe what the image shows, for people using screen readers.",
      hidden: ({ parent }) => Boolean(parent?.decorative),
    }),
    defineField({
      name: "decorative",
      title: "Decorative only",
      type: "boolean",
      initialValue: false,
      description: "Tick if the image adds nothing a reader would miss.",
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      const image = value as
        { asset?: unknown; alt?: string; decorative?: boolean } | undefined;
      if (!image?.asset || image.decorative || image.alt) return true;
      return "Add alt text, or mark the image as decorative.";
    }),
});
