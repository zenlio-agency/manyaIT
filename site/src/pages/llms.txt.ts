import type { APIRoute } from "astro";
import { SITE_NAME } from "@/consts.ts";
import { capabilityHref, industryHref } from "@/data/site.ts";
import {
  articles,
  capabilities,
  industries,
  settings,
} from "@/sanity/content.ts";
import { insightHref } from "@/utils/insights.ts";
import { absolute } from "@/utils/schema.ts";

/* A plain-text guide to the site for AI assistants (llmstxt.org), built from
   the same content as the pages so it never disagrees with them. */
export const GET: APIRoute = async () => {
  const [site, caps, inds, posts] = await Promise.all([
    settings(),
    capabilities(),
    industries(),
    articles(),
  ]);
  const item = (name: string, path: string, text?: string) =>
    `- [${name}](${absolute(path)})${text ? `: ${text}` : ""}`;

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${site.description ?? ""}`,
    "",
    "## Capabilities",
    "",
    ...caps.map((cap) =>
      item(cap.page.seoTitle || cap.title, capabilityHref(cap), cap.page.description),
    ),
    item(
      "Specialist Technology Talent",
      "/capabilities/specialist-talent",
      "Vetted technology specialists matched to your stack across the United States and India.",
    ),
    "",
    "## Industries",
    "",
    ...inds.map((ind) =>
      item(ind.title, industryHref(ind), ind.page.description),
    ),
    "",
    "## Insights",
    "",
    ...posts.map((post) => item(post.title, insightHref(post), post.description)),
    "",
    "## Company",
    "",
    item("About", "/about"),
    item("Careers", "/careers"),
    item("Contact", "/contact"),
    item("Legal and privacy", "/legal"),
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
