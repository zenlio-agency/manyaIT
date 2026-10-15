import { defineField, defineType } from "sanity";
import { confirmationComplete } from "../../lib/validation";
import { copy } from "../../lib/fields";

/** Who confirmed a claim, when and on what evidence. Shared by claims. */
export const confirmationFields = (flag: string, flagTitle: string) => [
  defineField({
    name: flag,
    title: flagTitle,
    type: "boolean",
    initialValue: false,
    description:
      "Tick only when the claim is confirmed in writing. Until then it shows on review builds with a 'confirm before launch' marker, and the live site won't build.",
  }),
  defineField({
    name: "confirmedBy",
    title: "Confirmed by",
    type: "string",
    hidden: ({ parent }) => !parent?.[flag],
  }),
  defineField({
    name: "confirmedOn",
    title: "Confirmed on",
    type: "date",
    hidden: ({ parent }) => !parent?.[flag],
  }),
  defineField({
    name: "evidence",
    title: "Evidence",
    type: "text",
    rows: 2,
    description:
      "Where the confirmation lives, e.g. an email or a signed approval.",
    hidden: ({ parent }) => !parent?.[flag],
  }),
];

/**
 * A figure such as "40% faster releases". Figures are claims, so each one
 * stays unconfirmed until someone records the evidence.
 */
export const stat = defineType({
  name: "stat",
  title: "Figure",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Figure",
      type: "string",
      description: 'For example "40%" or "6 wks". Use "[X]%" while unknown.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "What it measures",
      type: "string",
      validation: copy(true),
    }),
    ...confirmationFields("confirmed", "Confirmed"),
  ],
  validation: (rule) => rule.custom(confirmationComplete("confirmed")),
  preview: {
    select: { value: "value", label: "label", confirmed: "confirmed" },
    prepare: ({ value, label, confirmed }) => ({
      title: `${value ?? ""} ${label ?? ""}`.trim(),
      subtitle: confirmed ? "Confirmed" : "Not confirmed yet",
    }),
  },
});
