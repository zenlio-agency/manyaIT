# ManyaIT Legal Pack: Design Document

**Status:** Draft for review. Design only; nothing here is implemented yet.
**Prepared:** 4 October 2026, for the ManyaIT website in `site/`.
**Scope:** Which legal and compliance pages the site needs, how each page is
structured and designed, what goes in it, and how it connects to the rest of
the site.

> **Not legal advice.** This document designs the pages and outlines what
> each must cover. The wording of every policy must be written or approved by
> ManyaIT's counsel in the US and India before anything goes live. Anything in
> `[square brackets]` is a placeholder to confirm.

---

## 1. Recommendation at a glance

**What the research found.** Eight peers were reviewed: Accion Labs,
Techwave, ANSR, Xoriant, Persistent, Happiest Minds, Tredence and InfoVision
(section 2). They all publish a privacy policy. Beyond that, the quality is
uneven:

- None publishes a standalone accessibility statement. One (Tredence) has
  one tucked inside its Terms.
- None names an India Grievance Officer, though the SPDI Rules require one.
- None has a "Do Not Sell or Share" link. Only Techwave mentions honouring
  opt-out signals such as Global Privacy Control, and only "where required".
- Most load tracking cookies before the visitor chooses.
- Several have stale dates, leftover template text, or policies that
  contradict each other.

A short, accurate, well-structured pack is a real way for ManyaIT to stand
out, and it is cheap because the site collects very little.


**Launch set (7 pages, all under `/legal/`):**

| Page | URL | Why it is needed |
| --- | --- | --- |
| Legal hub | `/legal` | One home for every policy; the footer's "Legal" link |
| Privacy Notice | `/legal/privacy` | Required for the contact form, newsletter and Talent Network (India SPDI Rules, Texas TDPSA, CAN-SPAM; GDPR for EU visitors) |
| Terms of Use | `/legal/terms` | Protects the content, sets acceptable use, disclaims liability |
| Cookie Notice | `/legal/cookies` | States what the site stores (today: nothing optional) |
| Accessibility Statement | `/legal/accessibility` | Commits to WCAG 2.2 AA and gives a feedback route |
| Applicant Privacy Notice | `/legal/applicant-privacy` | How Talent Network and careers data is handled |
| Job Offer Fraud Notice | `/legal/job-offer-fraud` | Protects people from fake offers made in ManyaIT's name |

**Plus one working page:** `/legal/privacy-requests`, a form for access,
correction, deletion and opt-out requests, with an appeal route.

**Later, when they become true:** Trust & Security (only once certifications
are held), Ethics & Compliance, CSR Policy (if ManyaIT crosses the India
Companies Act threshold), and a cookie consent banner (only if analytics or
marketing tags are added).

**Two fixes to make before launch, outside the legal pages:**

1. **Self-host the photos.** Every page currently loads its photography from
   `images.unsplash.com`, which sends each visitor's IP address to a third
   party. Moving the files into `public/images/` removes the only third-party
   request on the site and keeps the privacy notice short.
2. **Add a notice line under each form.** The contact form, the newsletter
   field and the Talent Network link each need one sentence linking to the
   right notice (designs in section 7.7).

---

## 2. What peers publish

Eight sites from the same niche were reviewed in October 2026: IT services,
digital engineering and GCC enablers, most with US and India operations.
ANSR is a GCC specialist. Tredence (San Jose and Bengaluru) and InfoVision
(Richardson, Texas) are the closest in shape to ManyaIT. Checks ran from a
US connection, so banner behaviour is what a US visitor sees. Per-site notes
and URLs are in Appendix A.

### 2.1 Comparison

✓ = present and reasonable · ~ = present with problems · ✗ = missing

| Site | Privacy notice | Terms | Cookie notice | Banner offers Reject up front | Accessibility | Applicant notice | Fraud notice | Ethics / speak-up | Certifications page |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Accion Labs | ✓ dated 2026, GDPR only | ✓ dated 2025 | ~ undated, template leftovers | ✓ (but one tracker fires first) | ✗ | ✗ | ✓ on careers | ~ supplier code, not in footer | ✗ badges only |
| Techwave | ✓ dated 2026, rights by region incl. Texas and DPDP | ✗ | ~ recycled privacy template | ✗ banner disabled by plan limit | ✗ | ~ inside privacy | ~ exists but not linked anywhere | ✗ | ✓ Quality page with policy PDFs |
| ANSR | ~ undated, ~6,000 words | ✗ (referenced, missing) | ✗ | ✓ equal-weight Reject All | ✗ | ~ inside privacy | ✗ | ✓ versioned policy + anonymous form | ✗ |
| Xoriant | ~ dated 2018, cites repealed law | ~ undated, no governing law | ~ dated 2018 | ✗ | ✗ | ✓ separate, legal-basis table (placeholders left in) | ✓ careers site | ✓ reporting form | ✗ |
| Persistent | ✓ dated 2026, DPDP wording, named DPO | ~ undated | ✓ dated cookie table | ✗ opt-out model | ✗ | ? careers site unreachable | ✓ | ✓ ethics hub | ✓ plus a privacy-programme page |
| Happiest Minds | ~ undated, question headings | ~ undated, one-sided forum clause | ~ inside privacy | ✗ | ✗ | ✗ | ✓ with EEO incl. caste | ✓ policy PDFs | ✓ |
| Tredence | ✓ dated 2026, excludes client data, complaint routes per region | ~ undated, no governing law | ~ dated 2023 | ✗ categories pre-ticked | ~ inside Terms, WCAG 2.2 AA | ~ inside privacy | ✗ | ✓ plus a public supplier security and privacy policy | ✓ |
| InfoVision | ~ dated 2020, no laws named | ✗ | ✗ | ~ Reject exists, but continuing counts as consent | ✗ | ✗ | ✓ | ✗ | ✗ |

