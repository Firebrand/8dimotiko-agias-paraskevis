import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeader } from "@/components/page-header";
import { SiteSearch } from "@/components/site-search";

export const metadata: Metadata = {
  title: "Αναζήτηση",
  description: "Αναζητήστε ανακοινώσεις, δράσεις και σελίδες του 8ου Δημοτικού Αγίας Παρασκευής.",
  alternates: { canonical: "/anazitisi" },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <>
      <PageHeader
        title="Αναζήτηση"
        subtitle="Ψάξτε σε όλες τις ανακοινώσεις, τις δράσεις και τις σελίδες του ιστότοπου."
        crumbs={[{ label: "Αρχική", href: "/" }, { label: "Αναζήτηση" }]}
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Suspense fallback={<div className="h-15 animate-pulse rounded-full bg-mist" />}>
          <SiteSearch />
        </Suspense>
      </div>
    </>
  );
}
