import { Section, EmptyState } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Briefcase } from "lucide-react";
import type { TimelineEntry } from "@/types/database";

export function Timeline({ items }: { items: TimelineEntry[] }) {
  return (
    <Section
      id="timeline"
      eyebrow="Career"
      title="A trajectory of impact"
      description="Leadership roles and milestones that have shaped organizations and markets."
    >
      {items.length === 0 ? (
        <EmptyState label="Career timeline entries will appear here once added in the dashboard." />
      ) : (
        <div className="relative mx-auto max-w-3xl">
          {/* Vertical spine */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-[var(--accent)]/60 via-white/10 to-transparent sm:left-1/2" />

          <div className="space-y-10">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={(i % 4) * 60}>
                <div
                  className={`relative flex flex-col gap-1 pl-12 sm:w-1/2 sm:pl-0 ${
                    i % 2 === 0 ? "sm:ml-auto sm:pl-12" : "sm:pr-12 sm:text-right"
                  }`}
                >
                  {/* Node */}
                  <span
                    className={`absolute left-2.5 top-1.5 grid h-4 w-4 place-items-center rounded-full border-2 border-[var(--accent)] bg-ink-950 ${
                      i % 2 === 0 ? "sm:-left-2" : "sm:-right-2 sm:left-auto"
                    }`}
                  >
                    {item.is_current && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    )}
                  </span>

                  <div className="card p-5">
                    <div
                      className={`flex items-center gap-2 text-xs font-medium text-[var(--accent-soft)] ${
                        i % 2 === 0 ? "" : "sm:justify-end"
                      }`}
                    >
                      <Briefcase className="h-3.5 w-3.5" />
                      {item.start_date}
                      {item.start_date && (item.end_date || item.is_current) && " — "}
                      {item.is_current ? "Present" : item.end_date}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-white">{item.role}</h3>
                    {item.organization && (
                      <p className="text-sm text-ink-300">
                        {item.organization}
                        {item.location ? ` · ${item.location}` : ""}
                      </p>
                    )}
                    {item.description && (
                      <p className="mt-3 text-sm leading-relaxed text-ink-300">{item.description}</p>
                    )}
                    {item.achievements.length > 0 && (
                      <ul
                        className={`mt-3 space-y-1.5 text-sm text-ink-300 ${
                          i % 2 === 0 ? "" : "sm:list-none"
                        }`}
                      >
                        {item.achievements.map((a, idx) => (
                          <li key={idx} className="flex gap-2 sm:justify-start">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
