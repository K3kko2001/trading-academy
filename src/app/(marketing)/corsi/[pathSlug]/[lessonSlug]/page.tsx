import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUser, getProfile, hasActiveSubscription } from "@/lib/dal";
import { completeLesson } from "@/app/actions/progress";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pathSlug: string; lessonSlug: string }>;
}): Promise<Metadata> {
  const { pathSlug, lessonSlug } = await params;
  const supabase = await createClient();

  const { data: path } = await supabase
    .from("paths")
    .select("id")
    .eq("slug", pathSlug)
    .single();

  if (!path) return {};

  const { data: lesson } = await supabase
    .from("lessons")
    .select("title, summary, image_url")
    .eq("path_id", path.id)
    .eq("slug", lessonSlug)
    .single();

  if (!lesson) return {};

  return {
    title: lesson.title,
    description: lesson.summary ?? undefined,
    openGraph: lesson.image_url
      ? { images: [{ url: lesson.image_url, width: 1200, height: 630 }] }
      : undefined,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ pathSlug: string; lessonSlug: string }>;
}) {
  const { pathSlug, lessonSlug } = await params;
  const supabase = await createClient();

  const { data: path } = await supabase
    .from("paths")
    .select("*")
    .eq("slug", pathSlug)
    .single();

  if (!path) notFound();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("path_id", path.id)
    .eq("slug", lessonSlug)
    .single();

  if (!lesson) notFound();

  const [user, profile, isSubscriber] = await Promise.all([
    getUser(),
    getProfile(),
    hasActiveSubscription(),
  ]);

  const isAdmin = profile?.role === "admin";
  const isLocked = lesson.is_premium && !isSubscriber && !isAdmin;
  const showUpsell = !lesson.is_premium && !isSubscriber;

  let completed = false;
  if (user) {
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("lesson_id", lesson.id)
      .maybeSingle();
    completed = Boolean(progress);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <Link
        href={`/corsi/${pathSlug}`}
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={14} /> {path.title}
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <h1 className="text-3xl font-semibold">{lesson.title}</h1>
        {lesson.is_premium && (
          <span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
            <Lock size={12} /> Premium
          </span>
        )}
      </div>

      {lesson.summary && <p className="mt-3 text-muted">{lesson.summary}</p>}

      {lesson.image_url && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={lesson.image_url}
            alt={lesson.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {isLocked ? (
        <div className="relative mt-8">
          <div className="prose prose-invert prose-headings:text-foreground prose-p:text-muted prose-li:text-muted max-h-56 max-w-none overflow-hidden">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lesson.content ?? ""}
            </ReactMarkdown>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

          <div className="relative mt-4 rounded-2xl border border-white/10 bg-card p-8 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10 text-amber-300">
              <Lock size={20} />
            </span>
            <p className="mt-4 font-medium">
              Questa lezione fa parte del piano Premium.
            </p>
            <p className="mt-2 text-sm text-muted">
              Sblocca strategie avanzate, esempi di trade reali e il trading
              journal con l&apos;abbonamento Premium.
            </p>
            <Link
              href="/prezzi"
              className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
            >
              Vedi i piani
            </Link>
          </div>
        </div>
      ) : (
        <>
          <article className="prose prose-invert prose-headings:text-foreground prose-p:text-muted prose-li:text-muted prose-strong:text-foreground mt-8 max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lesson.content ?? ""}
            </ReactMarkdown>
          </article>

          {!lesson.is_premium &&
            (user ? (
              <form action={completeLesson} className="mt-10">
                <input type="hidden" name="lessonId" value={lesson.id} />
                <input type="hidden" name="pathSlug" value={pathSlug} />
                <button
                  type="submit"
                  disabled={completed}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {completed ? (
                    <>
                      <CheckCircle2 size={16} /> Lezione completata
                    </>
                  ) : (
                    "Segna come completata"
                  )}
                </button>
              </form>
            ) : (
              <p className="mt-10 text-sm text-muted">
                <Link href="/login" className="font-medium text-accent hover:underline">
                  Accedi
                </Link>{" "}
                per salvare i tuoi progressi.
              </p>
            ))}

          {showUpsell && (
            <div className="mt-12 rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Sparkles size={18} />
              </span>
              <p className="mt-3 font-medium">Vuoi scoprire di più?</p>
              <p className="mt-1 text-sm text-muted">
                {user
                  ? "Passa a Premium per sbloccare strategie avanzate, esempi di trade reali e il trading journal."
                  : "Registrati gratis per salvare i tuoi progressi e continuare il percorso Fondamenta."}
              </p>
              <Link
                href={user ? "/prezzi" : "/registrati"}
                className="mt-4 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
              >
                {user ? "Passa a Premium" : "Registrati gratis"}
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
