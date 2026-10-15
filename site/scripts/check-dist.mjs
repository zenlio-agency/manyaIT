/**
 * Runs after every build (`npm run build`). Fails it if any built file still
 * points at Sanity, or contains the Sanity read token. Images and files from
 * Sanity are copied onto the site at build time, so a page that links to
 * Sanity means visitors' browsers would contact a third party, which the
 * Privacy and Cookie Notices say they don't.
 */
import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

/* The token can live in site/.env locally, as in src/sanity/config.ts. */
try {
  process.loadEnvFile();
} catch {
  /* No .env file. */
}

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));

/** Files a browser reads as text. Images and fonts are skipped. */
const TEXT = new Set([
  ".html",
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".xml",
  ".txt",
  ".svg",
  ".webmanifest",
]);

const checks = [
  {
    what: "links to Sanity: copy the file through src/sanity/image.ts",
    pattern: /\b(?:api|apicdn|cdn)\.sanity\.io\b/,
  },
];
const token = process.env.SANITY_READ_TOKEN;
if (token) checks.push({ what: "contains the Sanity read token", text: token });

const problems = [];
for (const entry of await readdir(DIST, {
  recursive: true,
  withFileTypes: true,
})) {
  if (!entry.isFile() || !TEXT.has(extname(entry.name))) continue;
  const path = join(entry.parentPath, entry.name);
  const content = await readFile(path, "utf8");
  for (const check of checks) {
    const found = check.text
      ? content.includes(check.text)
      : check.pattern.test(content);
    if (found) problems.push(`${relative(DIST, path)} ${check.what}`);
  }
}

if (problems.length) {
  console.error(`\ncheck-dist failed:\n  ${problems.join("\n  ")}\n`);
  process.exit(1);
}
console.log("check-dist: nothing in the build links to Sanity.");
