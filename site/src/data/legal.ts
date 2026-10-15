/**
 * Facts shared by every legal page, kept in one place so the notices never
 * disagree. The Markdown in `src/content/legal/` uses them as `{{key}}`
 * tokens (see `LEGAL_TOKENS`). They stay in code, under counsel's control,
 * rather than in Sanity; every build warns if an office address in Sanity
 * stops matching the one here (`src/integrations/content-check.ts`).
 */
export const LEGAL = {
  usEntity: "ManyaIT Inc.",
  usAddress: "8668 John Hickman Pkwy #903\nFrisco, Texas 75034",
  indiaEntity: "ManyaIT Solutions Pvt Ltd",
  indiaAddress:
    "Bizness Square, Whitefields\nHITECH City, Hyderabad\nTelangana 500081",
  privacyEmail: "info@manyait.com",
  legalEmail: "info@manyait.com",
  careersEmail: "hr@manyait.com",
  accessibilityEmail: "info@manyait.com",
  /** How soon a privacy request is acknowledged. */
  acknowledge: "72 hours",
  /** How long a Talent Network profile is kept without renewal. */
  talentRetention: "12 months",
  /** How soon accessibility feedback gets a reply. */
  accessibilityReply: "5 business days",
} as const;

/** Each office's legal entity, by its id in Sanity. */
export const ENTITY_BY_LOCATION: Record<string, string> = {
  dallas: LEGAL.usEntity,
  hyderabad: LEGAL.indiaEntity,
};

/** The legal pages, in footer order. The hub lists the documents itself. */
export const LEGAL_LINKS = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Accessibility", href: "/legal/accessibility" },
  { label: "Privacy Requests", href: "/legal/privacy-requests" },
  { label: "Legal", href: "/legal" },
] as const;

export const PRIVACY_REQUESTS_HREF = "/legal/privacy-requests";

/** A mail link that keeps any placeholder brackets out of the address. */
export const mailLink = (address: string) =>
  `<a href="mailto:${address.replace(/[[\]]/g, "")}">${address}</a>`;

const oneLine = (address: string) => address.replace(/\n/g, ", ");

/** Values for the `{{key}}` tokens in the legal Markdown. May be HTML. */
export const LEGAL_TOKENS: Record<string, string> = {
  usEntity: LEGAL.usEntity,
  usAddress: oneLine(LEGAL.usAddress),
  indiaEntity: LEGAL.indiaEntity,
  indiaAddress: oneLine(LEGAL.indiaAddress),
  privacyEmail: mailLink(LEGAL.privacyEmail),
  legalEmail: mailLink(LEGAL.legalEmail),
  careersEmail: mailLink(LEGAL.careersEmail),
  accessibilityEmail: mailLink(LEGAL.accessibilityEmail),
  acknowledge: LEGAL.acknowledge,
  talentRetention: LEGAL.talentRetention,
  accessibilityReply: LEGAL.accessibilityReply,
  requestForm: `<a href="${PRIVACY_REQUESTS_HREF}">privacy request form</a>`,
};