### 2.2 What most of them do

- A short legal row at the bottom of the footer, two to four links, with flat
  URLs such as `/privacy-policy` and `/terms-of-use`. Nobody uses a `/legal`
  hub.
- Rights requests by email to a "DPO" or "privacy" mailbox, usually without
  a named person.
- No table of contents, summary box, print option or version history on any
  legal page. Several use bold text instead of real headings, which hurts
  screen readers and deep links.
- Fraud warnings for job seekers: six of the eight. This matters for any
  India talent hub.

### 2.3 Good practices to borrow

| Practice | Seen at | Where it lands in this pack |
| --- | --- | --- |
| Rights set out by region (EU/UK, India DPDP, US states including Texas) | Techwave | Privacy Notice section 8 |
| Specific retention periods per data type | Techwave | Privacy Notice data table |
| Scope that excludes client data processed on clients' behalf | Tredence | Privacy Notice section 2 |
| Complaint routes per jurisdiction (India Data Protection Board, EU/UK authority, US state Attorney General) | Tredence | Privacy Notice section 8 |
| Separate applicant notice with a legal-basis table | Xoriant | Applicant Privacy Notice |
| A web form for privacy requests, not just a mailbox | Xoriant | `/legal/privacy-requests` |
| Unbundled consent: a request checkbox and a separate, unticked marketing opt-in | Persistent | Form notice lines (7.7) |
| Acknowledging requests within 72 hours | Persistent | Privacy request page (7.4) |
| Dated cookie inventory | Persistent | Cookie Notice (when cookies exist) |
| Reject All with the same weight as Accept All | ANSR | Consent design (7.3) |
| Equal-opportunity statement that includes caste | Happiest Minds | Applicant Privacy Notice |
| Speak-up policy with version history and anonymous reporting | ANSR | Ethics & Compliance (later) |
| Certifications and policy PDFs on one page | Techwave, Persistent | Trust & Security (later) |
| Public supplier security and privacy terms | Tredence | Optional, later |
| Dated WCAG 2.2 AA statement | Tredence (inside Terms) | Accessibility Statement, as its own page |

### 2.4 Mistakes to avoid

- **Stale or missing dates.** Xoriant's policies date from 2018, InfoVision's
  from 2020. ANSR's privacy policy and most terms are undated.
- **Template leftovers.** Accion links still point to a subsidiary's domain.
  Xoriant shows "Your engaging subtitle goes here". Tredence shows unfilled
  `[#…#]` tokens. Persistent has swapped headings and a stray spam domain.
- **Pages that contradict each other.** Happiest Minds' Terms say data is
  never shared, while its privacy policy lists sharing. Techwave says it uses
  no advertising trackers while ad-tech cookies fire on load.
- **Consent that isn't consent.** "Continuing to browse means you agree"
  (Happiest Minds, InfoVision), pre-ticked categories (Tredence), no Reject
  button (Xoriant, Persistent), and trackers firing before any choice
  (most of them).
- **Missing or orphaned pages.** Terms missing at Techwave, ANSR and
  InfoVision. ANSR's privacy policy references Terms that don't exist.
  Techwave's fraud page and Accion's supplier code are linked from nowhere.
- **One-sided or missing governing-law clauses** (Happiest Minds, Tredence,
  Xoriant).

### 2.5 What this means for ManyaIT

1. **Cover what nobody else does.** A standalone accessibility statement, a
   named India Grievance Officer, a Texas TDPSA section with an appeal route,
   and a Global Privacy Control commitment make the pack stronger than every
   peer reviewed.
2. **Stay true to the site.** ManyaIT sets no tracking cookies today. Saying
   so plainly, and keeping it true, avoids the most common failure in the
   niche: claims contradicted by real trackers.
3. **Make the pages findable and readable.** A `/legal` hub, real headings,
   an "On this page" list, an At a glance box, dates and a change log. None
   of the eight do all of these.
