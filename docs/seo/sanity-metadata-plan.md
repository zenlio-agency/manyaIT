# Sanity metadata plan

Most page titles, descriptions and H1s are edited in the Studio, not in code.
The code changes in this branch can't update them, so the changes below need
to be made in Sanity, then published, and the site rebuilt.

All proposals follow the copy rules in `site/README.md` ("Copy rules") and
`site/src/data/copy-rules.ts`. That means no "GCC", "capability center",
"staffing", "recruiting" or "engagement" outside the homepage's approved
phrases. The proposals are a keyword-mapping plan based on what each page
covers. They are **not** based on search-volume or ranking data, since none
was available. Check them against Search Console queries, or a keyword tool,
before publishing.

Where a title is shown "as rendered", the site adds " | ManyaIT" itself, or
puts "ManyaIT | " in front on the homepage. It leaves the name off when the
result would be over 60 characters.

## Page titles and descriptions

Studio path: open the document, then **Search and social → Page title /
Description**.

| Document (`_id`) | Field | Current | Proposed (as rendered) | Chars |
| --- | --- | --- | --- | --- |
| Homepage (`homePage`) | Page title | Technology & Talent Partners | ManyaIT \| Data, AI & Engineering Teams for Enterprises | 54 |
| Pages → Careers (`page-careers`) | Page title | Careers | Careers in Data, AI & Enterprise Engineering \| ManyaIT | 54 |
| Pages → Contact (`page-contact`) | Page title | Start a Conversation | Contact ManyaIT: Data, AI & Engineering Teams | 45 |
| Pages → Industries (`page-industries`) | Page title | Industries | Industries: Banking, Telecom, Healthcare & Energy \| ManyaIT | 59 |
| Pages → Insights (`page-insights`) | Page title | Insights | Insights on Data, AI, SAP & Engineering \| ManyaIT | 49 |
| Industry → Banking (`industry-banking`) | Page title | _(empty: "Banking & Finance")_ | Banking & Financial Services Technology \| ManyaIT | 49 |
| Industry → Energy (`industry-energy`) | Page title | _(empty: "Energy & Utilities")_ | Energy & Utilities Technology Solutions \| ManyaIT | 49 |
| Industry → Healthcare (`industry-healthcare`) | Page title | _(empty: "Healthcare & Wellness")_ | Healthcare Data & Technology Solutions \| ManyaIT | 48 |
| Industry → Retail (`industry-retail`) | Page title | _(empty: "Retail & E-commerce")_ | Retail & E-commerce Technology Solutions \| ManyaIT | 50 |
| Industry → Telecom (`industry-telecom`) | Page title | _(empty: "Telecom & Networks")_ | Telecom BSS/OSS & Network Engineering \| ManyaIT | 47 |
| Insight (`insight-ai-pilots-to-production`) | Page title | _(empty: headline is 73 chars)_ | Why AI Pilots Stall, and How Teams Reach Production | 51 |
| Insight (`insight-modernize-legacy-without-freezing-roadmap`) | Page title | _(empty: headline is 61 chars)_ | Modernize Legacy Apps Without Freezing the Roadmap \| ManyaIT | 60 |
| Insight (`insight-two-cities-one-team`) | Page title | _(empty: headline is 64 chars)_ | One Platform Team Across Time Zones \| ManyaIT | 45 |
| Insight (`insight-sap-clean-core-explained`) | Description | 168 characters | A plain-language guide to SAP clean core for budget holders: what it means, how it changes cost and risk, and what to ask before you fund it. | 141 |

The article "Page title" field now takes effect: before this branch, articles
always used their headline.

Leave unchanged: the capability pages, About and Capabilities. Their titles
and descriptions are already descriptive and within length.

## H1 headings

Each H1 is the hero heading of its document: **Hero → Heading** on the
pages and the homepage, and **Page heading** on capabilities and industries.
They are short slogans that don't name the service. Keep the slogans, and
make the hero's **eyebrow** or **lede** name the service in plain words.
That way readers, search engines and AI assistants can tell what the page is
about from its first lines.

| Page | Current H1 | Suggested eyebrow or lede wording |
| --- | --- | --- |
| /capabilities/applied-ai | Take AI from pilot to production. | Applied AI and generative AI engineering |
| /capabilities/agentic-ai-automation | AI that doesn't just answer. It executes. | Agentic AI and intelligent automation |
| /capabilities/data-analytics | Turn enterprise data into decision-grade intelligence. | Data and analytics engineering |
| /capabilities/sap-enterprise-data | Modernize your SAP core and put its data to work. | SAP S/4HANA transformation and enterprise data |
| /capabilities/digital-product-engineering | Complex programs, delivered to production. | Digital product engineering and modernization |
| /careers | Build systems that matter. | Careers in data, AI and enterprise engineering |
| /insights | Field notes from the teams doing the work. | Insights on data, AI, SAP and engineering |
| /industries/* | (sector slogans) | "[Sector] technology, data and AI engineering" |

Check each hero's current eyebrow first. Where it already names the service,
nothing needs to change.

## If ManyaIT relaxes the GCC rule

"Global Capability Center" is the company's stated positioning, but the copy
rules ban "GCC" and "capability center" everywhere except fixed homepage
phrases. If ManyaIT wants to rank for GCC searches, the rule has to change
first: update `site/src/data/copy-rules.ts` and `studio/lib/validation.ts`
together. Then these become options:

- Homepage title: `ManyaIT | Global Capability Center Technology Partner` (53)
- A dedicated GCC landing page explaining the setup, scale and transfer
  model, linked from the homepage and About.
