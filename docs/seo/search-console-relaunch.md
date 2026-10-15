# Search relaunch: Google Search Console and Bing

How to make Google and Bing drop the previous ManyaIT site and list the new
one. Checked on 15 Oct 2026. Do the steps in order, starting after the
branch with these changes is merged and deployed.

## What a search for "manyait" shows today

| Result                                                       | What it is                                    | What happens now                               |
| ------------------------------------------------------------ | --------------------------------------------- | ---------------------------------------------- |
| `https://manyait.com/` ("ManyaIT Inc.")                      | Old home page title and description           | Redirects to `https://www.manyait.com/`, works |
| `https://manyait.com/about-us/`                              | Old About page                                | **404 Not found**                              |
| `https://manyait.com/services/`                              | Old Services page                             | **404 Not found**                              |
| `https://manyait.com/what-we-do/`                            | Old What We Do page                           | **404 Not found**                              |
| `https://manyait.com/contact/`                               | Old Contact page                              | Redirects to `/contact`, works                 |
| `github.com/zenlio-agency/manyaIT/pull/29`, `33`, `34`, `35` | Pull requests in the public GitHub repository | Public, indexed under the brand name           |

`https://www.manyait.com/` itself serves the new site correctly: the right
title, canonical, structured data, `robots.txt` and sitemap.

## Why the old links are still there

1. **Old addresses had nowhere to go.** The old site used addresses like
   `/about-us/` and `/services/`. The new site has no page at those
   addresses, and nothing told Google where they moved, so Google kept its
   stored copy. These changes add permanent (301) redirects:

   | Old address   | Now redirects to |
   | ------------- | ---------------- |
   | `/about-us`   | `/about`         |
   | `/services`   | `/capabilities`  |
   | `/what-we-do` | `/capabilities`  |

   With a 301, Google replaces the old result with the new page and carries
   over its history. Removing the old result does not do that.

2. **Two days is short.** Google recrawls a small site over days to weeks.
   Requesting indexing (below) speeds it up but doesn't make it instant.

3. **`/sitemap.xml` returned 404.** The sitemap was only at
   `/sitemap-index.xml`. If `/sitemap.xml` was submitted, Search Console
   shows it as "Couldn't fetch" and Google learned nothing from it. Both
   addresses work now.

