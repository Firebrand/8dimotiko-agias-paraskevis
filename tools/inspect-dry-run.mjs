// Renders the dry-run Portable Text back to readable text so the conversion
// can be eyeballed against the original site.
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const docs = JSON.parse(await readFile(resolve(import.meta.dirname, "..", "wp-export", "_dry-run.json"), "utf8"));

const byType = {};
for (const d of docs) byType[d._type] = (byType[d._type] ?? 0) + 1;
console.log("DOCUMENT COUNTS:", byType);

const blockTypes = {};
for (const d of docs)
  for (const b of d.body ?? []) {
    blockTypes[b._type] = (blockTypes[b._type] ?? 0) + 1;
    if (b._type === "block") {
      const style = b.listItem ? `list:${b.listItem}` : `style:${b.style}`;
      blockTypes[style] = (blockTypes[style] ?? 0) + 1;
    }
  }
console.log("BLOCK TYPES IN BODIES:", blockTypes);

const posts = docs.filter((d) => d._type === "post");
console.log("\nposts with cover:", posts.filter((p) => p.coverImage).length, "/", posts.length);
console.log("posts with empty body:", posts.filter((p) => !p.body?.length).length);
console.log("posts with no excerpt:", posts.filter((p) => !p.excerpt).length);
console.log("posts with categories:", posts.filter((p) => p.categories?.length).length);

const render = (blocks = []) =>
  blocks
    .map((b) => {
      if (b._type === "block") {
        const text = (b.children ?? []).map((c) => `${c.marks?.length ? `[${c.marks.join(",")}]` : ""}${c.text}`).join("");
        const prefix = b.listItem ? "  • " : b.style !== "normal" ? `<${b.style}> ` : "";
        return prefix + text;
      }
      if (b._type === "figure") return `[IMAGE${b.alt ? ` alt="${b.alt}"` : ""}${b.caption ? ` caption="${b.caption}"` : ""}]`;
      if (b._type === "gallery") return `[GALLERY ${b.images?.length} images]`;
      if (b._type === "fileAttachment") return `[FILE "${b.title}"]`;
      if (b._type === "dataTable")
        return `[TABLE header=${b.hasHeaderRow}]\n` + (b.rows ?? []).map((r) => "   | " + r.cells.join(" | ")).join("\n");
      if (b._type === "videoEmbed") return `[VIDEO ${b.url ?? "file"}]`;
      if (b._type === "audioEmbed") return `[AUDIO ${b.title ?? ""}]`;
      return `[${b._type}]`;
    })
    .join("\n");

const show = (doc, label) => {
  console.log(`\n${"=".repeat(90)}\n${label}: ${doc.title}  (${doc._id})`);
  console.log(`slug: ${doc.slug?.current}   legacy: ${doc.legacyPath ?? "-"}`);
  if (doc.excerpt) console.log(`excerpt: ${doc.excerpt}`);
  if (doc.coverImage) console.log(`cover: yes`);
  console.log("-".repeat(90));
  console.log(render(doc.body));
};

for (const id of process.argv.slice(2)) {
  const doc = docs.find((d) => d._id === id || d.slug?.current === id);
  if (doc) show(doc, doc._type);
  else console.log(`not found: ${id}`);
}

if (process.argv.length <= 2) {
  console.log("\n\n########## PAGES ##########");
  for (const doc of docs.filter((d) => d._type === "page")) show(doc, "page");
}
