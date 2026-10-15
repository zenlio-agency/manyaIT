import { defineArrayMember, defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons/Case";
import { copy } from "../../lib/fields";
import { slugGuard } from "../../lib/validation";
import { API_VERSION } from "../../lib/constants";

/**
 * A job opening on /careers, with its own page at /careers/<address>.
 * HR adds, edits and closes these, and publishing makes the change live.
 */
export const opportunity = defineType({
  name: "opportunity",
  title: "Job opening",
  type: "document",
  icon: CaseIcon,
  groups: [
    { name: "role", title: "Role", default: true },
    { name: "details", title: "Description" },
    { name: "apply", title: "Applying" },
    { name: "seo", title: "Search" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Job title",
      type: "string",
      group: "role",
      validation: copy(true),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "role",
      options: {
        list: [
          { title: "Open: shown on the careers page", value: "open" },
          { title: "Closed: hidden from the list", value: "closed" },
        ],
        layout: "radio",
      },
      initialValue: "open",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Page address",
      type: "slug",
      group: "role",
      description: "The role lives at /careers/<this>.",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => [rule.required(), rule.custom(slugGuard)],
    }),
    defineField({
      name: "allowSlugChange",
      title: "Allow address change",
      type: "boolean",
      group: "role",
      description: "Administrators only.",
      hidden: ({ currentUser }) =>
        !currentUser?.roles.some((role) => role.name === "administrator"),
    }),
    defineField({
      name: "reference",
      title: "Reference code",
      type: "string",
      group: "role",
      description:
        "Shown on the job page so candidates can check an offer is genuine, e.g. HYD-ENG-014.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "team",
      title: "Team",
      type: "string",
      group: "role",
      options: {
        list: [
          { title: "A capability team", value: "capability" },
          { title: "Client Partnership", value: "client-partnership" },
        ],
        layout: "radio",
      },
      initialValue: "capability",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "capability",
      title: "Capability",
      type: "reference",
      group: "role",
      to: [{ type: "capability" }],
      hidden: ({ parent }) => parent?.team !== "capability",
      validation: (rule) =>
        rule.custom((value, context) =>
          (context.document as { team?: string } | undefined)?.team ===
            "capability" && !value
            ? "Choose the capability team."
            : true,
        ),
    }),
    defineField({
      name: "locations",
      title: "Locations",
      type: "array",
      group: "role",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "location" }] }),
      ],
    }),
    defineField({
      name: "place",
      title: "Location shown",
      type: "string",
      group: "role",
      description:
        'How the location reads on the role, e.g. "Jersey City, NJ", "India" or "Remote, United States".',
      validation: copy(true),
    }),
    defineField({
      name: "remote",
      title: "Open to remote",
      type: "boolean",
      group: "role",
      initialValue: false,
    }),
    defineField({
      name: "workMode",
      title: "Working mode",
      type: "string",
      group: "role",
      options: { list: ["On-site", "Hybrid", "Remote"], layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "employmentType",
      title: "Type",
      type: "string",
      group: "role",
      options: { list: ["Full-time", "Part-time", "Fixed-term", "Internship"] },
      initialValue: "Full-time",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "experience",
      title: "Experience",
      type: "string",
      group: "role",
      description: 'e.g. "5–8 years"',
    }),
    defineField({
      name: "postedAt",
      title: "Posted on",
      type: "date",
      group: "role",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "closesAt",
      title: "Closes on",
      type: "date",
      group: "role",
      description:
        "Optional. After this date the role disappears from the site automatically.",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "details",
      validation: copy(true),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "articleBody",
      group: "details",
    }),
    defineField({
      name: "requirements",
      title: "What you'll bring",
      type: "array",
      group: "details",
      of: [defineArrayMember({ type: "string", validation: copy() })],
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      group: "details",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "jdPdf",
      title: "Job description (PDF)",
      type: "file",
      group: "details",
      description:
        "Optional. Anyone with the link can open an uploaded file, so don't upload anything confidential.",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "applyMethod",
      title: "How to apply",
      type: "string",
      group: "apply",
      options: {
        list: [
          { title: "Email the careers team", value: "email" },
          { title: "An approved job board", value: "link" },
        ],
        layout: "radio",
      },
      initialValue: "email",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "applyEmail",
      title: "Apply by email to",
      type: "string",
      group: "apply",
      description: "Leave empty to use the careers email from Site settings.",
      hidden: ({ parent }) => parent?.applyMethod !== "email",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "applyUrl",
      title: "Job board address",
      type: "url",
      group: "apply",
      description: "Only job boards listed in Site settings are allowed.",
      hidden: ({ parent }) => parent?.applyMethod !== "link",
      validation: (rule) =>
        rule.uri({ scheme: ["https"] }).custom(async (value, context) => {
          const doc = context.document as { applyMethod?: string } | undefined;
          if (doc?.applyMethod !== "link") return true;
          if (!value) return "Add the job board address.";
          const allowed = await context
            .getClient({ apiVersion: API_VERSION })
            .fetch<string[] | null>(
              `*[_id == "siteSettings"][0].approvedJobBoards`,
            );
          const host = new URL(value).hostname.replace(/^www\./, "");
          return (allowed ?? []).some(
            (domain) => host === domain || host.endsWith(`.${domain}`),
          )
            ? true
            : `${host} isn't an approved job board. Add it in Site settings first.`;
        }),
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
      title: "Newest first",
      name: "postedDesc",
      by: [{ field: "postedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      reference: "reference",
      city: "place",
    },
    prepare: ({ title, status, reference, city }) => ({
      title,
      subtitle: [status === "closed" ? "Closed" : "Open", city, reference]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
