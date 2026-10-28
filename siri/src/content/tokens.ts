/**
 * Token values mirrored from styles/tokens.css for the style guide. Keep in
 * step with tokens.css; the CSS file is the source of truth.
 */

export const colors = [
  { name: "--bg", value: "#FAFAFA", role: "Page background, off-white" },
  { name: "--surface", value: "#FFFFFF", role: "Cards, nav pill" },
  { name: "--tint", value: "#EEF0F8", role: "Tinted tiles and sections" },
  { name: "--photo", value: "#E3E6EE", role: "Photo placeholders" },
  { name: "--border", value: "#DDE0E8", role: "Borders" },
  { name: "--divider", value: "#EBEDF2", role: "Dividers" },
  { name: "--muted-2", value: "#B4B7C2", role: "Chart bars, logo placeholders" },
  { name: "--muted", value: "#686B76", role: "Captions, labels" },
  { name: "--slate", value: "#3A3D45", role: "Body copy" },
  { name: "--ink", value: "#0D0F0D", role: "Headings, ink tiles, primary dark buttons" },
  { name: "--accent", value: "#0F766E", role: "Siri teal, the single brand accent" },
  { name: "--accent-light", value: "color-mix(accent 45%, #fff)", role: "Accent on ink" },
  { name: "--danger", value: "#B42318", role: "“Before” states only" },
  { name: "--danger-tint", value: "#FCEBEC", role: "“Before” states only" },
  { name: "--on-dark-muted", value: "rgba(255,255,255,.72)", role: "Secondary text on ink" },
  { name: "--on-dark-chip", value: "rgba(255,255,255,.12)", role: "Chips on ink" },
] as const;

export const hex = {
  bg: "#FAFAFA",
  surface: "#FFFFFF",
  tint: "#EEF0F8",
  photo: "#E3E6EE",
  muted: "#686B76",
  slate: "#3A3D45",
  ink: "#0D0F0D",
  accent: "#0F766E",
  danger: "#B42318",
  dangerTint: "#FCEBEC",
  onDarkMuted: "rgba(255,255,255,.72)",
} as const;

export const radii = [
  { name: "--radius-lg", value: "24px", role: "Bento tiles and large cards" },
  { name: "--radius-md", value: "20px", role: "Medium cards" },
  { name: "--radius-sm", value: "16px", role: "Small tiles" },
  { name: "--radius-pill", value: "999px", role: "Buttons, chips, nav bar" },
] as const;

export const spacing = [
  { name: "--content-max", value: "1320px", role: "Content width" },
  { name: "--gutter", value: "32px (16px under 600px)", role: "Side padding" },
  { name: "--section-y", value: "128px (72px under 900px)", role: "Section padding, vertical" },
  { name: "--tile-gap", value: "14px", role: "Gap between bento tiles" },
  { name: "--tile-pad", value: "24–32px", role: "Tile inner padding" },
  { name: "--nav-inset", value: "20px", role: "Floating nav inset from the top" },
] as const;
