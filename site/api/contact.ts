/**
 * Receives submissions from the Contact form and files each one in
 * HighLevel, as a Vercel Function at /api/contact.
 */

const API = "https://services.leadconnectorhq.com";

/** Answers that must be present, as the form marks them. */
const REQUIRED = [
  "name",
  "email",
  "company_name",
  "job_title",
  "contact_consent",
] as const;

/** The note's lines, in the form's order. */
const NOTE_LINES: [label: string, name: string][] = [
  ["Name", "name"],
  ["Email", "email"],
  ["Company", "company_name"],
  ["Job Title", "job_title"],
  ["Enquirer Type", "enquirer_type"],
  ["Industry", "industry"],
  ["Areas of Interest", "areas_of_interest"],
  ["Message", "message"],
  ["Contact Consent", "contact_consent"],
  ["Marketing Opt In", "marketing_opt_in"],
];

class Rejected extends Error {}

export async function POST(request: Request): Promise<Response> {
  const wantsJson = (request.headers.get("accept") ?? "").includes("json");
  const reply = (status: number, message: string) =>
    wantsJson
      ? Response.json({ ok: status < 300, message }, { status })
      : new Response(page(message), {
          status,
          headers: { "content-type": "text/html; charset=utf-8" },
        });

  try {
    const form = await request.formData().catch(() => {
      throw new Rejected("The form couldn't be read.");
    });

    if (text(form, "website")) return reply(200, "Thank you.");

    const submission = await readSubmission(form);
    const settings = readSettings();
    await fileSubmission(submission, settings);
    return reply(200, "Thank you. Your message is with our team.");
  } catch (error) {
    if (error instanceof Rejected) return reply(400, error.message);
    console.error("Contact form failed:", error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply(
      502,
      `Your message didn't send. Error details: ${errorMessage}`,
    );
  }
}

type Submission = {
  fields: Record<string, string>;
  tags: string[];
};

async function readSubmission(form: FormData): Promise<Submission> {
  const fields: Record<string, string> = {};
  for (const [name, value] of form) {
    if (typeof value !== "string") continue;
    fields[name] = value.replace(/\r\n?/g, "\n").trim().slice(0, 2000);
  }

  if (fields.contact_consent !== "Yes") {
    throw new Rejected("Please agree to us contacting you.");
  }
  for (const name of REQUIRED) {
    if (!fields[name]) throw new Rejected(`Please fill in "${name}".`);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    throw new Rejected("Please enter a valid email address.");
  }

  const tags = ["contact form"];
  if (fields.enquirer_type) tags.push(`type: ${fields.enquirer_type}`);
  if (fields.industry) tags.push(`industry: ${fields.industry}`);
  if (fields.marketing_opt_in === "Yes") tags.push("marketing opt-in");

  return { fields, tags };
}

type Settings = {
  token: string;
  locationId: string;
  version: string;
};

function readSettings(): Settings {
  const token = process.env.GHL_PRIVATE_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    throw new Error("GHL_PRIVATE_TOKEN or GHL_LOCATION_ID isn't set.");
  }
  return {
    token,
    locationId,
    version: process.env.GHL_API_VERSION || "2021-07-28",
  };
}

async function fileSubmission(
  { fields, tags }: Submission,
  settings: Settings,
) {
  const call = api(settings);

  // Split name
  const nameParts = fields.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || "";

  const { contact } = (await call("POST", "/contacts/upsert", {
    json: {
      locationId: settings.locationId,
      firstName,
      lastName,
      email: fields.email,
      companyName: fields.company_name,
      source: "Contact Form",
      customFields: [
        { id: "job_title", value: fields.job_title || "" },
        { id: "enquirer_type", value: fields.enquirer_type || "" },
        { id: "industry", value: fields.industry || "" },
        { id: "areas_of_interest", value: fields.areas_of_interest || "" },
        { id: "message", value: fields.message || "" },
        { id: "contact_consent", value: fields.contact_consent || "" },
        { id: "marketing_opt_in", value: fields.marketing_opt_in || "" },
      ],
    },
  })) as { contact?: { id?: string } };
  
  if (!contact?.id) throw new Error("HighLevel returned no contact id.");

  await call("POST", `/contacts/${contact.id}/tags`, { json: { tags } });

  const lines = NOTE_LINES.filter(([, name]) => fields[name]).map(
    ([label, name]) => `${label}: ${fields[name]}`,
  );
  await call("POST", `/contacts/${contact.id}/notes`, {
    json: {
      body: [`Contact Form Submission, ${today()}`, "", ...lines].join("\n"),
    },
  });
}

function api({ token, version }: Settings) {
  return async (
    method: "GET" | "POST",
    path: string,
    { json, body }: { json?: unknown; body?: FormData } = {},
  ): Promise<unknown> => {
    const response = await fetch(API + path, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Version: version,
        Accept: "application/json",
        ...(json ? { "Content-Type": "application/json" } : {}),
      },
      body: json ? JSON.stringify(json) : body,
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      const route = path.split("?")[0].replace(/\/[A-Za-z0-9]{15,}/g, "/…");
      throw new Error(`HighLevel ${method} ${route}: ${response.status}`);
    }
    return response.json().catch(() => ({}));
  };
}

function text(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function page(message: string) {
  const safe = message.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
  return `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>ManyaIT Contact</title><p>${safe}</p><p><a href="/">Back Home</a></p>`;
}
