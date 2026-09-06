import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const OUT = resolve(import.meta.dirname, "..", "wp-export");
const pages = JSON.parse(await readFile(resolve(OUT, "pages.json"), "utf8"));
const ids = process.argv.slice(2).map(Number);

let dump = "";
for (const p of pages.filter((x) => ids.length === 0 || ids.includes(x.id))) {
  dump += `\n${"=".repeat(100)}\nid=${p.id} | ${p.title.rendered}\nlink: ${decodeURIComponent(p.link)}\n${"=".repeat(100)}\n`;
  dump += p.content.rendered + "\n";
}
const file = resolve(OUT, "_pages-dump.txt");
await writeFile(file, dump, "utf8");
console.log(`wrote ${dump.length} chars to ${file}`);
