import { createClient } from "@sanity/client";
import {
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
  SANITY_READ_TOKEN,
} from "./config.ts";

/**
 * Reads published content only: drafts never reach the site. It skips
 * Sanity's CDN so a build always gets what was just published.
 */
export const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  token: SANITY_READ_TOKEN,
  useCdn: false,
  perspective: "published",
});
