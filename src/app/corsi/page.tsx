import Link from "next/link";
import { ArrowRight, BookOpen, LineChart, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const levelLabels: Record<string, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzato: "Avanzato",
};

const levelIcons: Record<string, React.ElementType> = {
  principiante: BookOpen,
  intermedio: LineChart,
  avanzato: Sparkles,
};

export default async function CorsiPage() {
  const supabase = await createClient();
  const { data: paths } = await supabase
    .from("paths")
    .select("*")
    .order("order_index");

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold sm:text-4xl">Percorso corsi</h1>
      <p className="mt-2 text-muted">
        Dalle basi alle strategie avanzate, un livello alla volta.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {paths?.map((path) => {
          const Icon = levelIcons[path.level] ?? BookOpen;
          return (
            <Link
              key={path.id}
              href={`/corsi/${path.slug}`}
              className="group rounded-2xl border border-white/10 bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon size={20} />
              </span>
              <span className="mt-4 block text-xs font-medium uppercase tracking-wide text-muted">
                {levelLabels[path.level] ?? path.level}
              </span>
              <h2 className="mt-1 text-xl font-semibold">{path.title}</h2>
              <p className="mt-2 text-sm text-muted">{path.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                Inizia <ArrowRight size={14} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
