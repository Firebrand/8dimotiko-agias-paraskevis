import Link from "next/link";

import { accentClasses, cx } from "@/lib/utils";
import type { Accent } from "@/lib/types";

export type CategoryOption = {
  _id: string;
  title: string;
  slug: string;
  accent?: Accent | null;
  count: number;
};

export function CategoryFilter({
  categories,
  activeSlug,
  total,
}: {
  categories: CategoryOption[];
  activeSlug?: string;
  total: number;
}) {
  if (!categories.length) return null;

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
        <li>
          <Chip href="/nea" label="Όλα" count={total} active={!activeSlug} />
        </li>
        {categories.map((category) => (
          <li key={category._id}>
            <Chip
              href={`/nea/kategoria/${category.slug}`}
              label={category.title}
              count={category.count}
              active={activeSlug === category.slug}
              accent={category.accent}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chip({
  href,
  label,
  count,
  active,
  accent,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
  accent?: Accent | null;
}) {
  const tone = accentClasses(accent);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200",
        active
          ? "border-brand-600 bg-brand-600 text-white shadow-glow"
          : cx("border-black/8 bg-white text-ink-soft hover:-translate-y-0.5", tone.hover),
      )}
    >
      {label}
      <span
        className={cx(
          "rounded-full px-1.5 py-0.5 text-[0.68rem] font-bold tabular-nums",
          active ? "bg-white/20 text-white" : "bg-mist text-ink-soft/70",
        )}
      >
        {count}
      </span>
    </Link>
  );
}
