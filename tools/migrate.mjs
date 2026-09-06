// Migrates the legacy WordPress export into Sanity.
//
//   npm run migrate            # full run (assets are cached between runs)
//   npm run migrate -- --dry   # convert everything, write nothing
//
// Safe to re-run: every document uses a deterministic id and createOrReplace.
import { createClient } from "@sanity/client";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { AssetMirror } from "./lib/assets.mjs";
import { htmlToPlainText, htmlToPortableText } from "./lib/html-to-portable-text.mjs";
import { createSlugger, slugify } from "./lib/greeklish.mjs";
import {
  CATEGORY_ACCENTS,
  HERO_IMAGE_URL,
  NAVIGATION,
  PAGES,
  QUICK_LINKS,
  SCHOOL,
  SKIPPED_WP_PAGES,
  STAFF,
} from "./lib/site-content.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const EXPORT_DIR = resolve(ROOT, "wp-export");
const DRY_RUN = process.argv.includes("--dry");

// ---------------------------------------------------------------- environment
const envFile = await readFile(resolve(ROOT, ".env.local"), "utf8").catch(() => "");
for (const line of envFile.split("\n")) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !dataset) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET");
if (!token && !DRY_RUN) throw new Error("Missing SANITY_API_TOKEN (needed to write documents)");

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-09-01",
  useCdn: false,
});

// ---------------------------------------------------------------------- input
const load = async (name) => JSON.parse(await readFile(resolve(EXPORT_DIR, `${name}.json`), "utf8"));
const [wpPosts, wpPages, wpCategories, wpMedia] = await Promise.all(
  ["posts", "pages", "categories", "media"].map(load),
);

console.log(`Loaded ${wpPosts.length} posts, ${wpPages.length} pages, ${wpMedia.length} media items`);

const mirror = new AssetMirror({
  client,
  mediaItems: wpMedia,
  cachePath: resolve(EXPORT_DIR, "_asset-cache.json"),
  log: (msg) => process.env.VERBOSE && console.log(msg),
});
await mirror.load();

const ctx = DRY_RUN
  ? { resolveImage: async () => "image-dry-run", resolveFile: async () => "file-dry-run" }
  : {
      resolveImage: (url) => mirror.resolveImage(url),
      resolveFile: (url) => mirror.resolveFile(url),
    };

// -------------------------------------------------------------------- helpers
const ENTITIES = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#039;": "'", "&#39;": "'",
  "&nbsp;": " ", "&hellip;": "…", "&laquo;": "«", "&raquo;": "»", "&ndash;": "–",
  "&mdash;": "—", "&rsquo;": "’", "&lsquo;": "‘", "&ldquo;": "“", "&rdquo;": "”",
};

