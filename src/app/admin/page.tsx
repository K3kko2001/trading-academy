import { redirect } from "next/navigation";
import { FileCheck, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUser, getProfile } from "@/lib/dal";
import { publishNewsPost } from "@/app/actions/admin";

export default async function AdminPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const profile = await getProfile();
  if (profile?.role !== "admin") {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-300">
          <ShieldAlert size={22} />
        </span>
        <h1 className="mt-4 text-2xl font-semibold">Accesso non autorizzato</h1>
        <p className="mt-2 text-muted">
          Questa sezione è riservata agli amministratori.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: drafts } = await supabase
    .from("news_posts")
    .select("id, title, excerpt, source, created_at")
    .eq("status", "draft")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Bozze in attesa di revisione</h1>
      <p className="mt-2 text-muted">
        Contenuti generati automaticamente: rivedi e pubblica.
      </p>

      <div className="mt-10 space-y-4">
        {drafts?.map((draft) => (
          <div
            key={draft.id}
            className="rounded-2xl border border-white/10 bg-card p-6"
          >
            <h2 className="font-semibold">{draft.title}</h2>
            {draft.excerpt && (
              <p className="mt-2 text-sm text-muted">{draft.excerpt}</p>
            )}
            <span className="mt-2 block text-xs text-muted">
              Fonte: {draft.source ?? "n/d"}
            </span>
            <form action={publishNewsPost} className="mt-4">
              <input type="hidden" name="postId" value={draft.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
              >
                Pubblica
              </button>
            </form>
          </div>
        ))}
        {!drafts?.length && (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-muted">
            <FileCheck className="mx-auto mb-3" size={24} />
            Nessuna bozza in attesa.
          </div>
        )}
      </div>
    </div>
  );
}
