/**
 * The four industries. Page-level content (hero, KPIs, dashboard callouts,
 * use cases, data sources) is added in phase 4.
 */

export type IndustrySlug =
  | "banking-finance"
  | "insurance"
  | "energy-utilities"
  | "retail-ecommerce";

export interface IndustrySummary {
  slug: IndustrySlug;
  name: string;
  /** Caption for the industry card's photo placeholder. */
  photo: string;
  /** "KPIs we move" on the home page industry cards. */
  cardKpis: string[];
}

export const industries: IndustrySummary[] = [
  {
    slug: "banking-finance",
    name: "Banking & Finance",
    photo: "Risk team at work",
    cardKpis: ["Regulatory report cycle time", "Fraud detection rate"],
  },
  {
    slug: "insurance",
    name: "Insurance",
    photo: "Claims analysts",
    cardKpis: ["Claims cycle time", "Loss ratio", "Leakage"],
  },
  {
    slug: "energy-utilities",
    name: "Energy & Utilities",
    photo: "Field engineer at a substation",
    cardKpis: ["Asset uptime", "Load forecast accuracy"],
  },
  {
    slug: "retail-ecommerce",
    name: "Retail & E-commerce",
    photo: "Store manager with live inventory",
    cardKpis: ["Stock availability", "Promotion ROI"],
  },
];

export const industryHref = (slug: IndustrySlug) => `/industries/${slug}`;
