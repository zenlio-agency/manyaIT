/** Site name. Appended to every page title and used as `og:site_name` and
    in the structured data, as the only name, so search engines show it. */
export const SITE_NAME = "ManyaIT";
/** Canonical origin. Resolves canonical URLs, social images, and the sitemap.
    Vercel serves the site on www and redirects the bare domain here. */
export const SITE_URL = "https://www.manyait.com";
/** BCP 47 locale tag used to format dates and numbers. */
export const SITE_LOCALE = "en-US";
/** Routes excluded from search and the sitemap. Surrounding slashes are ignored. */
export const NOINDEX_ROUTES: string[] = ["/404", "/careers/apply"];
