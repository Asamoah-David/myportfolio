"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h2 className="text-xl font-semibold text-white">Couldn&apos;t load this view</h2>
      <p className="mt-2 max-w-sm text-sm text-ink-400">
        A server or database error occurred. Check your Supabase connection and try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-soft)]"
      >
        <RefreshCw className="h-4 w-4" /> Retry
      </button>
    </div>
  );
}
