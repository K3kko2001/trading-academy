import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <TrendingUp size={18} strokeWidth={2.5} />
              </span>
              Trading Academy
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted">
              Il percorso interattivo per imparare a fare trading, dalle basi
              alle strategie avanzate.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Impara</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/corsi" className="hover:text-foreground">
                  Percorso corsi
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/prezzi" className="hover:text-foreground">
                  Prezzi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Account</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/registrati" className="hover:text-foreground">
                  Registrati
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground">
                  Accedi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Trading Academy</p>
          <p>A scopo educativo, non è consulenza finanziaria.</p>
        </div>
      </div>
    </footer>
  );
}
