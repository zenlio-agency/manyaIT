/**
 * Runs before `npm run seed` and `npm run deploy`. It shows which project,
 * dataset and account they're about to use, and stops with the fix when
 * one is wrong, instead of a "project user not found" error halfway
 * through.
 */
import { readdirSync, readFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";
import { API_VERSION, MANYAIT_PROJECT_ID } from "../lib/constants";

type Me = { id?: string; name?: string; email?: string; provider?: string };
type Project = {
  members?: { id: string; role?: string; isCurrentUser?: boolean }[];
};
type ApiError = { statusCode?: number; message?: string };

/** How each sign-in method reads in `npx sanity login`. */
const PROVIDERS: Record<string, string> = {
  google: "Google",
  github: "GitHub",
  sanity: "E-mail / password",
};

const MANAGE = `https://www.sanity.io/manage/project/${MANYAIT_PROJECT_ID}/members`;

function stop(...lines: string[]): never {
  console.error(`\n✗ ${lines.join("\n  ")}\n`);
  process.exit(1);
}

/** Where a project id other than ManyaIT's comes from. Sanity reads the
    .env files in this folder; .env.example is only a template. */
function overrideSources(): string[] {
  const sources = readdirSync(".")
    .filter((file) => file.startsWith(".env") && file !== ".env.example")
    .filter((file) => {
      const value = readFileSync(file, "utf8").match(
        /^\s*SANITY_STUDIO_PROJECT_ID\s*=\s*["']?([\w-]+)/m,
      )?.[1];
      return value && value !== MANYAIT_PROJECT_ID;
    })
    .map((file) => `the file studio\\${file}: delete it, or the line in it`);
  return sources.length
    ? sources
    : [
        'a SANITY_STUDIO_PROJECT_ID environment variable: remove it in Windows (Start → "Edit environment variables for your account"), then open a new terminal',
      ];
}

async function main() {
  const client = getCliClient({ apiVersion: API_VERSION });
  const { projectId, dataset } = client.config();
  const account = client.withConfig({
    useProjectHostname: false,
    apiVersion: "2021-06-07",
  });

  console.log(`Project: ${projectId}   Dataset: ${dataset}`);
  if (projectId !== MANYAIT_PROJECT_ID) {
    stop(
      `This would use project ${projectId}, not ManyaIT's project ${MANYAIT_PROJECT_ID}.`,
      "The other project id comes from:",
      ...overrideSources().map((source) => `- ${source}`),
    );
  }

  const me = await account
    .request<Me>({ url: "/users/me" })
    .catch((error: { statusCode?: number }) => {
      if (error.statusCode === 401) {
        stop(
          "Your Sanity sign-in has expired. Sign in again:",
          "  npx sanity logout",
          "  npx sanity login",
        );
      }
      throw error;
    });
  if (!me.id) stop("You aren't signed in to Sanity. Run: npx sanity login");
  const who = [me.name, me.email && `<${me.email}>`].filter(Boolean).join(" ");
  const method = PROVIDERS[me.provider ?? ""] ?? me.provider ?? "unknown";
  console.log(`Signed in as: ${who}`);
  console.log(`Account id: ${me.id}   Signed in with: ${method}`);

  /* Listing the project's datasets needs project access, so it settles
     whether this sign-in can import. */
  const datasets = await client.datasets.list().catch((error: ApiError) => {
    if (error.statusCode !== 401 && error.statusCode !== 403) throw error;
    return stop(
      `This sign-in can't open project ${projectId}. Sanity says: ${error.message}`,
      "",
      "Sanity keeps a separate account for each way of signing in (Google,",
      "GitHub, e-mail and password), even with the same name and email. If the",
      `members page at ${MANAGE}`,
      "lists you, your browser used another way. Sign in here the same way:",
      "  npx sanity logout",
      "  npx sanity login",
      `This terminal used: ${method}. Pick the other one your browser uses.`,
      "",
      "If the members page doesn't list you, have the project's owner add",
      `${me.email ?? "this account"} as an Administrator.`,
    );
  });

  /* The role, when the project shares its member list. */
  const project = await account
    .request<Project>({ url: `/projects/${projectId}` })
    .catch(() => undefined);
  const member = project?.members?.find(
    ({ id, isCurrentUser }) => isCurrentUser || id === me.id,
  );
  if (member?.role) console.log(`Role: ${member.role}`);
  if (member?.role === "viewer") {
    stop(
      `${who} can only view project ${projectId}, so it can't import or deploy.`,
      `Ask the project's owner to make this account an Administrator at ${MANAGE}`,
    );
  }

  if (!datasets.some(({ name }) => name === dataset)) {
    stop(
      `Project ${projectId} has no "${dataset}" dataset.`,
      `Create it: npx sanity datasets create ${dataset} --visibility public`,
    );
  }
  console.log("✓ Ready.\n");
}

main().catch((error: Error) =>
  stop(`Couldn't check the project: ${error.message}`),
);
