import { Section, EmptyState } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Mic, MapPin, PlayCircle, Presentation } from "lucide-react";
import type { SpeakingEngagement } from "@/types/database";

export function Speaking({ items }: { items: SpeakingEngagement[] }) {
  return (
    <Section
      id="speaking"
      eyebrow="Speaking"
      title="On the stage"
      description="Keynotes, panels and workshops at conferences worldwide."
    >
      {items.length === 0 ? (
        <EmptyState label="Speaking engagements will appear here once added in the dashboard." />
      ) : (
        <div className="mx-auto max-w-4xl space-y-4">
          {items.map((s, i) => (
            <Reveal key={s.id} delay={(i % 4) * 60}>
              <article className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent-soft)]">
                  <Mic className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-medium capitalize text-[var(--accent-soft)]">
                      {s.type}
                    </span>
                    {s.date && <span className="text-ink-400">{s.date}</span>}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-1 text-sm text-ink-400">
                    {[s.event, s.location].filter(Boolean).join(" · ")}
                  </p>
                  {s.description && (
                    <p className="mt-2 text-sm leading-relaxed text-ink-300">{s.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-3 text-sm sm:flex-col sm:items-end">
                  {s.video_url && (
                    <a
                      href={s.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[var(--accent-soft)] hover:underline"
                    >
                      <PlayCircle className="h-4 w-4" /> Watch
                    </a>
                  )}
                  {s.slides_url && (
                    <a
                      href={s.slides_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-ink-300 hover:text-white"
                    >
                      <Presentation className="h-4 w-4" /> Slides
                    </a>
                  )}
                  {s.location && !s.video_url && !s.slides_url && (
                    <span className="inline-flex items-center gap-1.5 text-ink-400">
                      <MapPin className="h-4 w-4" /> {s.location}
                    </span>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}
