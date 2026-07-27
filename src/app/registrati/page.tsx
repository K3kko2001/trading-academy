import Link from "next/link";
import {
  BarChart3,
  Coins,
  DollarSign,
  Lock,
  Mail,
  Percent,
  TrendingUp,
  User,
} from "lucide-react";
import { signup } from "@/app/actions/auth";
import FloatingIcons from "@/components/floating-icons";

const floatingItems = [
  { icon: TrendingUp, className: "left-[8%] top-[18%]", duration: 7, delay: 0, rotate: -6 },
  { icon: DollarSign, className: "right-[10%] top-[14%]", duration: 6, delay: 0.6, rotate: 8 },
  { icon: Coins, className: "left-[14%] bottom-[20%]", duration: 8, delay: 1.2, rotate: -4 },
  { icon: BarChart3, className: "right-[8%] bottom-[24%]", duration: 6.5, delay: 0.3, rotate: 5 },
  { icon: Percent, className: "right-[22%] top-[46%]", duration: 7.5, delay: 1.6, rotate: -8 },
];

export default async function RegistratiPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; checkEmail?: string }>;
}) {
  const { error, checkEmail } = await searchParams;

  if (checkEmail) {
    return (
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-20">
        <div className="bg-grid absolute inset-0" />
        <div className="glow absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2" />

        <div className="relative flex w-full max-w-sm flex-col items-center rounded-3xl border border-white/10 bg-card/90 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Mail size={22} />
          </span>
          <h1 className="mt-6 text-2xl font-semibold">Controlla la tua email</h1>
          <p className="mt-2 text-sm text-muted">
            Ti abbiamo inviato un link di conferma. Apri l&apos;email e conferma
            l&apos;account per accedere.
          </p>
          <Link href="/login" className="mt-6 text-sm font-medium text-accent hover:underline">
            Vai al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-20">
      <div className="bg-grid absolute inset-0" />
      <div className="glow absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2" />
      <FloatingIcons items={floatingItems} />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-card/90 p-8 shadow-2xl shadow-black/40 backdrop-blur">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <TrendingUp size={18} strokeWidth={2.5} />
          </span>
          Trading Academy
        </Link>

        <h1 className="mt-8 text-2xl font-semibold">Crea il tuo account</h1>
        <p className="mt-1 text-sm text-muted">
          Gratis, per iniziare il percorso Fondamenta.
        </p>

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <form action={signup} className="mt-8 space-y-4">
          <div>
            <label htmlFor="fullName" className="text-sm font-medium">
              Nome
            </label>
            <div className="relative mt-1.5">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="w-full rounded-lg border border-white/10 bg-background px-10 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative mt-1.5">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-white/10 bg-background px-10 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative mt-1.5">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full rounded-lg border border-white/10 bg-background px-10 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.01]"
          >
            Registrati
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Hai già un account?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}
