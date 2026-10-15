# ManyaIT Studio

The Sanity Studio where HR and marketing manage the website's content: job
openings, insights, case studies, the homepage, capabilities, industries,
locations, search settings and site-wide details. The website in `../site`
keeps all design, layout and animation; the Studio only holds content.

The Studio uses project `n3hghywr` and the `production` dataset. The website
reads its words, photos and job openings from there at build time, and a
webhook rebuilds it whenever something is published (see "Publishing updates
the site").

## Set up

Node 22.12 or newer.

```sh
cd studio
npm install
npm run dev        # http://localhost:3333, sign in with your Sanity account
```

To publish the Studio for editors, sign in once with `npx sanity login`, then
run `npm run deploy`. It goes to https://manyait.sanity.studio (if that name
is taken, Sanity asks for another).

After the first deploy, the Studio's app id appears at
https://www.sanity.io/manage/project/n3hghywr/studios. Adding it as
`deployment.appId` in `sanity.cli.ts` lets you choose which Studio version
editors get; without it, they always get the latest.

No `.env` is needed. Copy `.env.example` to `.env` only to point the Studio
at another project or dataset, e.g. a test dataset.

| Script             | What it does                                                       |
| ------------------ | ------------------------------------------------------------------ |
| `npm run dev`      | The Studio locally                                                 |
| `npm run build`    | Builds the Studio to `dist/`                                       |
| `npm run deploy`   | Publishes it to https://manyait.sanity.studio                      |
| `npm run validate` | Checks the schemas                                                 |
| `npm run check`    | Type-checks the code                                               |
| `npm run typegen`  | Regenerates the website's query types (`site/src/sanity/types.ts`) |
| `npm run seed`     | Fills an empty dataset with the starting content (see below)       |
| `npm run refresh`  | Replaces the content with the starting content (see below)         |

## Publishing updates the site

The website is rebuilt from Sanity, so anything published in the Studio is
live about two minutes later. Two settings connect them, each made once.
Only published content reaches the site; drafts never do.

**1. A deploy hook in Vercel** (a private address that starts a build):

1. Vercel → the website's project → Settings → Git → Deploy Hooks.
2. Name it `Sanity publish`, choose the branch `main`, and select Create Hook.
3. Copy the address it shows. Keep it private: anyone with it can start a
   build. Don't paste it into a chat, an email or the code.

**2. A webhook in Sanity** (calls that address whenever something is
published):

1. https://www.sanity.io/manage/project/n3hghywr → API → Webhooks →
   Create webhook.
2. Name: `Rebuild the website`. URL: paste the Vercel address.
3. Dataset: `production`. Trigger on: Create, Update and Delete.
4. Filter:
   ```
   _type in ["siteSettings", "homePage", "pageSettings", "capability", "industry", "location", "insight", "insightCategory", "opportunity", "caseStudy", "clientLogo", "ecosystemCompany"]
   ```
5. HTTP method: `POST`. Leave the projection, the secret and "Trigger on
   drafts" empty or off. Save.

To check it: change a word in the Studio, publish, and watch a new build
start under Vercel → Deployments. If a build fails (Sanity unreachable, a
required item missing or, with `STRICT_CONTENT=1`, an unconfirmed claim),
the site that's already live stays up, and the failed build shows why.

## The starting content

`seed/production.ndjson` is the website's content as it was when the pages
moved to Sanity, as Sanity documents: settings, the homepage, page headers
and FAQs, capabilities, industries, locations, Insights articles and
categories, client logos, the ecosystem company and the ten sample job
roles. Its photos and logos are in `seed/files/`. Sanity is now where the
content lives; this file is only a starting point.

