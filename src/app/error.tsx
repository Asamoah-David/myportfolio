"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to your monitoring of choice in production.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--accent-soft)]">
        Something went wrong
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-white">
        An unexpected error occurred
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-400">
        The page failed to load. Please try again — if it persists, the issue has been logged.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="inline-flex h-11 items-center rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-soft)]"
        >
          Try again
        </button>
        <a
          href="/"
          className="inline-flex h-11 items-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition-colors hover:border-[var(--accent)]"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
