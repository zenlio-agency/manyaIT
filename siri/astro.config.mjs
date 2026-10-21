// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://siridataanalytics.com",
  output: "static",
  /* Pages live at addresses without a trailing slash, as every link writes them. */
  trailingSlash: "never",
  build: {
    format: "file",
  },
});
