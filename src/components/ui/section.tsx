import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  contentClassName,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-20 sm:py-28", className)}>
      <div className="container-x">
        {(eyebrow || title || description) && (
          <Reveal className="mx-auto mb-14 max-w-3xl text-center">
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent-soft)]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-300">
                {description}
              </p>
            )}
          </Reveal>
        )}
        <div className={contentClassName}>{children}</div>
      </div>
    </section>
  );
}

// Placeholder shown for any section whose data has not been filled in yet.
// Keeps the public layout intact (skeleton) rather than hiding the section.
export function EmptyState({ label }: { label: string }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="grid grid-cols-3 gap-2 opacity-40" aria-hidden>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-2 w-16 rounded-full bg-ink-600" />
        ))}
      </div>
      <p className="text-sm text-ink-400">{label}</p>
    </div>
  );
}