4. **Sitelinks are automatic.** Nobody can request them. See
   [Sitelinks](#sitelinks).

## Which links to remove, and which to leave alone

**Do not use the Removals tool on the old site's pages.** A removal only
hides a result for about six months. It doesn't move anything to the new
page. It also hides every version of the address (http and https, www and
non-www). **Removing `https://manyait.com/` would hide the new home page
`https://www.manyait.com/` for six months.** Never use "Remove all URLs with
this prefix" on the domain.

| Address                                                 | Action                                                                                              |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `https://manyait.com/`                                  | Leave it. Request indexing of `https://www.manyait.com/`                                            |
| `/about-us/`, `/services/`, `/what-we-do/`, `/contact/` | Leave them. Inspect each old address and request indexing (step 4)                                  |
| GitHub pull request pages                               | Not in Search Console. See [GitHub repository](#github-repository)                                  |
| Any other old address that shows a 404 page             | Send it to the developer for a redirect. Remove it only if nothing on the new site matches (step 8) |

## Before you start: check the deploy

Open these in a browser. Each should land on the page shown:

- `https://manyait.com/about-us/` → `https://www.manyait.com/about`
- `https://manyait.com/services/` → `https://www.manyait.com/capabilities`
- `https://manyait.com/what-we-do/` → `https://www.manyait.com/capabilities`
- `https://www.manyait.com/sitemap.xml` → an XML list naming `sitemap-0.xml`
- `https://www.manyait.com/sitemap-0.xml` → 31 addresses, most with a
  `lastmod` date

## Google Search Console

1. **Use a Domain property.** Search Console → property menu → **Add
   property** → **Domain** → `manyait.com`. Add the TXT record it gives you
   at the DNS provider for manyait.com, then click **Verify**. A Domain
   property covers `manyait.com`, `www.manyait.com`, http and https. A
   `https://www.manyait.com/` URL-prefix property alone can't inspect the
   old addresses on `https://manyait.com/`. Keep any existing property.

2. **Sitemaps.** Indexing → **Sitemaps**.
   - Remove any old entry: open it → ⋮ → **Remove sitemap**. Examples are
     `sitemap_index.xml`, `wp-sitemap.xml`, `page-sitemap.xml` from the old
     site, or anything showing "Couldn't fetch".
   - Submit `https://www.manyait.com/sitemap-index.xml`.
   - It should read **Success** with about **31** discovered pages within a
     day.

3. **Request indexing of the new pages.** Paste each address into the
   search bar at the top (URL Inspection) → **Request indexing**. Google
   allows about 10 a day, so go in this order:
   - Day 1: `https://www.manyait.com/`, `/about`, `/capabilities`,
     `/industries`, `/careers`, `/contact`, `/insights`
   - Day 2 onwards: the capability pages, then the industry pages, then the
     articles. The sitemap covers anything left over.

4. **Inspect the old addresses.** URL Inspection on
   `https://manyait.com/about-us/`, `/services/`, `/what-we-do/` and
   `/contact/` → **Test live URL**. It should report the redirect. Then
   **Request indexing**. Google recrawls the old address, follows the
   redirect, and swaps the result.

5. **Don't use Change of address.** That tool is for moving to a different
   domain. This is the same domain.

6. **Check `robots.txt`.** Settings → **robots.txt** → it should be fetched
   with no errors. It allows everything and names the sitemap.

7. **After 1–2 weeks, read Indexing → Pages.**
   - **Page with redirect**: expected, these are the old addresses.
   - **Not found (404)**: open it and **export** the list. Send every old
     address with a match on the new site to the developer for a redirect.
   - **Crawled – currently not indexed** or **Discovered – currently not
     indexed**: normal for a new site. Wait, and request indexing for
     important pages.
   - **Alternate page with proper canonical tag**: fine.

8. **Removals, only for dead pages.** Use this only for an old address that
   has no match on the new site, still shows in results, and returns 404:
   Indexing → **Removals** → **New request** → **Temporarily remove URL** →
   paste the exact address → **Remove this URL only**. Never the home page,
   never a prefix.

9. **Check the structured data.** Run the
   [Rich Results Test](https://search.google.com/test/rich-results) on the
   home page, a capability page and an article. Each should be read with no
   errors.

## Bing Webmaster Tools

Bing's index also feeds Yahoo, DuckDuckGo and Copilot, so this covers them
too.

1. **Add the site.** Go to [bing.com/webmasters](https://www.bing.com/webmasters)
   and sign in. Choose **Import from Google Search Console**: it brings the
   verified site and its sitemaps across, with no separate verification.
   Bing keeps checking ownership through Google, so leave that access in
   place.
2. **Sitemaps.** Sitemaps → **Submit sitemap** →
   `https://www.manyait.com/sitemap-index.xml`. Remove any old sitemap
   entries.
3. **IndexNow.** The site now has an IndexNow key at
   `https://www.manyait.com/151bda15c632d0c547d2d84b530357ca.txt`. Once the
   deploy is live, run this from the `site/` folder:

   ```sh
   npm run indexnow
   ```

   It sends every address in the live sitemap to Bing, which usually
   crawls them within hours. It should print `IndexNow: 200` or `202`.
   Run it again after a big content change, or for a few pages with
   `npm run indexnow -- /careers /about`. Bing Webmaster Tools → IndexNow
   lists what arrived.

4. **URL Inspection.** Inspect `https://www.manyait.com/` and
   **Request indexing**, then do the same for the old addresses from step 4
   above.
5. **Old pages.** Bing follows the 301 redirects. Only for a dead page with
   no new match: Configuration → **Block URLs** → block that exact page.
   As with Google, never the home page or the domain.

## Sitelinks

Sitelinks are the extra links under the main result for a brand search
(Capabilities, Careers, Contact). Google and Bing choose them themselves;
neither offers a way to request them. They appear once the search engine
has indexed the new site, understands its structure, and sees people
searching for the brand. For a relaunched site that usually takes a few
weeks, after the old results have been replaced.

Already done on the site:

- One clear menu, with every section linked from the home page and the
  footer
- A different title and description on every page
- `WebSite` and `Organization` structured data naming the site "ManyaIT",
  also known as "Manya IT" and "ManyaIT Inc."
- Breadcrumbs on every inner page
- A sitemap listing only real pages, each with the date it last changed

Still for ManyaIT to do:

- Add the **LinkedIn** company page, and any other official profiles, in
  Sanity → Site settings → Social. Only Instagram is there now. These feed
  the `sameAs` link that ties the brand to the site.
- Set up a **Google Business Profile** for the Frisco office, and **Bing
  Places** for the same, with `https://www.manyait.com` as the website.
  This often powers the panel shown beside brand searches.

## GitHub repository

The repository `github.com/zenlio-agency/manyaIT` is public. Search engines
index its pull requests, which now rank for "manyait". They show internal
working notes (content plans, the Sanity project, deployment details).
Search Console can't remove them, because the site isn't yours there.

1. **Make the repository private.** GitHub → the repository → **Settings**
   → **General** → **Danger Zone** → **Change repository visibility** →
   **Private**.
   - Vercel's Hobby plan deploys a private repository owned by a personal
     GitHub account (`zenlio-agency` is one), but only commits made by the
     Vercel account's owner. Merges made on GitHub by `zenlio-agency`
     qualify if that is the login linked to Vercel. After the change, merge
     a small change and confirm that production still deploys.
2. **Ask Google to drop the pages.** Once they show a 404 when signed out,
   paste each address into Google's
   [Remove outdated content](https://search.google.com/search-console/remove-outdated-content)
   tool. Bing's equivalent is the Content Removal Tool in Bing Webmaster
   Tools.

## Timeline

| When       | What to expect                                                               |
| ---------- | ---------------------------------------------------------------------------- |
| Deploy day | Redirects live. Submit sitemaps, request indexing, run `npm run indexnow`    |
| 1–3 days   | Home page title and description update. Bing picks up the IndexNow list      |
| 1–2 weeks  | Old About, Services and What We Do results replaced. Review Indexing → Pages |
| 2–6 weeks  | Most new pages indexed. Sitelinks may appear for "manyait"                   |

## What changed in the code

- `site/vercel.json`, `site/astro.config.mjs`, `site/public/_redirects`:
  301 redirects for `/about-us`, `/services` and `/what-we-do`
- `site/src/utils/sitemap.ts`, `site/astro.config.mjs`: a `lastmod` date on
  each sitemap address, from Sanity's last edit and the legal pages' dates.
  The sitemap is also written to `/sitemap.xml`.
- `site/src/consts.ts`, `site/src/utils/schema.ts`: `alternateName` on the
  `Organization` and `WebSite` structured data
- `site/public/151bda15c632d0c547d2d84b530357ca.txt`,
  `site/scripts/indexnow.mjs`: the IndexNow key and `npm run indexnow`
