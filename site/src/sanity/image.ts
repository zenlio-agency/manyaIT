import { getImage } from "astro:assets";
import { createImageUrlBuilder } from "@sanity/image-url";
import { SANITY_DATASET, SANITY_PROJECT_ID } from "./config.ts";
import type { SanityImageCrop, SanityImageHotspot } from "./types.ts";

/*
 * Images from Sanity are downloaded at build time and served from the
 * site's own domain, so visitors never load anything from Sanity. Astro
 * fetches each file once (allowed by `image.remotePatterns` in
 * astro.config.mjs) and writes the resized copies into the build.
 */

/** An image as the queries return it (see `IMAGE` in queries.ts). */
export type SanityImage = {
  asset: {
    _id: string;
    url: string | null;
    extension: string | null;
    width: number | null;
    height: number | null;
  } | null;
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
  alt?: string;
  decorative?: boolean;
};

const builder = createImageUrlBuilder({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
});

/** The widest file fetched from Sanity; Astro makes smaller sizes from it. */
const MAX_WIDTH = 2400;

/**
 * The file Astro downloads: the editor's crop applied, at most `MAX_WIDTH`
 * wide. Given an aspect ratio, Sanity also crops to that shape around the
 * editor's hotspot, so a fixed-shape slot keeps the important part.
 */
export function imageSource(image: SanityImage, aspectRatio?: number) {
  const { asset } = image;
  if (!asset?.width || !asset.height) return undefined;
  if (asset.extension === "svg") {
    throw new Error(
      `Image ${asset._id} is an SVG. SVGs are copied as files, not resized; they can't go through the photo helpers.`,
    );
  }
  const { top = 0, bottom = 0, left = 0, right = 0 } = image.crop ?? {};
  const croppedWidth = asset.width * (1 - left - right);
  const croppedHeight = asset.height * (1 - top - bottom);
  const ratio = aspectRatio ?? croppedWidth / croppedHeight;
  /* The small allowance stops float error from losing a pixel. */
  const width = Math.floor(
    Math.min(MAX_WIDTH, croppedWidth, croppedHeight * ratio) + 1e-6,
  );
  const height = Math.round(width / ratio);
  const url = builder.image(image).width(width).height(height).quality(90);
  return { url: url.url(), width, height };
}

/** The editor's hotspot as a CSS `object-position`, for cover-fit photos. */
export function objectPosition(image: SanityImage): string | undefined {
  const { hotspot } = image;
  if (hotspot?.x === undefined || hotspot.y === undefined) return undefined;
  const { top = 0, bottom = 0, left = 0, right = 0 } = image.crop ?? {};
  const percent = (value: number) =>
    `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%`;
  return `${percent((hotspot.x - left) / (1 - left - right))} ${percent(
    (hotspot.y - top) / (1 - top - bottom),
  )}`;
}

/** Alt text, or empty for an image marked decorative. */
export const altText = (image: SanityImage) =>
  image.decorative ? "" : (image.alt ?? "");

type PhotoOptions = {
  /** Width of the file written to the build. */
  width?: number;
  /** Crop to this width ÷ height around the hotspot. */
  aspectRatio?: number;
  /** `jpg` for social images, which not every platform reads as WebP. */
  format?: "webp" | "jpg";
};

/**
 * A Sanity image copied into the build at one size, for components that take
 * a plain image path (photo tiles, page headers, social images). Returns
 * `undefined` when there's no image, so the component shows its fallback.
 */
export async function sanityPhoto(
  image: SanityImage | null | undefined,
  { width = 1600, aspectRatio, format = "webp" }: PhotoOptions = {},
) {
  const source = image && imageSource(image, aspectRatio);
  if (!image || !source) return undefined;
  const outWidth = Math.min(width, source.width);
  const outHeight = Math.round((outWidth * source.height) / source.width);
  const { src } = await getImage({
    src: source.url,
    width: outWidth,
    height: outHeight,
    format,
  });
  return {
    src,
    width: outWidth,
    height: outHeight,
    alt: altText(image),
    position: objectPosition(image),
  };
}

/* ---------------------------------------------------------------------------
 * SVG files, such as client logos, are copied into the build as they are,
 * since there is nothing to resize. A logo file is shown with <img> but can
 * also be opened on its own, so anything that could run or load something
 * stops the build instead.
 */
