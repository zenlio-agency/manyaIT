/**
 * Runs after `npm run refresh`. The refresh replaces every document in
 * seed/production.ndjson with the version in that file, so any draft of one
 * of them was started from content that no longer exists. This deletes those
 * drafts, so the Studio shows what's live. (The first import brought in the
 * sample job roles as drafts; the refresh publishes them.)
 */
import { readFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";
import { API_VERSION } from "../lib/constants";

async function main() {
  const client = getCliClient({ apiVersion: API_VERSION });
  const ids = readFileSync("seed/production.ndjson", "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => (JSON.parse(line) as { _id: string })._id)
    .filter((id) => !id.startsWith("drafts."));
  const drafts = await client.fetch<{ _id: string; title?: string }[]>(
    `*[_id in $drafts]{ _id, "title": coalesce(title, name, page, _id) }`,
    { drafts: ids.map((id) => `drafts.${id}`) },
  );
  if (!drafts.length) {
    console.log("✓ No old drafts to clear.");
    return;
  }
  const transaction = client.transaction();
  for (const { _id } of drafts) transaction.delete(_id);
  await transaction.commit();
  for (const { title } of drafts)
    console.log(`  cleared the old draft of ${title}`);
  console.log(`✓ Cleared ${drafts.length} old draft(s).`);
}

main().catch((error: Error) => {
  console.error(`\n✗ Couldn't clear old drafts: ${error.message}\n`);
  process.exit(1);
});
