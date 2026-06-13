import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="absolute inset-0 grid-bg" aria-hidden />
      <div className="relative">
        <p className="font-[family-name:var(--font-display)] text-7xl font-bold text-gradient">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 max-w-sm text-sm text-ink-400">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-soft)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      </div>
    </div>
  );
}
