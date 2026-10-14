/** Page metadata for `BaseHead` and layouts. */
export interface SeoProps {
  /** Page title. The site name is appended unless the title already has it. */
  title?: string;
  /** Page and social description. Defaults to the one in Sanity's Site
      settings. */
  description?: string;
  /** Social image. Defaults to the one in Sanity's Site settings, then
      `/og-image.jpg`. */
  image?: string;
  /** Describes the social image. Defaults to the page title. */
  imageAlt?: string;
  /** Open Graph type. */
  type?: "website" | "article";
  /** Override `NOINDEX_ROUTES` for this page's robots tag. */
  noindex?: boolean;
}
