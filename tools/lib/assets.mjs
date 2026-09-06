// Downloads WordPress uploads and mirrors them into Sanity's asset store.
// Results are cached on disk so the migration can be re-run cheaply.
import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";

const IMAGE_EXT = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"]);
// Sanity's image pipeline cannot decode these; keep them as plain files.
const UNSUPPORTED_IMAGE_EXT = new Set(["heic", "heif"]);

const MIME = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif",
  webp: "image/webp", svg: "image/svg+xml", avif: "image/avif",
  pdf: "application/pdf", mp4: "video/mp4", mov: "video/quicktime",
  mp3: "audio/mpeg", m4a: "audio/mp4", wav: "audio/wav",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip",
};

const extOf = (url) => (decodeURIComponent(url).split("?")[0].split(".").pop() ?? "").toLowerCase();

/** Stable cache key: protocol/host/encoding differences collapse to one entry. */
function normalize(url) {
  try {
    const u = new URL(url, "https://www.8dimotikoagp.gr");
    return `${u.hostname.replace(/^www\./, "")}${decodeURIComponent(u.pathname)}`;
  } catch {
    return url;
  }
}

export class AssetMirror {
  constructor({ client, mediaItems, cachePath, log = console.log }) {
    this.client = client;
    this.cachePath = cachePath;
    this.log = log;
    this.cache = new Map();
    this.inFlight = new Map();
    this.stats = { uploaded: 0, cached: 0, failed: 0, bytes: 0 };
    this.failures = [];

    // Map every WordPress size variant back to the full-size original.
    this.originals = new Map();
    for (const item of mediaItems) {
      if (!item.source_url) continue;
      const original = item.source_url;
      this.originals.set(normalize(original), original);
      for (const size of Object.values(item.media_details?.sizes ?? {})) {
        if (size?.source_url) this.originals.set(normalize(size.source_url), original);
      }
    }
  }

  async load() {
    try {
      const raw = JSON.parse(await readFile(this.cachePath, "utf8"));
      this.cache = new Map(Object.entries(raw));
      this.log(`  asset cache: ${this.cache.size} entries`);
    } catch {
      this.log("  asset cache: starting fresh");
    }
  }

  async save() {
    await writeFile(this.cachePath, JSON.stringify(Object.fromEntries(this.cache), null, 2), "utf8");
  }

  /** Resolves a resized WordPress URL to its full-resolution original. */
  toOriginal(url) {
    const direct = this.originals.get(normalize(url));
    if (direct) return direct;
    // Fall back to stripping WordPress' `-1024x768` size suffix.
    const stripped = url.replace(/-\d{2,5}x\d{2,5}(\.[a-z0-9]+)(\?.*)?$/i, "$1");
    return this.originals.get(normalize(stripped)) ?? stripped;
  }

  async resolveImage(url) {
    if (!url) return null;
    const ext = extOf(url);
    if (UNSUPPORTED_IMAGE_EXT.has(ext)) return null;
    return this.upload(this.toOriginal(url), "image");
  }

  async resolveFile(url) {
    if (!url) return null;
    return this.upload(this.toOriginal(url), "file");
  }

  /** Images go in as image assets so Sanity can crop/resize them; everything else as files. */
  async resolveAuto(url) {
    return IMAGE_EXT.has(extOf(url)) ? this.resolveImage(url) : this.resolveFile(url);
  }

  async upload(url, type) {
    const cacheKey = `${type}:${normalize(url)}`;
    if (this.cache.has(cacheKey)) {
      const value = this.cache.get(cacheKey);
      if (value) this.stats.cached++;
      return value;
    }
    if (this.inFlight.has(cacheKey)) return this.inFlight.get(cacheKey);

    const task = this.#doUpload(url, type, cacheKey);
    this.inFlight.set(cacheKey, task);
    try {
      return await task;
    } finally {
      this.inFlight.delete(cacheKey);
    }
  }

  async #doUpload(url, type, cacheKey) {
    const filename = decodeURIComponent(basename(new URL(url, "https://www.8dimotikoagp.gr").pathname));
    const ext = extOf(url);
    try {
      const res = await fetch(url, { headers: { "User-Agent": "content-migration/1.0" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      if (!buffer.length) throw new Error("empty body");

      const asset = await this.client.assets.upload(type, buffer, {
        filename,
        contentType: MIME[ext] ?? res.headers.get("content-type") ?? undefined,
      });

      this.cache.set(cacheKey, asset._id);
      this.stats.uploaded++;
      this.stats.bytes += buffer.length;
      this.log(`  + ${type} ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`);
      return asset._id;
    } catch (err) {
      // Remember the failure so later runs don't retry a dead URL forever.
      this.cache.set(cacheKey, null);
      this.stats.failed++;
      this.failures.push({ url, reason: err.message });
      this.log(`  ! failed ${filename}: ${err.message}`);
      return null;
    }
  }
}
