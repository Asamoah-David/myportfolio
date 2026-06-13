import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { Sidebar } from "@/components/admin/sidebar";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Friendly message instead of a 500 when the app isn't connected to Supabase.
  if (!supabaseConfigured) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
          Supabase not configured
        </h1>
        <p className="mt-3 max-w-md text-sm text-ink-400">
          Set <code className="text-[var(--accent-soft)]">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code className="text-[var(--accent-soft)]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{" "}
          <code className="text-[var(--accent-soft)]">SUPABASE_SERVICE_ROLE_KEY</code> to enable the
          dashboard. See the README for setup.
        </p>
      </div>
    );
  }

  // Hard server-side guard (defence-in-depth alongside the proxy).
  await requireAdmin();

  const supabase = await createClient();
  const { count } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  return (
    <div className="min-h-screen bg-ink-950">
      <Sidebar unread={count ?? 0} />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
