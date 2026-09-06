import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { categoriesQuery, categoryQuery, postsPageQuery } from "../src/sanity/queries.ts";

const ROOT = resolve(import.meta.dirname, "..");
const env = await readFile(resolve(ROOT, ".env.local"), "utf8").catch(() => "");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-09-01",
  useCdn: false,
});

for (const slug of ["genika", "politismos", "ekpaideftiki-tileorasi", "anakoinoseis"]) {
  try {
    const cat = await client.fetch(categoryQuery, { slug });
    const list = await client.fetch(postsPageQuery, { from: 0, to: 12, category: slug });
    console.log(`${slug.padEnd(26)} category=${cat ? "ok" : "MISSING"}  posts=${list.posts.length}  total=${list.total}`);
  } catch (err) {
    console.log(`${slug.padEnd(26)} ERROR: ${err.message}`);
  }
}

try {
  const cats = await client.fetch(categoriesQuery);
  console.log(`\ncategoriesQuery -> ${cats.length} categories`);
} catch (err) {
  console.log(`\ncategoriesQuery ERROR: ${err.message}`);
}
