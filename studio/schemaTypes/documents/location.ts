import { defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons/Pin";
import { copy } from "../../lib/fields";

/**
 * A ManyaIT hub: Dallas (Client & Leadership Hub) or Hyderabad (Engineering
 * & Talent Hub). Shown on /locations, the map, the footer and beside the
 * contact form. The legal pages keep their own copy of each address.
 */
export const location = defineType({
  name: "location",
  title: "Location",
  type: "document",
  icon: PinIcon,
  fields: [
    defineField({
      name: "city",
      title: "City",
      type: "string",
      description: 'e.g. "Dallas, Texas"',
      validation: copy(true),
    }),
    defineField({
      name: "short",
      title: "Short name",
      type: "string",
      description: 'e.g. "Dallas"',
      validation: copy(true),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      description:
        'e.g. "United States". The careers page filters roles by country.',
      validation: copy(true),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description:
        'Dallas is the "Client & Leadership Hub", Hyderabad the "Engineering & Talent Hub".',
      validation: copy(true),
    }),
    defineField({
      name: "text",
      title: "Description",
      type: "text",
      rows: 3,
      validation: copy(true),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 4,
      description:
        "One line per row. If this changes, tell the developer: the legal pages hold their own copy.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "timeZone",
      title: "Time zone",
      type: "string",
      description:
        'An IANA time zone, e.g. "America/Chicago" or "Asia/Kolkata".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "locale",
      title: "Locale",
      type: "string",
      description: 'For the local time format, e.g. "en-US" or "en-IN".',
      initialValue: "en-US",
    }),
    defineField({
      name: "position",
      title: "Map position",
      type: "object",
      options: { columns: 2 },
      fields: [
        defineField({
          name: "lat",
          title: "Latitude",
          type: "number",
          validation: (rule) => rule.required().min(-90).max(90),
        }),
        defineField({
          name: "lon",
          title: "Longitude",
          type: "number",
          validation: (rule) => rule.required().min(-180).max(180),
        }),
      ],
    }),
    defineField({ name: "link", title: "Button", type: "linkItem" }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      hidden: true,
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: { select: { title: "city", subtitle: "role" } },
});
