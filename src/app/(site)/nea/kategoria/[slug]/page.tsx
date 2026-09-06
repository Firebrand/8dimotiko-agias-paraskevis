import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryFilter } from "@/components/category-filter";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { PostCard } from "@/components/post-card";
import { loadNewsPage, parsePage } from "@/lib/news";
import type { CategoryRef } from "@/lib/types";
import { sanityFetch } from "@/sanity/live";
import { categoryQuery, categorySlugsQuery } from "@/sanity/queries";

type Category = CategoryRef & { description?: string | null };

async function getCategory(slug: string) {
  const { data } = await sanityFetch({ query: categoryQuery, params: { slug }, stega: false });
  return (data ?? null) as Category | null;
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({ query: categorySlugsQuery, stega: false, perspective: "published" });
  return (data ?? []) as { slug: string }[];
}

export async function generateMetadata(
  props: PageProps<"/nea/kategoria/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategory(slug);
  if (!category) return {};

  return {
    title: `${category.title} — Νέα`,
    description:
      category.description ??
      `Δημοσιεύσεις του 8ου Δημοτικού Σχολείου Αγίας Παρασκευής στην κατηγορία «${category.title}».`,
    alternates: { canonical: `/nea/kategoria/${slug}` },
  };
}

export default async function CategoryPage(props: PageProps<"/nea/kategoria/[slug]">) {
  const [{ slug }, searchParams] = await Promise.all([props.params, props.searchParams]);
  const category = await getCategory(slug);
  if (!category) notFound();

  const page = parsePage(searchParams.page);
  const { posts, total, categories, grandTotal, totalPages } = await loadNewsPage({
    page,
    category: slug,
  });

  return (
    <>
      <PageHeader
        title={category.title}
        eyebrow={`${total} ${total === 1 ? "δημοσίευση" : "δημοσιεύσεις"}`}
        subtitle={category.description ?? undefined}
        crumbs={[
          { label: "Αρχική", href: "/" },
          { label: "Νέα & Ανακοινώσεις", href: "/nea" },
          { label: category.title },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <CategoryFilter categories={categories} activeSlug={slug} total={grandTotal} />

        {posts.length > 0 ? (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <li key={post._id} className={index > 2 ? "reveal" : undefined}>
                <PostCard post={post} priority={index < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-16 text-center text-ink-soft">
            Δεν υπάρχουν δημοσιεύσεις σε αυτή την κατηγορία.
          </p>
        )}

        <Pagination current={page} total={totalPages} basePath={`/nea/kategoria/${slug}`} />
      </div>
    </>
  );
}
