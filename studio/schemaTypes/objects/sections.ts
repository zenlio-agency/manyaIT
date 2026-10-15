import { defineArrayMember, defineField, defineType } from "sanity";
import { copy } from "../../lib/fields";

/** The eyebrow, heading and intro that open a section. */
export const sectionIntro = defineType({
  name: "sectionIntro",
  title: "Section intro",
  type: "object",
  options: { collapsible: true },
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
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      validation: copy(),
    }),
  ],
});

/** A button: its label and where it goes. */
export const linkItem = defineType({
  name: "linkItem",
  title: "Button",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: copy(true),
    }),
    defineField({
      name: "href",
      title: "Goes to",
      type: "string",
      description:
        'A page on this site, e.g. "/contact", or a full https:// address.',
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            typeof value === "string" && /^(\/|#|https:\/\/)/.test(value)
              ? true
              : 'Start with "/", "#" or "https://".',
          ),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

/** The top of an inner page. */
export const pageHero = defineType({
  name: "pageHero",
  title: "Page header",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Label",
      type: "string",
      validation: copy(),
    }),
    defineField({
      name: "title",
      title: "Heading",
      type: "string",
      validation: copy(true),
    }),
    defineField({
      name: "lede",
      title: "Intro",
      type: "text",
      rows: 3,
      validation: copy(),
    }),
    defineField({
      name: "points",
      title: "Short points",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.max(3),
    }),
    defineField({ name: "photo", title: "Photo", type: "imageWithAlt" }),
  ],
});

/** A question and answer. */
export const faqItem = defineType({
  name: "faqItem",
  title: "Question",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: copy(true),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "textBlock",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "question" } },
});

/** A challenge in the reader's words, and the answer. */
export const problemRow = defineType({
  name: "problemRow",
  title: "Challenge",
  type: "object",
  fields: [
    defineField({
      name: "challenge",
      title: "What we hear",
      type: "string",
      validation: copy(true),
    }),
    defineField({
      name: "answer",
      title: "How the team answers",
      type: "text",
      rows: 3,
      validation: copy(true),
    }),
  ],
  preview: { select: { title: "challenge", subtitle: "answer" } },
});

/** A titled card with a line of text. */
export const featureItem = defineType({
  name: "featureItem",
  title: "Card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: copy(true),
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 3,
      validation: copy(true),
    }),
  ],
  preview: { select: { title: "title", subtitle: "text" } },
});

/** A group of short labels, e.g. the specialists or platforms of a team. */
export const chipGroup = defineType({
  name: "chipGroup",
  title: "Group",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: copy(true),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
  ],
  preview: { select: { title: "title" } },
});

/** Shared page sections for capability and industry pages. */
export const pageSections = [
  defineField({
    name: "problems",
    title: "Challenges",
    type: "object",
    group: "page",
    fields: [
      defineField({
        name: "heading",
        title: "Heading",
        type: "string",
        validation: copy(),
      }),
      defineField({
        name: "rows",
        title: "Challenges",
        type: "array",
        of: [defineArrayMember({ type: "problemRow" })],
      }),
    ],
  }),
  defineField({
    name: "offerings",
    title: "What we build",
    type: "object",
    group: "page",
    fields: [
      defineField({
        name: "heading",
        title: "Heading",
        type: "string",
        validation: copy(),
      }),
      defineField({
        name: "intro",
        title: "Intro",
        type: "text",
        rows: 3,
        validation: copy(),
      }),
      defineField({
        name: "items",
        title: "Cards",
        type: "array",
        of: [defineArrayMember({ type: "featureItem" })],
      }),
    ],
  }),
  defineField({
    name: "stack",
    title: "People and platforms",
    type: "object",
    group: "page",
    fields: [
      defineField({
        name: "intro",
        title: "Intro",
        type: "text",
        rows: 3,
        validation: copy(),
      }),
      defineField({
        name: "groups",
        title: "Groups",
        type: "array",
        of: [defineArrayMember({ type: "chipGroup" })],
      }),
    ],
  }),
  defineField({
    name: "outcomes",
    title: "Outcomes to expect",
    type: "array",
    group: "proof",
    description: "Figures are claims: each one needs evidence before launch.",
    of: [defineArrayMember({ type: "stat" })],
    validation: (rule) => rule.max(4),
  }),
  defineField({
    name: "faq",
    title: "Questions",
    type: "array",
    group: "faq",
    of: [defineArrayMember({ type: "faqItem" })],
  }),
];
