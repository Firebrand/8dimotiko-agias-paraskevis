// Creates a Sanity editor token and writes it straight to .env.local.
// The secret is never printed to stdout
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const run = promisify(execFile);
const ROOT = resolve(import.meta.dirname, "..");
const PROJECT_ID = "dt6i1qpo";
const DATASET = "production";

const { stdout } = await run(
  "npx",
  ["sanity", "tokens", "create", "content-migration-and-drafts", "--role=editor", "--project-id", PROJECT_ID, "--yes", "--json"],
  { shell: true, maxBuffer: 1 << 24 }
);

const json = JSON.parse(stdout.slice(stdout.indexOf("{"), stdout.lastIndexOf("}") + 1));
const token = json.key ?? json.token ?? json.value;
if (!token) throw new Error(`Could not find token in CLI output keys: ${Object.keys(json)}`);

const envLocal = [
  "# Sanity — local development secrets. Not committed.",
  `NEXT_PUBLIC_SANITY_PROJECT_ID=${PROJECT_ID}`,
  `NEXT_PUBLIC_SANITY_DATASET=${DATASET}`,
  "NEXT_PUBLIC_SANITY_API_VERSION=2026-09-01",
  "",
  "# Editor token: used by the migration script and for draft previews.",
  `SANITY_API_TOKEN=${token}`,
  "",
].join("\n");

await writeFile(resolve(ROOT, ".env.local"), envLocal, "utf8");

const example = [
  "# Copy to .env.local and fill in. Public values are safe to commit.",
  `NEXT_PUBLIC_SANITY_PROJECT_ID=${PROJECT_ID}`,
  `NEXT_PUBLIC_SANITY_DATASET=${DATASET}`,
  "NEXT_PUBLIC_SANITY_API_VERSION=2026-09-01",
  "",
  "# Editor-role token from https://sanity.io/manage -> API -> Tokens.",
  "# Required for the WordPress migration script and Studio draft previews.",
  "SANITY_API_TOKEN=",
  "",
].join("\n");
await writeFile(resolve(ROOT, ".env.example"), example, "utf8");

const gitignore = await readFile(resolve(ROOT, ".gitignore"), "utf8");
console.log(`Wrote .env.local (token length ${token.length}) and .env.example`);
console.log(`.gitignore covers .env*: ${/^\.env\*?/m.test(gitignore) || gitignore.includes(".env")}`);
