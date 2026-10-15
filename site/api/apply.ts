/**
 * Receives applications from /careers/apply and files each one in
 * HighLevel, as a Vercel Function at /api/apply. The site itself stays
 * static; this is its only server code.
 *
 * For each application it:
 * 1. creates or updates the contact (name, email, phone);
 * 2. attaches the CV to the contact's file-upload field;
 * 3. tags the contact "careers application", "applied: <role>" and, when
 *    asked for, "talent network";
 * 4. adds a note with every answer, so HR sees the whole application.
 *
 * Settings, in Vercel → Project → Settings → Environment Variables. The
 * token is a secret: it never goes in the code or the browser.
 * - GHL_PRIVATE_TOKEN: a HighLevel Private Integration token with the
 *   scopes contacts.write, locations/customFields.readonly and forms.write.
 * - GHL_LOCATION_ID: the HighLevel sub-account's Location ID.
 * - GHL_CV_FIELD_KEY (optional): the key of the file-upload custom field
 *   that holds CVs. Defaults to contact.cv, a field named "CV".
 * - GHL_API_VERSION (optional): HighLevel's Version header. Defaults to
 *   2021-07-28.
 */

const API = "https://services.leadconnectorhq.com";

/** Vercel caps a request body at 4.5 MB, so the form allows 4 MB. */
const MAX_CV_BYTES = 4 * 1024 * 1024;

/** PDF, Word 97–2003 and Word 2007+, each by its opening bytes. */
const CV_TYPES = [
  { extension: "pdf", signature: [0x25, 0x50, 0x44, 0x46] },
  { extension: "doc", signature: [0xd0, 0xcf, 0x11, 0xe0] },
  { extension: "docx", signature: [0x50, 0x4b, 0x03, 0x04] },
];

/** Answers that must be present, as the form marks them. */
const REQUIRED = [
  "role",
  "first-name",
  "last-name",
  "email",
  "phone",
  "location",
  "experience",
  "availability",
  "authorized",
  "sponsorship",
] as const;

/** The note's lines, in the form's order. */
const NOTE_LINES: [label: string, name: string][] = [
  ["Role", "role-title"],
  ["Name", "full-name"],
  ["Email", "email"],
  ["Phone", "phone"],
  ["Current location", "location"],
  ["LinkedIn", "linkedin"],
  ["Years of experience", "experience"],
  ["Could start", "availability"],
  ["Portfolio or other link", "portfolio"],
  ["Authorized to work where the role is based", "authorized"],
  ["Needs visa sponsorship", "sponsorship"],
  ["Keep profile on file", "talent-network"],
  ["Anything else", "note"],
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
      throw new Rejected("The application couldn't be read.");
    });

    /* People leave the hidden "website" box empty; bots fill it in. A bot
       is told it worked and nothing is filed. */
    if (text(form, "website")) return reply(200, "Thank you.");

    const application = await readApplication(form);
    const settings = readSettings();
    await fileApplication(application, settings);
    return reply(200, "Thank you. Your application is with our team.");
  } catch (error) {
    if (error instanceof Rejected) return reply(400, error.message);
    console.error("Careers application failed:", error);
    
    // Send the actual error message to the browser so we can debug it
    const errorMessage = error instanceof Error ? error.message : String(error);
    return reply(
      502,
      `Your application didn't send. Error details: ${errorMessage}`,
    );
  }
}

type Application = {
  fields: Record<string, string>;
  cv: File;
  tags: string[];
};

/** Checks the answers and the CV, and gathers what HighLevel needs. */
async function readApplication(form: FormData): Promise<Application> {
  const fields: Record<string, string> = {};
  for (const [name, value] of form) {
    if (typeof value !== "string") continue;
    /* Browsers send typed line breaks as \r\n. */
    fields[name] = value.replace(/\r\n?/g, "\n").trim().slice(0, 2000);
  }

  if (fields.consent !== "yes") {
    throw new Rejected("Please agree to us using your details.");
  }
  for (const name of REQUIRED) {
    if (!fields[name]) throw new Rejected(`Please fill in "${name}".`);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    throw new Rejected("Please enter a valid email address.");
  }

  const cv = form.get("cv");
  if (!(cv instanceof File) || cv.size === 0) {
    throw new Rejected("Please attach your CV.");
  }
  if (cv.size > MAX_CV_BYTES) {
    throw new Rejected("Please attach a CV under 4 MB.");
  }
  /* The file's name and its opening bytes must agree on PDF or Word. */
  const cvExtension = cv.name.split(".").pop()?.toLowerCase() ?? "";
  const type = CV_TYPES.find((t) => t.extension === cvExtension);
  const head = new Uint8Array(await cv.slice(0, 4).arrayBuffer());
  if (!type?.signature.every((byte, index) => head[index] === byte)) {
    throw new Rejected("Please attach your CV as a PDF or Word file.");
  }

  /* Choosing "Register your interest" is itself asking to be kept on file,
     so the form disables that box and the browser doesn't send it. */
  const network =
    fields.role === "talent-network" || fields["talent-network"] === "yes";
  fields["talent-network"] = network ? "Yes" : "No";
  for (const name of ["authorized", "sponsorship"]) {
    fields[name] = fields[name] === "yes" ? "Yes" : "No";
  }
  fields["role-title"] ||= fields.role;
  fields["full-name"] = `${fields["first-name"]} ${fields["last-name"]}`;

  const tags = ["careers application", "Career Form", `applied: ${fields["role-title"]}`];
  if (network) tags.push("talent network");

  return { fields, cv, tags };
}

