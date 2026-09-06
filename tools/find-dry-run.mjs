// Finds dry-run documents containing a given block type, for spot checks.
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const docs = JSON.parse(await readFile(resolve(import.meta.dirname, "..", "wp-export", "_dry-run.json"), "utf8"));
const [wanted, limit = "3"] = process.argv.slice(2);

const matches = docs.filter((d) => (d.body ?? []).some((b) => b._type === wanted));
console.log(`${matches.length} documents contain "${wanted}"\n`);
for (const doc of matches.slice(0, Number(limit))) {
  console.log(`--- ${doc._id} | ${doc.title} | /${doc.slug?.current}`);
  for (const b of doc.body) {
    if (b._type === "block") console.log(`    text: ${(b.children ?? []).map((c) => c.text).join("").slice(0, 110)}`);
    else console.log(`    ${b._type}: ${JSON.stringify({ ...b, images: b.images?.length, rows: b.rows?.length }).slice(0, 220)}`);
  }
  console.log();
}
