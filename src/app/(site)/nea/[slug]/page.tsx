import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeft, ArrowRight, Calendar } from "@/components/icons";
import { Breadcrumbs, SectionHeading } from "@/components/page-header";
import { CategoryChips, PostCard } from "@/components/post-card";
import { RichText } from "@/components/rich-text";
import { SanityImage } from "@/components/sanity-image";
import type { PostCard as PostCardData, PostDetail } from "@/lib/types";
import { formatDate, hasImage, siteUrl } from "@/lib/utils";
import { imageSrc } from "@/sanity/image";
import { sanityFetch } from "@/sanity/live";
import { postQuery, postSlugsQuery } from "@/sanity/queries";

type Neighbour = { title: string; slug: string } | null;

type Result = {
  post: PostDetail | null;
  previous: Neighbour;
  next: Neighbour;
  related: PostCardData[];
};

async function getPost(slug: string) {
  const { data } = await sanityFetch({ query: postQuery, params: { slug }, stega: false });
  return (data ?? { post: null, previous: null, next: null, related: [] }) as Result;
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({ query: postSlugsQuery, stega: false, perspective: "published" });
  return (data ?? []) as { slug: string }[];
}

export async function generateMetadata(props: PageProps<"/nea/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { post } = await getPost(slug);
  if (!post) return {};

  const cover = hasImage(post.coverImage) ? imageSrc(post.coverImage.asset, 1200) : undefined;

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/nea/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      url: `${siteUrl()}/nea/${slug}`,
      images: cover ? [{ url: cover, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function PostPage(props: PageProps<"/nea/[slug]">) {
  const { slug } = await props.params;
  const { post, previous, next, related } = await getPost(slug);
  if (!post) notFound();

  const cover = hasImage(post.coverImage) ? post.coverImage : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    description: post.excerpt ?? undefined,
    image: cover ? imageSrc(cover.asset, 1200) : undefined,
    inLanguage: "el",
    mainEntityOfPage: `${siteUrl()}/nea/${slug}`,
    publisher: {
      "@type": "EducationalOrganization",
      name: "8ο Δημοτικό Σχολείο Αγίας Παρασκευής",
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="relative isolate overflow-hidden border-b border-black/6 bg-mist">
        <div className="aurora opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-4 pb-12 pt-10 sm:px-6 sm:pb-14 sm:pt-14 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Αρχική", href: "/" },
              { label: "Νέα", href: "/nea" },
              { label: post.title },
            ]}
          />

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <time
              dateTime={post.publishedAt}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft"
            >
              <Calendar className="size-4" />
              {formatDate(post.publishedAt)}
            </time>
            <CategoryChips categories={post.categories} />
          </div>

          <h1 className="mt-4 text-3xl leading-[1.12] text-ink sm:text-4xl lg:text-[2.85rem]">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{post.excerpt}</p>
          )}
        </div>
      </header>

      {cover && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-2 overflow-hidden rounded-b-4xl bg-mist shadow-card sm:rounded-4xl sm:mt-8">
            <SanityImage
              image={cover}
              sizes="(max-width: 1024px) 100vw, 1024px"
              width={1800}
              priority
              className="h-auto w-full"
            />
          </div>
          {cover.caption && (
            <p className="mt-3 text-center text-sm text-ink-soft/80">{cover.caption}</p>
          )}
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <RichText value={post.body} />

        {(previous || next) && (
          <nav
            aria-label="Πλοήγηση άρθρων"
            className="mt-16 grid gap-3 border-t border-black/8 pt-8 sm:grid-cols-2"
          >
            {previous ? <NeighbourLink post={previous} direction="prev" /> : <span />}
            {next && <NeighbourLink post={next} direction="next" />}
          </nav>
        )}
      </div>

      {related.length > 0 && (
        <section className="border-t border-black/6 bg-mist">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <SectionHeading title="Σχετικές δημοσιεύσεις" className="mb-8" />
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item._id}>
                  <PostCard post={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}

function NeighbourLink({
  post,
  direction,
}: {
  post: { title: string; slug: string };
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";
  const Icon = isPrev ? ArrowLeft : ArrowRight;

  return (
    <Link
      href={`/nea/${post.slug}`}
      className={`group flex flex-col gap-1.5 rounded-3xl border border-black/8 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card ${isPrev ? "" : "sm:text-right"}`}
    >
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-ink-soft/60 ${isPrev ? "" : "sm:flex-row-reverse sm:self-end"}`}
      >
        <Icon className="size-3.5" />
        {isPrev ? "Προηγούμενο" : "Επόμενο"}
      </span>
      <span className="line-clamp-2 font-display text-[0.98rem] font-bold text-ink transition-colors group-hover:text-brand-700">
        {post.title}
      </span>
    </Link>
  );
}