4. **Release checks matter as much as wording.** No template tokens, every
   page dated, every page linked from somewhere, and the same facts on every
   page (section 10).

---

## 3. What the ManyaIT site actually does with data

The policies should describe the site as it is, not as a generic template.
Today the site:

| Touchpoint | Data collected | Where it goes | Notes |
| --- | --- | --- | --- |
| Contact form (`/contact`) | Name, work email, company, topic, message | Not connected yet; will go to `[inbox / CRM]` | Business contacts, mostly |
| Talent Network (`/contact?topic=careers`) | Same fields, topic "Careers" | Same as above | This is applicant data; needs the applicant notice |
| Newsletter (footer) | Work email | Not connected yet; will go to `[email platform]` | Marketing email: CAN-SPAM, consent |
| Role finder (`/careers`) | Nothing; filters run in the browser | n/a | Links to the contact form |
| Every page | IP address, browser, pages requested | Hosting logs at Cloudflare (`wrangler.jsonc`) | Strictly necessary |
| Every page with photos | IP address, page URL as referrer | Unsplash (`images.unsplash.com`) | Remove by self-hosting |
| Cookies / local storage | None | n/a | No analytics, no tags, no consent banner needed today |

Fonts are self-hosted, so there are no Google Fonts requests.

**Design consequence:** while the site sets no optional cookies and loads no
third-party trackers, it does **not** need a cookie consent banner. A short
Cookie Notice that says so is enough. If analytics or advertising tags are
added later, the consent design in section 7.3 switches on.

---

## 4. Laws and frameworks to plan for

ManyaIT is a US company (Frisco, Texas) with an engineering hub in Hyderabad,
India, marketing to global enterprises. Counsel should confirm which of these
apply and when.

| Framework | Applies when | What it asks of the website |
| --- | --- | --- |
| **India: IT Act 2000, s.43A and SPDI Rules 2011** | A body corporate in India handles personal information | Publish a privacy policy on the website; name a **Grievance Officer** with contact details; resolve grievances within one month |
| **India: Digital Personal Data Protection Act 2023 and DPDP Rules 2025** | Digital personal data processed in India, or of people in India | Itemised notice of data and purposes; clear, affirmative consent; rights to access, correct and erase; a published contact for questions; a grievance route and the right to complain to the Data Protection Board. The Rules phase in after notification in November 2025; confirm current dates |
| **US: Texas Data Privacy and Security Act (TDPSA)** | Doing business in Texas, unless a small business under SBA rules | Privacy notice with set contents; access, correct, delete and portability rights, plus opt-out of sale, targeted ads and profiling; reply within 45 days; an **appeal** process. People acting in a commercial or employment context are outside "consumer", so B2B contacts are largely excluded |
| **US: California (CCPA/CPRA)** | Only above its thresholds (revenue over roughly $26.6M, or large-volume data) | If it applies: notice at collection, "Your Privacy Choices" link, Global Privacy Control, and coverage of B2B and applicant data |
| **US: CAN-SPAM** | Any marketing email, including the newsletter | Physical postal address in every email, a working unsubscribe honoured within 10 business days, no misleading subject lines |
| **EU / UK GDPR** | Marketing to, or monitoring, people in the EU or UK | Article 13 notice contents, legal bases, transfer safeguards (SCCs), rights, and possibly an Article 27 representative; consent before non-essential cookies |
| **Accessibility (ADA Title III; WCAG)** | US public-facing sites; WCAG 2.1/2.2 AA is the working standard | An accessibility statement with a target level, known limits and a feedback route |
| **India Companies Act s.135 (CSR)** | Net worth ≥ ₹500 crore, turnover ≥ ₹1,000 crore, or net profit ≥ ₹5 crore | CSR policy disclosed on the website. Likely not yet applicable |
| **UK Modern Slavery Act / Australian equivalent** | Turnover over £36m in the UK, or A$100m in Australia | Annual statement. Likely not applicable |

---

## 5. The pack: page inventory and priorities

### 5.1 Launch (must have)

1. **Legal hub** (`/legal`): every policy as a card with a one-line summary
   and its last-updated date.
2. **Privacy Notice** (`/legal/privacy`): the main notice for website
   visitors, business contacts and newsletter subscribers, with regional
   sections for the US, India and the EU/UK.
3. **Terms of Use** (`/legal/terms`).
4. **Cookie Notice** (`/legal/cookies`).
5. **Accessibility Statement** (`/legal/accessibility`).
6. **Applicant Privacy Notice** (`/legal/applicant-privacy`): kept separate
   from the main notice because the audience, data, retention and legal basis
   all differ, and the careers page can link straight to it.
7. **Job Offer Fraud Notice** (`/legal/job-offer-fraud`): turns the one-line
   warning already on `/careers` into a full page people can be sent to.
8. **Privacy Requests** (`/legal/privacy-requests`): a request form, not a
   policy. Linked from every privacy notice and from the footer.

### 5.2 Later (when true)

