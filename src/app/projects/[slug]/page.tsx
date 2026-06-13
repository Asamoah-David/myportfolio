import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, Code2 } from "lucide-react";
import { getProjectBySlug, getProfile } from "@/lib/data";
import { ButtonLink } from "@/components/ui/button";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary || undefined,
    openGraph: {
      title: project.title,
      description: project.summary || undefined,
      images: project.cover_image ? [{ url: project.cover_image }] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, profile] = await Promise.all([getProjectBySlug(slug), getProfile()]);
  if (!project || !project.published) notFound();

  return (
    <main className="pb-24">
      {/* Cover */}
      <div className="relative h-[42vh] min-h-72 w-full overflow-hidden bg-ink-850">
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={project.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-ink-800 to-ink-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/30" />
        <div className="container-x absolute inset-x-0 top-6">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm text-white backdrop-blur transition-colors hover:bg-black/60"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      <div className="container-x -mt-24 relative">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {project.category?.name && (
              <span className="rounded-full bg-[var(--accent)]/15 px-3 py-1 font-medium text-[var(--accent-soft)]">
                {project.category.name}
              </span>
            )}
            {project.year && <span className="text-ink-400">{project.year}</span>}
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {project.title}
          </h1>
          {project.summary && (
            <p className="mt-4 text-lg leading-relaxed text-ink-300">{project.summary}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {project.demo_url && (
              <ButtonLink href={project.demo_url} external size="sm">
                <ExternalLink className="h-4 w-4" /> Live
              </ButtonLink>
            )}
            {project.repo_url && (
              <ButtonLink href={project.repo_url} external variant="outline" size="sm">
                <Code2 className="h-4 w-4" /> Source
              </ButtonLink>
            )}
          </div>

          {project.technologies.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-ink-300"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {project.description && (
            <div className="prose-exec mt-10 max-w-none">
              {project.description.split("\n").filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          {project.outcomes && (
            <div className="mt-8 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/[0.04] p-6">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--accent-soft)]">
                Outcomes & Impact
              </h2>
              <p className="mt-2 leading-relaxed text-ink-200">{project.outcomes}</p>
            </div>
          )}

          {project.case_study && (
            <div className="prose-exec mt-10 max-w-none">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
                Case Study
              </h2>
              {project.case_study.split("\n").filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
        </div>

        {project.gallery.length > 0 && (
          <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2">
            {project.gallery.map((src, i) => (
              <div
                key={i}
                className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/8 bg-ink-850"
              >
                <Image src={src} alt={`${project.title} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="mx-auto mt-16 max-w-3xl border-t border-white/5 pt-8 text-center">
          <p className="text-ink-400">Interested in working together?</p>
          <ButtonLink href={profile?.email ? `mailto:${profile.email}` : "/#contact"} className="mt-4">
            Get in touch
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
