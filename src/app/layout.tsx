import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

import type { SiteSettings } from "@/lib/types";
import { hasImage, siteUrl } from "@/lib/utils";
import { imageSrc } from "@/sanity/image";
import { sanityFetch } from "@/sanity/live";
import { settingsQuery } from "@/sanity/queries";

import "./globals.css";

// Both faces ship a Greek subset, which the whole site depends on.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["greek", "latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["greek", "latin"],
  weight: ["700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: settingsQuery, stega: false });
  const settings = (data ?? {}) as SiteSettings;
  const title = settings.title ?? "8ο Δημοτικό Σχολείο Αγίας Παρασκευής";

  // A real photo of the school makes a better social preview than a generated card.
  const hero = (settings.heroImages ?? []).find(hasImage);
  const ogImage = hero ? imageSrc(hero.asset, 1200) : undefined;

  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s · ${settings.shortTitle ?? title}` },
    description: settings.description ?? undefined,
    applicationName: title,
    openGraph: {
      type: "website",
      locale: "el_GR",
      siteName: title,
      title,
      description: settings.description ?? undefined,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
    alternates: { canonical: "/" },
  };
}

/**
 * Root shell only. The public site's header and footer live in the `(site)`
 * group so the Studio at /studio can render on a bare page.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="el"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white">{children}</body>
    </html>
  );
}
