import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Coins,
  DollarSign,
  LineChart,
  Newspaper,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import FloatingIcons from "@/components/floating-icons";

const heroFloatingItems = [
  { icon: DollarSign, className: "-left-6 top-4", duration: 6.5, delay: 0.2, rotate: -8 },
  { icon: LineChart, className: "-right-5 top-1/3", duration: 7.5, delay: 0.8, rotate: 6 },
  { icon: Coins, className: "-bottom-6 left-10", duration: 7, delay: 1.4, rotate: -5 },
];

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

const features = [
  {
    icon: BookOpen,
    title: "Percorso strutturato",
    description:
      "Dalle basi alla strategia avanzata, un livello alla volta, senza saltare passaggi.",
  },
  {
    icon: LineChart,
    title: "Esempi pratici",
    description:
      "Breakdown di trade reali: entry, exit e gestione del rischio spiegati passo passo.",
  },
  {
    icon: Newspaper,
    title: "Sempre aggiornato",
    description:
      "Recap di mercato e nuove lezioni, riviste e approvate prima della pubblicazione.",
  },
  {
    icon: ShieldCheck,
    title: "Prima il rischio",
    description:
      "Gestione del rischio e psicologia del trading al centro di ogni lezione.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const { data: paths } = await supabase
    .from("paths")
    .select("slug, title, description, level")
    .order("order_index");

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0" />
        <div className="glow absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted">
              <Sparkles size={14} className="text-accent" />
              Piattaforma educativa interattiva
            </span>

            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Impara a fare{" "}
              <span className="gradient-text">trading</span>, dalle basi
              alle strategie avanzate
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted">
              Lezioni pratiche, esempi di trade reali e aggiornamenti di
              mercato. Inizia gratis con le Fondamenta, cresci al tuo ritmo.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/registrati"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
              >
                Inizia gratis
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/corsi"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium hover:bg-white/5"
              >
                Esplora il percorso corsi
              </Link>
            </div>

            <p className="mt-4 text-xs text-muted">
              Gratis per iniziare · Nessuna carta richiesta
            </p>
          </div>

          <div className="relative">
            <FloatingIcons items={heroFloatingItems} />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
              <Image
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1400&auto=format&fit=crop"
                alt="Grafico a candele di mercato su schermo scuro"
                width={1400}
                height={933}
                priority
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-card p-6 transition-colors hover:border-accent/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <f.icon size={20} />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Path */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Il percorso</h2>
            <p className="mt-2 text-muted">
              Tre livelli, un percorso chiaro dall&apos;inizio alla fine.
            </p>
          </div>
          <Link
            href="/corsi"
            className="hidden items-center gap-1 text-sm font-medium text-accent hover:underline sm:inline-flex"
          >
            Vedi tutto <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {paths?.map((path) => {
            const Icon = levelIcons[path.level] ?? BookOpen;
            return (
              <Link
                key={path.slug}
                href={`/corsi/${path.slug}`}
                className="group rounded-2xl border border-white/10 bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon size={20} />
                </span>
                <span className="mt-4 block text-xs font-medium uppercase tracking-wide text-muted">
                  {levelLabels[path.level] ?? path.level}
                </span>
                <h3 className="mt-1 text-lg font-semibold">{path.title}</h3>
                <p className="mt-2 text-sm text-muted">{path.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Inizia <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden border-t border-white/10">
        <Image
          src="https://images.unsplash.com/photo-1768055104929-cf2317674a80?q=80&w=1800&auto=format&fit=crop"
          alt="Trader analizza grafici di mercato"
          fill
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Pronto a iniziare il tuo percorso?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Registrati gratis e parti dalle Fondamenta oggi stesso.
          </p>
          <Link
            href="/registrati"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
          >
            Crea il tuo account gratis
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
