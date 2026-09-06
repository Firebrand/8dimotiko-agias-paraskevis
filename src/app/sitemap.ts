import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/utils";
import { client } from "@/sanity/client";
import { sitemapQuery } from "@/sanity/queries";

export const revalidate = 3600;

type Result = {
  posts: { slug: string; _updatedAt: string; publishedAt: string }[];
  pages: { slug: string; _updatedAt: string }[];
  categories: { slug: string; _updatedAt: string }[];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const data = (await client.fetch(sitemapQuery)) as Result;

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/nea`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...(data.pages ?? []).map((page) => ({
      url: `${base}/${page.slug}`,
      lastModified: new Date(page._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...(data.posts ?? []).map((post) => ({
      url: `${base}/nea/${post.slug}`,
      lastModified: new Date(post._updatedAt ?? post.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...(data.categories ?? []).map((category) => ({
      url: `${base}/nea/kategoria/${category.slug}`,
      lastModified: new Date(category._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
