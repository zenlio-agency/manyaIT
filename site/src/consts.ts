/** Site name. Appended to every page title and used as `og:site_name`. */
export const SITE_NAME = "ManyaIT";
/** Other names people search for the company by, for search engines'
    site name. Listed as `alternateName` in the structured data. */
export const SITE_ALTERNATE_NAMES = ["Manya IT", "ManyaIT Inc."];
/** Canonical origin. Resolves canonical URLs, social images, and the sitemap.
    Vercel serves the site on www and redirects the bare domain here. */
export const SITE_URL = "https://www.manyait.com";
/** BCP 47 locale tag used to format dates and numbers. */
export const SITE_LOCALE = "en-US";
/** Routes excluded from search and the sitemap. Surrounding slashes are ignored. */
export const NOINDEX_ROUTES: string[] = ["/404", "/careers/apply"];
