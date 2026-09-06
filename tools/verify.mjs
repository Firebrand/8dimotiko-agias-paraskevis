// Sanity-side sanity check: confirms the migration produced what we expect.
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const envFile = await readFile(resolve(ROOT, ".env.local"), "utf8").catch(() => "");
for (const line of envFile.split("\n")) {
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

const result = await client.fetch(`{
  "counts": {
    "post": count(*[_type == "post"]),
    "page": count(*[_type == "page"]),
    "category": count(*[_type == "category"]),
    "staffMember": count(*[_type == "staffMember"]),
    "imageAssets": count(*[_type == "sanity.imageAsset"]),
    "fileAssets": count(*[_type == "sanity.fileAsset"])
  },
  "singletons": {
    "siteSettings": *[_id == "siteSettings"][0]{title, phone, email, address, "heroImages": count(heroImages), "quickLinks": count(quickLinks)},
    "navigation": *[_id == "navigation"][0]{"items": items[]{label, "slug": page->slug.current, href, "children": count(children)}},
    "announcement": *[_id == "announcement"][0]{enabled, tone}
  },
  "brokenImageRefs": count(*[_type in ["post","page"] && (
    count(body[_type == "figure" && !defined(asset)]) > 0
  )]),
  "postsMissingSlug": count(*[_type == "post" && !defined(slug.current)]),
  "duplicateSlugs": *[_type == "post"]{ "s": slug.current } | order(s asc),
  "eventsPage": *[_id == "page-scholikes-ekdiloseis"][0]{title, body},
  "latest": *[_type == "post"] | order(publishedAt desc)[0...5]{title, "slug": slug.current, publishedAt, "cover": defined(coverImage.asset)},
  "unresolvedAssets": count(*[_type in ["post","page"] && length(pt::text(body)) == 0 && count(body) == 0])
}`);

const slugs = result.duplicateSlugs.map((x) => x.s);
const dupes = slugs.filter((s, i) => s && slugs.indexOf(s) !== i);

console.log("COUNTS:", result.counts);
console.log("\nSITE SETTINGS:", result.singletons.siteSettings);
console.log("\nANNOUNCEMENT:", result.singletons.announcement);
console.log("\nNAVIGATION:");
for (const item of result.singletons.navigation.items ?? []) {
  console.log(`  ${item.label} -> ${item.slug ? "/" + item.slug : item.href}  (${item.children ?? 0} children)`);
}
console.log("\nposts missing slug:", result.postsMissingSlug);
console.log("duplicate post slugs:", dupes.length ? dupes : "none");
console.log("documents with figure blocks missing assets:", result.brokenImageRefs);
console.log("\nΣχολικές Εκδηλώσεις body:", JSON.stringify(result.eventsPage.body, null, 1).slice(0, 400));
console.log("\nLATEST POSTS:");
for (const p of result.latest) console.log(`  ${p.publishedAt.slice(0, 10)}  cover=${p.cover}  /nea/${p.slug}`);
