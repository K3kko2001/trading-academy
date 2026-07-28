import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: paths }, { data: lessons }, { data: posts }] = await Promise.all([
    supabase.from("paths").select("slug"),
    supabase.from("lessons").select("slug, paths(slug)"),
    supabase
      .from("news_posts")
      .select("slug, published_at")
      .eq("status", "published"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/corsi`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/prezzi`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/registrati`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const pathRoutes: MetadataRoute.Sitemap = (paths ?? []).map((path) => ({
    url: `${SITE_URL}/corsi/${path.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const lessonRoutes: MetadataRoute.Sitemap = (lessons ?? [])
    .filter((lesson) => lesson.paths)
    .map((lesson) => ({
      url: `${SITE_URL}/corsi/${(lesson.paths as unknown as { slug: string }).slug}/${lesson.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.published_at ?? undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...pathRoutes, ...lessonRoutes, ...postRoutes];
}
