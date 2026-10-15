import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { CloseRoleAction } from "./actions/closeRole";
import { API_VERSION, DATASET, FIXED_TYPES, PROJECT_ID } from "./lib/constants";

const fixed = new Set<string>(FIXED_TYPES);
const isAdmin = (roles: { name: string }[] | undefined) =>
  Boolean(roles?.some((role) => role.name === "administrator"));

export default defineConfig({
  name: "manyait",
  title: "ManyaIT website",
  projectId: PROJECT_ID,
  dataset: DATASET,

  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: API_VERSION }),
  ],

  /* The query tool is for developers; editors don't see it. */
  tools: (tools, { currentUser }) =>
    isAdmin(currentUser?.roles)
      ? tools
      : tools.filter((tool) => tool.name !== "vision"),

  schema: {
    types: schemaTypes,
    /* Fixed documents can't be created from the + menu, and a new job
       opening starts open, posted today and applied for by email. */
    templates: (templates) => [
      ...templates.filter((template) => !fixed.has(template.schemaType)),
      {
        id: "opportunity-new",
        title: "New job opening",
        schemaType: "opportunity",
        value: () => ({
          status: "open",
          team: "capability",
          employmentType: "Full-time",
          applyMethod: "email",
          postedAt: new Date().toISOString().slice(0, 10),
        }),
      },
    ],
  },

  document: {
    /* Settings, pages, capabilities, industries and locations can be
       edited and published, but never deleted, duplicated or unpublished:
       the website's layout depends on them. */
    actions: (actions, { schemaType }) => {
      if (fixed.has(schemaType)) {
        return actions.filter(
          (action) =>
            !["delete", "duplicate", "unpublish"].includes(action.action ?? ""),
        );
      }
      if (schemaType === "opportunity") return [...actions, CloseRoleAction];
      return actions;
    },
    newDocumentOptions: (options) =>
      options.filter((option) => !fixed.has(option.templateId)),
  },
});
