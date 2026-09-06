import Link from "next/link";

import { ArrowRight, Search } from "@/components/icons";

export function NotFoundContent() {
  return (
    <section className="relative isolate overflow-hidden bg-mist">
      <div className="aurora" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
        <p className="font-display text-7xl font-extrabold text-gradient sm:text-8xl">404</p>
        <h1 className="mt-6 text-3xl text-ink sm:text-4xl">Η σελίδα δεν βρέθηκε</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
          Η σελίδα που ζητήσατε δεν υπάρχει ή έχει μετακινηθεί. Δοκιμάστε από την αρχική σελίδα ή
          κάντε μια αναζήτηση.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 font-display text-sm font-bold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700"
          >
            Αρχική σελίδα
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/anazitisi"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3.5 font-display text-sm font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700"
          >
            <Search className="size-4" />
            Αναζήτηση
          </Link>
        </div>
      </div>
    </section>
  );
}
