import { Section, EmptyState } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Target, Compass, BookOpen } from "lucide-react";
import type { Profile } from "@/types/database";

export function About({ profile }: { profile: Profile | null }) {
  const hasBio = Boolean(profile?.bio || profile?.career_overview);
  const cards = [
    { icon: Target, label: "Mission", value: profile?.mission },
    { icon: Compass, label: "Leadership Philosophy", value: profile?.philosophy },
    { icon: BookOpen, label: "Executive Summary", value: profile?.executive_summary },
  ].filter((c) => c.value);

  return (
    <Section id="about" eyebrow="About" title="Vision meets execution">
      {!hasBio && cards.length === 0 ? (
        <EmptyState label="Biography and leadership philosophy will appear here once added in the dashboard." />
      ) : (
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="prose-exec max-w-none">
            {profile?.bio ? (
              profile.bio.split("\n").filter(Boolean).map((p, i) => (
                <p key={i} className="text-lg">
                  {p}
                </p>
              ))
            ) : (
              <p className="text-lg">{profile?.career_overview}</p>
            )}
            {profile?.bio && profile?.career_overview && (
              <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--accent-soft)]">
                  Career Overview
                </h3>
                <p className="text-base text-ink-300">{profile.career_overview}</p>
              </div>
            )}
          </Reveal>

          <div className="space-y-4">
            {cards.map((c, i) => (
              <Reveal key={c.label} delay={i * 80}>
                <div className="card p-6">
                  <c.icon className="h-6 w-6 text-[var(--accent)]" />
                  <h3 className="mt-4 text-sm font-semibold uppercase tracking-widest text-ink-400">
                    {c.label}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink-200">{c.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
