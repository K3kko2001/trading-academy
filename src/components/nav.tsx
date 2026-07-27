import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { getProfile } from "@/lib/dal";
import { logout } from "@/app/actions/auth";
import MobileMenu from "@/components/mobile-menu";

export default async function Nav() {
  const profile = await getProfile();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-lg">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <TrendingUp size={18} strokeWidth={2.5} />
          </span>
          Trading Academy
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/80 sm:flex">
          <Link href="/corsi" className="transition-colors hover:text-foreground">
            Percorso corsi
          </Link>
          <Link href="/blog" className="transition-colors hover:text-foreground">
            Blog
          </Link>
          <Link href="/prezzi" className="transition-colors hover:text-foreground">
            Prezzi
          </Link>
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          {profile ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
              >
                Dashboard
              </Link>
              <form action={logout}>
                <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium hover:bg-white/5">
                  Esci
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
              >
                Accedi
              </Link>
              <Link
                href="/registrati"
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.03]"
              >
                Inizia gratis
              </Link>
            </>
          )}
        </div>

        <MobileMenu loggedIn={Boolean(profile)} logoutAction={logout} />
      </div>
    </header>
  );
}
