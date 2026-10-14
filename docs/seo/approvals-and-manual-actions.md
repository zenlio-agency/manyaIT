# SEO work: approvals and manual actions

The branch `seo/technical-fixes` makes code changes only. Nothing here has
been deployed, and nothing outside the repository has been changed. The
items below need a decision from ManyaIT, or an action in Vercel, Google
Search Console, Sanity or Google Tag Manager.

## After merging (Vercel and Search Console)

1. **Check Vercel's Root Directory is `site`.** `vercel.json` lives in
   `site/`, next to the `api/` functions. If the Vercel project builds from
   the repository root instead, move the file there.
2. **Confirm the redirects on the preview deployment** before promoting to
   production:
   - `/privacy`, `/terms`, `/locations` and `/capabilities/talent-solutions`
     return **301**.
   - `/capabilities/workforce-solutions` returns 301 to
     `/capabilities/specialist-talent`.
   - `/about/` redirects to `/about` (Vercel uses 308 for trailing slashes).
   - `https://manyait.com/...` still redirects to `https://www.manyait.com/...`
     in one hop.
3. **Search Console:** verify the `https://www.manyait.com` property, if it
   isn't already, and submit `https://www.manyait.com/sitemap-index.xml`.
   Use URL Inspection on a few pages to confirm Google picks up the new
   canonical URLs.
4. **Rich Results Test** on one page of each type (capability, industry,
   article). This confirms Google reads the JSON-LD. FAQ rich results are
   currently shown only for government and health sites, so the FAQ markup
   is for search engines' understanding of the page, not for a visible
   result.

## Analytics and consent (decision needed)

What the site does today, as checked against the live GTM container on
14 Oct 2026:

- Every page loads **Google Tag Manager** (`GTM-5DW2SKHR`) and, separately,
  the **GA4 tag** (`G-0HDNRPQCGF`, through `gtag.js`). Both are inline in
  `site/src/layouts/BaseLayout.astro`.
- The published GTM container has **no tags** (only built-in variables), so
  page views are **not** counted twice today. GA4 runs once, through
  `gtag.js`. GTM adds about 330 KB of script that currently does nothing.
- If someone later adds a GA4 tag in GTM, page views **will** be counted
  twice, unless the direct `gtag.js` snippet is removed at the same time.
- GA4 sets cookies (`_ga`, `_ga_*`). The **Cookie Notice**
  (`site/src/content/legal/cookies.md`) says the site sets "no analytics"
  cookies and is hosted on **Cloudflare**. Both statements are now wrong:
  analytics runs, and the site is hosted on **Vercel**.

Options for ManyaIT, with counsel where the legal text changes:

- **A. One loading path.** Keep GTM, configure GA4 inside it, and remove the
  inline `gtag.js` snippet. Or the reverse: remove GTM until it's needed.
- **B. Consent.** Visitors in the EU/UK, and arguably under India's DPDP Act
  and some US state laws, need a consent banner before analytics cookies are
  set. Choose a consent tool and run GA4 in Consent Mode behind it.
- **C. Cookie Notice.** List the GA4 cookies, name Vercel as the host, and
  remove "no analytics". Counsel must approve the wording.

No tracking code, consent tool or legal text was changed in this branch.

## Unconfirmed claims (confirmation needed)

From the site's own content check (`npm run build` lists them; 37 open):

- **Six homepage figures** (Homepage → Figures), e.g. "50+ Global enterprise
  clients served" and "100% Enterprise solutions delivered on schedule".
  Record who confirmed each figure, when, and the evidence, or remove it.
- **14 client logos** with no recorded permission: American Express, AT&T,
  Bank of America, Chevron, Citi, CVS Health, ExxonMobil, Goldman Sachs,
  Johnson & Johnson, JPMorgan Chase, Schneider Electric, T-Mobile,
  UnitedHealthcare, Verizon. Get written permission or remove each one
  (Proof & claims → Client logos).
- **Ecosystem company** "Siri Data Analytics": confirm the relationship in
  writing.
- **Copy-rule breaks in code** on `/capabilities/specialist-talent` (14
  uses of "engagement", one of "vendor", and "Hyderabad" outside the footer),
  plus one "engagement" on `/capabilities`. The wording is in
  `site/src/pages/capabilities/specialist-talent.astro`. Only that page's
  meta description was changed here, because the body copy is a wording
  decision.

## Strict content mode does not block (decision needed)

The README says `STRICT_CONTENT=1` "stops the build" on any finding. In
fact `site/src/integrations/content-check.ts` only blocks on duplicate page
addresses. With `STRICT_CONTENT=1`, the 37 findings are still just warnings
(build exits 0). The fix is one line: treat the findings as blocking when
strict is on. **If Vercel production already sets `STRICT_CONTENT=1`, that
fix would stop every production deploy until all 37 items are resolved.**
Decide whether to fix it now, or after the claims above are cleared.

## Other findings

- **Job openings.** The ten roles on `/careers` are sample roles (see
  `site/README.md`). No `JobPosting` markup was added. Once real roles are in
  the Studio, each with a posting date, location and employment type, add
  `JobPosting` markup for them.
- **Office addresses in schema.** The `Organization` markup leaves out
  addresses, because the legal entity names and CIN are still awaiting
  counsel (`site/src/data/legal.ts`). Add them once confirmed.
- **Social profiles.** Only Instagram has an address in Site settings, so
  `sameAs` lists only Instagram. Add the LinkedIn and other company profile
  URLs in Site settings, and they flow into the markup on the next build.
  `twitter:site` was not added, because no X account is recorded.
- **"Hide from search engines" switch does nothing.** The Studio's
  Search and social → "Hide from search engines" (`seo.noindex`) is never
  read by the site, and no document has it switched on. Either wire it into
  the page head and the sitemap filter, or remove it from the Studio.
- **GitHub Pages workflow removed.** `.github/workflows/astro.yml` only
  deployed to GitHub Pages (that URL returns 404), and every recent run
  failed at `npm ci`. It's removed in its own commit, which can be dropped
  to keep it.
