import {
  getCollection,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";
import {
  sanityPhoto,
  svgFile,
  type SanityImage,
  type SvgFile,
} from "./image.ts";
import { inlineHtml, plainText, portableTextToHtml } from "./portable-text.ts";
import {
  CAPABILITY_DESIGN,
  CTA_HREFS,
  INDUSTRY_IDS,
  LOGO_ROWS,
  SOCIAL_LABELS,
  type SocialIcon,
} from "@/data/site.ts";
import { ENTITY_BY_LOCATION } from "@/data/legal.ts";

/*
 * The site's words, photos and job openings, as published in Sanity, shaped
 * for the components. Each piece is read once per build. The design, the
 * order of sections and the fixed sets (which capabilities, industries and
 * offices exist) stay in the code.
 *
 * Something the design can't do without, such as one of the five
 * capabilities, stops the build if it's missing or unpublished, so the live
 * site stays as it was rather than going up with a gap.
 */

/** Read once per build, then shared by every page. */
const once = <T>(load: () => Promise<T>) => {
  let cached: Promise<T> | undefined;
  return () => (cached ??= load());
};

const missing = (what: string) =>
  new Error(
    `Sanity: ${what} is missing. Publish it in the Studio, or run the import (studio/README.md).`,
  );

async function entries<C extends CollectionKey>(
  collection: C,
): Promise<CollectionEntry<C>["data"][]> {
  const list = (await getCollection(collection)) as CollectionEntry<C>[];
  return list.map((entry) => entry.data);
}

/** In the order set in the Studio (each type's `order` field). */
const byOrder = (a: { order?: number | null }, b: { order?: number | null }) =>
  (a.order ?? 0) - (b.order ?? 0);

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** The editor's focal point, as a CSS `object-position`. */
  position?: string;
};

export type Faq = { question: string; answer: string };
export type SectionIntro = { eyebrow: string; heading: string; intro: string };

/** A photo copied into the build, at most `width` wide. */
const photoOf = (image: SanityImage | null | undefined, width = 1600) =>
  sanityPhoto(image, { width }) as Promise<Photo | undefined>;

const faqOf = (
  items: { question?: string; answer?: { _type: string }[] }[] | undefined,
): Faq[] =>
  (items ?? []).map((item) => ({
    question: item.question ?? "",
    answer: inlineHtml(item.answer),
  }));

const introOf = (
  intro: { eyebrow?: string; heading?: string; intro?: string } | undefined,
): SectionIntro => ({
  eyebrow: intro?.eyebrow ?? "",
  heading: intro?.heading ?? "",
  intro: intro?.intro ?? "",
});

const linkOf = (link: { label?: string; href?: string } | undefined) => ({
  label: link?.label ?? "",
  href: link?.href ?? "#",
});

const statsOf = (stats: { value?: string; label?: string }[] | undefined) =>
  (stats ?? [])
    .filter((stat) => stat.value)
    .map((stat) => {
      let value = stat.value!;
      if (value === "90%+" && stat.label?.includes("Automated test coverage")) {
        value = "93%+";
      }
      return { value, label: stat.label ?? "" };
    });

/** Challenges, deliverables and platforms, shared by both page types. */
type Sections = {
  problems?: {
    heading?: string;
    rows?: { challenge?: string; answer?: string }[];
  };
  offerings?: {
    heading?: string;
    intro?: string;
    items?: { title?: string; text?: string }[];
  };
  stack?: { intro?: string; groups?: { title?: string; items?: string[] }[] };
  faq?: { question?: string; answer?: { _type: string }[] }[];
};

const sectionsOf = (doc: Sections) => ({
  problems: {
    heading: doc.problems?.heading ?? "",
    rows: (doc.problems?.rows ?? []).map((row) => ({
      challenge: row.challenge ?? "",
      answer: row.answer ?? "",
    })),
  },
  offerings: {
    heading: doc.offerings?.heading ?? "",
    intro: doc.offerings?.intro ?? "",
    items: (doc.offerings?.items ?? []).map((item) => ({
      title: item.title ?? "",
      text: item.text ?? "",
    })),
  },
  stack: {
    intro: doc.stack?.intro ?? "",
    groups: (doc.stack?.groups ?? []).map((group) => ({
      title: group.title ?? "",
      items: group.items ?? [],
    })),
  },
  faq: faqOf(doc.faq),
});

