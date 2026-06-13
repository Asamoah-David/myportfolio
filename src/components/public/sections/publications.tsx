import { Section, EmptyState } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { FileText, ExternalLink, Download } from "lucide-react";
import type { Publication } from "@/types/database";

const TYPE_LABEL: Record<string, string> = {
  research: "Research Paper",
  article: "Article",
  whitepaper: "White Paper",
  technical: "Technical Publication",
};

export function Publications({ items }: { items: Publication[] }) {
  return (
    <Section
      id="publications"
      eyebrow="Research & Innovation"
      title="Published thinking"
      description="Peer-reviewed research, white papers and technical writing advancing the field."
    >
      {items.length === 0 ? (
        <EmptyState label="Publications and research will appear here once added in the dashboard." />
      ) : (
        <div className="mx-auto max-w-4xl space-y-4">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 60}>
              <article className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent-soft)]">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-medium text-[var(--accent-soft)]">
                      {TYPE_LABEL[p.type] || p.type}
                    </span>
                    {p.published_date && <span className="text-ink-400">{p.published_date}</span>}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-white">{p.title}</h3>
                  {(p.publisher || p.authors) && (
                    <p className="mt-1 text-sm text-ink-400">
                      {[p.authors, p.publisher].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {p.abstract && (
                    <p className="mt-3 text-sm leading-relaxed text-ink-300">{p.abstract}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[var(--accent-soft)] hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" /> View
                      </a>
                    )}
                    {p.pdf_url && (
                      <a
                        href={p.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-ink-300 hover:text-white"
                      >
                        <Download className="h-4 w-4" /> PDF
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}