| Command           | What it does                                                                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run seed`    | Fills an empty dataset. Skips any document that already exists, so it never overwrites an editor's changes.                                               |
| `npm run refresh` | Replaces each of those documents with the version in the file, then clears drafts started from the old versions. **Overwrites editors' changes to them.** |

Both first check where they're about to go (`scripts/preflight.ts`, also
`npm run preflight` on its own). They print the project, dataset and
signed-in account, and stop with the fix if the project isn't `n3hghywr` (a
leftover `.env` file or environment variable), the account isn't a member
or can only view, or the dataset is missing. Assets are matched by their
contents, so nothing uploads twice.

```sh
cd studio
npm install
npx sanity login   # once, with an account that's an Administrator on the project
npm run refresh    # or: npm run seed, for an empty dataset
```

After an import:

- **Proof & claims → Not confirmed yet** lists every figure, client logo and
  the ecosystem company. None is confirmed until someone records the evidence.
- **Careers → Open roles** shows the ten sample roles the careers page lists.
  HR replaces them with real openings. A role needs a reference code and a
  posting date before changes to it can be published; to take a sample role
  down, use Unpublish or Delete. A role is linked to the office in its
  country, and "Location shown" keeps the place it names, e.g.
  "Jersey City, NJ".

## What editors see

The menu is arranged around the jobs HR and marketing do:

- **Start here**: a one-page guide to publishing, jobs, articles and the copy
  rules.
- **Careers**: open roles, closed roles and all roles. "New job opening" starts
  a role that is open, posted today and applied for by email. **Close role**
  closes and publishes in one step.
- **Insights**: articles and categories. The Insights grid's filters come from
  the categories.
- **Case studies**.
- **Website pages**: the homepage, the other pages (About, Careers, Locations,
  Contact and the overview pages), capabilities, industries and locations.
- **Proof & claims**: everything not yet confirmed in writing, client logos
  and ecosystem companies.
- **Site settings**: contacts, social profiles, button labels, the footer
  line, approved job boards and default search settings.

## Safeguards

- **Nothing unconfirmed goes live.** Figures, client logos, quotes, client
  names and ecosystem relationships start unconfirmed. Marking one confirmed
  needs who confirmed it, when and the evidence. A case study names its client
  only with recorded permission, and always has an anonymous description.
  "Proof & claims → Not confirmed yet" lists what's waiting.
- **Copy rules.** Every copy field warns about the banned words in
  `site/README.md` (recruiting, staffing, hire, consulting, vendor and the
  rest). The readers are B2B decision-makers and talent partners, so write in
  high-level business and technical terms, never basic ones (see "Copy rules"
  in `site/README.md`).
- **Addresses stay put.** Capability and industry addresses are read-only. A
  published article, role or case study can't change its address unless an
  administrator allows it (a developer then adds a redirect).
- **Fixed sets.** The settings, homepage, page settings, capabilities,
  industries and locations can be edited and published but never created,
  deleted, duplicated or unpublished, because the site's layout depends on
  them. They are created once by the import (see "The starting content").
- **Job applications** go by email to the careers address, or to a job board
  listed under "Approved job boards" in Site settings. The contact-form option
  is added once the form is connected to an inbox.
- **Alt text** is required on every image unless it's marked decorative.
- **The query tool** (Vision) is shown to administrators only.

## Content types

| Type                                 | What it is                                       |
| ------------------------------------ | ------------------------------------------------ |
| `siteSettings`, `homePage`           | One document each                                |
| `pageSettings`                       | One per code-owned page (`page-about`, …)        |
| `capability`, `industry`, `location` | Fixed sets with the site's existing ids          |
| `insight`, `insightCategory`         | Articles at `/insights/<slug>` and their filters |
| `opportunity`                        | Job openings, listed on `/careers`               |
| `caseStudy`                          | Case studies at `/case-studies/<slug>`           |
| `clientLogo`, `ecosystemCompany`     | Proof shown on the homepage, each confirmed      |

Shared objects: `seo`, `stat` (a figure with its confirmation), `imageWithAlt`,
`textBlock` and `articleBody` (rich text with tables and callouts), and the
section objects used by the pages.

## Phases

1. Done: the Studio, its content types and safeguards.
2. Done: the website fetches Sanity content at build time. Images are copied
   onto the site, so visitors never load anything from Sanity.
3. Done: `npm run seed` imports the content, with every claim unconfirmed.
4. Done: the pages read Sanity, checked word for word against the site
   before the switch; publishing rebuilds the site through a webhook.
5. Done: build-time checks for unconfirmed claims, placeholders and banned
   words.
6. Hosting, a daily rebuild (so roles past their closing date drop off) and
   job pages with a PDF and search markup.
7. An editor guide and invitations.
