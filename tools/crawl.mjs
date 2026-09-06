// Requests every route on the running server and reports failures, so nothing
// is broken on a page we never happened to open by hand.
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { legacyRedirects } from "../src/lib/legacy-redirects.ts";

const ROOT = resolve(import.meta.dirname, "..");
const env = await readFile(resolve(ROOT, ".env.local"), "utf8").catch(() => "");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}

const BASE = process.env.BASE_URL ?? "http://localhost:3001";
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-09-01",
  useCdn: false,
});

const { posts, pages, categories } = await client.fetch(`{
  "posts": *[_type == "post" && defined(slug.current)].slug.current,
  "pages": *[_type == "page" && defined(slug.current)].slug.current,
  "categories": *[_type == "category" && defined(slug.current)].slug.current
}`);

const routes = [
  "/",
  "/nea",
  "/nea?page=2",
  "/nea?page=24",
  "/anazitisi",
  "/api/search-index",
  "/robots.txt",
  "/sitemap.xml",
  "/studio",
  ...pages.map((s) => `/${s}`),
  ...categories.map((s) => `/nea/kategoria/${s}`),
  ...posts.map((s) => `/nea/${s}`),
];

const failures = [];
let done = 0;
const CONCURRENCY = 8;

async function visit(path) {
  try {
    const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
    const body = res.status === 200 ? await res.text() : "";
    if (res.status !== 200) {
      failures.push({ path, status: res.status });
    } else if (/Application error|__next_error__|Internal Server Error/.test(body)) {
      failures.push({ path, status: "render error" });
    } else if (res.headers.get("content-type")?.includes("text/html") && body.length < 3000) {
      failures.push({ path, status: `suspiciously short (${body.length})` });
    }
  } catch (err) {
    failures.push({ path, status: err.message });
  }
  process.stdout.write(`\r  crawled ${++done}/${routes.length}  failures=${failures.length}   `);
}

const queue = [...routes];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) await visit(queue.shift());
  }),
);
process.stdout.write("\n");

// Spot-check a sample of the generated legacy redirects.
const sample = legacyRedirects.filter((_, i) => i % 20 === 0);
let redirectFailures = 0;
for (const redirect of sample) {
  const res = await fetch(`${BASE}${encodeURI(redirect.source)}`, { redirect: "manual" });
  const location = res.headers.get("location");
  if (res.status !== 308 || decodeURIComponent(location ?? "") !== redirect.destination) {
    redirectFailures++;
    console.log(`  redirect FAIL ${redirect.source} -> got ${res.status} ${location}`);
  }
}
console.log(`Redirects checked: ${sample.length}, failures: ${redirectFailures}`);

if (failures.length) {
  console.log(`\n${failures.length} FAILURES:`);
  for (const f of failures.slice(0, 40)) console.log(`  ${f.status}  ${f.path}`);
} else {
  console.log("\nAll routes returned 200 with rendered content.");
}
