"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { Calendar, Close, Document, Search } from "@/components/icons";
import { cx, formatDate } from "@/lib/utils";

type Entry = {
  id: string;
  kind: "post" | "page";
  title: string;
  href: string;
  date?: string;
  categories?: string[];
  summary?: string;
  haystack: string;
};

/** Matches the normalisation used when the index is built. */
function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ς/g, "σ")
    .replace(/\s+/g, " ")
    .trim();
}

const MAX_RESULTS = 40;

export function SiteSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const deferred = useDeferredValue(query);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/search-index")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { entries: Entry[] }) => {
        if (!cancelled) setEntries(data.entries);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the URL shareable without pushing a history entry per keystroke.
  useEffect(() => {
    const trimmed = deferred.trim();
    const next = trimmed ? `/anazitisi?q=${encodeURIComponent(trimmed)}` : "/anazitisi";
    router.replace(next, { scroll: false });
  }, [deferred, router]);

  const results = useMemo(() => {
    const terms = normalize(deferred).split(" ").filter((term) => term.length > 1);
    if (!entries || !terms.length) return [];

    return entries
      .map((entry) => {
        let score = 0;
        const title = normalize(entry.title);
        for (const term of terms) {
          if (!entry.haystack.includes(term)) return null;
          if (title.includes(term)) score += title.startsWith(term) ? 6 : 4;
          score += 1;
        }
        if (entry.kind === "page") score += 2;
        return { entry, score };
      })
      .filter(Boolean)
      .sort((a, b) => b!.score - a!.score || (b!.entry.date ?? "").localeCompare(a!.entry.date ?? ""))
      .slice(0, MAX_RESULTS)
      .map((hit) => hit!.entry);
  }, [entries, deferred]);

  const trimmed = deferred.trim();
  const searching = trimmed.length > 1;

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-ink-soft/50" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Αναζητήστε ανακοινώσεις, δράσεις, σελίδες…"
          autoFocus
          aria-label="Αναζήτηση στον ιστότοπο"
          className="w-full rounded-full border border-black/10 bg-white py-4 pl-13 pr-13 text-base text-ink shadow-card outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand-300"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink-soft transition-colors hover:bg-mist hover:text-ink"
          >
            <span className="sr-only">Καθαρισμός</span>
            <Close className="size-4" />
          </button>
        )}
      </div>

      <div className="mt-8" aria-live="polite">
        {failed && (
          <p className="text-ink-soft">
            Η αναζήτηση δεν είναι προσωρινά διαθέσιμη. Δοκιμάστε να ανανεώσετε τη σελίδα.
          </p>
        )}

        {!failed && !searching && (
          <p className="text-ink-soft">
            Γράψτε τουλάχιστον δύο χαρακτήρες για να ξεκινήσει η αναζήτηση.
          </p>
        )}

        {!failed && searching && !entries && <ResultSkeleton />}

        {!failed && searching && entries && (
          <>
            <p className="text-sm font-semibold text-ink-soft">
              {results.length === 0
                ? `Δεν βρέθηκαν αποτελέσματα για «${trimmed}».`
                : `${results.length}${results.length === MAX_RESULTS ? "+" : ""} αποτελέσματα για «${trimmed}»`}
            </p>

            {results.length > 0 && (
              <ul className="mt-5 space-y-3">
                {results.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      href={entry.href}
                      className="group block rounded-3xl border border-black/6 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
                    >
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span
                          className={cx(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide ring-1 ring-inset",
                            entry.kind === "post"
                              ? "bg-brand-50 text-brand-700 ring-brand-200"
                              : "bg-sun-50 text-sun-700 ring-sun-200",
                          )}
                        >
                          {entry.kind === "post" ? (
                            <Calendar className="size-3" />
                          ) : (
                            <Document className="size-3" />
                          )}
                          {entry.kind === "post" ? "Νέα" : "Σελίδα"}
                        </span>
                        {entry.date && (
                          <time dateTime={entry.date} className="text-xs font-semibold text-ink-soft/70">
                            {formatDate(entry.date)}
                          </time>
                        )}
                      </span>

                      <span className="mt-2.5 block font-display text-[1.05rem] font-bold leading-snug text-ink transition-colors group-hover:text-brand-700">
                        {entry.title}
                      </span>

                      {entry.summary && (
                        <span className="mt-1.5 line-clamp-2 block text-sm leading-relaxed text-ink-soft">
                          {entry.summary}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <ul className="space-y-3" aria-hidden>
      {[0, 1, 2].map((index) => (
        <li
          key={index}
          className="h-28 animate-pulse rounded-3xl border border-black/6 bg-mist"
          style={{ animationDelay: `${index * 90}ms` }}
        />
      ))}
    </ul>
  );
}
