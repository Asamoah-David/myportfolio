import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPortfolioData } from "@/lib/data";
import { PrintButton } from "@/components/public/print-button";


export const metadata: Metadata = {
  title: "Printable Profile",
  robots: { index: false, follow: false },
};

// A clean, single-column document optimised for printing / saving as PDF.
export default async function PrintPage() {
  const d = await getPortfolioData();
  const p = d.profile;
  const name = p?.full_name || "Executive Profile";

  return (
    <div className="mx-auto max-w-3xl bg-[#ffffff] px-6 py-10 text-[#111] print:px-0 print:py-0">
      {/* Toolbar (hidden in print) */}
      <div className="no-print mb-8 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-ink-600">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
        <PrintButton />
      </div>

      {/* Header */}
      <header className="border-b-2 border-[#111] pb-5">
        <h1 className="text-3xl font-bold">{name}</h1>
        {p?.title && <p className="mt-1 text-lg text-[#444]">{p.title}</p>}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#444]">
          {p?.email && <span>{p.email}</span>}
          {p?.phone && <span>{p.phone}</span>}
          {p?.location && <span>{p.location}</span>}
          {(p?.social_links ?? []).map((l) => (
            <span key={l.url}>{l.url}</span>
          ))}
        </div>
      </header>

      <Doc title="Summary">
        {p?.executive_summary || p?.tagline ? (
          <p className="text-sm leading-relaxed">{p?.executive_summary || p?.tagline}</p>
        ) : null}
        {p?.bio && <p className="mt-2 text-sm leading-relaxed">{p.bio}</p>}
      </Doc>

      {d.expertise.length > 0 && (
        <Doc title="Areas of Expertise">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {d.expertise.map((e) => (
              <div key={e.id}>
                <span className="font-semibold">{e.title}</span>
                {e.skills.length > 0 && (
                  <span className="text-[#555]"> — {e.skills.join(", ")}</span>
                )}
              </div>
            ))}
          </div>
        </Doc>
      )}

      {d.timeline.length > 0 && (
        <Doc title="Experience">
          {d.timeline.map((t) => (
            <div key={t.id} className="mb-3">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-bold">{t.role}</h3>
                <span className="text-xs text-[#555]">
                  {t.start_date}
                  {(t.end_date || t.is_current) && " – "}
                  {t.is_current ? "Present" : t.end_date}
                </span>
              </div>
              {t.organization && (
                <p className="text-sm italic text-[#444]">
                  {t.organization}
                  {t.location ? `, ${t.location}` : ""}
                </p>
              )}
              {t.description && <p className="mt-1 text-sm">{t.description}</p>}
              {t.achievements.length > 0 && (
                <ul className="mt-1 list-disc pl-5 text-sm">
                  {t.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Doc>
      )}

      {d.projects.length > 0 && (
        <Doc title="Selected Projects">
          {d.projects.map((pr) => (
            <div key={pr.id} className="mb-2">
              <h3 className="text-sm font-bold">
                {pr.title}
                {pr.year ? ` (${pr.year})` : ""}
              </h3>
              {pr.summary && <p className="text-sm">{pr.summary}</p>}
              {pr.technologies.length > 0 && (
                <p className="text-xs text-[#555]">Tech: {pr.technologies.join(", ")}</p>
              )}
            </div>
          ))}
        </Doc>
      )}

      {d.publications.length > 0 && (
        <Doc title="Publications">
          <ul className="list-disc pl-5 text-sm">
            {d.publications.map((pub) => (
              <li key={pub.id}>
                <span className="font-semibold">{pub.title}</span>
                {pub.publisher ? `, ${pub.publisher}` : ""}
                {pub.published_date ? ` (${pub.published_date})` : ""}
              </li>
            ))}
          </ul>
        </Doc>
      )}

      {d.patents.length > 0 && (
        <Doc title="Patents & IP">
          <ul className="list-disc pl-5 text-sm">
            {d.patents.map((pt) => (
              <li key={pt.id}>
                {pt.title}
                {pt.patent_number ? ` — ${pt.patent_number}` : ""} ({pt.status})
              </li>
            ))}
          </ul>
        </Doc>
      )}

      {d.awards.length > 0 && (
        <Doc title="Awards & Recognition">
          <ul className="list-disc pl-5 text-sm">
            {d.awards.map((a) => (
              <li key={a.id}>
                <span className="font-semibold">{a.title}</span>
                {a.organization ? `, ${a.organization}` : ""}
                {a.year ? ` (${a.year})` : ""}
              </li>
            ))}
          </ul>
        </Doc>
      )}

      {d.certifications.length > 0 && (
        <Doc title="Certifications">
          <ul className="list-disc pl-5 text-sm">
            {d.certifications.map((c) => (
              <li key={c.id}>
                {c.name}
                {c.issuer ? ` — ${c.issuer}` : ""}
                {c.issue_date ? ` (${c.issue_date})` : ""}
              </li>
            ))}
          </ul>
        </Doc>
      )}

      {d.speaking.length > 0 && (
        <Doc title="Speaking Engagements">
          <ul className="list-disc pl-5 text-sm">
            {d.speaking.map((s) => (
              <li key={s.id}>
                <span className="font-semibold">{s.title}</span>
                {s.event ? `, ${s.event}` : ""}
                {s.date ? ` (${s.date})` : ""}
              </li>
            ))}
          </ul>
        </Doc>
      )}

      <footer className="mt-10 border-t border-[#ccc] pt-4 text-center text-xs text-[#888]">
        Generated from {name}&apos;s portfolio.
      </footer>
    </div>
  );
}

function Doc({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-[#111]">{title}</h2>
      {children}
    </section>
  );
}
