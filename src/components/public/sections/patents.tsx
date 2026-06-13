import { Section, EmptyState } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ScrollText, ExternalLink } from "lucide-react";
import type { Patent } from "@/types/database";

export function Patents({ items }: { items: Patent[] }) {
  return (
    <Section
      id="patents"
      eyebrow="Intellectual Property"
      title="Patents & inventions"
      description="Protected innovations and original intellectual property."
    >
      {items.length === 0 ? (
        <EmptyState label="Patents and intellectual property will appear here once added in the dashboard." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 80}>
              <article className="card h-full p-6">
                <div className="flex items-start justify-between gap-3">
                  <ScrollText className="h-6 w-6 text-[var(--accent)]" />
                  <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs font-medium capitalize text-ink-300">
                    {p.status}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{p.title}</h3>
                <dl className="mt-3 space-y-1 text-sm text-ink-400">
                  {p.patent_number && (
                    <div className="flex gap-2">
                      <dt className="text-ink-500">No.</dt>
                      <dd className="text-ink-200">{p.patent_number}</dd>
                    </div>
                  )}
                  {p.office && (
                    <div className="flex gap-2">
                      <dt className="text-ink-500">Office</dt>
                      <dd>{p.office}</dd>
                    </div>
                  )}
                  {(p.filing_date || p.grant_date) && (
                    <div className="flex gap-2">
                      <dt className="text-ink-500">{p.grant_date ? "Granted" : "Filed"}</dt>
                      <dd>{p.grant_date || p.filing_date}</dd>
                    </div>
                  )}
                </dl>
                {p.description && (
                  <p className="mt-3 text-sm leading-relaxed text-ink-300">{p.description}</p>
                )}
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--accent-soft)] hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" /> View filing
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
