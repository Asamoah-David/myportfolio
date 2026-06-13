import Link from "next/link";
import {
  FolderKanban,
  Award,
  FileText,
  Images,
  Mail,
  Mic,
  BadgeCheck,
  Quote,
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function count(table: string, filter?: { col: string; val: unknown }) {
  const supabase = await createClient();
  let q = supabase.from(table).select("id", { count: "exact", head: true });
  if (filter) q = q.eq(filter.col, filter.val);
  const { count } = await q;
  return count ?? 0;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    projects,
    awards,
    publications,
    media,
    speaking,
    certifications,
    testimonials,
    messages,
    unread,
    profile,
  ] = await Promise.all([
    count("projects"),
    count("awards"),
    count("publications"),
    count("media"),
    count("speaking_engagements"),
    count("certifications"),
    count("testimonials"),
    count("contact_messages"),
    count("contact_messages", { col: "is_read", val: false }),
    supabase.from("profile").select("full_name, title").limit(1).maybeSingle(),
  ]);

  const { data: recent } = await supabase
    .from("contact_messages")
    .select("id, name, email, subject, created_at, is_read")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Projects", value: projects, icon: FolderKanban, href: "/admin/projects" },
    { label: "Publications", value: publications, icon: FileText, href: "/admin/publications" },
    { label: "Awards", value: awards, icon: Award, href: "/admin/awards" },
    { label: "Media items", value: media, icon: Images, href: "/admin/media" },
    { label: "Speaking", value: speaking, icon: Mic, href: "/admin/speaking" },
    { label: "Certifications", value: certifications, icon: BadgeCheck, href: "/admin/certifications" },
    { label: "Testimonials", value: testimonials, icon: Quote, href: "/admin/testimonials" },
    { label: "Messages", value: messages, icon: Mail, href: "/admin/messages" },
  ];

  const incomplete = !profile.data?.full_name || !profile.data?.title;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
          Welcome back{profile.data?.full_name ? `, ${profile.data.full_name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          Here&apos;s an overview of your portfolio.
        </p>
      </div>

      {incomplete && (
        <Link
          href="/admin/profile"
          className="mb-6 flex items-center gap-3 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.06] px-4 py-3 transition-colors hover:bg-[var(--accent)]/[0.1]"
        >
          <CircleAlert className="h-5 w-5 text-[var(--accent-soft)]" />
          <span className="flex-1 text-sm text-ink-200">
            Complete your profile to bring your portfolio to life.
          </span>
          <ArrowRight className="h-4 w-4 text-ink-400" />
        </Link>
      )}

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card group p-5">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent-soft)]">
                <s.icon className="h-5 w-5" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-ink-600 transition-colors group-hover:text-white" />
            </div>
            <p className="mt-4 text-3xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-ink-400">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent messages */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Recent messages</h2>
            <Link href="/admin/messages" className="text-sm text-[var(--accent-soft)] hover:underline">
              View all
            </Link>
          </div>
          {recent && recent.length > 0 ? (
            <ul className="divide-y divide-white/5">
              {recent.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-3">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      m.is_read ? "bg-ink-600" : "bg-[var(--accent)]"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{m.name}</p>
                    <p className="truncate text-xs text-ink-500">{m.subject || m.email}</p>
                  </div>
                  <span className="shrink-0 text-xs text-ink-500">{formatDate(m.created_at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-ink-500">No messages yet.</p>
          )}
        </div>

        <div className="card p-6">
          <h2 className="mb-4 text-base font-semibold text-white">Quick actions</h2>
          <div className="space-y-2">
            {[
              { label: "Edit profile", href: "/admin/profile" },
              { label: "Add a project", href: "/admin/projects" },
              { label: "Manage SEO", href: "/admin/seo" },
              { label: "Site settings", href: "/admin/settings" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.02] px-4 py-2.5 text-sm text-ink-200 transition-colors hover:border-[var(--accent)]/30 hover:text-white"
              >
                {a.label}
                <ArrowRight className="h-4 w-4 text-ink-500" />
              </Link>
            ))}
            {unread > 0 && (
              <p className="pt-2 text-xs text-ink-500">
                You have <span className="text-[var(--accent-soft)]">{unread}</span> unread message
                {unread > 1 ? "s" : ""}.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