function decodeEntities(input) {
  return String(input ?? "")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(Number.parseInt(h, 16)))
    .replace(/&[a-z]+;|&#0?39;/gi, (m) => ENTITIES[m.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

/** Path of a WordPress permalink, decoded and without the trailing slash. */
function legacyPath(link) {
  try {
    const path = decodeURIComponent(new URL(link).pathname);
    return path.length > 1 ? path.replace(/\/$/, "") : path;
  } catch {
    return null;
  }
}

function buildExcerpt(html, limit = 200) {
  const text = htmlToPlainText(html);
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("; "));
  if (stop > limit * 0.5) return cut.slice(0, stop + 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/**
 * Promotes the first image of a post to its cover image and removes it from the
 * body, so the article does not open with the same photo twice.
 */
function extractCover(blocks) {
  const first = blocks[0];
  if (!first) return { cover: null, body: blocks };

  if (first._type === "figure") {
    return { cover: first, body: blocks.slice(1) };
  }
  if (first._type === "gallery" && Array.isArray(first.images) && first.images.length > 1) {
    const [cover, ...rest] = first.images;
    const remainder =
      rest.length === 1 ? rest[0] : { ...first, images: rest };
    return { cover, body: [remainder, ...blocks.slice(1)] };
  }
  return { cover: null, body: blocks };
}

const documents = [];
const redirects = [];
const addRedirect = (source, destination) => {
  if (source && source !== destination) redirects.push({ source, destination, permanent: true });
};

// ----------------------------------------------------------------- categories
const categorySlugger = createSlugger();
const categoryIdByWpId = new Map();

for (const wpCategory of wpCategories.filter((c) => c.count > 0)) {
  const title = decodeEntities(wpCategory.name);
  const slug = categorySlugger(title, `category-${wpCategory.id}`);
  const _id = `category-${wpCategory.id}`;
  categoryIdByWpId.set(wpCategory.id, _id);
  documents.push({
    _id,
    _type: "category",
    title,
    slug: { _type: "slug", current: slug },
    accent: CATEGORY_ACCENTS[wpCategory.slug] ?? CATEGORY_ACCENTS[decodeURIComponent(wpCategory.slug)] ?? "blue",
    ...(wpCategory.description ? { description: decodeEntities(wpCategory.description) } : {}),
  });
  addRedirect(`/category/${decodeURIComponent(wpCategory.slug)}`, `/nea/kategoria/${slug}`);
}
console.log(`Prepared ${categoryIdByWpId.size} categories`);

// ---------------------------------------------------------------------- pages
const pageIdBySlug = new Map();
const wpPageById = new Map(wpPages.map((p) => [p.id, p]));

for (const spec of PAGES) {
  const source = spec.wp ? wpPageById.get(spec.wp) : null;
  const _id = `page-${spec.slug}`;
  pageIdBySlug.set(spec.slug, _id);

  const html = spec.dropBody ? "" : (source?.content?.rendered ?? "");
  const blocks = await htmlToPortableText(html, ctx);
  const { cover, body } = spec.isSection ? { cover: null, body: blocks } : extractCover(blocks);

  documents.push({
    _id,
    _type: "page",
    title: spec.title,
    slug: { _type: "slug", current: spec.slug },
    ...(spec.subtitle ? { subtitle: spec.subtitle } : {}),
    ...(cover ? { coverImage: cover } : {}),
    ...(body.length ? { body } : {}),
    ...(spec.showStaffDirectory ? { showStaffDirectory: true } : {}),
    ...(spec.showContactDetails ? { showContactDetails: true } : {}),
    ...(source ? { legacyPath: legacyPath(source.link) } : {}),
  });

  if (source) addRedirect(legacyPath(source.link), `/${spec.slug}`);
  process.stdout.write(`\r  pages: ${pageIdBySlug.size}/${PAGES.length}   `);
}
process.stdout.write("\n");

for (const [wpId, reason] of SKIPPED_WP_PAGES) {
  const source = wpPageById.get(wpId);
  if (source) console.log(`  skipped page ${wpId} (${reason})`);
}

// ---------------------------------------------------------------------- posts
const postSlugger = createSlugger();
const postIdByWpId = new Map();
let postIndex = 0;

for (const wpPost of [...wpPosts].sort((a, b) => a.date.localeCompare(b.date))) {
  const title = decodeEntities(wpPost.title.rendered) || "Χωρίς τίτλο";
  const html = wpPost.content.rendered ?? "";
  const blocks = await htmlToPortableText(html, ctx);
  const { cover, body } = extractCover(blocks);
  const slug = postSlugger(title, `nea-${wpPost.id}`);
  const _id = `post-${wpPost.id}`;
  postIdByWpId.set(wpPost.id, _id);

  const categories = (wpPost.categories ?? [])
    .map((id) => categoryIdByWpId.get(id))
    .filter(Boolean)
    .map((ref) => ({ _type: "reference", _key: `cat-${ref}`, _ref: ref }));

  documents.push({
    _id,
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    publishedAt: new Date(`${wpPost.date}Z`).toISOString(),
    excerpt: buildExcerpt(html),
    ...(cover ? { coverImage: cover } : {}),
    ...(body.length ? { body } : {}),
    ...(categories.length ? { categories } : {}),
    legacyPath: legacyPath(wpPost.link),
  });

  addRedirect(legacyPath(wpPost.link), `/nea/${slug}`);
  process.stdout.write(`\r  posts: ${++postIndex}/${wpPosts.length}  assets uploaded=${mirror.stats.uploaded} cached=${mirror.stats.cached} failed=${mirror.stats.failed}   `);
  if (postIndex % 25 === 0 && !DRY_RUN) await mirror.save();
}
process.stdout.write("\n");
if (!DRY_RUN) await mirror.save();

// Mark the three most recent posts as featured for the home page hero rail.
for (const doc of documents
  .filter((d) => d._type === "post")
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  .slice(0, 3)) {
  doc.featured = true;
}

// ---------------------------------------------------------------------- staff
STAFF.forEach((member, index) => {
  documents.push({
    _id: `staff-${slugify(member.name) || index}`,
    _type: "staffMember",
    name: member.name,
    section: member.section,
    ...(member.role ? { role: member.role } : {}),
    ...(member.contactHours ? { contactHours: member.contactHours } : {}),
    order: index,
  });
});
console.log(`Prepared ${STAFF.length} staff members`);

// ----------------------------------------------------------------- singletons
const heroAsset = await ctx.resolveImage(HERO_IMAGE_URL);
const mapQuery = encodeURIComponent(SCHOOL.mapQuery);

documents.push({
  _id: "siteSettings",
  _type: "siteSettings",
  title: SCHOOL.title,
  shortTitle: SCHOOL.shortTitle,
  description: SCHOOL.description,
  heroTitle: SCHOOL.heroTitle,
  heroText: SCHOOL.heroText,
  ...(heroAsset
    ? {
        heroImages: [
          {
            _type: "figure",
            _key: "hero-1",
            asset: { _type: "reference", _ref: heroAsset },
            alt: "Το κτίριο του 8ου Δημοτικού Σχολείου Αγίας Παρασκευής",
          },
        ],
      }
    : {}),
  highlights: SCHOOL.highlights.map((h, i) => ({ ...h, _type: "highlight", _key: `hl-${i}` })),
  quickLinks: QUICK_LINKS.map((link, i) => ({ ...link, _type: "quickLink", _key: `ql-${i}` })),
  address: SCHOOL.address,
  phone: SCHOOL.phone,
  email: SCHOOL.email,
  officeHours: SCHOOL.officeHours,
  parentsAssociationUrl: SCHOOL.parentsAssociationUrl,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
  mapEmbedUrl: `https://www.google.com/maps?q=${mapQuery}&output=embed`,
});

documents.push({
  _id: "navigation",
  _type: "navigation",
  items: NAVIGATION.map((item, i) => ({
    _type: "navGroup",
    _key: `nav-${i}`,
    label: item.label,
    ...(item.page ? { page: { _type: "reference", _ref: pageIdBySlug.get(item.page) } } : {}),
    ...(item.href ? { href: item.href } : {}),
    ...(item.children
      ? {
          children: item.children.map((child, j) => ({
            _type: "navLink",
            _key: `nav-${i}-${j}`,
            label: child.label,
            ...(child.page ? { page: { _type: "reference", _ref: pageIdBySlug.get(child.page) } } : {}),
            ...(child.href ? { href: child.href } : {}),
          })),
        }
      : {}),
  })),
  footerNote: `© ${new Date().getFullYear()} ${SCHOOL.title}`,
});

documents.push({
  _id: "announcement",
  _type: "announcement",
  enabled: false,
  tone: "info",
  text: "",
});

// ------------------------------------------------------------------ redirects
addRedirect("/sample-page", "/to-scholeio-mas");
for (const wpId of SKIPPED_WP_PAGES.keys()) {
  const source = wpPageById.get(wpId);
  if (source && wpId !== 2) addRedirect(legacyPath(source.link), "/");
}

const seenSources = new Set();
const uniqueRedirects = redirects.filter((r) => {
  if (seenSources.has(r.source)) return false;
  seenSources.add(r.source);
  return true;
});

await writeFile(
  resolve(ROOT, "src/lib/legacy-redirects.ts"),
  `/**
 * Redirects from the old WordPress URLs to the new Latin-slug routes.
 *
 * Generated by \`npm run migrate\` — do not edit by hand.
 */
export type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

export const legacyRedirects: LegacyRedirect[] = ${JSON.stringify(uniqueRedirects, null, 2)};
`,
  "utf8",
);
console.log(`Wrote ${uniqueRedirects.length} legacy redirects`);

// --------------------------------------------------------------------- commit
console.log(
  `\nAssets — uploaded: ${mirror.stats.uploaded}, reused: ${mirror.stats.cached}, failed: ${mirror.stats.failed}, ${(mirror.stats.bytes / 1048576).toFixed(1)} MB transferred`,
);
if (mirror.failures.length) {
  await writeFile(
    resolve(EXPORT_DIR, "_asset-failures.json"),
    JSON.stringify(mirror.failures, null, 2),
    "utf8",
  );
  console.log(`  ${mirror.failures.length} asset failures written to wp-export/_asset-failures.json`);
}

if (DRY_RUN) {
  await writeFile(resolve(EXPORT_DIR, "_dry-run.json"), JSON.stringify(documents, null, 2), "utf8");
  console.log(`\nDry run: ${documents.length} documents written to wp-export/_dry-run.json`);
  process.exit(0);
}

const BATCH = 40;
for (let i = 0; i < documents.length; i += BATCH) {
  const slice = documents.slice(i, i + BATCH);
  const tx = slice.reduce((t, doc) => t.createOrReplace(doc), client.transaction());
  await tx.commit({ visibility: "async" });
  process.stdout.write(`\r  committed ${Math.min(i + BATCH, documents.length)}/${documents.length} documents   `);
}
process.stdout.write("\n");
console.log("Migration complete.");
