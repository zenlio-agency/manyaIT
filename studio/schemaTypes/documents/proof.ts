import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons/Image";
import { LinkIcon } from "@sanity/icons/Link";
import { copy } from "../../lib/fields";
import { confirmationComplete } from "../../lib/validation";
import { confirmationFields } from "../objects/stat";

/**
 * A client logo for the homepage strip. Logos are trademarks and imply a
 * relationship, so each one needs written permission before launch.
 */
export const clientLogo = defineType({
  name: "clientLogo",
  title: "Client logo",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "name",
      title: "Company",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "row",
      title: "Row",
      type: "string",
      options: {
        list: [
          { title: "Banking & Finance", value: "banking" },
          {
            title: "Telecommunications, Healthcare and Energy",
            value: "telecom-healthcare-energy",
          },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description:
        "An SVG or a PNG on a transparent background. It shows in grey, and in colour on hover.",
      options: { accept: "image/svg+xml,image/png,image/webp" },
      validation: (rule) => rule.required(),
    }),
    ...confirmationFields(
      "permissionConfirmed",
      "Written permission to show this logo",
    ),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  validation: (rule) =>
    rule.custom(confirmationComplete("permissionConfirmed")),
  orderings: [
    {
      title: "Order",
      name: "order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", confirmed: "permissionConfirmed", media: "logo" },
    prepare: ({ title, confirmed, media }) => ({
      title,
      subtitle: confirmed ? "Permission confirmed" : "Permission not confirmed",
      media,
    }),
  },
});

/** A company in the "ManyaIT ecosystem" section of the homepage. */
export const ecosystemCompany = defineType({
  name: "ecosystemCompany",
  title: "Ecosystem company",
  type: "document",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "name",
      title: "Company",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "focus",
      title: "Focus",
      type: "string",
      description: 'e.g. "Data & analytics"',
      validation: copy(true),
    }),
    defineField({
      name: "line",
      title: "One line on what it does",
      type: "string",
      validation: copy(true),
    }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({
      name: "url",
      title: "Website",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    ...confirmationFields(
      "relationshipConfirmed",
      "Relationship confirmed in writing",
    ),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  validation: (rule) =>
    rule.custom(confirmationComplete("relationshipConfirmed")),
  preview: {
    select: {
      title: "name",
      confirmed: "relationshipConfirmed",
      media: "logo",
    },
    prepare: ({ title, confirmed, media }) => ({
      title,
      subtitle: confirmed
        ? "Relationship confirmed"
        : "Relationship not confirmed",
      media,
    }),
  },
});
