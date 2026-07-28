import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2, Lock, User } from "lucide-react";
import { getUser, getProfile, hasActiveSubscription } from "@/lib/dal";
import { updateProfile, updatePassword } from "@/app/actions/profile";

export const metadata: Metadata = {
  title: "Impostazioni",
  robots: { index: false, follow: false },
};

export default async function ImpostazioniPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    updated?: string;
    passwordError?: string;
    passwordUpdated?: string;
  }>;
}) {
  const user = await getUser();
  if (!user) redirect("/login");

  const { error, updated, passwordError, passwordUpdated } = await searchParams;

  const [profile, isSubscriber] = await Promise.all([
    getProfile(),
    hasActiveSubscription(),
  ]);

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Impostazioni</h1>
      <p className="mt-2 text-muted">Gestisci il tuo profilo e il tuo account.</p>

      <section className="mt-10 rounded-2xl border border-white/10 bg-card p-6">
        <div className="flex items-center gap-2 font-semibold">
          <User size={18} className="text-accent" /> Profilo
        </div>

        {updated && (
          <p className="mt-4 flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-accent">
            <CheckCircle2 size={16} /> Profilo aggiornato.
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <form action={updateProfile} className="mt-6 space-y-4">
          <div>
            <label htmlFor="fullName" className="text-sm font-medium">
              Nome
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              defaultValue={profile?.full_name ?? ""}
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              value={user.email ?? ""}
              disabled
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-background/50 px-4 py-2.5 text-sm text-muted"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Piano</label>
            <p className="mt-1.5 text-sm text-muted">
              {isSubscriber ? "Premium" : "Gratis"}
            </p>
          </div>
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
          >
            Salva modifiche
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-card p-6">
        <div className="flex items-center gap-2 font-semibold">
          <Lock size={18} className="text-accent" /> Password
        </div>

        {passwordUpdated && (
          <p className="mt-4 flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-accent">
            <CheckCircle2 size={16} /> Password aggiornata.
          </p>
        )}
        {passwordError && (
          <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {decodeURIComponent(passwordError.replace(/\+/g, " "))}
          </p>
        )}

        <form action={updatePassword} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Nuova password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Conferma nuova password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-medium hover:bg-white/5"
          >
            Aggiorna password
          </button>
        </form>
      </section>
    </div>
  );
}
