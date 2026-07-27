import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("news_posts")
    .select("slug, title, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold sm:text-4xl">
        Blog & aggiornamenti di mercato
      </h1>
      <p className="mt-2 text-muted">
        Recap ed esempi pratici, aggiornati regolarmente.
      </p>

      <div className="mt-10 space-y-4">
        {posts?.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-2xl border border-white/10 bg-card p-6 transition-colors hover:border-accent/40"
          >
            <span className="text-xs text-muted">
              {post.published_at &&
                new Date(post.published_at).toLocaleDateString("it-IT")}
            </span>
            <h2 className="mt-1 text-xl font-semibold">{post.title}</h2>
            {post.excerpt && (
              <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
            )}
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
              Leggi <ArrowRight size={14} />
            </span>
          </Link>
        ))}
        {!posts?.length && (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-muted">
            <Newspaper className="mx-auto mb-3" size={24} />
            Nessun articolo pubblicato ancora.
          </div>
        )}
      </div>
    </div>
  );
}
