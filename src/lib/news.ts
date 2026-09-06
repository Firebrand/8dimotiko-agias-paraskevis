import type { CategoryOption } from "@/components/category-filter";
import type { PostCard } from "@/lib/types";
import { sanityFetch } from "@/sanity/live";
import { categoriesQuery, postsPageQuery } from "@/sanity/queries";

export const POSTS_PER_PAGE = 12;

/** Shared loader for the news index and every category listing. */
export async function loadNewsPage({
  page,
  category = "",
}: {
  page: number;
  category?: string;
}) {
  const from = (page - 1) * POSTS_PER_PAGE;

  const [listResult, categoriesResult] = await Promise.all([
    sanityFetch({
      query: postsPageQuery,
      params: { from, to: from + POSTS_PER_PAGE, category },
      stega: false,
    }),
    sanityFetch({ query: categoriesQuery, stega: false }),
  ]);

  const list = (listResult.data ?? { posts: [], total: 0 }) as {
    posts: PostCard[];
    total: number;
  };
  const categories = (categoriesResult.data ?? []) as CategoryOption[];
  const grandTotal = categories.reduce((sum, item) => sum + item.count, 0);

  return {
    posts: list.posts ?? [],
    total: list.total ?? 0,
    categories,
    grandTotal,
    totalPages: Math.max(1, Math.ceil((list.total ?? 0) / POSTS_PER_PAGE)),
  };
}

/** Reads and clamps the `?page=` query parameter. */
export function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}
