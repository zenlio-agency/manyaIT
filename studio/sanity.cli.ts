import { defineCliConfig } from "sanity/cli";
import { DATASET, PROJECT_ID } from "./lib/constants";

export default defineCliConfig({
  api: { projectId: PROJECT_ID, dataset: DATASET },
  /* `npm run deploy` publishes the Studio to https://manyait.sanity.studio */
  studioHost: "manyait",
  deployment: { autoUpdates: true, appId: "n7z0jy09as4098clo9o50w78" },
  /* `npm run typegen` writes TypeScript types for the website's queries
     (site/src/sanity/queries.ts) from these schemas. */
  typegen: {
    path: "../site/src/sanity/**/*.ts",
    schema: "schema.json",
    generates: "../site/src/sanity/types.ts",
    overloadClientMethods: true,
    /* Generated code isn't formatted; site/.prettierignore skips it. */
    formatGeneratedCode: false,
  },
});
