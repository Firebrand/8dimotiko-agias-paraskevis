// Converts the legacy WordPress (Gutenberg) HTML into Portable Text that matches
// the Sanity schema in src/sanity/schemaTypes.
import * as cheerio from "cheerio";

const HEADING_STYLE = { h1: "h2", h2: "h2", h3: "h3", h4: "h4", h5: "h4", h6: "h4" };
const INLINE_MARK = { strong: "strong", b: "strong", em: "em", i: "em", u: "underline", ins: "underline" };
const SKIP_TAGS = new Set(["script", "style", "noscript", "link", "meta"]);
const TRANSPARENT_INLINE = new Set(["span", "font", "small", "abbr", "sup", "sub", "code", "mark", "cite", "s", "strike", "del", "big"]);

let counter = 0;
const key = () => `k${(counter++).toString(36)}`;

/** Collapses runs of whitespace but keeps explicit newlines from <br>. */
const tidy = (text) => text.replace(/\u00a0/g, " ").replace(/[ \t\r\f]+/g, " ").replace(/ *\n */g, "\n");

const classList = (node) => String(node.attribs?.class ?? "");
const hasClass = (node, name) => classList(node).split(/\s+/).includes(name);
const classStartsWith = (node, prefix) => classList(node).split(/\s+/).some((c) => c.startsWith(prefix));

function sameMarks(a, b) {
  return a.length === b.length && a.every((m, i) => m === b[i]);
}

/** Serialises an element's descendants into Portable Text spans + markDefs. */
function collectSpans($, node, { marks = [], spans = [], markDefs = [] } = {}) {
  for (const child of node.children ?? []) {
    if (child.type === "text") {
      pushSpan(spans, tidy(child.data ?? ""), marks);
      continue;
    }
    if (child.type === "comment" || child.type !== "tag") continue;

    const tag = child.name;
    if (SKIP_TAGS.has(tag)) continue;

    if (tag === "br") {
      pushSpan(spans, "\n", marks, { force: true });
      continue;
    }
    if (INLINE_MARK[tag]) {
      collectSpans($, child, { marks: [...marks, INLINE_MARK[tag]], spans, markDefs });
      continue;
    }
    if (tag === "a") {
      const href = (child.attribs?.href ?? "").trim();
      if (!href) {
        collectSpans($, child, { marks, spans, markDefs });
        continue;
      }
      const defKey = key();
      markDefs.push({ _type: "link", _key: defKey, href });
      collectSpans($, child, { marks: [...marks, defKey], spans, markDefs });
      continue;
    }
    // Everything else (spans, divs, nested paragraphs) contributes its text.
    collectSpans($, child, { marks, spans, markDefs });
    if (!TRANSPARENT_INLINE.has(tag)) pushSpan(spans, "\n", marks, { force: true });
  }
  return { spans, markDefs };
}

function pushSpan(spans, text, marks, { force = false } = {}) {
  if (!text || (!force && !text.trim() && spans.length === 0)) return;
  const last = spans.at(-1);
  if (last && sameMarks(last.marks, marks)) {
    last.text += text;
    return;
  }
  spans.push({ _type: "span", _key: key(), text, marks: [...marks] });
}

function textBlock($, node, style = "normal", listItem) {
  const { spans, markDefs } = collectSpans($, node);
  // Trim leading/trailing whitespace across the span sequence.
  while (spans.length && !spans[0].text.trim()) spans.shift();
  while (spans.length && !spans.at(-1).text.trim()) spans.pop();
  if (spans.length) {
    spans[0].text = spans[0].text.replace(/^[\s\n]+/, "");
    spans.at(-1).text = spans.at(-1).text.replace(/[\s\n]+$/, "");
  }
  const used = new Set(spans.flatMap((s) => s.marks));
  const block = {
    _type: "block",
    _key: key(),
    style,
    markDefs: markDefs.filter((d) => used.has(d._key)),
    children: spans,
  };
  if (listItem) {
    block.listItem = listItem;
    block.level = 1;
  }
  return spans.some((s) => s.text.trim()) ? block : null;
}

