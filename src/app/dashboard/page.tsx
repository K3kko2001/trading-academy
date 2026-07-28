import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Award, Sparkles } from "lucide-react";
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

  const supabase = await createClient();
  const { data: paths } = await supabase
    .from("paths")
    .select("id, slug, title")
    .order("order_index");

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id);

  const completedCount = progress?.length ?? 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">
        Bentornato, {profile?.full_name ?? user.email}
      </h1>

      <div className="mt-6 flex flex-wrap gap-4">
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
      </div>

      {!isSubscriber && (
        <Link
          href="/prezzi"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
        >
          Passa a Premium
          <ArrowRight size={14} />
        </Link>
      )}

      <h2 className="mt-12 text-xl font-semibold">I tuoi percorsi</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {paths?.map((path) => (
          <Link
            key={path.id}
            href={`/corsi/${path.slug}`}
            className="rounded-2xl border border-white/10 bg-card p-6 transition-colors hover:border-accent/40"
          >
            <h3 className="font-semibold">{path.title}</h3>
            <span className="mt-2 inline-flex items-center gap-1 text-sm text-muted">
              Continua <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
