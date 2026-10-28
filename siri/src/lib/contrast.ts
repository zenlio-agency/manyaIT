/** WCAG 2 contrast ratios, used by the style guide to show token pairings. */

type RGB = [number, number, number];

function parse(color: string): { rgb: RGB; alpha: number } {
  const hex = color.trim().match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return { rgb: [(n >> 16) & 255, (n >> 8) & 255, n & 255], alpha: 1 };
  }
  const rgba = color.match(/rgba?\(([^)]+)\)/i);
  if (rgba) {
    const [r, g, b, a = "1"] = rgba[1].split(",").map((part) => part.trim());
    return { rgb: [Number(r), Number(g), Number(b)], alpha: Number(a) };
  }
  throw new Error(`Unsupported color: ${color}`);
}

/** Mix `color` over an opaque `background`, as the browser composites it. */
function flatten(color: string, background: string): RGB {
  const { rgb, alpha } = parse(color);
  const bg = parse(background).rgb;
  return rgb.map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha))) as RGB;
}

function luminance([r, g, b]: RGB) {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Contrast of `foreground` (may be translucent) on an opaque `background`. */
export function contrast(foreground: string, background: string): number {
  const fg = luminance(flatten(foreground, background));
  const bg = luminance(parse(background).rgb);
  const [hi, lo] = fg > bg ? [fg, bg] : [bg, fg];
  return (hi + 0.05) / (lo + 0.05);
}

/** Mix two hex colors like `color-mix(in srgb, a p%, b)`. */
export function mix(a: string, b: string, weightA: number): string {
  const x = parse(a).rgb;
  const y = parse(b).rgb;
  const out = x.map((c, i) => Math.round(c * weightA + y[i] * (1 - weightA)));
  return `#${out.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
