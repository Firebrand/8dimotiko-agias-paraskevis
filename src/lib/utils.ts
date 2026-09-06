import type { Accent, Figure, NavLink } from "./types";

/** Joins conditional class names; keeps JSX readable without a dependency. */
export function cx(...values: (string | false | null | undefined)[]) {
  return values.filter(Boolean).join(" ");
}

const dateFormatter = new Intl.DateTimeFormat("el-GR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("el-GR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatDate(value?: string | null) {
  if (!value) return "";
  return dateFormatter.format(new Date(value));
}

export function formatShortDate(value?: string | null) {
  if (!value) return "";
  return shortDateFormatter.format(new Date(value));
}

export function formatFileSize(bytes?: number | null) {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

/** Turns a navigation entry into an href, preferring the referenced page. */
export function navHref(item: Pick<NavLink, "href" | "pageSlug">) {
  if (item.pageSlug) return `/${item.pageSlug}`;
  return item.href ?? "#";
}

export function isExternal(href: string) {
  return /^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

export function hasImage(figure?: Figure | null): figure is Figure & { asset: { url: string } } {
  return Boolean(figure?.asset?.url);
}

export function aspectRatio(figure?: Figure | null) {
  return figure?.asset?.dimensions?.aspectRatio ?? 1.5;
}

/**
 * Tailwind class sets per category accent. Written out in full so Tailwind's
 * static extraction can see every class name.
 */
export const ACCENT_CLASSES: Record<Accent, { chip: string; dot: string; hover: string }> = {
  blue: {
    chip: "bg-brand-50 text-brand-700 ring-brand-200",
    dot: "bg-brand-500",
    hover: "hover:border-brand-200 hover:text-brand-700",
  },
  teal: {
    chip: "bg-teal-50 text-teal-700 ring-teal-200",
    dot: "bg-teal-500",
    hover: "hover:border-teal-200 hover:text-teal-700",
  },
  violet: {
    chip: "bg-sky-50 text-sky-700 ring-sky-200",
    dot: "bg-sky-500",
    hover: "hover:border-sky-200 hover:text-sky-700",
  },
  amber: {
    chip: "bg-sun-50 text-sun-700 ring-sun-200",
    dot: "bg-sun-500",
    hover: "hover:border-sun-200 hover:text-sun-700",
  },
  rose: {
    chip: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
    hover: "hover:border-rose-200 hover:text-rose-700",
  },
  green: {
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
    hover: "hover:border-emerald-200 hover:text-emerald-700",
  },
};

export function accentClasses(accent?: Accent | null) {
  return ACCENT_CLASSES[accent ?? "blue"] ?? ACCENT_CLASSES.blue;
}

/** Absolute site origin, used for canonical URLs, sitemap and OG tags. */
export function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
