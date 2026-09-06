import Link from "next/link";

import { ContactPanel } from "@/components/contact-panel";
import { ArrowRight, Sparkle } from "@/components/icons";
import { SectionHeading } from "@/components/page-header";
import { FeaturedPostCard, PostCard, PostRow } from "@/components/post-card";
import { QuickLinks } from "@/components/quick-links";
import { SanityImage } from "@/components/sanity-image";
import type { PostCard as PostCardData, SiteSettings } from "@/lib/types";
import { hasImage } from "@/lib/utils";
import { sanityFetch } from "@/sanity/live";
import { homeQuery, settingsQuery } from "@/sanity/queries";

export default async function HomePage() {
  const [settingsResult, homeResult] = await Promise.all([
    sanityFetch({ query: settingsQuery, stega: false }),
    sanityFetch({ query: homeQuery, stega: false }),
  ]);

  const settings = (settingsResult.data ?? {}) as SiteSettings;
  const home = (homeResult.data ?? {}) as {
    featured: PostCardData[];
    recent: PostCardData[];
    total: number;
  };

  const [lead, ...secondary] = home.featured ?? [];
  const heroImage = (settings.heroImages ?? []).find(hasImage) ?? null;

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative isolate overflow-hidden border-b border-black/6 bg-mist">
        <div className="aurora" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-18 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="animate-enter">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-700 shadow-sm ring-1 ring-brand-100">
              <Sparkle className="size-3.5" />
              {settings.shortTitle ?? "8ο Δημοτικό Αγίας Παρασκευής"}
            </p>

            <h1 className="mt-6 text-[2.1rem] leading-[1.08] text-ink sm:text-5xl lg:text-[3.4rem]">
              {settings.heroTitle ? (
                <HeroTitle text={settings.heroTitle} />
              ) : (
                <>
                  Καλώς ήρθατε στο <span className="text-gradient">σχολείο μας</span>
                </>
              )}
            </h1>

            {settings.heroText && (
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
                {settings.heroText}
              </p>
            )}

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/nea"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 font-display text-sm font-bold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700"
              >
                Νέα & Ανακοινώσεις
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/to-scholeio-mas"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3.5 font-display text-sm font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700"
              >
                Το σχολείο μας
              </Link>
            </div>

            {(settings.highlights ?? []).length > 0 && (
              <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
                {(settings.highlights ?? []).map((item) => (
                  <div key={item._key}>
                    <dt className="sr-only">{item.label}</dt>
                    <dd>
                      <span className="block font-display text-3xl font-extrabold text-gradient">
                        {item.value}
                      </span>
                      <span className="mt-0.5 block text-xs font-bold uppercase tracking-[0.12em] text-ink-soft/70">
                        {item.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {heroImage && (
            <div className="relative animate-enter [animation-delay:120ms]">
              <div
                aria-hidden
                className="absolute -inset-3 -z-10 rotate-2 rounded-5xl bg-gradient-to-br from-brand-500/25 via-transparent to-sun-400/25 blur-xl"
              />
              <div className="relative aspect-4/3 overflow-hidden rounded-5xl bg-white shadow-card-hover ring-1 ring-black/5">
                <SanityImage
                  image={heroImage}
                  sizes="(max-width: 1024px) 100vw, 620px"
                  fill
                  width={1600}
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ Top news */}
      {lead && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading
            title="Τελευταία νέα"
            description="Ανακοινώσεις, εκδηλώσεις και στιγμές από την καθημερινότητα του σχολείου μας."
            action={
              <Link
                href="/nea"
                className="group inline-flex items-center gap-1.5 font-display text-sm font-bold text-brand-600 hover:text-brand-800"
              >
                Όλα τα νέα ({home.total})
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            }
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
            <FeaturedPostCard post={lead} />
            {secondary.length > 0 && (
              <div className="flex flex-col gap-4">
                {secondary.map((post) => (
                  <PostRow key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------- Quick links */}
      {(settings.quickLinks ?? []).length > 0 && (
        <section className="border-y border-black/6 bg-mist">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <SectionHeading
              title="Χρήσιμες πληροφορίες"
              description="Οι σελίδες που αναζητούν συχνότερα οι γονείς και κηδεμόνες μας."
              className="mb-8"
            />
            <QuickLinks links={settings.quickLinks ?? []} />
          </div>
        </section>
      )}

      {/* --------------------------------------------------------- Recent grid */}
      {(home.recent ?? []).length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading title="Σχολική ζωή" description="Πρόσφατες δράσεις, επισκέψεις και εκδηλώσεις." className="mb-8" />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {home.recent.map((post) => (
              <li key={post._id} className="reveal">
                <PostCard post={post} />
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <Link
              href="/nea"
              className="group inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3.5 font-display text-sm font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700"
            >
              Δείτε όλα τα νέα
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------- Contact */}
      <section className="border-t border-black/6 bg-mist">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading
            title="Ελάτε να μας γνωρίσετε"
            description="Είμαστε στη διάθεσή σας για κάθε απορία σχετικά με το σχολείο μας."
            action={
              <Link
                href="/epikoinonia"
                className="group inline-flex items-center gap-1.5 font-display text-sm font-bold text-brand-600 hover:text-brand-800"
              >
                Σελίδα επικοινωνίας
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            }
            className="mb-8"
          />
          <ContactPanel settings={settings} />
        </div>
      </section>
    </>
  );
}

/** Highlights the final two words of the hero headline with the brand gradient. */
function HeroTitle({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  if (words.length < 4) return <>{text}</>;
  const head = words.slice(0, -2).join(" ");
  const tail = words.slice(-2).join(" ");
  return (
    <>
      {head} <span className="text-gradient">{tail}</span>
    </>
  );
}
