import { defineQuery } from "groq";

/*
 * Every query the site runs against Sanity. `npm run typegen` in studio/
 * reads this file and writes the result types to `types.ts`.
 *
 * References come back as document ids; pages look the documents up in
 * their own collections, so a reference to something unpublished simply
 * finds nothing.
 */

/** An image with its file's address and size, for `src/sanity/image.ts`. */
const IMAGE = /* groq */ `{
  ...,
  "asset": asset->{
    _id,
    url,
    extension,
    "width": metadata.dimensions.width,
    "height": metadata.dimensions.height
  }
}`;

const SEO = /* groq */ `"seo": seo{ ..., "image": image${IMAGE} }`;

/** Rich text with its images resolved. */
const BODY = /* groq */ `{ ..., _type == "imageWithAlt" => ${IMAGE} }`;

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"]{
    ...,
    "favicon": favicon${IMAGE},
    "appleTouchIcon": appleTouchIcon${IMAGE},
    ${SEO}
  }
`);

export const homePageQuery = defineQuery(`
  *[_type == "homePage" && _id == "homePage"]{
    ...,
    reel[]{ ..., "image": image${IMAGE} },
    "featuredInsight": featuredInsight._ref,
    ${SEO}
  }
`);

export const pageSettingsQuery = defineQuery(`
  *[_type == "pageSettings"]{
    ...,
    hero{ ..., "photo": photo${IMAGE} },
    ${SEO}
  }
`);

export const capabilitiesQuery = defineQuery(`
  *[_type == "capability"]{
    ...,
    "slug": slug.current,
    "photo": photo${IMAGE},
    industryNotes[]{ ..., "industry": industry._ref },
    ${SEO}
  }
`);

export const industriesQuery = defineQuery(`
  *[_type == "industry"]{
    ...,
    "slug": slug.current,
    "photo": photo${IMAGE},
    capabilityNotes[]{ ..., "capability": capability._ref },
    ${SEO}
  }
`);

export const locationsQuery = defineQuery(`
  *[_type == "location"] | order(order asc)
`);

export const articlesQuery = defineQuery(`
  *[_type == "insight" && defined(slug.current)] | order(order asc){
    ...,
    "slug": slug.current,
    "category": category->{ title, "slug": slug.current },
    "photo": photo${IMAGE},
    body[]${BODY},
    "capabilities": capabilities[]._ref,
    "industries": industries[]._ref,
    ${SEO}
  }
`);

export const articleCategoriesQuery = defineQuery(`
  *[_type == "insightCategory"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    order
  }
`);

/** Closed roles too: their pages stay up, marked closed and noindexed. */
export const opportunitiesQuery = defineQuery(`
  *[_type == "opportunity" && defined(slug.current)] | order(postedAt desc){
    ...,
    "slug": slug.current,
    "capability": capability._ref,
    "locations": locations[]._ref,
    description[]${BODY},
    "jdPdf": jdPdf.asset->{ _id, url, extension, size, originalFilename },
    ${SEO}
  }
`);

/** The client's name comes back only with recorded permission. */
export const caseStudiesQuery = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current)] | order(publishedAt desc){
    ...,
    "slug": slug.current,
    "clientPermission": clientPermission{ confirmed },
    "clientName": select(
      clientPermission.confirmed == true => clientPermission.clientName
    ),
    "industry": industry._ref,
    "capabilities": capabilities[]._ref,
    "photo": photo${IMAGE},
    ${SEO}
  }
`);

export const clientLogosQuery = defineQuery(`
  *[_type == "clientLogo"] | order(order asc){ ..., "logo": logo${IMAGE} }
`);

export const ecosystemQuery = defineQuery(`
  *[_type == "ecosystemCompany"] | order(order asc){ ..., "logo": logo${IMAGE} }
`);