- **Trust & Security** (`/trust`): security practices, then ISO 27001 /
  SOC 2 badges **only once certified**. Never list a certification that is in
  progress as held.
- **Ethics & Compliance** (`/legal/ethics`): code of conduct summary,
  anti-bribery commitment and a speak-up / whistleblower channel.
- **CSR Policy** (`/legal/csr`): when the India threshold is crossed.
- **Equal Opportunity statement**: a short block on `/careers` and in the
  applicant notice, rather than its own page.
- **Supplier Security & Privacy Standard** (optional): public terms for the
  service providers ManyaIT uses, like Tredence's. Useful once enterprise
  clients start asking for it in security reviews.
- **Cookie consent banner and preference centre**: only when non-essential
  cookies arrive (section 7.3).

### 5.3 Not needed

- Sub-processor lists and data processing agreements belong in client
  contracts, not on the public site.
- Investor and stock-exchange disclosures do not apply to a private company.
- Separate country privacy pages: one notice with regional sections is easier
  to keep accurate.

---

## 6. Information architecture

### 6.1 URLs

```
/legal                         Legal hub
/legal/privacy                 Privacy Notice
/legal/terms                   Terms of Use
/legal/cookies                 Cookie Notice
/legal/accessibility           Accessibility Statement
/legal/applicant-privacy       Applicant Privacy Notice
/legal/job-offer-fraud         Job Offer Fraud Notice
/legal/privacy-requests        Privacy request form
```

Add permanent redirects from the URLs people guess: `/privacy`,
`/privacy-policy`, `/terms`, `/terms-of-use`, `/cookie-policy`,
`/accessibility`. Every legal page is indexable and listed in the sitemap.

### 6.2 Footer

The bottom row of the footer becomes:

```
© 2026 ManyaIT Inc.   Privacy · Terms · Cookies · Accessibility · Privacy Requests · Legal
```

- "Legal" opens the hub; the others go straight to their page.
- If non-essential cookies are ever added, "Cookie settings" joins the row
  and reopens the preference centre.
- If CCPA ever applies, "Your Privacy Choices" with the standard icon joins
  the row.

### 6.3 Links from the rest of the site

| Place | Link |
| --- | --- |
| Contact form | Notice line linking to `/legal/privacy` (section 7.7) |
| Newsletter field | Notice line linking to `/legal/privacy#marketing` |
| `/careers` and the Talent Network topic | `/legal/applicant-privacy` and `/legal/job-offer-fraud` |
| Footer | As in 6.2 |
| Every policy | Its own contact block and a link to `/legal/privacy-requests` |

---

## 7. Page designs

All legal pages share one calm, readable layout in the existing ManyaIT
system: light theme, Plus Jakarta Sans headings, Inter body text, Manya Blue
for links and accents. Legal pages switch off scroll reveals so text never
fades in while someone is reading or searching it.

### 7.1 Legal hub (`/legal`)

```
┌──────────────────────────────────────────────────────────────┐
│ LEGAL (eyebrow)                                               │
│ Policies and notices                                (H1)      │
│ How ManyaIT handles your information and the terms for        │
│ using this site.                                              │
├──────────────────────────────────────────────────────────────┤
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐         │
│ │ Privacy Notice│ │ Terms of Use  │ │ Cookie Notice │         │
│ │ one-line sum. │ │ one-line sum. │ │ one-line sum. │         │
│ │ Updated [date]│ │ Updated [date]│ │ Updated [date]│         │
│ └───────────────┘ └───────────────┘ └───────────────┘         │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐         │
│ │ Accessibility │ │ Applicant     │ │ Job Offer     │         │
│ │               │ │ Privacy       │ │ Fraud Notice  │         │
│ └───────────────┘ └───────────────┘ └───────────────┘         │
├──────────────────────────────────────────────────────────────┤
│ Questions or a request about your data?                       │
│ [Make a privacy request]   privacy@[domain]                   │
└──────────────────────────────────────────────────────────────┘
```

- Cards are links, three across on desktop, two on tablet, one on mobile,
  reusing the Industry card style (number dropped, date added).
- The contact strip at the bottom is the same on every legal page.

### 7.2 Legal document template

