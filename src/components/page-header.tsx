import Link from "next/link";

import { ChevronDown } from "@/components/icons";
import { SanityImage } from "@/components/sanity-image";
import type { Figure } from "@/lib/types";
import { cx, hasImage } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  return (
    <nav aria-label="Διαδρομή πλοήγησης">
      <ol
        className={cx(
          "flex flex-wrap items-center gap-x-1 gap-y-1 text-xs font-semibold",
          tone === "light" ? "text-white/70" : "text-ink-soft/70",
        )}
      >
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1">
            {index > 0 && <ChevronDown className="size-3.5 -rotate-90 opacity-50" />}
            {item.href ? (
              <Link
                href={item.href}
                className={cx("transition-colors", tone === "light" ? "hover:text-white" : "hover:text-brand-700")}
              >
                {item.label}
              </Link>
            ) : (
              <span className={tone === "light" ? "text-white" : "text-ink"}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Page masthead. With a cover image it becomes a full-bleed photo banner;
 * without one it falls back to the aurora gradient treatment.
 */
export function PageHeader({
  title,
  subtitle,
  crumbs,
  cover,
  eyebrow,
}: {
  title: string;
  subtitle?: string | null;
  crumbs?: Crumb[];
  cover?: Figure | null;
  eyebrow?: string;
}) {
  const image = hasImage(cover) ? cover : null;

  if (image) {
    return (
      <header className="relative isolate overflow-hidden bg-ink">
        <SanityImage
          image={image}
          sizes="100vw"
          fill
          width={2000}
          priority
          className="-z-10 opacity-55"
        />
        <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/40" />
        <div className="mx-auto max-w-4xl px-4 pb-14 pt-14 sm:px-6 sm:pb-18 sm:pt-20 lg:px-8">
          {crumbs && <Breadcrumbs items={crumbs} tone="light" />}
          {eyebrow && (
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-brand-200">{eyebrow}</p>
          )}
          <h1 className="mt-3 text-3xl text-white sm:text-4xl lg:text-5xl">{title}</h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{subtitle}</p>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="relative isolate overflow-hidden border-b border-black/6 bg-mist">
      <div className="aurora opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && (
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</p>
        )}
        <h1 className="mt-3 text-3xl text-ink sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">{subtitle}</p>
        )}
      </div>
    </header>
  );
}

export function SectionHeading({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="max-w-2xl">
        <h2 className="text-2xl text-ink sm:text-3xl">{title}</h2>
        {description && <p className="mt-2.5 text-[0.98rem] leading-relaxed text-ink-soft">{description}</p>}
      </div>
      {action}
    </div>
  );
}
