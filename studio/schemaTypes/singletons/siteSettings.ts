import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";
import { copy } from "../../lib/fields";

/** Details used across the whole site. One document. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "contact", title: "Contact", default: true },
    { name: "brand", title: "Brand & favicon" },
    { name: "careers", title: "Careers" },
    { name: "seo", title: "Search defaults" },
  ],
  fields: [
    defineField({
      name: "email",
      title: "Company email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "careersEmail",
      title: "Careers email",
      type: "string",
      group: "contact",
      description: "Where job applications go by default.",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "social",
      title: "Social profiles",
      type: "array",
      group: "contact",
      description:
        "Profiles appear in the footer, the menu and beside the contact form, in this order.",
      of: [
        defineArrayMember({
          name: "socialProfile",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Instagram", value: "instagram" },
                  { title: "X", value: "x" },
                  { title: "Facebook", value: "facebook" },
                  { title: "YouTube", value: "youtube" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Profile address",
              type: "url",
              description:
                "Leave empty while the profile isn't ready; the icon then shows without a link.",
              validation: (rule) => rule.uri({ scheme: ["https"] }),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "favicon",
      title: "Favicon (Browser tab icon)",
      type: "image",
      group: "brand",
      description:
        "The icon displayed in browser tabs. SVG or 32×32 / 512×512 PNG recommended. If empty, the default ManyaIT logo icon is used.",
      options: {
        accept: "image/svg+xml,image/png,image/x-icon,image/vnd.microsoft.icon,image/webp",
      },
    }),
    defineField({
      name: "appleTouchIcon",
      title: "Apple touch icon",
      type: "image",
      group: "brand",
      description:
        "The icon displayed on Apple devices and home screen bookmarks. 180×180 PNG recommended. If empty, the default ManyaIT icon is used.",
      options: {
        accept: "image/png,image/webp,image/jpeg",
      },
    }),
    defineField({
      name: "ctaPrimaryLabel",
      title: "Main button label",
      type: "string",
      group: "brand",
      initialValue: "Start a Conversation",
      validation: copy(true),
    }),
    defineField({
      name: "ctaSecondaryLabel",
      title: "Careers button label",
      type: "string",
      group: "brand",
      initialValue: "Explore Opportunities",
      validation: copy(true),
    }),
    defineField({
      name: "footerLine",
      title: "Footer line",
      type: "text",
      rows: 2,
      group: "brand",
      validation: copy(true),
    }),
    defineField({
      name: "approvedJobBoards",
      title: "Approved job boards",
      type: "array",
      group: "careers",
      description:
        'Domains a job may link to for applications, e.g. "linkedin.com". The fraud notice says every genuine opening is on our careers page, so keep this list short.',
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "seo",
      title: "Default search and social",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
