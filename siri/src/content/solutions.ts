/**
 * The six solutions, in data-value-chain order. Page-level content (hero,
 * before/after, deliverables, stack, FAQ) is added in phase 3.
 */

export type SolutionSlug =
  | "unified-data-foundations"
  | "sap-insight-engine"
  | "decision-intelligence"
  | "predictive-generative-ai"
  | "digital-experiences"
  | "talent-on-demand";

export interface SolutionSummary {
  slug: SolutionSlug;
  name: string;
  /** Value-chain stage, shown as the eyebrow. */
  stage: string;
  /** Outcome phrase in the Solutions mega-menu. */
  outcome: string;
  /** One-line description (home bento and mega-menu). */
  line: string;
  /** Outcome metrics; the first one is the mega-menu KPI tile. */
  metrics: [string, string, string];
}

export const solutions: SolutionSummary[] = [
  {
    slug: "unified-data-foundations",
    name: "Unified Data Foundations",
    stage: "Ingest · Store",
    outcome: "Unify my data",
    line: "Governed cloud warehouses and lakehouses on Snowflake, Azure and AWS — tested, monitored and ready for BI and AI.",
    metrics: [
      "Data sources unified",
      "Report refresh time",
      "Platform cost per query",
    ],
  },
  {
    slug: "sap-insight-engine",
    name: "SAP Insight Engine",
    stage: "Model",
    outcome: "Unlock my SAP data",
    line: "S/4HANA and BW/4HANA analytics without compromising a clean core.",
    metrics: [
      "Month-end close time",
      "Manual SAP extracts eliminated",
      "Real-time reports live",
    ],
  },
  {
    slug: "decision-intelligence",
    name: "Decision Intelligence",
    stage: "Visualize",
    outcome: "See my KPIs clearly",
    line: "One semantic KPI layer, served as dashboards, alerts and embedded reports.",
    metrics: [
      "Dashboard adoption",
      "Time to answer a business question",
      "Spreadsheets retired",
    ],
  },
  {
    slug: "predictive-generative-ai",
    name: "Predictive & Generative AI",
    stage: "Predict",
    outcome: "Predict what's next",
    line: "Forecasting, anomaly detection and RAG assistants, monitored in production.",
    metrics: [
      "Forecast accuracy",
      "Anomaly catch rate",
      "Analyst hours saved per week",
    ],
  },
  {
    slug: "digital-experiences",
    name: "Digital Experiences",
    stage: "Activate",
    outcome: "Build an app",
    line: "Web and mobile apps with analytics and AI designed in from day one.",
    metrics: ["Release frequency", "App adoption", "Legacy systems retired"],
  },
  {
    slug: "talent-on-demand",
    name: "Talent on Demand",
    stage: "Every stage",
    outcome: "Add specialists",
    line: "Pre-vetted SAP, data, cloud and engineering specialists — staff augmentation, dedicated pods or managed services.",
    metrics: [
      "Time to first shortlist",
      "Interview-to-hire ratio",
      "Placement retention",
    ],
  },
];

export const solutionHref = (slug: SolutionSlug) => `/solutions/${slug}`;
