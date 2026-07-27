import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("news_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={14} /> Blog
      </Link>
      <span className="mt-4 block text-xs text-muted">
        {post.published_at &&
          new Date(post.published_at).toLocaleDateString("it-IT")}
      </span>
      <h1 className="mt-1 text-3xl font-semibold">{post.title}</h1>
      <article className="prose prose-invert mt-8 max-w-none prose-p:text-muted">
        <p>{post.content}</p>
      </article>
    </div>
  );
}
