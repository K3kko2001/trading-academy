import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Award, PlayCircle, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUser, getProfile, hasActiveSubscription } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const [profile, isSubscriber] = await Promise.all([
    getProfile(),
    hasActiveSubscription(),
  ]);
  const hasFullAccess = isSubscriber || profile?.role === "admin";

  const supabase = await createClient();

  const [{ data: paths }, { data: lessons }, { data: progress }] = await Promise.all([
    supabase.from("paths").select("id, slug, title, image_url").order("order_index"),
    supabase
      .from("lessons")
      .select("id, path_id, slug, title, summary, image_url, is_premium, order_index")
      .order("order_index"),
    supabase.from("lesson_progress").select("lesson_id").eq("user_id", user.id),
  ]);

  const completedIds = new Set((progress ?? []).map((p) => p.lesson_id));
  const completedCount = completedIds.size;

  const lessonsByPath = new Map<string, { total: number; done: number }>();
  for (const lesson of lessons ?? []) {
    const entry = lessonsByPath.get(lesson.path_id) ?? { total: 0, done: 0 };
    entry.total += 1;
    if (completedIds.has(lesson.id)) entry.done += 1;
    lessonsByPath.set(lesson.path_id, entry);
  }

  const pathById = new Map((paths ?? []).map((p) => [p.id, p]));

  type Lesson = NonNullable<typeof lessons>[number];
  let nextLesson: Lesson | undefined;
  for (const path of paths ?? []) {
    const found = (lessons ?? [])
      .filter((l) => l.path_id === path.id)
      .find((l) => !completedIds.has(l.id) && (!l.is_premium || hasFullAccess));
    if (found) {
      nextLesson = found;
      break;
    }
  }
  const nextLessonPath = nextLesson ? pathById.get(nextLesson.path_id) : undefined;

  const name = profile?.full_name ?? user.email;

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-white/10">
        <Image
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1800&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        <div className="relative mx-auto max-w-6xl px-6 py-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <Sparkles size={12} />
            {isSubscriber ? "Piano Premium" : "Piano Gratis"}
          </span>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Bentornato, {name}
          </h1>
          <p className="mt-2 text-muted">
            Continua da dove avevi lasciato o esplora un nuovo percorso.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Sparkles size={18} />
            </span>
            <div>
              <p className="text-xs text-muted">Piano attuale</p>
              <p className="font-semibold">{isSubscriber ? "Premium" : "Gratis"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Award size={18} />
            </span>
            <div>
              <p className="text-xs text-muted">Lezioni completate</p>
              <p className="font-semibold">{completedCount}</p>
            </div>
          </div>

          {!isSubscriber && (
            <Link
              href="/prezzi"
              className="flex items-center gap-2 rounded-2xl border border-accent/30 bg-accent/5 px-5 py-4 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
            >
              Passa a Premium
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {nextLesson && nextLessonPath && (
          <>
            <h2 className="mt-12 text-xl font-semibold">Continua da qui</h2>
            <Link
              href={`/corsi/${nextLessonPath.slug}/${nextLesson.slug}`}
              className="group mt-6 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card transition-colors hover:border-accent/40 sm:flex-row"
            >
              {nextLesson.image_url && (
                <div className="relative h-40 w-full shrink-0 overflow-hidden sm:h-auto sm:w-64">
                  <Image
                    src={nextLesson.image_url}
                    alt=""
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-center p-6">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">
                  {nextLessonPath.title}
                </span>
                <h3 className="mt-1 text-lg font-semibold">{nextLesson.title}</h3>
                {nextLesson.summary && (
                  <p className="mt-1 text-sm text-muted">{nextLesson.summary}</p>
                )}
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  <PlayCircle size={16} /> Continua lezione
                </span>
              </div>
            </Link>
          </>
        )}

        <h2 className="mt-12 text-xl font-semibold">I tuoi percorsi</h2>
        <div className="mt-6 space-y-3">
          {paths?.map((path) => {
            const stats = lessonsByPath.get(path.id) ?? { total: 0, done: 0 };
            const pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

            return (
              <Link
                key={path.id}
                href={`/corsi/${path.slug}`}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-card px-5 py-4 transition-colors hover:border-accent/40"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium">{path.title}</h3>
                  <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted">
                  {stats.done}/{stats.total} lezioni
                </span>
                <ArrowRight size={16} className="shrink-0 text-muted" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
