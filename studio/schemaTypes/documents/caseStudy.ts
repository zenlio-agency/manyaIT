import { defineArrayMember, defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons/Book";
import { copy } from "../../lib/fields";
import { confirmationComplete, slugGuard } from "../../lib/validation";
import { confirmationFields } from "../objects/stat";

/**
 * A case study at /case-studies/<address>. Nothing here may be invented:
 * a client is named only with written permission, otherwise it is described
 * anonymously, and every figure and quote needs evidence.
 */
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  icon: BookIcon,
  groups: [
    { name: "client", title: "Client", default: true },
    { name: "story", title: "Story" },
    { name: "proof", title: "Results" },
    { name: "seo", title: "Search" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "client",
      validation: copy(true),
    }),
    defineField({
      name: "slug",
      title: "Page address",
      type: "slug",
      group: "client",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => [rule.required(), rule.custom(slugGuard)],
    }),
    defineField({
      name: "allowSlugChange",
      title: "Allow address change",
      type: "boolean",
      group: "client",
      hidden: ({ currentUser }) =>
        !currentUser?.roles.some((role) => role.name === "administrator"),
    }),
    defineField({
      name: "anonymisedDescriptor",
      title: "How we describe the client",
      type: "string",
      group: "client",
      description:
        'Without naming them, e.g. "A US regional bank". Always required.',
      validation: copy(true),
    }),
    defineField({
      name: "clientPermission",
      title: "Permission to name the client",
      type: "object",
      group: "client",
      description: "Only with written permission from the client.",
      fields: [
        ...confirmationFields(
          "confirmed",
          "We have written permission to name the client",
        ),
        defineField({
          name: "clientName",
          title: "Client name",
          type: "string",
          hidden: ({ parent }) => !parent?.confirmed,
        }),
      ],
      validation: (rule) =>
        rule.custom((value) => {
          const permission = value as
            | {
                confirmed?: boolean;
                clientName?: string;
                confirmedBy?: string;
                confirmedOn?: string;
                evidence?: string;
              }
            | undefined;
          if (permission?.clientName && !permission.confirmed)
            return "Remove the client name, or record the written permission first.";
          if (!permission?.confirmed) return true;
          if (
            !permission.confirmedBy ||
            !permission.confirmedOn ||
            !permission.evidence
          )
            return "Add who gave permission, when, and the evidence.";
          if (!permission.clientName)
            return "Add the client name, or untick the permission.";
          return true;
        }),
    }),
    defineField({
      name: "industry",
      title: "Industry",
      type: "reference",
      group: "client",
      to: [{ type: "industry" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities",
      type: "array",
      group: "client",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "capability" }] }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "string",
      group: "story",
      validation: copy(true),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "imageWithAlt",
      group: "story",
    }),
    defineField({
      name: "challenge",
      title: "The challenge",
      type: "textBlock",
      group: "story",
    }),
    defineField({
      name: "approach",
      title: "What the team did",
      type: "textBlock",
      group: "story",
    }),
    defineField({
      name: "outcomes",
      title: "Results",
      type: "array",
      group: "proof",
      description: "Each figure needs evidence before it can go live.",
      of: [defineArrayMember({ type: "stat" })],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "quotes",
      title: "Quotes",
      type: "array",
      group: "proof",
      of: [
        defineArrayMember({
          name: "quote",
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Quote",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "attribution",
              title: "Attribution",
              type: "string",
              description:
                'Role and organization as approved, e.g. "CIO, a US regional bank".',
              validation: (rule) => rule.required(),
            }),
            ...confirmationFields("confirmed", "Approved for publication"),
          ],
          validation: (rule) => rule.custom(confirmationComplete("confirmed")),
          preview: {
            select: { title: "text", confirmed: "confirmed" },
            prepare: ({ title, confirmed }) => ({
              title,
              subtitle: confirmed ? "Approved" : "Not approved yet",
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "date",
      group: "story",
    }),
    defineField({
      name: "seo",
      title: "Search and social",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "anonymisedDescriptor",
      media: "photo",
    },
  },
});