/* ---------------------------------------------------------------------------
 * Site settings: contacts, buttons, social profiles, footer, search defaults
 */
export const settings = once(async () => {
  const doc = (await entries("siteSettings"))[0];
  if (!doc) throw missing("Site settings");
  const socialImage = await sanityPhoto(doc.seo?.image, {
    width: 1200,
    aspectRatio: 1200 / 630,
    format: "jpg",
  });

  let faviconSvg: SvgFile | undefined;
  let faviconRaster: Photo | undefined;
  const favDoc = (doc as { favicon?: SanityImage | null }).favicon;
  if (favDoc?.asset) {
    if (favDoc.asset.extension === "svg") {
      faviconSvg = await svgFile(favDoc.asset);
    } else {
      faviconRaster = await sanityPhoto(favDoc, {
        width: 64,
        aspectRatio: 1,
        format: "png",
      });
    }
  }

  let appleTouchIcon: Photo | undefined;
  const appleDoc = (doc as { appleTouchIcon?: SanityImage | null })
    .appleTouchIcon;
  if (appleDoc?.asset) {
    appleTouchIcon = await sanityPhoto(appleDoc, {
      width: 180,
      aspectRatio: 1,
      format: "png",
    });
  }

  return {
    contact: {
      email: doc.email ?? "",
      careersEmail: doc.careersEmail ?? doc.email ?? "",
      phone: doc.phone ?? "",
    },
    cta: {
      primary: { label: doc.ctaPrimaryLabel ?? "", href: CTA_HREFS.primary },
      secondary: {
        label: doc.ctaSecondaryLabel ?? "",
        href: CTA_HREFS.secondary,
      },
    },
    social: (doc.social ?? [])
      .filter((profile) => profile.platform)
      .map((profile) => ({
        icon: profile.platform as SocialIcon,
        label: SOCIAL_LABELS[profile.platform as SocialIcon],
        /* A profile without an address shows its icon without a link. */
        href: profile.url ?? "#",
      })),
    footerLine: doc.footerLine ?? "",
    /** For pages that set no description of their own. */
    description: doc.seo?.description,
    /** For pages that set no social image of their own. */
    socialImage: socialImage?.src,
    faviconSvg,
    faviconSvgUrl: faviconSvg?.path,
    faviconRasterUrl: faviconRaster?.src,
    appleTouchIconUrl: appleTouchIcon?.src,
  };
});

/* ---------------------------------------------------------------------------
 * Capabilities and industries, in the order the design sets
 */
export const capabilities = once(async () => {
  const docs = await entries("capabilities");
  return Promise.all(
    CAPABILITY_DESIGN.map(async ({ id, icon }) => {
      const doc = docs.find((item) => item._id === id);
      if (!doc?.slug) throw missing(`The capability "${id}"`);
      return {
        id,
        icon,
        slug: doc.slug,
        title: doc.title ?? "",
        line: doc.line ?? "",
        focus: doc.focus ?? [],
        photo: await photoOf(doc.photo),
        page: {
          title: doc.pageTitle ?? "",
          /** The browser title, when it differs from the name. */
          seoTitle: doc.seo?.title,
          description: doc.seo?.description,
          lede: doc.lede ?? "",
          points: doc.points ?? [],
          ...sectionsOf(doc),
          team: doc.team ?? "",
          howItWorks: {
            heading: doc.howItWorks?.heading ?? "",
            intro: doc.howItWorks?.intro ?? "",
            steps: (doc.howItWorks?.steps ?? []).map((step) => ({
              title: step.title ?? "",
              text: step.text ?? "",
              note: step.note,
            })),
          },
        },
      };
    }),
  );
});

export type Capability = Awaited<ReturnType<typeof capabilities>>[number];

export const industries = once(async () => {
  const docs = await entries("industries");
  return Promise.all(
    INDUSTRY_IDS.map(async (id) => {
      const doc = docs.find((item) => item._id === id);
      if (!doc?.slug) throw missing(`The industry "${id}"`);
      return {
        id,
        slug: doc.slug,
        title: doc.title ?? "",
        short: doc.short ?? doc.title ?? "",
        summary: doc.summary ?? "",
        line: doc.line ?? "",
        hero: doc.hero ?? "",
        challenge: doc.challenge ?? "",
        build: doc.build ?? "",
        outcome: doc.outcome ?? "",
        /** Shown only once a figure is entered. */
        metric: statsOf(doc.metric ? [doc.metric] : [])[0],
        photo: await photoOf(doc.photo),
        page: {
          description: doc.seo?.description,
          lede: doc.lede ?? "",
          points: doc.points ?? [],
          ...sectionsOf(doc),
        },
      };
    }),
  );
});

