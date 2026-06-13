"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { login, type AuthState } from "@/lib/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-soft)] disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(login, {});
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/admin";
  const notAuthorized = params.get("error") === "not_authorized";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirect" value={redirect} />

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-200">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-ink-500 outline-none focus:border-[var(--accent)]"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-200">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-ink-500 outline-none focus:border-[var(--accent)]"
          placeholder="••••••••"
        />
      </div>

      {(state.error || notAuthorized) && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {state.error || "This account does not have administrator access."}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
