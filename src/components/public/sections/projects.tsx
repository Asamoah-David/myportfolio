"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Code2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { EmptyState } from "@/components/ui/section";
import type { Project, ProjectCategory } from "@/types/database";

export function Projects({
  projects,
  categories,
}: {
  projects: Project[];
  categories: ProjectCategory[];
}) {
  const [active, setActive] = useState<string>("all");

  const usedCategories = useMemo(() => {
    const ids = new Set(projects.map((p) => p.category_id).filter(Boolean));
    return categories.filter((c) => ids.has(c.id));
  }, [projects, categories]);

  const filtered = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.category_id === active)),
    [projects, active],
  );

  return (
    <section id="projects" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent-soft)]">
            Featured Work
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Projects that moved the needle
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-300">
            Selected work demonstrating technical depth, business impact and design excellence.
          </p>
        </Reveal>

        {projects.length === 0 ? (
          <EmptyState label="Featured projects will appear here once added in the dashboard." />
        ) : (
          <>
            {usedCategories.length > 0 && (
              <div className="mb-10 flex flex-wrap justify-center gap-2">
                <FilterChip active={active === "all"} onClick={() => setActive("all")}>
                  All
                </FilterChip>
                {usedCategories.map((c) => (
                  <FilterChip key={c.id} active={active === c.id} onClick={() => setActive(c.id)}>
                    {c.name}
                  </FilterChip>
                ))}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={(i % 2) * 80}>
                  <article className="card group h-full overflow-hidden">
                    <Link href={`/projects/${p.slug}`} className="block">
                      <div className="relative aspect-[16/10] overflow-hidden bg-ink-850">
                        {p.cover_image ? (
                          <Image
                            src={p.cover_image}
                            alt={p.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-900 text-ink-600">
                            <span className="text-4xl font-bold">
                              {p.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        {p.featured && (
                          <span className="absolute left-4 top-4 rounded-full bg-[var(--accent)] px-2.5 py-1 text-xs font-semibold text-black">
                            Featured
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-ink-400">
                          {p.category?.name && (
                            <span className="text-[var(--accent-soft)]">{p.category.name}</span>
                          )}
                          {p.year && <span>· {p.year}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          {p.repo_url && (
                            <a
                              href={p.repo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-ink-400 transition-colors hover:text-white"
                              aria-label="Source"
                            >
                              <Code2 className="h-4 w-4" />
                            </a>
                          )}
                          {p.demo_url && (
                            <a
                              href={p.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-ink-400 transition-colors hover:text-white"
                              aria-label="Live demo"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                      <Link href={`/projects/${p.slug}`}>
                        <h3 className="mt-2 flex items-center gap-1.5 text-xl font-semibold text-white transition-colors group-hover:text-[var(--accent-soft)]">
                          {p.title}
                          <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                        </h3>
                      </Link>
                      {p.summary && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-300">
                          {p.summary}
                        </p>
                      )}
                      {p.technologies.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {p.technologies.slice(0, 5).map((t) => (
                            <span
                              key={t}
                              className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-0.5 text-xs text-ink-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-[var(--accent)] text-black"
          : "border border-white/10 bg-white/[0.02] text-ink-300 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
