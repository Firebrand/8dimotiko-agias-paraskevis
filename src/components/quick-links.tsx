import Link from "next/link";

import { ArrowRight, External, Info, QUICK_LINK_ICONS } from "@/components/icons";
import type { QuickLink } from "@/lib/types";
import { isExternal } from "@/lib/utils";

const HALOS = [
  "from-brand-600 to-brand-400",
  "from-sun-500 to-sun-400",
  "from-teal-600 to-teal-400",
  "from-violet-600 to-violet-400",
  "from-rose-500 to-rose-400",
  "from-emerald-600 to-emerald-400",
];

export function QuickLinks({ links }: { links: QuickLink[] }) {
  if (!links.length) return null;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link, index) => {
        const Icon = QUICK_LINK_ICONS[link.icon ?? "info"] ?? Info;
        const external = isExternal(link.href);
        return (
          <li key={link._key} className="reveal">
            <Link
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="group relative flex h-full items-start gap-4 overflow-hidden rounded-4xl border border-black/6 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-6"
            >
              <span
                aria-hidden
                className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${HALOS[index % HALOS.length]} text-white shadow-sm transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="size-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 font-display text-[1.02rem] font-bold text-ink transition-colors group-hover:text-brand-700">
                  {link.label}
                  {external && <External className="size-3.5 opacity-50" />}
                </span>
                {link.description && (
                  <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{link.description}</span>
                )}
              </span>
              <ArrowRight className="mt-3 size-4 shrink-0 text-brand-400 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
