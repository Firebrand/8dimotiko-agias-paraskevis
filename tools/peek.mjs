// Prints raw Portable Text for one document so span text can be inspected exactly.
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const env = await readFile(resolve(ROOT, ".env.local"), "utf8").catch(() => "");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2026-09-01",
  useCdn: false,
});

const slug = process.argv[2];
const doc = await client.fetch(
  `*[(_type == "post" || _type == "page") && slug.current == $slug][0]{title, body}`,
  { slug },
);

for (const block of doc.body ?? []) {
  if (block._type !== "block") {
    console.log(`[${block._type}]`);
    continue;
  }
  const label = block.listItem ? `li(${block.listItem})` : block.style;
  for (const span of block.children ?? []) {
    console.log(`${label.padEnd(12)} marks=${(span.marks ?? []).join(",") || "-"}  ${JSON.stringify(span.text)}`);
  }
}
