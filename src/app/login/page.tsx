import Link from "next/link";
import {
  BarChart3,
  Coins,
  DollarSign,
  Lock,
  Mail,
  Percent,
  TrendingUp,
} from "lucide-react";
import { login } from "@/app/actions/auth";
import FloatingIcons from "@/components/floating-icons";

const floatingItems = [
  { icon: TrendingUp, className: "left-[8%] top-[18%]", duration: 7, delay: 0, rotate: -6 },
  { icon: DollarSign, className: "right-[10%] top-[14%]", duration: 6, delay: 0.6, rotate: 8 },
  { icon: Coins, className: "left-[14%] bottom-[20%]", duration: 8, delay: 1.2, rotate: -4 },
  { icon: BarChart3, className: "right-[8%] bottom-[24%]", duration: 6.5, delay: 0.3, rotate: 5 },
  { icon: Percent, className: "right-[22%] top-[46%]", duration: 7.5, delay: 1.6, rotate: -8 },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const { error, redirectTo } = await searchParams;

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

        <h1 className="mt-8 text-2xl font-semibold">Bentornato</h1>
        <p className="mt-1 text-sm text-muted">
          Accedi per continuare il tuo percorso.
        </p>

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <form action={login} className="mt-8 space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo ?? "/dashboard"} />
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
                className="w-full rounded-lg border border-white/10 bg-background px-10 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.01]"
          >
            Accedi
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Non hai un account?{" "}
          <Link href="/registrati" className="font-medium text-accent hover:underline">
            Registrati
          </Link>
        </p>
      </div>
    </div>
  );
}