type Settings = {
  token: string;
  locationId: string;
  cvFieldKey: string;
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
    cvFieldKey: process.env.GHL_CV_FIELD_KEY || "contact.cv",
    version: process.env.GHL_API_VERSION || "2021-07-28",
  };
}

async function fileApplication(
  { fields, cv, tags }: Application,
  settings: Settings,
) {
  const call = api(settings);
  const cvFieldId = await findCvField(call, settings);

  const { contact } = (await call("POST", "/contacts/upsert", {
    json: {
      locationId: settings.locationId,
      firstName: fields["first-name"],
      lastName: fields["last-name"],
      email: fields.email,
      phone: fields.phone,
      source: "Careers application",
      customFields: [
        { id: "role_applied_for", value: fields["role-title"] || "" },
        { id: "current_location", value: fields.location || "" },
        { id: "linkedin_profile", value: fields.linkedin || "" },
        { id: "years_of_experience", value: fields.experience || "" },
        { id: "availability_to_start", value: fields.availability || "" },
        { id: "portfolio_or_github_link", value: fields.portfolio || "" },
        { id: "additional_information", value: fields.note || "" },
        { id: "work_authorization", value: fields.authorized || "" },
        { id: "visa_sponsorship_required", value: fields.sponsorship || "" },
      ],
    },
  })) as { contact?: { id?: string } };
  if (!contact?.id) throw new Error("HighLevel returned no contact id.");

  const upload = new FormData();
  
  // The guide specifies formatting the key exactly as <custom_field_id>_<random_id>
  // We use a simple alphanumeric random string (e.g. resume01 style) instead of a UUID with hyphens
  // to prevent potential 500 server errors on GoHighLevel's end.
  const randomId = Math.random().toString(36).substring(2, 10);
  const fileKey = `${cvFieldId}_${randomId}`;
  
  upload.append(fileKey, cv, cv.name);

  const uploadQuery = new URLSearchParams({
    contactId: contact.id,
    locationId: settings.locationId,
  });

  try {
    await call("POST", `/forms/upload-custom-files?${uploadQuery}`, {
      body: upload,
    });
  } catch (uploadError) {
    // If it fails, we throw the error so the frontend can display it in the network tab.
    throw uploadError;
  }

  /* Tags go through their own call, which adds to the contact's tags; the
     upsert's tags would replace them. */
  await call("POST", `/contacts/${contact.id}/tags`, { json: { tags } });

  const lines = NOTE_LINES.filter(([, name]) => fields[name]).map(
    ([label, name]) => `${label}: ${fields[name]}`,
  );
  await call("POST", `/contacts/${contact.id}/notes`, {
    json: {
      body: [`Careers application, ${today()}`, "", ...lines].join("\n"),
    },
  });
}

/** The CV field's id, looked up by key once per warm instance. */
let cvField: { key: string; id: string } | undefined;

async function findCvField(call: Call, settings: Settings) {
  if (cvField?.key === settings.cvFieldKey) return cvField.id;
  const { customFields = [] } = (await call(
    "GET",
    `/locations/${settings.locationId}/customFields?model=contact`,
  )) as { customFields?: { id: string; fieldKey?: string }[] };
  const field = customFields.find((f) => f.fieldKey === settings.cvFieldKey);
  if (!field) {
    throw new Error(
      `No HighLevel custom field has the key ${settings.cvFieldKey}.`,
    );
  }
  cvField = { key: settings.cvFieldKey, id: field.id };
  return field.id;
}

type Call = ReturnType<typeof api>;

/** A HighLevel API call that throws on any error status. */
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
      /* The path, not the answers: logs mustn't hold applicants' details. */
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

/** The reply for a browser that sent the form without JavaScript. */
function page(message: string) {
  const safe = message.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
  return `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>ManyaIT careers</title><p>${safe}</p><p><a href="/careers/">Back to Careers</a></p>`;
}
