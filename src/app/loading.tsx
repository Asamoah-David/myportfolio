export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[var(--accent)]" />
        <span className="text-sm text-ink-500">Loading…</span>
      </div>
    </div>
  );
}
