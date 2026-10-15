/**
 * Fixed content the website's design is built around. These documents are
 * created once by the seed script with these ids, and editors can change
 * them but not add or delete them. Adding one is a developer task, because
 * the homepage grid, icons, menus and contact-form options depend on them.
 */
export const CAPABILITY_IDS = [
  "cap-data",
  "cap-sap",
  "cap-ai",
  "cap-flow",
  "cap-code",
] as const;

export const INDUSTRY_IDS = [
  "industry-banking",
  "industry-telecom",
  "industry-healthcare",
  "industry-energy",
  "industry-retail",
] as const;

export const LOCATION_IDS = ["dallas", "hyderabad"] as const;

/** Page settings for the routes whose layout lives in code. */
export const PAGE_SETTINGS = [
  { id: "page-about", title: "About" },
  { id: "page-careers", title: "Careers" },
  { id: "page-locations", title: "Locations" },
  { id: "page-contact", title: "Contact" },
  { id: "page-capabilities", title: "Capabilities (overview)" },
  { id: "page-industries", title: "Industries (overview)" },
  { id: "page-insights", title: "Insights (overview)" },
  { id: "page-case-studies", title: "Case studies (overview)" },
] as const;

/** One document each, opened directly from the menu. */
export const SINGLETON_TYPES = ["siteSettings", "homePage"] as const;

/** Types editors can edit but never create or delete. */
export const FIXED_TYPES = [
  ...SINGLETON_TYPES,
  "pageSettings",
  "capability",
  "industry",
  "location",
] as const;

/** Contact-form topics an article's call to action can preselect. */
export const CONTACT_TOPICS = [
  { title: "Trusted Data", value: "cap-data" },
  { title: "Modern Core", value: "cap-sap" },
  { title: "Applied Intelligence", value: "cap-ai" },
  { title: "Autonomous Operations", value: "cap-flow" },
  { title: "Scalable Products", value: "cap-code" },
  { title: "A full capability center", value: "capability-center" },
  { title: "Careers", value: "careers" },
];

/** ManyaIT's own project, where the live content lives. */
export const MANYAIT_PROJECT_ID = "n3hghywr";

/**
 * The Sanity project and dataset. The project id isn't secret: it appears
 * in every request the Studio makes. Set SANITY_STUDIO_PROJECT_ID or
 * SANITY_STUDIO_DATASET to point the Studio somewhere else, e.g. a test
 * dataset. `npm run seed` and `npm run deploy` refuse any project but
 * ManyaIT's (scripts/preflight.ts).
 */
export const PROJECT_ID =
  process.env.SANITY_STUDIO_PROJECT_ID || MANYAIT_PROJECT_ID;
export const DATASET = process.env.SANITY_STUDIO_DATASET || "production";

export const API_VERSION = "2026-10-01";
