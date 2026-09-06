import { AnnouncementBar } from "@/components/announcement-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Announcement, Navigation, SiteSettings } from "@/lib/types";
import { sanityFetch, SanityLive } from "@/sanity/live";
import { announcementQuery, navigationQuery, settingsQuery } from "@/sanity/queries";

/** Chrome shared by every public page: notice bar, header, footer, live updates. */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [settingsResult, navResult, announcementResult] = await Promise.all([
    sanityFetch({ query: settingsQuery, stega: false }),
    sanityFetch({ query: navigationQuery, stega: false }),
    sanityFetch({ query: announcementQuery, stega: false }),
  ]);

  const settings = (settingsResult.data ?? {}) as SiteSettings;
  const navigation = (navResult.data ?? {}) as Navigation;
  const announcement = (announcementResult.data ?? {}) as Announcement;
  const items = navigation.items ?? [];
  const headerTitle = settings.shortTitle ?? settings.title ?? "8ο Δημοτικό Αγίας Παρασκευής";

  return (
    <div className="flex min-h-full flex-col">
      <AnnouncementBar announcement={announcement} />
      <SiteHeader items={items} title={headerTitle} logo={settings.logo} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter settings={settings} items={items} footerNote={navigation.footerNote} />
      <SanityLive />
    </div>
  );
}
