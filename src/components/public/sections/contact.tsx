"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Mail, Phone, MapPin, Send, CheckCircle2, Download, Loader2 } from "lucide-react";
import { submitContact, type ContactState } from "@/lib/actions/contact";
import { Reveal } from "@/components/ui/reveal";
import type { Profile } from "@/types/database";

const initial: ContactState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-soft)] disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Sending…
        </>
      ) : (
        <>
          <Send className="h-4 w-4" /> Send message
        </>
      )}
    </button>
  );
}

export function Contact({ profile }: { profile: Profile | null }) {
  const [state, formAction] = useActionState(submitContact, initial);

  return (
    <section id="contact" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent-soft)]">
              Contact
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Let&apos;s build what&apos;s next
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-300">
              For speaking, advisory, board or partnership inquiries, reach out directly — I read
              every message personally.
            </p>

            <div className="mt-8 space-y-4">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="card flex items-center gap-4 p-4 transition-colors hover:border-[var(--accent)]/40"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent-soft)]">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-ink-400">Email</span>
                    <span className="text-sm font-medium text-white">{profile.email}</span>
                  </span>
                </a>
              )}
              {profile?.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="card flex items-center gap-4 p-4 transition-colors hover:border-[var(--accent)]/40"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent-soft)]">
                    <Phone className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-ink-400">Phone</span>
                    <span className="text-sm font-medium text-white">{profile.phone}</span>
                  </span>
                </a>
              )}
              {profile?.location && (
                <div className="card flex items-center gap-4 p-4">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent-soft)]">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-ink-400">Location</span>
                    <span className="text-sm font-medium text-white">{profile.location}</span>
                  </span>
                </div>
              )}
            </div>

            {profile?.cv_url && (
              <a
                href={profile.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-soft)] hover:underline"
              >
                <Download className="h-4 w-4" /> Download full CV
              </a>
            )}
          </Reveal>

          <Reveal delay={120}>
            <div className="card p-6 sm:p-8">
              {state.ok ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <CheckCircle2 className="h-14 w-14 text-[var(--accent)]" />
                  <h3 className="text-xl font-semibold text-white">Message sent</h3>
                  <p className="max-w-sm text-sm text-ink-300">{state.message}</p>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">
                  {/* Honeypot: hidden from humans, tempting to bots */}
                  <div className="hidden" aria-hidden>
                    <label>
                      Company
                      <input name="company" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name" name="name" error={state.errors?.name} required />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      error={state.errors?.email}
                      required
                    />
                  </div>
                  <Field label="Subject" name="subject" error={state.errors?.subject} />
                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink-200">
                      Message <span className="text-[var(--accent)]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-ink-500 outline-none transition-colors focus:border-[var(--accent)]"
                      placeholder="Tell me about your project, event or opportunity…"
                    />
                    {state.errors?.message && (
                      <p className="mt-1 text-xs text-red-400">{state.errors.message[0]}</p>
                    )}
                  </div>

                  {state.message && !state.ok && (
                    <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                      {state.message}
                    </p>
                  )}

                  <SubmitButton />
                  <p className="text-center text-xs text-ink-500">
                    Protected by spam filtering and rate limiting.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink-200">
        {label} {required && <span className="text-[var(--accent)]">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-ink-500 outline-none transition-colors focus:border-[var(--accent)]"
      />
      {error && <p className="mt-1 text-xs text-red-400">{error[0]}</p>}
    </div>
  );
}
