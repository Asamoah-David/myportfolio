"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
import type { CrudState } from "@/lib/actions/singletons";

function SaveBar() {
  const { pending } = useFormStatus();
  return (
    <div className="sticky bottom-0 z-10 mt-6 flex items-center justify-end gap-3 border-t border-white/5 bg-ink-950/80 py-4 backdrop-blur">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--accent)] px-6 text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-soft)] disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save changes
      </button>
    </div>
  );
}

export function EditorForm({
  action,
  title,
  description,
  children,
}: {
  action: (prev: CrudState, fd: FormData) => Promise<CrudState>;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const [state, formAction] = useActionState<CrudState, FormData>(action, {
    ok: false,
    message: "",
  });

  return (
    <form action={formAction}>
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
          {title}
        </h1>
        {description && <p className="mt-1 text-sm text-ink-400">{description}</p>}
      </div>

      {state.message && (
        <p
          className={`mb-5 flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${
            state.ok
              ? "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent-soft)]"
              : "border-red-500/20 bg-red-500/10 text-red-300"
          }`}
        >
          {state.ok && <CheckCircle2 className="h-4 w-4" />}
          {state.ok ? "Saved successfully." : state.message}
        </p>
      )}

      {children}
      <SaveBar />
    </form>
  );
}

// Small presentational helpers shared by the singleton editors.
export function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="card mb-5 p-6">
      <legend className="mb-4 px-2 text-sm font-semibold uppercase tracking-widest text-[var(--accent-soft)]">
        {title}
      </legend>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function Input({
  name,
  label,
  defaultValue,
  type = "text",
  placeholder,
  full,
  help,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  type?: string;
  placeholder?: string;
  full?: boolean;
  help?: string;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink-200">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-ink-500 outline-none focus:border-[var(--accent)]"
      />
      {help && <p className="mt-1 text-xs text-ink-500">{help}</p>}
    </div>
  );
}

export function Textarea({
  name,
  label,
  defaultValue,
  rows = 3,
  placeholder,
  help,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  rows?: number;
  placeholder?: string;
  help?: string;
}) {
  return (
    <div className="sm:col-span-2">
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink-200">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-ink-500 outline-none focus:border-[var(--accent)]"
      />
      {help && <p className="mt-1 text-xs text-ink-500">{help}</p>}
    </div>
  );
}

export function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
      {/* Hidden companion guarantees a "false" is submitted when unchecked. */}
      <input type="hidden" name={name} value="false" />
      <input
        name={name}
        type="checkbox"
        value="true"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[var(--accent)]"
      />
      <span className="text-sm text-ink-200">{label}</span>
    </label>
  );
}
