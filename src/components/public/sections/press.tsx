import Image from "next/image";
import { Section, EmptyState } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Newspaper, ArrowUpRight } from "lucide-react";
import type { Press as PressItem } from "@/types/database";

export function Press({ items }: { items: PressItem[] }) {
  return (
    <Section
      id="press"
      eyebrow="Media & Press"
      title="In the spotlight"
      description="Features, interviews and coverage across leading outlets."
    >
      {items.length === 0 ? (
        <EmptyState label="Press and media coverage will appear here once added in the dashboard." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => {
            const Wrapper = p.url ? "a" : "div";
            return (
              <Reveal key={p.id} delay={(i % 3) * 70}>
                <Wrapper
                  {...(p.url
                    ? { href: p.url, target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="card group block h-full overflow-hidden"
                >
                  {p.image_url && (
                    <div className="relative aspect-[16/9] overflow-hidden bg-ink-850">
                      <Image
                        src={p.image_url}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-ink-400">
                      <Newspaper className="h-3.5 w-3.5" />
                      <span className="font-medium text-[var(--accent-soft)]">{p.outlet}</span>
                      {p.date && <span>· {p.date}</span>}
                    </div>
                    <h3 className="mt-2 flex items-start gap-1.5 text-base font-semibold text-white">
                      {p.title}
                      {p.url && (
                        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                    </h3>
                    {p.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-300">
                        {p.excerpt}
                      </p>
                    )}
                  </div>
                </Wrapper>
              </Reveal>
            );
          })}
        </div>
      )}
    </Section>
  );
}
