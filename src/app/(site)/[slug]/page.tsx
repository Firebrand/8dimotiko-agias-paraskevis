import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactPanel } from "@/components/contact-panel";
import { ArrowRight, External } from "@/components/icons";
import { PageHeader, SectionHeading } from "@/components/page-header";
import { RichText } from "@/components/rich-text";
import { SanityImage } from "@/components/sanity-image";
import { StaffDirectory } from "@/components/staff-directory";
import type { PageDetail, SectionChild, SiteSettings, StaffMember } from "@/lib/types";
import { hasImage, isExternal, navHref, siteUrl } from "@/lib/utils";
import { imageSrc } from "@/sanity/image";
import { sanityFetch } from "@/sanity/live";
import {
  pageQuery,
  pageSlugsQuery,
  sectionChildrenQuery,
  settingsQuery,
  staffQuery,
} from "@/sanity/queries";

async function getPage(slug: string) {
  const { data } = await sanityFetch({ query: pageQuery, params: { slug }, stega: false });
  return (data ?? null) as PageDetail | null;
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({ query: pageSlugsQuery, stega: false, perspective: "published" });
  return (data ?? []) as { slug: string }[];
}

export async function generateMetadata(props: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const page = await getPage(slug);
  if (!page) return {};

  const cover = hasImage(page.coverImage) ? imageSrc(page.coverImage.asset, 1200) : undefined;

  return {
    title: page.title,
    description: page.subtitle ?? undefined,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "article",
      title: page.title,
      description: page.subtitle ?? undefined,
      url: `${siteUrl()}/${slug}`,
      images: cover ? [{ url: cover, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function StaticPage(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;
  const page = await getPage(slug);
  if (!page) notFound();

  const [childrenResult, staffResult, settingsResult] = await Promise.all([
    sanityFetch({ query: sectionChildrenQuery, params: { slug }, stega: false }),
    page.showStaffDirectory
      ? sanityFetch({ query: staffQuery, stega: false })
      : Promise.resolve({ data: [] }),
    page.showContactDetails
      ? sanityFetch({ query: settingsQuery, stega: false })
      : Promise.resolve({ data: {} }),
  ]);

  const children = (childrenResult.data ?? []) as SectionChild[];
  const staff = (staffResult.data ?? []) as StaffMember[];
  const settings = (settingsResult.data ?? {}) as SiteSettings;
  const hasBody = Boolean(page.body?.length);

  return (
    <>
      <PageHeader
        title={page.title}
        subtitle={page.subtitle}
        cover={page.coverImage}
        crumbs={[{ label: "Αρχική", href: "/" }, { label: page.title }]}
      />

      {hasBody && (
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <RichText value={page.body} />
        </div>
      )}

      {children.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {hasBody && <SectionHeading title="Σε αυτή την ενότητα" className="mb-8" />}
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <li key={child._key} className="reveal">
                <SectionCard child={child} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {staff.length > 0 && (
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <StaffDirectory members={staff} />
        </div>
      )}

      {page.showContactDetails && (
        <section className="border-t border-black/6 bg-mist">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
            <SectionHeading
              title="Στοιχεία επικοινωνίας"
              description="Βρείτε μας εύκολα ή επικοινωνήστε μαζί μας τηλεφωνικά και με email."
              className="mb-8"
            />
            <ContactPanel settings={settings} />

            {settings.parentsAssociationUrl && (
              <a
                href={settings.parentsAssociationUrl}
                target="_blank"
                rel="noreferrer"
                className="group mt-5 flex items-center gap-4 rounded-3xl border border-black/6 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 font-display text-[1.02rem] font-bold text-ink group-hover:text-brand-700">
                    Σύλλογος Γονέων & Κηδεμόνων
                    <External className="size-3.5 opacity-50" />
                  </span>
                  <span className="mt-1 block text-sm text-ink-soft">
                    Επισκεφθείτε την ιστοσελίδα του Συλλόγου Γονέων του σχολείου μας.
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-brand-400 transition-transform group-hover:translate-x-1" />
              </a>
            )}
          </div>
        </section>
      )}

      {!hasBody && !children.length && !staff.length && !page.showContactDetails && (
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-ink-soft">Το περιεχόμενο αυτής της σελίδας ενημερώνεται.</p>
          <Link
            href="/nea"
            className="mt-6 inline-flex items-center gap-2 font-display text-sm font-bold text-brand-600 hover:text-brand-800"
          >
            Δείτε τα νέα του σχολείου
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </>
  );
}

function SectionCard({ child }: { child: SectionChild }) {
  const href = navHref(child);
  const external = isExternal(href);
  const cover = hasImage(child.coverImage) ? child.coverImage : null;

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group flex h-full flex-col overflow-hidden rounded-4xl border border-black/6 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-16/9 overflow-hidden bg-gradient-to-br from-brand-100 via-mist to-sun-50">
        {cover ? (
          <SanityImage
            image={cover}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            fill
            width={800}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 grid place-items-center font-display text-5xl font-extrabold text-brand-200"
          >
            8
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
        <h3 className="flex items-start gap-1.5 font-display text-[1.05rem] leading-snug text-ink transition-colors group-hover:text-brand-700">
          {child.label}
          {external && <External className="mt-1 size-3.5 shrink-0 opacity-50" />}
        </h3>
        {child.subtitle && (
          <p className="line-clamp-3 text-sm leading-relaxed text-ink-soft">{child.subtitle}</p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-bold text-brand-600">
          Μετάβαση
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
