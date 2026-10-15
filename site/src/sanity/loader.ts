import type { Loader } from "astro/loaders";
import { sanity } from "./client.ts";
import { SANITY_DATASET, SANITY_PROJECT_ID } from "./config.ts";

/**
 * Fills a content collection from Sanity at build time. Every build fetches
 * the whole set again and replaces what the last build stored, so anything
 * unpublished in Studio leaves the site on the next build. If Sanity can't
 * be reached, the build stops and the live site stays as it was.
 */
export function sanityLoader(query: string): Loader {
  return {
    name: "sanity",
    load: async ({ collection, store, logger, generateDigest }) => {
      const documents = await sanity.fetch<{ _id: string }[]>(query);
      store.clear();
      for (const document of documents) {
        store.set({
          id: document._id,
          data: document,
          digest: generateDigest(document),
        });
      }
      logger.info(
        `${collection}: ${documents.length} from ${SANITY_PROJECT_ID}/${SANITY_DATASET}`,
      );
    },
  };
}
