import Image from "next/image";

import type { Figure } from "@/lib/types";
import { cx, hasImage } from "@/lib/utils";

/**
 * Wordmark for the school. Falls back to a generated "8" monogram when no logo
 * has been uploaded in the Studio, so the header is never empty.
 */
export function Logo({
  logo,
  title,
  tone = "dark",
  className,
}: {
  logo?: Figure | null;
  title: string;
  /** `light` is for use on the dark footer background. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const [first, ...rest] = title.split(" ");

  return (
    <span className={cx("flex items-center gap-3", className)}>
      {hasImage(logo) ? (
        <Image
          src={logo.asset.url}
          alt=""
          width={48}
          height={48}
          className="size-11 shrink-0 rounded-2xl object-contain"
        />
      ) : (
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 via-brand-500 to-sun-500 font-display text-xl font-extrabold text-white shadow-glow"
        >
          8
        </span>
      )}
      <span className="flex flex-col leading-tight">
        <span
          className={cx(
            "font-display text-[0.95rem] font-extrabold tracking-tight sm:text-base",
            tone === "light" ? "text-white" : "text-ink",
          )}
        >
          {first}
        </span>
        <span
          className={cx(
            "text-[0.7rem] font-medium uppercase tracking-[0.14em] sm:text-[0.72rem]",
            tone === "light" ? "text-white/55" : "text-ink-soft/70",
          )}
        >
          {rest.join(" ")}
        </span>
      </span>
    </span>
  );
}
