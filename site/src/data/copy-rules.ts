/**
 * The site's copy rules, checked against every built page by
 * `src/integrations/content-check.ts`. The Studio warns editors with the
 * same list in `studio/lib/validation.ts`: change the two together (the
 * build warns when they differ).
 */

export type CopyRule = { word: string; pattern: RegExp };

/** Words the copy never uses. */
export const BANNED_WORDS: CopyRule[] = [
  { word: "recruiting / recruitment", pattern: /recruit/i },
  { word: "staffing", pattern: /staffing/i },
  { word: "staff augmentation", pattern: /staff aug/i },
  { word: "hire / hired / hiring", pattern: /\bhir(e|ed|es|ing)\b/i },
  { word: "placement", pattern: /placement/i },
  { word: "headhunting", pattern: /headhunt/i },
  { word: "outsourcing", pattern: /outsourc/i },
  { word: "consulting / consultant", pattern: /consult/i },
  { word: "agency", pattern: /agenc(y|ies)/i },
  { word: "contractor", pattern: /contractor/i },
  { word: "engagement", pattern: /engagement/i },
  { word: "bench", pattern: /\bbench\b/i },
  { word: "resources", pattern: /\bresources?\b/i },
  { word: "manpower", pattern: /manpower/i },
  { word: "vendor", pattern: /vendor/i },
  { word: "GCC", pattern: /\bGCCs?\b/ },
  { word: "capability center", pattern: /capabilit(y|ies) cent(er|re)s?/i },
  {
    word: "build-operate-transfer",
    pattern: /build[-,\s]+operate[-,\s]+(and\s+)?transfer/i,
  },
  { word: "BOT", pattern: /\bBOT\b/ },
  { word: "headcount", pattern: /headcount/i },
  { word: "skills brief", pattern: /skills? brief/i },
];

/** The office cities appear only in the footer and the legal notices. */
export const FOOTER_ONLY_PLACES: CopyRule[] = [
  { word: "Dallas", pattern: /\bDallas\b/i },
  { word: "Texas", pattern: /\bTexas\b/i },
  { word: "Hyderabad", pattern: /\bHyderabad\b/i },
];

/**
 * Wording that breaks a rule on purpose. Each exception covers one phrase
 * on one page, so the same words anywhere else are still caught.
 */
export const COPY_EXCEPTIONS: {
  page: string;
  phrase: string;
  reason: string;
}[] = [
  ...[
    "establish and scale Global Capability Centers",
    "the platforms your Global Capability Center runs on",
    "a defined build-operate-transfer path to full ownership",
    "A full capability center",
    "build and scale capability centers",
  ].map((phrase) => ({
    page: "/",
    phrase,
    reason: "The homepage keeps its original wording at ManyaIT's request.",
  })),
];
