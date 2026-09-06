import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryFilter } from "@/components/category-filter";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { PostCard } from "@/components/post-card";
import { loadNewsPage, parsePage } from "@/lib/news";

export const metadata: Metadata = {
  title: "Νέα & Ανακοινώσεις",
  description:
    "Όλες οι ανακοινώσεις, οι εκδηλώσεις και οι δράσεις του 8ου Δημοτικού Σχολείου Αγίας Παρασκευής.",
  alternates: { canonical: "/nea" },
};

export default async function NewsIndexPage(props: PageProps<"/nea">) {
  const searchParams = await props.searchParams;
  const page = parsePage(searchParams.page);
  const { posts, total, categories, grandTotal, totalPages } = await loadNewsPage({ page });

  if (page > totalPages && total > 0) notFound();

  return (
    <>
      <PageHeader
        title="Νέα & Ανακοινώσεις"
        eyebrow={`${total} δημοσιεύσεις`}
        subtitle="Ό,τι συμβαίνει στο σχολείο μας — ανακοινώσεις για γονείς, εκδηλώσεις, εκπαιδευτικές επισκέψεις και δράσεις των τμημάτων μας."
        crumbs={[{ label: "Αρχική", href: "/" }, { label: "Νέα & Ανακοινώσεις" }]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <CategoryFilter categories={categories} total={grandTotal} />

        {posts.length > 0 ? (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <li key={post._id} className={index > 2 ? "reveal" : undefined}>
                <PostCard post={post} priority={index < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-16 text-center text-ink-soft">Δεν υπάρχουν ακόμη δημοσιεύσεις.</p>
        )}

        <Pagination current={page} total={totalPages} basePath="/nea" />
      </div>
    </>
  );
}
