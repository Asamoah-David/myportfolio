"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/public/theme-toggle";
import type { SectionConfig } from "@/types/database";

export function Navbar({
  name,
  sections,
  cvUrl,
}: {
  name: string;
  sections: SectionConfig[];
  cvUrl?: string | null;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = sections.filter((s) => s.visible && s.key !== "contact").slice(0, 7);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-lg" : "bg-transparent",
      )}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <Link href="#top" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent)] text-sm font-bold text-black">
            {(name || "P").trim().charAt(0).toUpperCase()}
          </span>
          <span className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-white">
            {name || "Portfolio"}
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((s) => (
            <a
              key={s.key}
              href={`#${s.key}`}
              className="rounded-full px-3.5 py-2 text-sm text-ink-300 transition-colors hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {cvUrl && (
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ink-300 transition-colors hover:text-white"
            >
              <Download className="h-4 w-4" /> CV
            </a>
          )}
          <a
            href="#contact"
            className="inline-flex h-9 items-center rounded-full bg-[var(--accent)] px-4 text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-soft)]"
          >
            Get in touch
          </a>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            className="grid h-10 w-10 place-items-center rounded-lg text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass border-t border-white/5 lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {navItems.map((s) => (
              <a
                key={s.key}
                href={`#${s.key}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-ink-200 hover:bg-white/5"
              >
                {s.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-[var(--accent)] px-4 text-sm font-semibold text-black"
            >
              Get in touch
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
