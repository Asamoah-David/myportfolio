"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FolderKanban,
  Award,
  BadgeCheck,
  FileText,
  ScrollText,
  Mic,
  Newspaper,
  Quote,
  Images,
  Sparkles,
  Mail,
  Search,
  Settings,
  Menu,
  X,
  ExternalLink,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "./logout-button";

const NAV: { group: string; items: { href: string; label: string; icon: typeof User }[] }[] = [
  {
    group: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    group: "Content",
    items: [
      { href: "/admin/profile", label: "Profile", icon: User },
      { href: "/admin/expertise", label: "Expertise", icon: Sparkles },
      { href: "/admin/timeline", label: "Experience", icon: Briefcase },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/categories", label: "Categories", icon: Tags },
      { href: "/admin/publications", label: "Publications", icon: FileText },
      { href: "/admin/patents", label: "Patents & IP", icon: ScrollText },
      { href: "/admin/awards", label: "Awards", icon: Award },
      { href: "/admin/certifications", label: "Certifications", icon: BadgeCheck },
      { href: "/admin/speaking", label: "Speaking", icon: Mic },
      { href: "/admin/press", label: "Media & Press", icon: Newspaper },
      { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
      { href: "/admin/media", label: "Gallery & Media", icon: Images },
    ],
  },
  {
    group: "Communication",
    items: [{ href: "/admin/messages", label: "Messages", icon: Mail }],
  },
  {
    group: "Configuration",
    items: [
      { href: "/admin/seo", label: "SEO", icon: Search },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar({ unread = 0 }: { unread?: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/5 bg-ink-950/90 px-4 backdrop-blur lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--accent)] text-sm font-bold text-black">
            ◆
          </span>
          <span className="text-sm font-semibold text-white">Admin</span>
        </Link>
        <button onClick={() => setOpen((v) => !v)} className="text-white" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-white/5 bg-ink-900 transition-transform lg:translate-x-0 lg:flex",
          open ? "flex translate-x-0" : "hidden -translate-x-full lg:flex",
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-white/5 px-5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent)] text-base font-bold text-black">
            ◆
          </span>
          <div>
            <div className="text-sm font-semibold text-white">Portfolio</div>
            <div className="text-[11px] text-ink-500">Admin Console</div>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV.map((section) => (
            <div key={section.group}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-ink-600">
                {section.group}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-[var(--accent)]/12 text-white"
                          : "text-ink-300 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active ? "text-[var(--accent-soft)]" : "text-ink-500",
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.href === "/admin/messages" && unread > 0 && (
                        <span className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-bold text-black">
                          {unread}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/5 p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-4 w-4 text-ink-500" />
            View live site
          </a>
          <LogoutButton />
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
    </>
  );
}
