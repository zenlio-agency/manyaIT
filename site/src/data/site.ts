import capData from "@/assets/icons/cap-data.svg";
import capSap from "@/assets/icons/cap-sap.svg";
import capAi from "@/assets/icons/cap-ai.svg";
import capFlow from "@/assets/icons/cap-flow.svg";
import capCode from "@/assets/icons/cap-code.svg";

/*
 * What the design builds on, kept in code: the fixed sets and their order,
 * icons, menus, link paths and site-wide helpers. The words, photos, figures
 * and job openings are edited in Sanity and read through
 * `src/sanity/content.ts`.
 */

/**
 * The five capabilities, in the order used everywhere on the site, with the
 * icon the design gives each. Their words and photos are edited in Sanity.
 */
export const CAPABILITY_DESIGN = [
  { id: "cap-data", icon: capData },
  { id: "cap-sap", icon: capSap },
  { id: "cap-ai", icon: capAi },
  { id: "cap-flow", icon: capFlow },
  { id: "cap-code", icon: capCode },
] as const;

/** The industries, in the order used everywhere on the site. */
export const INDUSTRY_IDS = [
  "industry-banking",
  "industry-telecom",
  "industry-healthcare",
  "industry-energy",
  "industry-retail",
] as const;

/** The client-logo rows, in order, as the Studio names them. */
export const LOGO_ROWS = [
  { value: "banking", label: "Banking & Finance" },
  {
    value: "telecom-healthcare-energy",
    label: "Telecommunications, Healthcare and Energy",
  },
] as const;

/** Where the two site-wide buttons go. Their labels are edited in Sanity. */
export const CTA_HREFS = {
  primary: "/contact",
  secondary: "/careers",
} as const;

/** The social platforms the design has icons for. */
export const SOCIAL_LABELS = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  x: "X",
  facebook: "Facebook",
  youtube: "YouTube",
} as const;

export type SocialIcon = keyof typeof SOCIAL_LABELS;

/** Main navigation. Items with `menu` open a panel. */
export const NAV = [
  { label: "About", href: "/about" },
  { label: "Capabilities", href: "/capabilities", menu: "capabilities" },
  { label: "Industries", href: "/industries", menu: "industries" },
  { label: "Careers", href: "/careers" },
  { label: "Insights", href: "/insights" },
] as const;

/**
 * The delivery lifecycle, from discovery to running and improving the
 * platform. Shown on the About, Capabilities and capability pages.
 */
export const TEAM_STEPS = [
  {
    title: "Discover & define",
    text: "We align on business outcomes, baseline your systems, data and architecture, and shape a prioritized roadmap with measurable success criteria.",
    note: "Roadmap and success metrics",
  },
  {
    title: "Architect & mobilize",
    text: "We define the target architecture, delivery plan and quality gates, and mobilize a cross-functional team that knows your domain and owns the outcome.",
    note: "Architecture before acceleration",
  },
  {
    title: "Engineer & deliver",
    text: "Agile, DevSecOps-driven delivery inside your environments and controls, with CI/CD, automated testing and transparent progress against agreed outcomes.",
    note: "Value from the first sprint",
  },
  {
    title: "Operate & evolve",
    text: "We run, observe and optimize what we build under agreed service levels, extend the roadmap as value is proven, and transfer operations and knowledge to your teams whenever you choose.",
    note: "Built to last, yours to keep",
  },
];

/** Page path for a capability or an industry. */
export const capabilityHref = (cap: { slug: string }) =>
  `/capabilities/${cap.slug}`;
export const industryHref = (industry: { slug: string }) =>
  `/industries/${industry.slug}`;

/**
 * HighLevel's External Tracking script, which sends each contact-form
 * submission to HighLevel as a contact. The contact form loads it only once
 * someone starts filling the form in. The tracking id is public, as in the
 * script tag HighLevel provides; it isn't a secret.
 */
export const CONTACT_TRACKER = {
  src: "https://link.yourmarketingai.com/js/external-tracking.js",
  trackingId: "tk_78496c73a31147ccb529989b741fa4a3",
} as const;

/** Wraps `[placeholder]` runs in a marked span so they read as unconfirmed. */
export const tbc = (text: string) =>
  text.replace(
    /\[([^\]]+)\]/g,
    '<span class="tbc" title="Placeholder: confirm before launch">[$1]</span>',
  );
