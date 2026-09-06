import Link from "next/link";

import { ArrowLeft, ArrowRight } from "@/components/icons";
import { cx } from "@/lib/utils";

/** Builds a compact page list: 1 … 4 5 6 … 20 */
function pageWindow(current: number, total: number) {
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((p) => pages.add(p));

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const withGaps: (number | "gap")[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) withGaps.push("gap");
    withGaps.push(page);
  });
  return withGaps;
}

export function Pagination({
  current,
  total,
  basePath,
}: {
  current: number;
  total: number;
  basePath: string;
}) {
  if (total <= 1) return null;

  const href = (page: number) => (page === 1 ? basePath : `${basePath}?page=${page}`);

  return (
    <nav aria-label="Σελιδοποίηση" className="mt-12 flex items-center justify-center gap-1.5">
      <PageArrow
        href={href(current - 1)}
        disabled={current === 1}
        label="Προηγούμενη σελίδα"
        direction="prev"
      />

      <ul className="flex items-center gap-1.5">
        {pageWindow(current, total).map((page, index) =>
          page === "gap" ? (
            <li key={`gap-${index}`} aria-hidden className="px-1 text-ink-soft/50">
              …
            </li>
          ) : (
            <li key={page}>
              <Link
                href={href(page)}
                aria-current={page === current ? "page" : undefined}
                className={cx(
                  "grid size-10 place-items-center rounded-full text-sm font-bold tabular-nums transition-colors",
                  page === current
                    ? "bg-brand-600 text-white shadow-glow"
                    : "text-ink-soft hover:bg-mist hover:text-ink",
                )}
              >
                {page}
              </Link>
            </li>
          ),
        )}
      </ul>

      <PageArrow
        href={href(current + 1)}
        disabled={current === total}
        label="Επόμενη σελίδα"
        direction="next"
      />
    </nav>
  );
}

function PageArrow({
  href,
  disabled,
  label,
  direction,
}: {
  href: string;
  disabled: boolean;
  label: string;
  direction: "prev" | "next";
}) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;
  const className =
    "grid size-10 place-items-center rounded-full border border-black/8 transition-colors";

  if (disabled) {
    return (
      <span aria-hidden className={cx(className, "text-ink-soft/30")}>
        <Icon className="size-4" />
      </span>
    );
  }

  return (
    <Link href={href} className={cx(className, "text-ink-soft hover:border-brand-200 hover:text-brand-700")}>
      <span className="sr-only">{label}</span>
      <Icon className="size-4" />
    </Link>
  );
}
