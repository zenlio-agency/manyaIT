// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE_URL } from "./src/consts.ts";
import { isNoindexRoute } from "./src/utils/seo.ts";
import {
  SANITY_DATASET,
  SANITY_PROJECT_ID,
} from "./src/sanity/config.ts";
import contentCheck from "./src/integrations/content-check.ts";

export default defineConfig({
  site: SITE_URL,

  /* Legal page redirects, and the former Locations page */
  redirects: {
    "/locations": "/about#locations",
    "/privacy": "/legal/privacy",
    "/privacy-policy": "/legal/privacy",
    "/terms": "/legal/terms",
    "/terms-of-use": "/legal/terms",
    "/cookie-policy": "/legal/cookies",
    "/accessibility": "/legal/accessibility",
    "/capabilities/talent-solutions": "/capabilities/specialist-talent",
  },

  /* Allow ngrok and Cloudflare (cloudflared) tunnels for local review */
  server: {
    allowedHosts: [
      ".ngrok-free.app",
      ".ngrok-free.dev",
      ".ngrok.app",
      ".ngrok.dev",
      ".ngrok.io",
      ".trycloudflare.com",
    ],
  },

  /* Sanity images */
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/**`,
      },
    ],
  },

  integrations: [
    sitemap({
      filter: (page) => !isNoindexRoute(new URL(page).pathname),
    }),
    /* Claims, placeholders, copy rules and legal addresses, after each build */
    contentCheck(),
  ],

  fonts: [
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.local(),
      fallbacks: ["system-ui", "sans-serif"],
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/inter-latin-wght-normal.woff2"],
          },
        ],
      },
    },

    {
      name: "Plus Jakarta Sans",
      cssVariable: "--font-plus-jakarta",
      provider: fontProviders.local(),
      fallbacks: ["system-ui", "sans-serif"],
      options: {
        variants: [
          {
            weight: "200 800",
            style: "normal",
            src: [
              "./src/assets/fonts/plus-jakarta-sans-latin-wght-normal.woff2",
            ],
          },
          {
            weight: "200 800",
            style: "italic",
            src: [
              "./src/assets/fonts/plus-jakarta-sans-latin-wght-italic.woff2",
            ],
          },
        ],
      },
    },

    {
      name: "Poppins",
      cssVariable: "--font-poppins",
      provider: fontProviders.local(),
      fallbacks: ["system-ui", "sans-serif"],
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/poppins-latin-400-normal.woff2"],
          },
          {
            weight: 500,
            style: "normal",
            src: ["./src/assets/fonts/poppins-latin-500-normal.woff2"],
          },
          {
            weight: 600,
            style: "normal",
            src: ["./src/assets/fonts/poppins-latin-600-normal.woff2"],
          },
        ],
      },
    },
  ],

  vite: {
    build: {
      cssTarget: "safari15.4",
    },
  },
});