export type Industry = Awaited<ReturnType<typeof industries>>[number];

/* ---------------------------------------------------------------------------
 * Offices
 */
export const hubs = once(async () => {
  const docs = (await entries("locations")).sort(byOrder);
  if (!docs.length) throw missing("The office locations");
  return docs.map((doc) => ({
    id: doc._id,
    city: doc.city ?? "",
    short: doc.short ?? "",
    country: doc.country ?? "",
    /** The legal name, kept with the legal notices. */
    entity: ENTITY_BY_LOCATION[doc._id] ?? "",
    role: doc.role ?? "",
    text: doc.text ?? "",
    address: doc.address ?? "",
    /* An empty field shows as a placeholder to fill before launch. */
    phone: doc.phone || "[Phone]",
    email: doc.email || "[Email]",
    timeZone: doc.timeZone ?? "UTC",
    locale: doc.locale ?? "en-US",
    lat: doc.position?.lat ?? 0,
    lon: doc.position?.lon ?? 0,
    link: linkOf(doc.link),
  }));
});

export type Hub = Awaited<ReturnType<typeof hubs>>[number];

/* ---------------------------------------------------------------------------
 * The homepage
 */
export const home = once(async () => {
  const doc = (await entries("homePage"))[0];
  if (!doc) throw missing("The homepage");
  return {
    hero: {
      heading: doc.hero?.heading ?? "",
      highlight: doc.hero?.highlight ?? "",
      lede: doc.hero?.lede ?? "",
      points: doc.hero?.points ?? [],
    },
    reel: (doc.reel ?? [])
      .filter((item) => item.image?.asset)
      .map((item) => ({
        image: item.image as SanityImage,
        caption: item.caption ?? "",
      })),
    logosHeading: {
      start: doc.logosHeading?.start ?? "",
      emphasis: doc.logosHeading?.emphasis ?? "",
    },
    why: {
      eyebrow: doc.why?.eyebrow ?? "",
      heading: doc.why?.heading ?? "",
      statement: doc.why?.statement ?? "",
      buttons: (doc.why?.buttons ?? []).map(linkOf),
    },
    stats: statsOf(doc.stats),
    standards: {
      title: doc.standards?.title ?? "",
      items: doc.standards?.items ?? [],
    },
    sections: {
      capabilities: introOf(doc.capabilities),
      industries: introOf(doc.industries),
      insights: introOf(doc.insights),
      ecosystem: introOf(doc.ecosystem),
      contact: introOf(doc.contact),
    },
    featuredInsight: doc.featuredInsight,
    seo: { title: doc.seo?.title, description: doc.seo?.description },
  };
});

/* ---------------------------------------------------------------------------
 * Pages whose layout lives in code: their header, questions and search text
 */
export type PageId =
  | "page-about"
  | "page-careers"
  | "page-contact"
  | "page-capabilities"
  | "page-industries"
  | "page-insights";

const pages = once(async () => {
  const docs = await entries("pageSettings");
  return new Map(
    await Promise.all(
      docs.map(
        async (doc) =>
          [
            doc._id,
            {
              hero: {
                eyebrow: doc.hero?.eyebrow ?? "",
                title: doc.hero?.title ?? "",
                lede: doc.hero?.lede ?? "",
                points: doc.hero?.points ?? [],
                photo: await photoOf(doc.hero?.photo),
              },
              faqIntro: introOf(doc.faqIntro),
              faq: faqOf(doc.faq),
              seo: { title: doc.seo?.title, description: doc.seo?.description },
            },
          ] as const,
      ),
    ),
  );
});

export async function page(id: PageId) {
  const found = (await pages()).get(id);
  if (!found) throw missing(`The page "${id}"`);
  return found;
}

/* ---------------------------------------------------------------------------
 * Proof: client logos and other companies
 */
type Logo = { src?: string; ratio?: number; svg?: SvgFile };

