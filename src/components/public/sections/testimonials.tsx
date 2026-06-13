import Image from "next/image";
import { Section, EmptyState } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Quote, Star } from "lucide-react";
import { initials } from "@/lib/utils";
import type { Testimonial } from "@/types/database";

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <Section
      id="testimonials"
      eyebrow="Testimonials"
      title="Trusted by leaders"
      description="What executives, peers and partners say about working together."
    >
      {items.length === 0 ? (
        <EmptyState label="Testimonials will appear here once added in the dashboard." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 70}>
              <figure className="card flex h-full flex-col p-6">
                <Quote className="h-7 w-7 text-[var(--accent)]/40" />
                {t.rating ? (
                  <div className="mt-3 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-4 w-4 ${
                          idx < (t.rating ?? 0)
                            ? "fill-[var(--accent)] text-[var(--accent)]"
                            : "text-ink-600"
                        }`}
                      />
                    ))}
                  </div>
                ) : null}
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-200">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
                  {t.avatar_url ? (
                    <Image
                      src={t.avatar_url}
                      alt={t.name}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--accent)]/15 text-sm font-semibold text-[var(--accent-soft)]">
                      {initials(t.name)}
                    </span>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    {(t.title || t.company) && (
                      <div className="text-xs text-ink-400">
                        {[t.title, t.company].filter(Boolean).join(", ")}
                      </div>
                    )}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}
