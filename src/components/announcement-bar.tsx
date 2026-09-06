"use client";

import Link from "next/link";

import { ArrowRight, Close, Info } from "@/components/icons";
import type { Announcement } from "@/lib/types";
import { useDismissed } from "@/lib/use-dismissed";
import { cx, isExternal } from "@/lib/utils";

const TONES = {
  info: "bg-brand-700 text-white",
  warning: "bg-sun-400 text-sun-950",
  urgent: "bg-rose-700 text-white",
} as const;

/**
 * Editable notice strip. Dismissal is remembered per message, so turning on a
 * new announcement in the Studio shows it again to everyone.
 */
export function AnnouncementBar({ announcement }: { announcement: Announcement }) {
  const message = announcement.text?.trim() ?? "";
  const [dismissed, dismiss] = useDismissed(`announcement-dismissed:${message}`);

  const expired = announcement.expiresAt ? new Date(announcement.expiresAt) < new Date() : false;
  if (!announcement.enabled || !message || expired || dismissed) return null;

  const tone = TONES[announcement.tone ?? "info"];
  const href = announcement.linkHref?.trim();

  return (
    <div className={cx("relative", tone)}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <Info className="hidden size-5 shrink-0 opacity-80 sm:block" />
        <p className="flex-1 text-sm font-medium text-balance">
          {message}
          {href && (
            <Link
              href={href}
              target={isExternal(href) ? "_blank" : undefined}
              rel={isExternal(href) ? "noreferrer" : undefined}
              className="ml-2 inline-flex items-center gap-1 font-bold underline decoration-2 underline-offset-2 hover:no-underline"
            >
              {announcement.linkLabel?.trim() || "Περισσότερα"}
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="-mr-1 grid size-8 shrink-0 place-items-center rounded-full transition-colors hover:bg-white/15"
        >
          <span className="sr-only">Απόκρυψη ανακοίνωσης</span>
          <Close className="size-4" />
        </button>
      </div>
    </div>
  );
}