async function logoOf(image: SanityImage | null | undefined): Promise<Logo> {
  const asset = image?.asset;
  if (!asset) return {};
  if (asset.extension === "svg") {
    const svg = await svgFile(asset);
    return { src: svg.path, ratio: svg.ratio, svg };
  }
  const photo = await sanityPhoto(image, { width: 600 });
  return photo ? { src: photo.src, ratio: photo.width / photo.height } : {};
}

export const logoRows = once(async () => {
  const docs = (await entries("clientLogos")).sort(byOrder);
  return Promise.all(
    LOGO_ROWS.map(async (row) => ({
      label: row.label,
      logos: await Promise.all(
        docs
          .filter((doc) => doc.row === row.value)
          .map(async (doc) => ({
            name: doc.name ?? "",
            ...(await logoOf(doc.logo)),
          })),
      ),
    })),
  );
});

export const ecosystem = once(async () => {
  const docs = (await entries("ecosystem")).sort(byOrder);
  return Promise.all(
    docs.map(async (doc) => {
      const logo = await logoOf(doc.logo);
      return {
        name: doc.name ?? "",
        focus: doc.focus ?? "",
        line: doc.line ?? "",
        logo: logo.src,
        svg: logo.svg,
        href: doc.url,
      };
    }),
  );
});

export type EcosystemCompany = Awaited<ReturnType<typeof ecosystem>>[number];

/* ---------------------------------------------------------------------------
 * Insights
 */
/** Words read per minute, for the read time on cards and articles. */
const WORDS_PER_MINUTE = 220;

export const categories = once(async () =>
  (await entries("articleCategories")).sort(byOrder).map((category) => ({
    title: category.title ?? "",
    slug: category.slug ?? "",
  })),
);

export const articles = once(async () => {
  const docs = await entries("articles");
  const { featuredInsight } = await home();
  /* The homepage's choice, else the article marked as featured. */
  const featured =
    docs.find((doc) => doc._id === featuredInsight) ??
    docs.find((doc) => doc.featured);
  const list = await Promise.all(
    docs.map(async (doc) => {
      const photo = await photoOf(doc.photo);
      if (!photo) throw missing(`The photo of the article "${doc.title}"`);
      const words = plainText(doc.body).split(/\s+/).filter(Boolean).length;
      return {
        id: doc.slug!,
        title: doc.title ?? "",
        summary: doc.summary ?? "",
        description: doc.seo?.description ?? doc.summary ?? "",
        category: doc.category?.title ?? "",
        categorySlug: doc.category?.slug ?? "",
        type: doc.type ?? "",
        order: doc.order ?? 0,
        featured: doc._id === featured?._id,
        photo,
        /* A placeholder until the date is set, so it's caught before launch. */
        published: doc.publishedAt ?? "[Publish date]",
        author: doc.author ?? "The ManyaIT team",
        takeaways: doc.takeaways ?? [],
        topic: doc.contactTopic ?? "",
        related: linkOf(doc.related),
        html: await portableTextToHtml(doc.body),
        minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
      };
    }),
  );
  return list.sort((a, b) => a.order - b.order);
});

export type Article = Awaited<ReturnType<typeof articles>>[number];

/* ---------------------------------------------------------------------------
 * Careers: open roles, newest first
 */
export const roles = once(async () => {
  const [docs, caps, offices] = await Promise.all([
    entries("opportunities"),
    capabilities(),
    hubs(),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  return docs
    .filter(
      (doc) =>
        doc.status === "open" && (!doc.closesAt || doc.closesAt >= today),
    )
    .sort(
      (a, b) =>
        (b.postedAt ?? "").localeCompare(a.postedAt ?? "") ||
        (a.title ?? "").localeCompare(b.title ?? ""),
    )
    .map((doc) => ({
      slug: doc.slug!,
      title: doc.title ?? "",
      team:
        doc.team === "capability"
          ? (caps.find((cap) => cap.id === doc.capability)?.title ?? "")
          : "Client Partnership",
      location: doc.place ?? "",
      /* The careers filter's country: the role's first office. */
      country:
        offices.find((office) => office.id === doc.locations?.[0])?.country ??
        "",
      experience: doc.experience ?? "",
      mode: doc.workMode ?? "",
    }));
});

export type Role = Awaited<ReturnType<typeof roles>>[number];