```
┌──────────────────────────────────────────────────────────────┐
│ Legal  ›  Privacy Notice                     (breadcrumb)    │
│ Privacy Notice                                (H1)           │
│ Effective [date] · Last updated [date] · Version [1.0]       │
├───────────────┬──────────────────────────────────────────────┤
│ ON THIS PAGE  │ ┌──────────────────────────────────────────┐ │
│ 1 Who we are  │ │ AT A GLANCE (tinted summary box)         │ │
│ 2 What we     │ │ • What we collect, in one line           │ │
│   collect     │ │ • Why, in one line                       │ │
│ 3 How we use  │ │ • We never sell your data                │ │
│ …             │ │ • How to reach us                        │ │
│ (sticky,      │ └──────────────────────────────────────────┘ │
│  current      │                                              │
│  section      │ 1. Who we are                       #        │
│  highlighted) │ Body text, max 68ch …                        │
│               │                                              │
│               │ 2. What we collect                  #        │
│               │ ┌──────────┬─────────┬─────────┬──────────┐  │
│               │ │ Source   │ Data    │ Purpose │ Kept for │  │
│               │ └──────────┴─────────┴─────────┴──────────┘  │
│               │ …                                            │
├───────────────┴──────────────────────────────────────────────┤
│ Contact card: Privacy team / Grievance Officer, address,     │
│ email · [Make a privacy request]                             │
│ Previous versions: v1.0 [date] (link) · Print / Save as PDF  │
└──────────────────────────────────────────────────────────────┘
```

**Behaviour and details**

- **Header:** breadcrumb, H1, and a meta line with effective date, last
  updated date and version. Dates use `<time>`.
- **At a glance box:** four to six plain-language bullets in a tinted panel.
  It summarises; the numbered sections remain the binding text, and the box
  says so in one line.
- **On this page:** sticky in a left column from 64rem up, highlighting the
  current section as you scroll. Below 64rem it becomes a collapsible "On this
  page" list under the header.
- **Numbered sections:** H2 per section with a hover "#" link to copy the
  anchor. Deep links such as `/legal/privacy#your-rights` are stable, because
  forms and emails point at them.
- **Tables:** for data categories, purposes, legal bases and retention. They
  scroll sideways inside their own box on mobile, never the page.
- **Regional sections:** "If you are in India", "If you are in the US",
  "If you are in the EU or UK" as clearly labelled sections or accordions, so
  each reader finds their rights fast.
- **Contact card:** the privacy contact, the India Grievance Officer (name,
  email, address), and a button to the request form.
- **Change log:** the last few versions with dates and a one-line summary of
  what changed.
- **Print:** a print stylesheet hides nav, footer and the sticky list, and
  prints URLs after links. "Print / Save as PDF" uses the browser's own
  dialog, so there is no PDF file to keep in sync.
- **Reading comfort:** text column capped at 68ch, body at the main text size,
  generous line height, no motion.

### 7.3 Cookie consent (only if non-essential cookies are added)

Not needed at launch. If analytics or marketing tags are introduced:

- **Banner:** bottom of the screen, non-blocking, three equal-weight buttons:
  "Accept all", "Reject all", "Choose". Reject must be as easy as accept.
- **Preference centre:** a dialog with categories (Strictly necessary, always
  on; Analytics; Marketing), each with a plain description and a switch.
- **Defaults:** nothing optional loads before a choice. Honour the Global
  Privacy Control signal as a "Reject" for sale/sharing and targeted ads.
- **Re-opening:** a "Cookie settings" link in the footer and on the Cookie
  Notice.
- **Record keeping:** store the choice and its date; ask again after
  `[12]` months or when categories change.
- Prefer a privacy-friendly analytics tool that needs no cookies; then no
  banner is needed at all.

### 7.4 Privacy request form (`/legal/privacy-requests`)

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| Request type | Select | Access a copy · Correct · Delete · Opt out of marketing · Opt out of sale/sharing/targeted ads · Appeal a previous decision · Other |
| Full name | Text | Required |
| Email | Email | Required; used to verify the request |
| Your relationship to ManyaIT | Select | Website visitor · Client contact · Newsletter subscriber · Applicant / Talent Network · Other |
| Where you live | Select | India · United States (state) · EU/UK · Other |
| Details | Textarea | Optional |
| Authorised agent | Checkbox + fields | For requests made on someone's behalf |

Below the form: how identity is verified, when we acknowledge the request
(within `[72 hours]`), the response time (for example 45 days under Texas
law, one month under GDPR, and the India timeline once the DPDP Rules apply),
and how to appeal a decision. The confirmation message gives a reference
number.

### 7.5 Job Offer Fraud Notice (`/legal/job-offer-fraud`)

Structure:

1. **We never ask for money.** ManyaIT never charges a fee at any stage and
   never asks for payment, deposits or bank details before an offer.
2. **How we contact people.** Only from `@[domain]` addresses and the careers
   page; never from free email accounts or messaging-app-only accounts.
3. **How to check an offer.** Every genuine opening is on `/careers`; contact
   `[careers email]` to verify.
4. **How to report it.** Email `[careers email]` with the message; for India,
   the national cybercrime portal (cybercrime.gov.in) and helpline 1930; for
   the US, the FTC (reportfraud.ftc.gov).
5. **What ManyaIT will do.** Investigate and, where possible, act against the
   misuse of its name.

A highlighted callout at the top repeats point 1. The `/careers` page links
here from its existing one-line warning.

### 7.6 Accessibility Statement (`/legal/accessibility`)

