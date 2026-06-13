import Image from "next/image";
import { ArrowRight, Download, MapPin, CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { initials } from "@/lib/utils";
import type { Profile, Stat } from "@/types/database";

export function Hero({ profile }: { profile: Profile | null }) {
  const name = profile?.full_name || "Your Name";
  const title = profile?.title || "Executive Title";
  const tagline =
    profile?.tagline ||
    profile?.executive_summary ||
    "A premium executive portfolio. Sign in to the dashboard to add your name, title and summary — this space updates instantly.";
  const stats: Stat[] = profile?.stats?.length ? profile.stats : [];

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Ambient background */}
      <div className="absolute inset-0 grid-bg" aria-hidden />
      <div
        className="glow left-1/4 top-0 h-[28rem] w-[28rem] -translate-x-1/2"
        style={{ background: "var(--accent)" }}
        aria-hidden
      />
      <div className="glow right-0 top-40 h-80 w-80 bg-indigo-600/40" aria-hidden />

      <div className="container-x relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            {profile?.available && (
              <Reveal className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-ink-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                </span>
                Available for select engagements
              </Reveal>
            )}

            <Reveal delay={60}>
              <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
                {name}
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-4 text-lg font-medium text-[var(--accent-soft)] sm:text-xl">
                {title}
              </p>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
                {tagline}
              </p>
            </Reveal>

            {profile?.location && (
              <Reveal delay={220}>
                <p className="mt-4 flex items-center gap-2 text-sm text-ink-400">
                  <MapPin className="h-4 w-4" /> {profile.location}
                </p>
              </Reveal>
            )}

            <Reveal delay={260}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <ButtonLink href="#contact" size="lg">
                  Get in touch <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                {profile?.cv_url ? (
                  <ButtonLink href={profile.cv_url} variant="outline" size="lg" external>
                    <Download className="h-4 w-4" /> Download CV
                  </ButtonLink>
                ) : (
                  <ButtonLink href="#projects" variant="outline" size="lg">
                    View work
                  </ButtonLink>
                )}
              </div>
            </Reveal>

            {stats.length > 0 && (
              <Reveal delay={320}>
                <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/5 pt-8">
                  {stats.slice(0, 3).map((s) => (
                    <div key={s.label}>
                      <dt className="text-2xl font-bold text-white sm:text-3xl">{s.value}</dt>
                      <dd className="mt-1 text-xs text-ink-400">{s.label}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}
          </div>

          {/* Portrait */}
          <Reveal delay={200} className="relative mx-auto w-full max-w-sm">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-ink-850 shadow-[var(--shadow-elev)]">
              {profile?.hero_image_url || profile?.avatar_url ? (
                <Image
                  src={(profile.hero_image_url || profile.avatar_url) as string}
                  alt={name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 400px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-900">
                  <span className="font-[family-name:var(--font-display)] text-7xl font-bold text-ink-600">
                    {initials(profile?.full_name) || "—"}
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-950/80 to-transparent" />
            </div>
            <div className="glass absolute -bottom-5 -left-5 hidden items-center gap-2 rounded-2xl px-4 py-3 sm:flex">
              <CheckCircle2 className="h-5 w-5 text-[var(--accent)]" />
              <span className="text-sm font-medium text-white">Verified Executive</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
