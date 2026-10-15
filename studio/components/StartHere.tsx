import { Card, Heading, Stack, Text } from "@sanity/ui";

const sections: { title: string; lines: string[] }[] = [
  {
    title: "Publishing",
    lines: [
      "Edit, then press Publish. The change appears on the website in about 2 minutes.",
      "Drafts are never shown on the website.",
    ],
  },
  {
    title: "Job openings (HR)",
    lines: [
      "Careers → Open roles → the + button adds a role. Fill in the role, the description and how to apply, then Publish.",
      "Attach a job-description PDF if you have one. Anyone with the link can open an uploaded file, so never upload anything confidential.",
      "To take a role down, open it and use Close role. It leaves the careers page and its page is hidden from search.",
      "A role with a closing date disappears on its own the day after that date.",
    ],
  },
  {
    title: "Insights (marketing)",
    lines: [
      "Insights → Articles. Every article needs a photo with alt text, a summary, the In short points and a category.",
      "Leave the publish date empty while the article is in review.",
    ],
  },
  {
    title: "Nothing goes live unconfirmed",
    lines: [
      "Never add a client, figure, quote, logo or partner that isn't confirmed in writing.",
      "Proof & claims → Not confirmed yet lists everything still waiting. The live website won't build until each one is confirmed or removed.",
    ],
  },
  {
    title: "Words we don't use",
    lines: [
      "Recruiting, staffing, staff augmentation, hire, placement, headhunting, outsourcing, consulting, agency, contractor, engagement, bench, resources, manpower and vendor. Studio warns you if one appears.",
      "Dallas is the Client & Leadership Hub; Hyderabad is the Engineering & Talent Hub.",
    ],
  },
];

/** A short guide shown first in the Studio menu. */
export function StartHere() {
  return (
    <Card padding={4} height="fill" overflow="auto">
      <Stack gap={5} style={{ maxWidth: "40rem" }}>
        <Heading as="h1" size={3}>
          Managing the ManyaIT website
        </Heading>
        {sections.map((section) => (
          <Stack key={section.title} gap={3}>
            <Heading as="h2" size={1}>
              {section.title}
            </Heading>
            {section.lines.map((line) => (
              <Text key={line} size={2} muted>
                {line}
              </Text>
            ))}
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
