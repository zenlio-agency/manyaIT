import { seo } from "./objects/seo";
import { stat } from "./objects/stat";
import { imageWithAlt } from "./objects/imageWithAlt";
import { articleBody, callout, table, textBlock } from "./objects/richText";
import {
  chipGroup,
  faqItem,
  featureItem,
  linkItem,
  pageHero,
  problemRow,
  sectionIntro,
} from "./objects/sections";
import { capability } from "./documents/capability";
import { industry } from "./documents/industry";
import { location } from "./documents/location";
import { insight, insightCategory } from "./documents/insight";
import { opportunity } from "./documents/opportunity";
import { caseStudy } from "./documents/caseStudy";
import { clientLogo, ecosystemCompany } from "./documents/proof";
import { siteSettings } from "./singletons/siteSettings";
import { homePage } from "./singletons/homePage";
import { pageSettings } from "./singletons/pageSettings";

export const schemaTypes = [
  // Shared objects
  seo,
  stat,
  imageWithAlt,
  textBlock,
  articleBody,
  table,
  callout,
  sectionIntro,
  linkItem,
  pageHero,
  faqItem,
  problemRow,
  featureItem,
  chipGroup,
  // Documents
  siteSettings,
  homePage,
  pageSettings,
  capability,
  industry,
  location,
  insight,
  insightCategory,
  opportunity,
  caseStudy,
  clientLogo,
  ecosystemCompany,
];