1. Our commitment, with the target named: **WCAG 2.2 Level AA**.
2. What we have done: semantic structure, keyboard access to menus and
   dialogs, visible focus, colour contrast checked against the palette,
   reduced-motion support, content that shows without JavaScript.
3. Known limitations, honestly listed (for example the illustrative reel and
   any third-party embeds), with dates for fixes where planned.
4. How we test: automated checks plus keyboard and screen-reader passes, and
   the date of the last review.
5. Feedback: an email address and a promise to reply within `[5]` business
   days.

### 7.7 Notice lines on forms

Short, placed directly under the submit button, linking to the full notice:

- **Contact form:** "We use your details to reply to your message. See our
  [Privacy Notice](/legal/privacy)." Add a separate, unticked checkbox,
  "Also send me the ManyaIT Brief", so marketing consent is never bundled
  with the request.
- **Newsletter:** "Monthly, and you can unsubscribe at any time. See how we
  handle your email in our [Privacy Notice](/legal/privacy#marketing)."
  Use double opt-in (a confirmation email) so consent is provable.
- **Talent Network (topic "Careers"):** "We'll keep your details for
  `[12]` months to match you with roles. See our
  [Applicant Privacy Notice](/legal/applicant-privacy)."
- **Privacy request form:** "We use these details only to verify and answer
  your request."

No pre-ticked boxes. For India-facing consent under the DPDP Act, consent
must be a clear affirmative action; a separate unticked checkbox is the
safest pattern where consent (not another basis) is relied on.

---

## 8. Content outlines

Section headings and what each must cover. Counsel writes the final text.

### 8.1 Privacy Notice

1. **Who we are.** ManyaIT Inc. `[state of incorporation]`, 8668 John Hickman
   Pkwy #903, Frisco, Texas 75034, and `[ManyaIT India entity name]`,
   Madhapur, Hyderabad 500 081. Which entity controls which data.
2. **Scope.** This website, business contacts, newsletter subscribers. Points
   applicants to the Applicant Privacy Notice. States that data ManyaIT
   handles on clients' behalf is governed by client contracts, not this
   notice.
3. **What we collect and why.** A table: source → data → purpose → legal
   basis (GDPR) → retention. Covers the contact form, newsletter, hosting
   logs, and email correspondence.
4. **Who we share it with.** Hosting (Cloudflare), email delivery, CRM, and
   professional advisers, each described by function. Never sold.
5. **International transfers.** US ↔ India transfers and the safeguards used
   (SCCs for EU/UK data).
6. **How long we keep it.** Retention per category, from the table.
7. **How we protect it.** A short, true summary. No unconfirmed
   certifications.
8. **Your rights.** Regional sections for India (DPDP: access, correction,
   erasure, grievance, nomination, complaint to the Data Protection Board),
   the US (Texas TDPSA rights and appeal; California if it applies), and the
   EU/UK (GDPR rights). Each region ends with where to complain: the Data
   Protection Board of India, the Texas Attorney General, or the EU/UK
   supervisory authority.
9. **How to use your rights.** The request form, email, response times,
   verification, appeal.
10. **Marketing emails** (`#marketing`). Consent, frequency, unsubscribe.
11. **Cookies.** One paragraph and a link to the Cookie Notice.
12. **Children.** The site is not directed at children.
13. **Changes.** How updates are announced; the change log.
14. **Contact and Grievance Officer.** Name, email and address, as the SPDI
    Rules require.

### 8.2 Terms of Use

1. Acceptance of these terms.
2. Who we are (the same entities as above).
3. Using the site: lawful use, no scraping, no interference, no attempts to
   gain access.
4. Intellectual property: site content, the ManyaIT name and logo; a limited
   licence to view and share links.
5. No offer and no professional advice: site content describes capabilities
   and is not an offer of services or employment. Sample roles on `/careers`
   are illustrative.
6. Third-party links and content (including any third-party images).
7. Disclaimers: the site is provided "as is".
8. Limitation of liability.
9. Indemnity.
10. Governing law and venue: `[Texas law and Texas courts]`, or counsel's
    choice.
11. Changes to the terms.
12. Contact.

### 8.3 Cookie Notice

1. What cookies and similar technologies are.
2. What this site uses today: no optional cookies, no analytics, no
   advertising tags; hosting may set strictly necessary security cookies
   (`[confirm any Cloudflare cookies]`).
3. Third-party content: none after the photos are self-hosted.
4. If this changes: the categories that would apply and the consent
   process from section 7.3.
5. How to control cookies in the browser; Global Privacy Control.
6. Changes and contact.

When optional cookies exist, add a table: name, provider, purpose, category,
duration.

### 8.4 Accessibility Statement

As in section 7.6.

### 8.5 Applicant Privacy Notice

1. Scope: Talent Network sign-ups, applications, interviews.
2. What we collect: contact details, CV contents, work history, skills,
   interview notes, and what the person chooses to share. No sensitive data
   requested.
3. Why: to consider people for current and future roles and to stay in touch
   about them.
4. Legal basis and consent (India: consent through the form; EU/UK:
   legitimate interests or consent).
5. Who sees it: the ManyaIT team in Dallas and Hyderabad, and the `[applicant
   tracking system]`.
6. How long: `[12]` months in the Talent Network unless renewed; successful
   applicants' data moves to employment records.
7. Rights and how to use them; the request form.
8. Equal opportunity statement covering both US protected characteristics
   and caste.
9. Link to the Job Offer Fraud Notice.

### 8.6 Job Offer Fraud Notice

As in section 7.5.

### 8.7 Privacy request page

As in section 7.4, with a short intro and the response times.

---

## 9. Copy rules on legal pages

The site's copy rules ban certain words, and several of them appear in
standard legal drafting. On legal pages, use these swaps unless counsel needs
the exact statutory term:

| Avoid | Use instead |
| --- | --- |
| vendors, contractors | service providers |
| subcontractors (of data) | sub-processors |
| consultants (as advisers) | professional advisers |
| recruitment, recruiting, hiring | careers, applications, employment |
| candidates | applicants |
| engagement | project, relationship, contract |
| agency | (avoid; name the role instead) |
| resources | (avoid; name the thing: information, tools, teams) |

Statutory terms such as "sale", "share", "controller", "processor", "data
fiduciary" and "data principal" stay as the law defines them.

Style:

- Plain English, short sentences, "we" and "you".
- Each section starts with what the reader most needs.
- Define a term once, at first use.
- Placeholders stay in `[brackets]` through `tbc()` until counsel signs off,
  so they show with the dotted "confirm before launch" marker.
- Never claim a certification, figure or partner that is not confirmed.

---

## 10. Implementation plan (for later)

Not built yet. When approved:

1. **Content.** One Markdown file per policy in an Astro content collection,
   `site/src/content/legal/`, with front matter: `title`, `summary`,
   `effective`, `updated`, `version`, `order`, `changes` (list).
2. **Components** (Lumos naming, in `src/components/content/`):
   - `LegalHub`: the hub grid and contact strip.
   - `LegalDocument`: header, At a glance box, body, contact card, change log.
   - `LegalToc`: the sticky / collapsible "On this page" list.
   - `PrivacyRequestForm`: the request form on the Lumos `Form` component.
   - `CookieConsent`: only if section 7.3 is ever needed.
3. **Routes:** `src/pages/legal/index.astro` and
   `src/pages/legal/[slug].astro`; redirects in `astro.config.mjs`.
4. **Footer:** replace the four `#` links with the routes in section 6.2.
5. **Forms:** add the notice lines in section 7.7.
6. **Photos:** self-host the Unsplash images.
7. **Checks before release:**
   - `npm run check`; a link check over every `/legal` anchor; an
     accessibility pass (keyboard, screen reader, axe); print preview.
   - The banned-word scan from the README, with the statutory exceptions
     above.
   - No template tokens or placeholders left: search for `[`, `{{` and
     `[#`.
   - Every page shows an effective date and version, and is linked from the
     hub and the footer.
   - The same facts everywhere: what the Privacy Notice, Cookie Notice and
     Terms say about sharing, cookies and contacts must match each other
     and the live site. Load the site in a fresh browser and confirm no
     cookie or third-party request appears that the notices don't mention.

Rough effort: 2–3 days to build the templates and pages once final text is
supplied.

---

## 11. Keeping it current

| Owner | Responsibility |
| --- | --- |
| Counsel (US and India) | Approves wording; reviews yearly and when laws change |
| Marketing | Keeps the data inventory (section 3) true when tools change |
| Engineering | Updates pages, dates and the change log; runs the release checks |

Review the pack:

- every year, and
- whenever a tool that touches personal data is added (analytics, CRM, email
  platform, applicant tracking, chat), a form changes, or ManyaIT starts
  serving a new region.

Each change updates `updated`, bumps `version` and adds a change-log line.

---

## 12. Open questions for ManyaIT

1. Legal entity names: the US company (state of incorporation) and the
   Indian company (registered name, CIN, registered address).
2. Which entity operates the website and owns the domain.
3. Privacy contact email and the Grievance Officer's name for India.
4. Governing law and venue for the Terms of Use.
5. Does ManyaIT market to, or work with, people in the EU or UK?
6. Revenue band, to check the Texas small-business exemption and California
   thresholds.
7. Which tools will receive form data: inbox, CRM, email platform, applicant
   tracking system.
8. Any plan to add analytics, advertising pixels or chat.
9. Retention periods for contacts, subscribers and Talent Network profiles.
10. Certifications actually held (ISO 27001, SOC 2), if any.
11. Whether the India CSR threshold is met.
12. Official domains and email addresses for the fraud notice.

---

## Appendix A. Research detail

Condensed from the two research passes (October 2026, US connection).

**Accion Labs**
- Footer: Privacy Notice (`/privacy-notice`), Cookie Policy (`/cookie-policy`), Terms & Conditions (`/terms-and-conditions`), Sitemap and the Graminno CSR initiative.
- Banner: HubSpot, with Accept / Decline / Cookies settings. A ZoomInfo cookie is set before consent.
- Privacy notice: last updated 26 June 2026, about 2,000 words. Section titles are bold text, not headings. Names GDPR only; transfers use SCCs; requests go to a DPO mailbox.
- Terms: effective September 2025. Include SMS/TCPA rules and Delaware law with arbitration. No IP section.
- Cookie policy: undated generic template, with links that still point to a subsidiary's domain.
- Careers: a fraud alert ("does not charge candidates any money").
- Supplier code of conduct with a whistleblower mailbox, found only in the sitemap.
- No accessibility statement.

**Techwave**
- Footer: Privacy Policy (`/privacy-policy/`), Cookie Policy, Quality, Careers. No Terms (404).
- Banner: CookieYes, disabled by a page-view plan limit, while analytics and ad-tech cookies fire on load.
- Privacy notice: last updated June 2026, about 2,500 words in 16 sections with an "In Short" summary.
  - Rights set out by region: EEA/UK, India DPDP (no Grievance Officer named), and the US (CCPA/CPRA plus 19 states including Texas).
  - Specific retention periods; SCCs for transfers.
- Fraud page `/recruitment-fraud-disclaimer/` is not linked from anywhere.
- `/quality/` lists ISO and SOC 2 certifications with policy PDFs.

**ANSR**
- Footer: Privacy Policy (`/privacy-policy/`), Whistleblower Policy (`/speakup/`). No Terms or Cookie Policy.
- Banner: CookieYes, with Customize / Reject All / Accept All at equal weight.
- Privacy policy: undated, about 6,000 words, covering ansr.com and talent500.co.
  - Explains controller and processor roles and names its tools.
  - Uses DPDP terms without naming the Act; requests go to a DPO mailbox.
  - References Terms of Use that don't exist.
- SpeakUp: a versioned whistleblower policy (2020, 2024) with an anonymous form.

**Xoriant**
- Footer: Terms of Use (`/terms-use`), Cookie Policy, Privacy Policy, Sitemap, Ethics (`/whistleblower-policy`), Brand Policy.
- Banner: OneTrust. The US first screen has no Reject.
- Privacy policy: from 2018. Cites the repealed Directive 95/46/EC; requests go through a OneTrust web form.
- Terms: undated, with no governing law.
- Careers site: a fraud advisory and a separate Candidate Privacy Notice.
  - The notice has a legal-basis table (DPDPA, GDPR, CCPA/CPRA) and 36-month retention.
  - Template placeholders are left in it.

**Persistent**
- Footer: Privacy Notice (`/privacy-notice/`), Cookie Policy, Terms of Use, Sitemap.
- Banner: OneTrust on an opt-out model. No Reject; trackers fire before any click.
- Privacy notice: updated July 2026, numbered sections, DPDP-style rights. A named privacy officer and a 72-hour acknowledgment.
- Cookie policy: a full cookie table dated November 2025.
- Contact form: a request checkbox plus a separate, unticked marketing opt-in.
- Other pages:
  - recruitment fraud awareness page
  - privacy-programme page
  - certifications page
  - ethics hub: code of conduct, whistleblower policy, anti-bribery, anti-trafficking

**Happiest Minds**
- Footer: Terms and Conditions, Privacy Policy only.
- Banner: CookieYes, with "Accept All" and settings. No Reject; "continuing means you agree".
- Privacy policy: undated, with question-style headings and the cookie tables embedded. Rights cover access and correction only.
- Terms: undated, Karnataka law, with a one-sided forum clause.
- Careers: a fraud alert with an EEO statement covering caste and veteran status.
- Policy PDFs sit under Investors.

**Tredence**
- Footer: Terms of Use, Privacy Policy (`/privacy-policy`), Cookies Policy, Third Party Security & Privacy Policy.
- Banner: Cookiebot with categories pre-ticked and no Deny. Unfilled template tokens are in the dialog.
- Privacy policy: effective April 2026.
  - Excludes client data processed on clients' behalf.
  - "Does not sell" data; SCCs plus transfer impact assessments.
  - A named contact; complaint routes for India, the EU/UK and US Attorneys General.
- Terms: undated, no governing law. An accessibility statement ("partially conformant with WCAG 2.2 AA", dated August 2025) is appended inside.
- A public supplier security and privacy policy: sub-processor notice, audits, and breach notice within 24 hours.

**InfoVision**
- Footer: Privacy Policy, Sitemap only. No Terms or cookie notice.
- Banner: a WordPress plugin. "If you continue… we assume consent"; trackers fire before any choice.
- Privacy statement: last revised October 2020, no laws named, rights in one line.
- `/disclaimer/` is actually a recruitment fraud notice, linked from the Careers page.
