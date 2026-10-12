/*
 * Where the site reads its content at build time. The project id and
 * dataset aren't secret: they appear in every request to Sanity. A read
 * token is needed only once the dataset is private. Set it as
 * SANITY_READ_TOKEN in the host's environment, or in site/.env locally,
 * never in code.
 */

/* Lets site/.env set these locally. Values set in the shell or on the host
   take precedence. */
try {
  process.loadEnvFile();
} catch {
  /* No .env file. */
}

export const SANITY_PROJECT_ID =
  process.env.SANITY_PROJECT_ID ||
  process.env.PUBLIC_SANITY_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  "n3hghywr";

export const SANITY_DATASET =
  process.env.SANITY_DATASET ||
  process.env.PUBLIC_SANITY_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";

export const SANITY_READ_TOKEN =
  process.env.SANITY_READ_TOKEN ||
  process.env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_TOKEN ||
  undefined;

/** Fixed, so a Sanity API change never alters a build unannounced. */
export const SANITY_API_VERSION = "2026-10-01";
