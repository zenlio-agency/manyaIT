/**
 * Photography for the sections whose words still live in code: free Unsplash
 * photos, standing in until ManyaIT's own photography is ready. They are
 * served from `public/images/` as WebP, so pages make no third-party
 * requests. To swap one, replace the file and keep its name, or add a new
 * file and change its path here.
 *
 * Photos for capabilities, industries, articles, page headers and the
 * homepage reel are edited in Sanity instead.
 */
const image = (name: string) => `/images/${name}.webp`;

/** The homepage careers card. */
export const CAREERS_PHOTO = image("careers-home");

/** One per careers-page point, in order. */
export const CAREERS_POINT_PHOTOS = [1, 2, 3, 4].map((n) =>
  image(`careers-point-${n}`),
);

/** The About page's story section. */
export const ABOUT_PHOTOS = {
  story: image("about-story"),
};

/** The careers page's "Life at ManyaIT" section. */
export const CAREERS_LIFE_PHOTO = image("careers-life");

/** The Locations page hero. */
export const LOCATIONS_PHOTO = image("locations-hero");
