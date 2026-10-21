# Siri Data Analytics website

The new marketing site for [siridataanalytics.com](https://siridataanalytics.com),
Direction B ("Bento"). Astro with TypeScript, plain CSS custom properties and
static output, deployable to Netlify, Vercel or Cloudflare Pages.

```sh
cd siri
npm install
npm run dev      # http://localhost:4321/styleguide
npm run build    # static site in dist/
npm run check    # type-check .astro and .ts files
```

## Build phases

| Phase | Scope                                                                  | Status |
| ----- | ---------------------------------------------------------------------- | ------ |
| 1     | Scaffold, tokens, fonts, layout, nav, footer, components, `/styleguide` | Done   |
| 2     | Home page                                                              |        |
| 3     | Solution template, six solution pages, overview                       |        |
| 4     | Industry template, four industry pages, overview                      |        |
| 5     | Data Check and Book a Data Consult, with tests                        |        |
| 6     | About, Careers, Data Notes, legal pages                               |        |
| 7     | SEO, JSON-LD, sitemap, redirects, analytics events, 404               |        |
| 8     | QA pass and placeholder list                                          |        |

Until phase 2 lands, `/` has no page; start at `/styleguide`.

## Structure

| Path                    | What it is                                                                 |
| ----------------------- | -------------------------------------------------------------------------- |
| `src/styles/tokens.css` | Every color, type, radius and spacing value. The only place colors live.  |
| `src/styles/global.css` | Reset, type classes (`.h1`, `.h2`, `.card-title`, `.big-number`), layout. |
| `src/content/`          | Typed copy and data. Components read from here, never hard-code copy.     |
| `src/content/placeholders.ts` | Every unconfirmed fact, in square brackets. Replace values here.    |
| `src/components/`       | Astro components (see `/styleguide` for each one).                        |
| `src/scripts/`          | Vanilla TS for the interactive parts (nav, FAQ).                          |
| `src/layouts/`          | Page shell: head, skip link, nav, footer.                                 |

## Rules

- **No invented facts.** Any figure, client, logo, quote, year or person not in
  the brief stays a bracketed placeholder in `placeholders.ts`.
- **No new colors.** Use the tokens; derive hover states with `color-mix()`.
- **Photos are placeholders** (`PhotoPlaceholder`) until approved photos exist.
- **Accessibility:** semantic HTML, real buttons and links, visible focus,
  WCAG AA contrast (the style guide lists every pairing), and
  `prefers-reduced-motion` turns off all transitions.

## Components

`FloatingNav` (with Solutions and Industries mega-menus and a full-screen
mobile sheet), `Footer`, `Button`, `BentoGrid`, `Tile`, `Eyebrow`, `Chip`,
`StatTile`, `Sparkline`, `MiniBars`, `LogoTile`, `PhotoPlaceholder`,
`CTABento`, `Breadcrumbs`, `FAQ` (searchable accordion), `ComparisonTable`,
`TableScroll`.

Styling a component's root from a parent: tile and button roots don't always
carry the parent's style scope, so target them with `:global(.class)`.

## Environment

Copy `.env.example` to `.env`. The variables are used from phase 5 on:

- `PUBLIC_FORM_ENDPOINT` — where the consult wizard POSTs its JSON
- `PUBLIC_SCHEDULER_URL` — scheduler embedded beside the wizard
- `PUBLIC_ANALYTICS_ID` — analytics ID, loaded only after consent

## Deploying

Pages build as `name.html` so URLs have no trailing slash. Netlify and
Cloudflare Pages serve these as-is; on Vercel, set `cleanUrls: true` (phase 7
adds the redirect files for each host).
