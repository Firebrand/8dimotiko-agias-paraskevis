import { client } from "@/sanity/client";
import { searchIndexQuery } from "@/sanity/queries";

export const revalidate = 300;

type Raw = {
  posts: {
    id: string;
    title: string;
    slug: string;
    publishedAt: string;
    excerpt?: string | null;
    categories?: string[] | null;
    text?: string | null;
  }[];
  pages: {
    id: string;
    title: string;
    slug: string;
    subtitle?: string | null;
    text?: string | null;
  }[];
};

/**
 * Flat index for the client-side search. Body text is trimmed so the payload
 * stays small enough to download in one go.
 */
export async function GET() {
  const data = (await client.fetch(searchIndexQuery)) as Raw;

  const entries = [
    ...(data.pages ?? []).map((page) => ({
      id: page.id,
      kind: "page" as const,
      title: page.title,
      href: `/${page.slug}`,
      summary: page.subtitle ?? truncate(page.text, 160),
      haystack: normalize(`${page.title} ${page.subtitle ?? ""} ${page.text ?? ""}`),
    })),
    ...(data.posts ?? []).map((post) => ({
      id: post.id,
      kind: "post" as const,
      title: post.title,
      href: `/nea/${post.slug}`,
      date: post.publishedAt,
      categories: post.categories ?? [],
      summary: post.excerpt ?? truncate(post.text, 160),
      haystack: normalize(
        `${post.title} ${post.excerpt ?? ""} ${(post.categories ?? []).join(" ")} ${truncate(post.text, 900)}`,
      ),
    })),
  ];

  return Response.json(
    { entries },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } },
  );
}

function truncate(text?: string | null, length = 160) {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= length) return clean;
  return `${clean.slice(0, clean.lastIndexOf(" ", length))}…`;
}

/**
 * Lower-cases and strips Greek accents so "Αγιασμός" also matches "αγιασμος".
 */
function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ς/g, "σ")
    .replace(/\s+/g, " ")
    .trim();
}
