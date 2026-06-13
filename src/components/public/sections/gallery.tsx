"use client";

import { useState } from "react";
import Image from "next/image";
import { X, FileText, PlayCircle } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { EmptyState } from "@/components/ui/section";
import type { MediaItem } from "@/types/database";

export function Gallery({ items }: { items: MediaItem[] }) {
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const images = items.filter((m) => m.type === "image");
  const others = items.filter((m) => m.type !== "image");

  return (
    <section id="gallery" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent-soft)]">
            Gallery
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Professional gallery
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-300">
            Moments from talks, events and milestones.
          </p>
        </Reveal>

        {items.length === 0 ? (
          <EmptyState label="Gallery images and media will appear here once added in the dashboard." />
        ) : (
          <>
            {images.length > 0 && (
              <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
                {images.map((m, i) => (
                  <Reveal key={m.id} delay={(i % 4) * 50}>
                    <button
                      onClick={() => setLightbox(m)}
                      className="group relative block w-full overflow-hidden rounded-xl border border-white/8 bg-ink-850"
                    >
                      <Image
                        src={m.url}
                        alt={m.title || "Gallery image"}
                        width={500}
                        height={500}
                        className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {m.title && (
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent p-3 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                          {m.title}
                        </span>
                      )}
                    </button>
                  </Reveal>
                ))}
              </div>
            )}

            {others.length > 0 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((m) => (
                  <a
                    key={m.id}
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card flex items-center gap-3 p-4"
                  >
                    {m.type === "video" ? (
                      <PlayCircle className="h-6 w-6 text-[var(--accent)]" />
                    ) : (
                      <FileText className="h-6 w-6 text-[var(--accent)]" />
                    )}
                    <span className="truncate text-sm text-white">{m.title || m.url}</span>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-6 backdrop-blur"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative max-h-[85vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightbox.url}
              alt={lightbox.title || "Gallery image"}
              width={1400}
              height={1000}
              className="max-h-[85vh] w-auto rounded-xl object-contain"
            />
            {lightbox.title && (
              <p className="mt-3 text-center text-sm text-ink-300">{lightbox.title}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
