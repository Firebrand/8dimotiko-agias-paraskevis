// Pulls a rendered page from the dev server and prints the article text so the
// Portable Text output can be compared against the legacy site.
import * as cheerio from "cheerio";

const base = process.env.BASE_URL ?? "http://localhost:3001";

for (const path of process.argv.slice(2)) {
  const res = await fetch(`${base}${path}`);
  const $ = cheerio.load(await res.text());
  console.log(`\n${"=".repeat(90)}\n${path}  [${res.status}]`);
  console.log(`h1: ${$("h1").first().text().trim()}`);

  const rich = $(".rich-text").first();
  console.log(`blocks: ${rich.children().length}`);
  rich.children().each((_, el) => {
    const node = $(el);
    const tag = el.tagName;
    if (tag === "figure") {
      const imgs = node.find("img").length;
      const table = node.find("table").length;
      const audio = node.find("audio").length;
      const video = node.find("video, iframe").length;
      console.log(`  <figure> imgs=${imgs} table=${table} audio=${audio} video=${video} ${node.find("button").length ? `lightbox-buttons=${node.find("button").length}` : ""}`);
      if (table) {
        console.log(`     header: ${node.find("thead th").map((_, th) => $(th).text().trim()).get().join(" | ")}`);
        console.log(`     rows: ${node.find("tbody tr").length}`);
      }
    } else if (tag === "a") {
      console.log(`  <a download> "${node.find("span").first().text().trim()}" -> ${node.attr("href")?.slice(0, 70)}`);
    } else {
      const text = node.text().replace(/\s+\n/g, "\n").trim();
      const lines = text.split("\n");
      console.log(`  <${tag}> ${lines.length} line(s): ${JSON.stringify(text.slice(0, 150))}`);
    }
  });
}