function firstImage($, node) {
  const img = $(node).find("img").first();
  return img.length ? img.get(0) : null;
}

/** Picks the largest candidate from a WordPress srcset, falling back to src. */
function bestImageUrl(img) {
  const src = img.attribs?.src ?? "";
  const srcset = img.attribs?.srcset ?? "";
  if (!srcset) return src;
  const best = srcset
    .split(",")
    .map((part) => part.trim().split(/\s+/))
    .map(([url, size]) => ({ url, width: Number.parseInt(size ?? "0", 10) || 0 }))
    .filter((c) => c.url)
    .sort((a, b) => b.width - a.width)[0];
  return best?.url ?? src;
}

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|avif|svg)(\?|$)/i;
const isImageUrl = (url) => IMAGE_EXTENSIONS.test(decodeURIComponent(url ?? ""));

async function imageBlock($, img, ctx, captionNode) {
  const asset = await ctx.resolveImage(bestImageUrl(img));
  if (!asset) return null;
  const caption = captionNode ? tidy($(captionNode).text()).trim() : "";
  const alt = tidy(img.attribs?.alt ?? "").trim();
  return {
    _type: "figure",
    _key: key(),
    asset: { _type: "reference", _ref: asset },
    ...(alt ? { alt } : {}),
    ...(caption ? { caption } : {}),
  };
}

async function galleryBlock($, node, ctx) {
  const images = [];
  for (const img of $(node).find("img").toArray()) {
    const figure = await imageBlock($, img, ctx);
    if (figure) images.push(figure);
  }
  if (!images.length) return null;
  if (images.length === 1) return images[0];
  return { _type: "gallery", _key: key(), images };
}

async function fileBlock($, node, ctx, { titleFallback } = {}) {
  const anchors = $(node).find("a[href]").toArray();
  const href = anchors.map((a) => a.attribs.href).find((h) => /\/wp-content\/uploads\//.test(h)) ?? anchors[0]?.attribs?.href;
  if (!href) return null;
  const asset = await ctx.resolveFile(href);
  if (!asset) return null;
  const label = anchors
    .map((a) => tidy($(a).text()).trim())
    .find((t) => t && !/^(download|λήψη)$/i.test(t));
  return {
    _type: "fileAttachment",
    _key: key(),
    title: label || titleFallback || decodeURIComponent(href.split("/").pop() ?? "Αρχείο"),
    file: { _type: "file", asset: { _type: "reference", _ref: asset } },
  };
}

function tableBlock($, node) {
  const table = node.name === "table" ? node : $(node).find("table").get(0);
  if (!table) return null;
  const rows = $(table)
    .find("tr")
    .toArray()
    .map((tr) => ({
      _type: "row",
      _key: key(),
      cells: $(tr)
        .find("th,td")
        .toArray()
        .map((cell) => tidy($(cell).text()).trim()),
    }))
    .filter((row) => row.cells.some((c) => c));
  if (!rows.length) return null;
  const caption = tidy($(node).find("figcaption").first().text()).trim();
  const headerish = rows[0].cells.every((c) => c === c.toUpperCase() && c.length > 0);
  return {
    _type: "dataTable",
    _key: key(),
    ...(caption ? { caption } : {}),
    hasHeaderRow: headerish || $(table).find("th").length > 0,
    rows,
  };
}

/** Figcaptions are sometimes whole paragraphs; keep only a headline-sized part. */
function shortTitle(text, max = 110) {
  const clean = tidy(text).trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(", "), cut.lastIndexOf(" "));
  return `${cut.slice(0, stop > max * 0.4 ? stop : max).replace(/[,.\s]+$/, "")}…`;
}

