import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 grid-bg" aria-hidden />
      <div
        className="glow left-1/2 top-1/4 h-96 w-96 -translate-x-1/2"
        style={{ background: "var(--accent)" }}
        aria-hidden
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[var(--accent)] text-xl font-bold text-black">
            ◆
          </span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-bold text-white">
            Administrator Access
          </h1>
          <p className="mt-2 text-sm text-ink-400">
            Sign in to manage your portfolio content.
          </p>
        </div>
        <div className="card p-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-xs text-ink-500">
          Protected area · rate-limited · authorized administrators only
        </p>
      </div>
    </div>
  );
}
