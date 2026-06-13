"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-soft)]"
    >
      <Printer className="h-4 w-4" /> Print / Save as PDF
    </button>
  );
}
