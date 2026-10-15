/*
 * The job openings themselves are edited in Sanity (Careers in the Studio)
 * and read through `src/sanity/content.ts`. A role's address in links is
 * its slug, as in `/careers/apply?role=…`.
 */

/**
 * The form's choice for people who want to be considered for future roles
 * ("Register your interest" on the site; the Talent Network in the
 * Applicant Privacy Notice). The slug stays `talent-network` in links.
 */
export const TALENT_NETWORK = {
  slug: "talent-network",
  title: "Register your interest",
  text: "No specific role yet. We'll keep your profile and our people team will reach out when a relevant role opens.",
} as const;

export const APPLY_PATH = "/careers/apply";

/** The application form, with the role chosen. */
export const applyHref = (slug: string) => `${APPLY_PATH}?role=${slug}`;

/** How joining works, on /careers and beside the application form. */
export const JOIN_STEPS: { title: string; text: string }[] = [
  {
    title: "Discover",
    text: "Explore openings across data, enterprise platforms, AI and digital engineering, or register your interest.",
  },
  {
    title: "Connect",
    text: "An open conversation with our people team about your experience and ambitions.",
  },
  {
    title: "Collaborate",
    text: "A practical session with the team you would join, centered on real business challenges.",
  },
  {
    title: "Contribute",
    text: "Receive your offer, meet your team and start on work that matters, with support from day one.",
  },
];
