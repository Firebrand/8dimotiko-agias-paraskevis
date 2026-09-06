import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const OUT = resolve(import.meta.dirname, "..", "wp-export");
const load = async (n) => JSON.parse(await readFile(resolve(OUT, `${n}.json`), "utf8"));

const [posts, pages, cats, media] = await Promise.all(
  ["posts", "pages", "categories", "media"].map(load)
);

const decode = (s) =>
  s.replace(/&#(\d+);/g, (_, d) => String.fromCharCode(d))
   .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
   .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&laquo;|&raquo;/g, '"')
   .replace(/&#8211;|&#8212;/g, "-").trim();

console.log("=== CATEGORIES (count) ===");
for (const c of cats.sort((a, b) => b.count - a.count))
  console.log(`  ${String(c.count).padStart(4)}  id=${c.id}  ${decode(c.name)}  [${c.slug}]`);

console.log("\n=== PAGES ===");
for (const p of pages.sort((a, b) => a.id - b.id)) {
  const html = p.content.rendered;
  console.log(`\n--- id=${p.id} parent=${p.parent} template=${p.template || "-"} | ${decode(p.title.rendered)}`);
  console.log(`    link: ${decodeURIComponent(p.link)}`);
  console.log(`    html length: ${html.length}`);
  console.log(`    tags used: ${[...new Set([...html.matchAll(/<([a-z][a-z0-9]*)/gi)].map((m) => m[1].toLowerCase()))].join(", ")}`);
}

console.log("\n\n=== HTML TAG FREQUENCY ACROSS ALL POST CONTENT ===");
const tagFreq = {};
const classFreq = {};
for (const p of posts) {
  for (const m of p.content.rendered.matchAll(/<([a-z][a-z0-9]*)/gi))
    tagFreq[m[1].toLowerCase()] = (tagFreq[m[1].toLowerCase()] ?? 0) + 1;
  for (const m of p.content.rendered.matchAll(/class="([^"]+)"/g))
    for (const c of m[1].split(/\s+/)) classFreq[c] = (classFreq[c] ?? 0) + 1;
}
console.log(Object.entries(tagFreq).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join("  "));
console.log("\n=== CLASS FREQUENCY ===");
console.log(Object.entries(classFreq).sort((a, b) => b[1] - a[1]).slice(0, 40).map(([k, v]) => `${k}:${v}`).join("  "));

console.log("\n=== MEDIA MIME TYPES ===");
const mimes = {};
for (const m of media) mimes[m.mime_type] = (mimes[m.mime_type] ?? 0) + 1;
console.log(mimes);

console.log("\n=== POSTS WITH FEATURED IMAGE ===");
console.log(posts.filter((p) => p.featured_media).length, "of", posts.length);

console.log("\n=== DATE RANGE ===");
const dates = posts.map((p) => p.date).sort();
console.log(dates[0], "->", dates.at(-1));

console.log("\n=== SAMPLE POST HTML (most images) ===");
const richest = posts.slice().sort(
  (a, b) => (b.content.rendered.match(/<img/g) ?? []).length - (a.content.rendered.match(/<img/g) ?? []).length
)[0];
console.log(decode(richest.title.rendered), "| imgs:", (richest.content.rendered.match(/<img/g) ?? []).length);
console.log(richest.content.rendered.slice(0, 3000));
