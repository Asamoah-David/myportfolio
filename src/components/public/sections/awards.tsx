import Image from "next/image";
import { Section, EmptyState } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Trophy, ExternalLink } from "lucide-react";
import type { Award } from "@/types/database";

export function Awards({ items }: { items: Award[] }) {
  return (
    <Section
      id="awards"
      eyebrow="Recognition"
      title="Awards & honors"
      description="Recognition from leading institutions, peers and industry bodies."
    >
      {items.length === 0 ? (
        <EmptyState label="Awards and recognition will appear here once added in the dashboard." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 70}>
              <article className="card group h-full p-6">
                <div className="flex items-center gap-4">
                  {a.image_url ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10">
                      <Image src={a.image_url} alt={a.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent-soft)]">
                      <Trophy className="h-6 w-6" />
                    </div>
                  )}
                  {a.year && (
                    <span className="ml-auto text-sm font-semibold text-ink-400">{a.year}</span>
                  )}
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">{a.title}</h3>
                {a.organization && <p className="mt-1 text-sm text-ink-400">{a.organization}</p>}
                {a.description && (
                  <p className="mt-3 text-sm leading-relaxed text-ink-300">{a.description}</p>
                )}
                {a.url && (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--accent-soft)] opacity-0 transition-opacity group-hover:opacity-100 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" /> Details
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}
