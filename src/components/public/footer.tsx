import Link from "next/link";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import type { Profile, SiteSettings, SectionConfig } from "@/types/database";

export function Footer({
  profile,
  settings,
  sections,
}: {
  profile: Profile | null;
  settings: SiteSettings | null;
  sections: SectionConfig[];
}) {
  const name = profile?.full_name || settings?.site_name || "Executive Portfolio";
  const year = "2025"; // build-time constant; avoids hydration drift
  const links = sections.filter((s) => s.visible).slice(0, 8);

  return (
    <footer className="relative border-t border-white/5 bg-ink-950">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--accent)] text-base font-bold text-black">
                {name.trim().charAt(0).toUpperCase()}
              </span>
              <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
                {name}
              </span>
            </div>
            {profile?.title && <p className="mt-4 max-w-sm text-sm text-ink-400">{profile.title}</p>}
            {settings?.footer_text && (
              <p className="mt-3 max-w-sm text-sm text-ink-400">{settings.footer_text}</p>
            )}
            <div className="mt-5 space-y-2 text-sm text-ink-400">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4" /> {profile.email}
                </a>
              )}
              {profile?.location && (
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {profile.location}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">
              Navigate
            </h3>
            <ul className="mt-4 space-y-2.5">
              {links.map((s) => (
                <li key={s.key}>
                  <a href={`#${s.key}`} className="text-sm text-ink-300 transition-colors hover:text-white">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-500">Connect</h3>
            <ul className="mt-4 space-y-2.5">
              {(profile?.social_links ?? []).map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm text-ink-300 transition-colors hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
              {profile?.cv_url && (
                <li>
                  <a
                    href={profile.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink-300 transition-colors hover:text-white"
                  >
                    Download CV
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-ink-500">
            © {year} {name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-ink-500">
            <a href="/print" className="transition-colors hover:text-white">
              Printable profile
            </a>
            <Link href="/admin" className="transition-colors hover:text-white">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
