"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  Settings,
  ShieldCheck,
} from "lucide-react";

const marketingLinks = [
  { href: "/corsi", label: "Percorso corsi" },
  { href: "/blog", label: "Blog" },
  { href: "/prezzi", label: "Prezzi" },
];

export default function MobileMenu({
  loggedIn,
  isAdmin,
  logoutAction,
}: {
  loggedIn: boolean;
  isAdmin?: boolean;
  logoutAction: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        className="rounded-lg border border-white/10 p-2 text-foreground"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-white/10 bg-background shadow-2xl shadow-black/50">
          <div className="flex flex-col gap-1 px-6 py-4">
            {loggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/5"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link
                  href="/corsi"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/5"
                >
                  <BookOpen size={16} /> Percorso corsi
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/5"
                  >
                    <ShieldCheck size={16} /> Admin
                  </Link>
                )}
                <Link
                  href="/impostazioni"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/5"
                >
                  <Settings size={16} /> Impostazioni
                </Link>
                <div className="mt-2 border-t border-white/10 pt-3">
                  <form action={logoutAction}>
                    <button className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted hover:bg-white/5">
                      Esci
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                {marketingLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/90 hover:bg-white/5"
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/5"
                  >
                    Accedi
                  </Link>
                  <Link
                    href="/registrati"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-accent px-3 py-2.5 text-center text-sm font-semibold text-accent-foreground"
                  >
                    Registrati
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
