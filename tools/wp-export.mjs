// One-off exporter: pulls every post, page, category and media item from the
// legacy WordPress site into ./wp-export so the Sanity migration can run offline.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const WP = "https://www.8dimotikoagp.gr/wp-json/wp/v2";
const OUT = resolve(import.meta.dirname, "..", "wp-export");

async function getJSON(url, tries = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "content-migration/1.0" } });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return { body: await res.json(), headers: res.headers };
    } catch (err) {
      if (attempt >= tries) throw new Error(`GET ${url} failed: ${err.message}`);
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
}

async function collection(name, extra = "") {
  const all = [];
  for (let page = 1; ; page++) {
    const { body, headers } = await getJSON(`${WP}/${name}?per_page=100&page=${page}${extra}`);
    all.push(...body);
    const totalPages = Number(headers.get("x-wp-totalpages") ?? 1);
    process.stdout.write(`\r  ${name}: ${all.length} (page ${page}/${totalPages})   `);
    if (page >= totalPages) break;
  }
  process.stdout.write("\n");
  return all;
}

async function save(name, data) {
  const file = resolve(OUT, `${name}.json`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

for (const [name, extra] of [
  ["posts", "&_embed=wp:featuredmedia,wp:term&orderby=date&order=desc"],
  ["pages", "&_embed=wp:featuredmedia"],
  ["categories", ""],
  ["tags", ""],
  ["media", ""],
]) {
  const data = await collection(name, extra);
  await save(name, data);
}

const { body: menus } = await getJSON("https://www.8dimotikoagp.gr/wp-json").catch(() => ({ body: null }));
if (menus) await save("root", menus);

console.log(`\nExport written to ${OUT}`);