async function videoBlock($, node, ctx) {
  const video = node.name === "video" ? node : $(node).find("video").get(0);
  const iframe = $(node).find("iframe").get(0);
  const title = shortTitle($(node).find("figcaption").first().text());

  if (video) {
    const src = video.attribs?.src ?? $(video).find("source").first().attr("src") ?? "";
    const asset = src ? await ctx.resolveFile(src) : null;
    if (!asset) return null;
    return {
      _type: "videoEmbed",
      _key: key(),
      ...(title ? { title } : {}),
      file: { _type: "file", asset: { _type: "reference", _ref: asset } },
    };
  }
  const url = iframe?.attribs?.src ?? tidy($(node).find(".wp-block-embed__wrapper").text()).trim();
  if (!url || !/^https?:\/\//.test(url)) return null;
  return { _type: "videoEmbed", _key: key(), ...(title ? { title } : {}), url };
}

async function audioBlock($, node, ctx) {
  const audio = node.name === "audio" ? node : $(node).find("audio").get(0);
  const src = audio?.attribs?.src ?? $(audio ?? node).find("source").first().attr("src") ?? "";
  const asset = src ? await ctx.resolveFile(src) : null;
  if (!asset) return null;
  const title = shortTitle($(node).find("figcaption").first().text());
  return {
    _type: "audioEmbed",
    _key: key(),
    ...(title ? { title } : {}),
    file: { _type: "file", asset: { _type: "reference", _ref: asset } },
  };
}

/** PDF embedder plugin blocks — reduce to a normal download block. */
async function pdfEmbedBlock($, node, ctx) {
  const src =
    $(node).find("[data-pdf-src]").attr("data-pdf-src") ??
    $(node).attr("data-pdf-src") ??
    $(node).find("object[data]").attr("data") ??
    $(node).find("a[href$='.pdf']").attr("href");
  if (!src) return null;
  const asset = await ctx.resolveFile(src);
  if (!asset) return null;
  return {
    _type: "fileAttachment",
    _key: key(),
    title: decodeURIComponent((src.split("/").pop() ?? "").replace(/\.pdf$/i, "")) || "Έγγραφο PDF",
    file: { _type: "file", asset: { _type: "reference", _ref: asset } },
  };
}

async function nodeToBlocks($, node, ctx, style = "normal") {
  if (node.type === "text") {
    return tidy(node.data ?? "").trim() ? [textBlock($, { children: [node] }, style)] : [];
  }
  if (node.type !== "tag" || SKIP_TAGS.has(node.name)) return [];

  const tag = node.name;
  const out = [];
  const add = (block) => block && out.push(block);

  // --- Gutenberg block wrappers, matched most-specific first ---
  if (hasClass(node, "wp-block-gallery")) {
    add(await galleryBlock($, node, ctx));
    return out;
  }
  if (hasClass(node, "wp-block-file")) {
    add(await fileBlock($, node, ctx));
    return out;
  }
  if (classStartsWith(node, "wp-block-pdfemb") || hasClass(node, "pdfemb-viewer")) {
    add(await pdfEmbedBlock($, node, ctx));
    return out;
  }
  if (hasClass(node, "wp-block-video") || tag === "video") {
    add(await videoBlock($, node, ctx));
    return out;
  }
  if (hasClass(node, "wp-block-audio") || tag === "audio") {
    add(await audioBlock($, node, ctx));
    return out;
  }
  if (hasClass(node, "wp-block-embed") || tag === "iframe") {
    add(await videoBlock($, node, ctx));
    return out;
  }
  if (hasClass(node, "wp-block-table") || tag === "table") {
    add(tableBlock($, node));
    return out;
  }
  if (hasClass(node, "wp-block-image") || (tag === "figure" && firstImage($, node))) {
    const img = firstImage($, node);
    if (!img) return out;
    // The legacy site occasionally pointed an <img> at a PDF; serve it as a download.
    if (!isImageUrl(bestImageUrl(img))) {
      const asset = await ctx.resolveFile(bestImageUrl(img));
      if (asset) {
        const filename = decodeURIComponent((bestImageUrl(img).split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, ""));
        add({
          _type: "fileAttachment",
          _key: key(),
          title: tidy(img.attribs?.alt ?? "").trim() || filename || "Αρχείο",
          file: { _type: "file", asset: { _type: "reference", _ref: asset } },
        });
      }
      return out;
    }
    add(await imageBlock($, img, ctx, $(node).find("figcaption").get(0)));
    return out;
  }
  // Media+text and cover blocks: emit the image, then the copy beside it.
  if (hasClass(node, "wp-block-media-text") || hasClass(node, "wp-block-cover")) {
    const img = firstImage($, node);
    if (img) add(await imageBlock($, img, ctx));
    const content = $(node).find(".wp-block-media-text__content, .wp-block-cover__inner-container").get(0);
    for (const child of (content ?? node).children ?? []) {
      if (child.type === "tag" && $(child).find("img").length && firstImage($, child) === img) continue;
      out.push(...(await nodeToBlocks($, child, ctx, style)));
    }
    return out;
  }

  // --- Plain HTML ---
  if (tag === "hr") return out;

  if (HEADING_STYLE[tag]) {
    add(textBlock($, node, HEADING_STYLE[tag]));
    return out;
  }
  if (tag === "blockquote") {
    for (const child of node.children ?? []) out.push(...(await nodeToBlocks($, child, ctx, "blockquote")));
    if (!out.length) add(textBlock($, node, "blockquote"));
    return out;
  }
  if (tag === "ul" || tag === "ol") {
    const listItem = tag === "ul" ? "bullet" : "number";
    for (const li of $(node).children("li").toArray()) {
      // A list item may itself contain images or files.
      const media = $(li).find("img, .wp-block-file").length;
      add(textBlock($, li, "normal", listItem));
      if (media) {
        for (const child of li.children ?? []) {
          if (child.type === "tag" && (child.name === "figure" || hasClass(child, "wp-block-file"))) {
            out.push(...(await nodeToBlocks($, child, ctx, style)));
          }
        }
      }
    }
    return out;
  }
  if (tag === "p" || tag === "pre") {
    const img = firstImage($, node);
    if (img && !tidy($(node).text()).trim()) {
      add(await imageBlock($, img, ctx));
      return out;
    }
    add(textBlock($, node, style));
    return out;
  }

  // Generic containers: recurse when they hold block-level children,
  // otherwise treat them as a paragraph (e.g. the legacy `.white-box` div).
  const blockChildren = (node.children ?? []).filter(
    (c) => c.type === "tag" && !["a", "br", "strong", "b", "em", "i", "u", "span", "sup", "sub", "font", "img"].includes(c.name),
  );
  if (blockChildren.length) {
    for (const child of node.children ?? []) out.push(...(await nodeToBlocks($, child, ctx, style)));
    return out;
  }
  const img = firstImage($, node);
  if (img) {
    add(await imageBlock($, img, ctx));
    return out;
  }
  add(textBlock($, node, style));
  return out;
}

/** Runs of 2+ standalone images read much better as a single gallery. */
function groupImageRuns(blocks) {
  const out = [];
  let run = [];
  const flush = () => {
    if (run.length >= 2) out.push({ _type: "gallery", _key: key(), images: run });
    else out.push(...run);
    run = [];
  };
  for (const block of blocks) {
    if (block._type === "figure" && !block.caption) run.push(block);
    else {
      flush();
      out.push(block);
    }
  }
  flush();
  return out;
}

export async function htmlToPortableText(html, ctx) {
  if (!html || !html.trim()) return [];
  const $ = cheerio.load(html, null, false);
  const blocks = [];
  for (const node of $.root().contents().toArray()) {
    blocks.push(...(await nodeToBlocks($, node, ctx)));
  }
  return groupImageRuns(blocks.filter(Boolean));
}

/** Plain-text rendition used for excerpts and the search index. */
export function htmlToPlainText(html) {
  if (!html) return "";
  const $ = cheerio.load(html, null, false);
  $("script, style, figcaption").remove();
  return tidy($.root().text()).replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
}
