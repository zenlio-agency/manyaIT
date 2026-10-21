import { placeholders } from "./placeholders";

export const site = {
  name: "Siri Data Analytics",
  tagline: "Data. Clarity. Decisions.",
  url: "https://siridataanalytics.com",
  phone: {
    display: "+1 (832) 334-1019",
    href: "tel:+18323341019",
  },
  email: {
    display: "info@siridataanalytics.com",
    href: "mailto:info@siridataanalytics.com",
  },
  address: {
    locality: "Frisco",
    region: "TX",
    regionName: "Texas",
    street: "8668 John Hickman Pkwy #903",
    postalCode: "75034",
    country: "US",
  },
  linkedinUrl: placeholders.linkedinUrl,
  legalEntity: placeholders.legalEntity,
  copyrightYear: 2026,
  network: {
    name: "ManyaIT",
    href: "https://www.manyait.com/",
  },
} as const;

/** Primary calls to action, used by the nav, CTA bentos and page heroes. */
export const cta = {
  consult: { label: "Book a Data Consult", href: "/book-a-consult" },
  dataCheck: { label: "Take the Data Check", href: "/data-check" },
} as const;

export interface NavLink {
  label: string;
  href: string;
}

/** Top-level nav. Solutions and Industries open mega-menus. */
export const primaryNav = {
  solutions: { label: "Solutions", href: "/solutions" },
  industries: { label: "Industries", href: "/industries" },
  links: [
    { label: "Data Notes", href: "/data-notes" },
    { label: "Careers", href: "/careers" },
    { label: "About", href: "/about" },
  ] satisfies NavLink[],
};

export const companyLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Data Notes", href: "/data-notes" },
  { label: "Data Check", href: "/data-check" },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
  { label: "Accessibility", href: "/accessibility" },
];