const UNSAFE_SVG: [RegExp, string][] = [
  [/<script\b/i, "a script"],
  [/\son[a-z]+\s*=/i, "an event handler"],
  [/<foreignObject\b/i, "embedded HTML"],
  [/javascript:/i, "a javascript: link"],
  [/<(?:iframe|embed|object)\b/i, "an embedded document"],
  [/\bhref\s*=\s*["'](?!#|data:image\/)/i, "a link to another file"],
  [/url\(\s*["']?\s*(?!#|data:image\/)/i, "a link to another file"],
  [/@import\b/i, "an imported style sheet"],
];

/**
 * Removes the DOCTYPE that design tools add, filling in its entities when
 * they are plain text (Illustrator declares its namespaces this way).
 */
function resolveDoctype(svg: string, id: string): string {
  const doctype = svg.match(/<!DOCTYPE[^[>]*(?:\[([\s\S]*?)\])?\s*>/i);
  let text = doctype ? svg.replace(doctype[0], "") : svg;
  if (doctype) {
    for (const [, name, value] of (doctype[1] ?? "").matchAll(
      /<!ENTITY\s+([\w.-]+)\s+"([^"]*)"\s*>/g,
    )) {
      if (/[&<%]/.test(value)) {
        throw new Error(`SVG ${id}: entity "${name}" isn't plain text.`);
      }
      text = text.replaceAll(`&${name};`, value);
    }
    if (/<!ENTITY/i.test(text)) {
      throw new Error(`SVG ${id}: it declares entities the site can't check.`);
    }
  }

  /* Strip stray doctype closure remnants before the root element (e.g. "]>" or "]&gt;"). */
  const svgIndex = text.indexOf("<svg");
  if (svgIndex > 0) {
    const before = text.slice(0, svgIndex);
    if (!before.includes("<?xml") || /[\]>]/.test(before)) {
      text = text.slice(svgIndex);
    }
  }

  /* Fill in standard Illustrator entities that were partially stripped or entity-escaped. */
  text = text
    .replaceAll("&amp;ns_svg;", "http://www.w3.org/2000/svg")
    .replaceAll("&ns_svg;", "http://www.w3.org/2000/svg")
    .replaceAll("&amp;ns_xlink;", "http://www.w3.org/1999/xlink")
    .replaceAll("&ns_xlink;", "http://www.w3.org/1999/xlink");

  return text;
}

export type SvgFile = {
  /** Where the file is served on this site. */
  path: string;
  /** The file name under `/media/`. */
  file: string;
  /** The file itself, checked. */
  text: string;
  /** Width ÷ height, from the viewBox, else the width and height. */
  ratio?: number;
};

const svgFiles = new Map<string, Promise<SvgFile>>();

/** An SVG from Sanity, fetched once and checked, to serve from `/media/`. */
export function svgFile(asset: NonNullable<SanityImage["asset"]>) {
  const { _id: id, url } = asset;
  if (!url) throw new Error(`SVG ${id} has no file.`);
  if (!svgFiles.has(id)) {
    svgFiles.set(
      id,
      (async () => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`SVG ${id}: Sanity answered ${response.status}.`);
        }
        const text = resolveDoctype(await response.text(), id);
        for (const [pattern, what] of UNSAFE_SVG) {
          if (pattern.test(text)) {
            throw new Error(
              `SVG ${id} contains ${what}, which the site doesn't allow. Upload it again without it, or as a PNG.`,
            );
          }
        }
        const box = text
          .match(/viewBox\s*=\s*"([^"]+)"/)?.[1]
          .split(/[\s,]+/)
          .map(Number);
        const width = box?.[2] ?? Number(text.match(/\bwidth="([\d.]+)/)?.[1]);
        const height =
          box?.[3] ?? Number(text.match(/\bheight="([\d.]+)/)?.[1]);
        const file = `${id.replace(/^image-/, "").replace(/-svg$/, "")}.svg`;
        return {
          path: `/media/${file}`,
          file,
          text,
          ratio: width && height ? width / height : undefined,
        };
      })(),
    );
  }
  return svgFiles.get(id)!;
}
