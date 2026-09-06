import Link from "next/link";

import { ArrowRight, Calendar } from "@/components/icons";
import { SanityImage } from "@/components/sanity-image";
import type { PostCard as PostCardData } from "@/lib/types";
import { accentClasses, cx, formatDate, hasImage } from "@/lib/utils";

export function CategoryChips({ categories }: { categories: PostCardData["categories"] }) {
  if (!categories?.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {categories.map((category) => {
        const accent = accentClasses(category.accent);
        return (
          <li key={category._id}>
            <span
              className={cx(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide ring-1 ring-inset",
                accent.chip,
              )}
            >
              <span className={cx("size-1.5 rounded-full", accent.dot)} />
              {category.title}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Standard news card used across the home page, news index and related lists. */
export function PostCard({ post, priority }: { post: PostCardData; priority?: boolean }) {
  const cover = hasImage(post.coverImage) ? post.coverImage : null;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-4xl border border-black/6 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-16/10 overflow-hidden bg-gradient-to-br from-brand-100 via-mist to-sun-50">
        {cover ? (
          <SanityImage
            image={cover}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            fill
            width={900}
            priority={priority}
            className="transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 grid place-items-center font-display text-6xl font-extrabold text-brand-200"
          >
            8
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <time
            dateTime={post.publishedAt}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft/70"
          >
            <Calendar className="size-3.5" />
            {formatDate(post.publishedAt)}
          </time>
          <CategoryChips categories={post.categories} />
        </div>

        <h3 className="font-display text-lg leading-snug text-ink transition-colors group-hover:text-brand-700">
          <Link href={`/nea/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p className="line-clamp-3 text-sm leading-relaxed text-ink-soft">{post.excerpt}</p>
        )}

        <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-bold text-brand-600">
          Διαβάστε περισσότερα
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}

/** Large editorial treatment for the lead story on the home page. */
export function FeaturedPostCard({ post }: { post: PostCardData }) {
  const cover = hasImage(post.coverImage) ? post.coverImage : null;

  return (
    <article className="group relative isolate flex min-h-100 flex-col justify-end overflow-hidden rounded-5xl bg-ink shadow-card transition-shadow duration-300 hover:shadow-card-hover lg:min-h-125">
      {cover ? (
        <SanityImage
          image={cover}
          sizes="(max-width: 1024px) 100vw, 760px"
          fill
          width={1600}
          priority
          className="-z-10 transition-transform duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-700 via-brand-600 to-sun-600" />
      )}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/10"
      />

      <div className="flex flex-col gap-4 p-6 sm:p-9">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-white backdrop-blur">
            Τελευταία είδηση
          </span>
          <time dateTime={post.publishedAt} className="text-xs font-semibold text-white/75">
            {formatDate(post.publishedAt)}
          </time>
        </div>

        <h2 className="max-w-2xl font-display text-2xl leading-tight text-white sm:text-3xl lg:text-4xl">
          <Link href={`/nea/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="max-w-2xl line-clamp-3 text-[0.95rem] leading-relaxed text-white/80">
            {post.excerpt}
          </p>
        )}

        <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
          Διαβάστε το άρθρο
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </article>
  );
}

/** Compact list row for the secondary stories beside the featured card. */
export function PostRow({ post }: { post: PostCardData }) {
  const cover = hasImage(post.coverImage) ? post.coverImage : null;

  return (
    <article className="group relative flex gap-4 rounded-3xl border border-black/6 bg-white p-3 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="relative size-22 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-100 to-sun-50">
        {cover ? (
          <SanityImage image={cover} sizes="96px" fill width={300} className="transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <span aria-hidden className="absolute inset-0 grid place-items-center font-display text-2xl font-extrabold text-brand-300">
            8
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-1.5 py-1 pr-1">
        <time dateTime={post.publishedAt} className="text-[0.7rem] font-bold uppercase tracking-wider text-ink-soft/60">
          {formatDate(post.publishedAt)}
        </time>
        <h3 className="line-clamp-3 font-display text-[0.98rem] leading-snug text-ink transition-colors group-hover:text-brand-700">
          <Link href={`/nea/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}
