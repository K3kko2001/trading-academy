import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Prezzi",
  description:
    "Inizia gratis con il percorso Fondamenta. Passa a Premium per strategie avanzate, esempi di trade reali e trading journal.",
};

const freeFeatures = [
  "Percorso Fondamenta completo",
  "Glossario completo",
  "Blog e recap di mercato (ultimi 7 giorni)",
  "Quiz di verifica per ogni lezione",
  "Calcolatori di rischio/posizione",
];

const premiumFeatures = [
  "Percorsi Intermedio e Avanzato",
  "Esempi pratici di trade reali",
  "Trading journal con statistiche automatiche",
  "Simulatore di paper trading",
  "Community premium e Q&A live mensile",
  "Archivio completo di news e certificati di completamento",
];

export default function PrezziPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold sm:text-4xl">Prezzi</h1>
        <p className="mt-2 text-muted">
          Inizia gratis. Passa a Premium quando sei pronto ad approfondire.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-card p-8">
          <h2 className="text-xl font-semibold">Gratis</h2>
          <p className="mt-1 text-3xl font-semibold">€0</p>
          <ul className="mt-6 space-y-3 text-sm text-muted">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/registrati"
            className="mt-8 block rounded-full border border-white/15 px-6 py-3 text-center text-sm font-medium hover:bg-white/5"
          >
            Inizia gratis
          </Link>
        </div>

        <div className="relative rounded-2xl border-2 border-accent bg-card p-8">
          <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            Consigliato
          </span>
          <h2 className="text-xl font-semibold">Premium</h2>
          <p className="mt-1 text-3xl font-semibold">
            €19<span className="text-base font-normal text-muted">/mese</span>
          </p>
          <ul className="mt-6 space-y-3 text-sm text-muted">
            {premiumFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/registrati"
            className="mt-8 block rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.01]"
          >
            Passa a Premium
          </Link>
        </div>
      </div>
    </div>
  );
}
