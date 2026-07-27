import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function PathPage({
  params,
}: {
  params: Promise<{ pathSlug: string }>;
}) {
  const { pathSlug } = await params;
  const supabase = await createClient();

  const { data: path } = await supabase
    .from("paths")
    .select("*")
    .eq("slug", pathSlug)
    .single();

  if (!path) notFound();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("slug, title, summary, is_premium, order_index")
    .eq("path_id", path.id)
    .order("order_index");

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <Link
        href="/corsi"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={14} /> Tutti i percorsi
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">{path.title}</h1>
      <p className="mt-2 text-muted">{path.description}</p>

      <ol className="mt-10 space-y-3">
        {lessons?.map((lesson, i) => (
          <li key={lesson.slug}>
            <Link
              href={`/corsi/${pathSlug}/${lesson.slug}`}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-card px-5 py-4 transition-colors hover:border-accent/40"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-xs font-medium text-muted">
                  {i + 1}
                </span>
                {lesson.title}
              </span>
              {lesson.is_premium ? (
                <span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
                  <Lock size={12} /> Premium
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  <CheckCircle2 size={12} /> Gratis
                </span>
              )}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
