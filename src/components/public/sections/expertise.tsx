import { Section, EmptyState } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/lib/icon";
import type { Expertise as ExpertiseType } from "@/types/database";

export function Expertise({ items }: { items: ExpertiseType[] }) {
  return (
    <Section
      id="expertise"
      eyebrow="Expertise"
      title="Domains of mastery"
      description="Deep, cross-disciplinary expertise spanning the technologies shaping the next decade."
    >
      {items.length === 0 ? (
        <EmptyState label="Areas of expertise will appear here once added in the dashboard." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 80}>
              <div className="card group h-full p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent-soft)] transition-colors group-hover:bg-[var(--accent)]/20">
                  <Icon name={item.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-300">{item.description}</p>
                )}
                {item.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-xs text-ink-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}
