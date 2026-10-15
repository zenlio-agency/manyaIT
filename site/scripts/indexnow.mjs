/**
 * Tells Bing, and the other search engines that share IndexNow (Yandex,
 * Seznam, Naver), that pages changed, so they crawl them again within
 * hours instead of weeks. Run it once a deploy is live:
 *
 *   npm run indexnow                    every page in the live sitemap
 *   npm run indexnow -- /about /careers only these pages
 *
 * The key is the file `public/<key>.txt`. It must already be live on the
 * site, because the search engine fetches it to check the request is ours.
 */
import { readdir } from "node:fs/promises";

/* The same origin as SITE_URL in src/consts.ts. */
const SITE = "https://www.manyait.com";

const files = await readdir(new URL("../public/", import.meta.url));
const keyFile = files.find((file) => /^[a-f0-9]{32}\.txt$/.test(file));
if (!keyFile) throw new Error("No IndexNow key file (<key>.txt) in public/.");
const key = keyFile.replace(/\.txt$/, "");

/** Every page address in a sitemap, following a sitemap index. */
async function sitemapUrls(address) {
  const response = await fetch(address);
  if (!response.ok) throw new Error(`${address}: ${response.status}`);
  const xml = await response.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(
    (match) => match[1],
  );
  if (!xml.includes("<sitemapindex")) return locs;
  return (await Promise.all(locs.map(sitemapUrls))).flat();
}

const paths = process.argv.slice(2);
const urls = paths.length
  ? paths.map((path) => new URL(path, SITE).href)
  : await sitemapUrls(`${SITE}/sitemap-index.xml`);

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key,
    keyLocation: `${SITE}/${keyFile}`,
    urlList: urls,
  }),
});

/* 200 and 202 both mean the list was accepted. */
console.log(`IndexNow: ${response.status} for ${urls.length} addresses`);
if (!response.ok) {
  console.log(await response.text());
  process.exitCode = 1;
}
