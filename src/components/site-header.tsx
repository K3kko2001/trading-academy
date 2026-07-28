import Link from "next/link";
import { TrendingUp, LayoutDashboard, BookOpen, ShieldCheck } from "lucide-react";
import { getUser, getProfile } from "@/lib/dal";
import { logout } from "@/app/actions/auth";
import UserMenu from "@/components/user-menu";
import MobileMenu from "@/components/mobile-menu";

export default async function SiteHeader() {
  const user = await getUser();
  const profile = user ? await getProfile() : null;

  if (!user) {
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
          </div>

          <MobileMenu loggedIn={false} logoutAction={logout} />
        </div>
      </header>
    );
  }

  const name = profile?.full_name ?? user.email ?? "Utente";
  const isAdmin = profile?.role === "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-card">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <TrendingUp size={18} strokeWidth={2.5} />
            </span>
            Trading Academy
          </Link>
          <nav className="hidden items-center gap-1 text-sm font-medium text-muted sm:flex">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 hover:bg-white/5 hover:text-foreground"
            >
              <LayoutDashboard size={15} /> Dashboard
            </Link>
            <Link
              href="/corsi"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 hover:bg-white/5 hover:text-foreground"
            >
              <BookOpen size={15} /> Percorso corsi
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 hover:bg-white/5 hover:text-foreground"
              >
                <ShieldCheck size={15} /> Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="hidden sm:block">
          <UserMenu name={name} email={user.email ?? ""} logoutAction={logout} />
        </div>

        <MobileMenu loggedIn isAdmin={isAdmin} logoutAction={logout} />
      </div>
    </header>
  );
}
