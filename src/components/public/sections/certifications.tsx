import Image from "next/image";
import { Section, EmptyState } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { BadgeCheck, ExternalLink } from "lucide-react";
import type { Certification } from "@/types/database";

export function Certifications({ items }: { items: Certification[] }) {
  return (
    <Section
      id="certifications"
      eyebrow="Credentials"
      title="Certifications"
      description="Industry-recognized credentials validating technical and professional expertise."
    >
      {items.length === 0 ? (
        <EmptyState label="Certifications will appear here once added in the dashboard." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 60}>
              <article className="card flex h-full items-start gap-4 p-5">
                {c.image_url ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                    <Image src={c.image_url} alt={c.name} fill className="object-contain p-1" />
                  </div>
                ) : (
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent-soft)]">
                    <BadgeCheck className="h-6 w-6" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white">{c.name}</h3>
                  {c.issuer && <p className="mt-0.5 text-sm text-ink-400">{c.issuer}</p>}
                  <p className="mt-1 text-xs text-ink-500">
                    {[c.issue_date && `Issued ${c.issue_date}`, c.expiry_date && `Expires ${c.expiry_date}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {c.credential_url && (
                    <a
                      href={c.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--accent-soft)] hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Verify
                    </a>
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
