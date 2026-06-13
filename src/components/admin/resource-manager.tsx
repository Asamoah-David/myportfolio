"use client";

import { useState, useTransition, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Loader2,
  Save,
  AlertTriangle,
  Inbox,
} from "lucide-react";
import { Field } from "./field";
import { saveRecord, deleteRecord, type CrudState, type ResourceKey } from "@/lib/actions/crud";
import { slugify } from "@/lib/utils";
import type { ResourceConfig } from "@/lib/admin-config";

type Record_ = Record<string, unknown> & { id: string };

export function ResourceManager({
  config,
  records,
  selectOptions = {},
}: {
  config: ResourceConfig;
  records: Record_[];
  selectOptions?: Record<string, { value: string; label: string }[]>;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<Record_ | null>(null);
  const [creating, setCreating] = useState(false);
  const [state, setState] = useState<CrudState | null>(null);
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const open = creating || editing !== null;

  const filtered = useMemo(() => {
    if (!query.trim()) return records;
    const q = query.toLowerCase();
    return records.filter((r) =>
      [config.primary, config.secondary]
        .filter(Boolean)
        .some((f) => String(r[f as string] ?? "").toLowerCase().includes(q)),
    );
  }, [records, query, config]);

  function openCreate() {
    setState(null);
    setEditing(null);
    setCreating(true);
  }
  function openEdit(r: Record_) {
    setState(null);
    setCreating(false);
    setEditing(r);
  }
  function close() {
    setCreating(false);
    setEditing(null);
    setState(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Auto-generate slug from the primary field when left blank.
    if (config.fields.some((f) => f.name === "slug") && !String(fd.get("slug") || "").trim()) {
      fd.set("slug", slugify(String(fd.get(config.primary) || "")));
    }

    const id = editing?.id ?? null;
    start(async () => {
      const res = await saveRecord(config.key as ResourceKey, id, fd);
      setState(res);
      if (res.ok) {
        close();
        router.refresh();
      }
    });
  }

  function handleDelete(id: string) {
    start(async () => {
      const res = await deleteRecord(config.key as ResourceKey, id);
      setConfirmId(null);
      if (res.ok) router.refresh();
      else setState(res);
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
            {config.plural}
          </h1>
          <p className="mt-1 text-sm text-ink-400">{config.description}</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg bg-[var(--accent)] px-4 text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-soft)]"
        >
          <Plus className="h-4 w-4" /> New {config.singular.toLowerCase()}
        </button>
      </div>

      {/* Search */}
      {records.length > 5 && (
        <div className="relative mb-4 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${config.plural.toLowerCase()}…`}
            className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-9 pr-3 text-sm text-white placeholder-ink-500 outline-none focus:border-[var(--accent)]"
          />
        </div>
      )}

      {state && !state.ok && !open && (
        <p className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {state.message}
        </p>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <Inbox className="h-10 w-10 text-ink-600" />
          <p className="text-sm text-ink-400">
            {records.length === 0
              ? `No ${config.plural.toLowerCase()} yet. Create your first one.`
              : "No matches."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/8">
          <ul className="divide-y divide-white/5">
            {filtered.map((r) => {
              const img = config.imageField ? (r[config.imageField] as string) : null;
              const title = String(r[config.primary] ?? "Untitled");
              const sub = config.secondary ? String(r[config.secondary] ?? "") : "";
              return (
                <li
                  key={r.id}
                  className="flex items-center gap-4 bg-white/[0.01] px-4 py-3 transition-colors hover:bg-white/[0.03]"
                >
                  {config.imageField &&
                    (img ? (
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-ink-850">
                        <Image src={img} alt="" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-ink-850 text-sm font-semibold text-ink-500">
                        {title.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-white">{title}</p>
                      {r.featured === true && (
                        <span className="rounded bg-[var(--accent)]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent-soft)]">
                          Featured
                        </span>
                      )}
                      {r.published === false && (
                        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-ink-400">
                          Draft
                        </span>
                      )}
                    </div>
                    {sub && <p className="truncate text-xs text-ink-500">{sub}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => openEdit(r)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-white/5 hover:text-white"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setConfirmId(r.id)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Slide-over form */}
      {open && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <div className="relative flex h-full w-full max-w-xl flex-col bg-ink-900 shadow-2xl">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-6">
              <h2 className="text-lg font-semibold text-white">
                {creating ? `New ${config.singular.toLowerCase()}` : `Edit ${config.singular.toLowerCase()}`}
              </h2>
              <button
                onClick={close}
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
              <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-6 sm:grid-cols-2">
                {config.fields.map((f) => (
                  <Field
                    key={f.name}
                    field={f}
                    value={editing ? editing[f.name] : undefined}
                    options={selectOptions[f.name]}
                    error={state?.errors?.[f.name]}
                  />
                ))}
                {state && !state.ok && (
                  <p className="sm:col-span-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                    {state.message}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center justify-end gap-3 border-t border-white/5 px-6 py-4">
                <button
                  type="button"
                  onClick={close}
                  className="h-10 rounded-lg px-4 text-sm text-ink-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm font-semibold text-black transition-colors hover:bg-[var(--accent-soft)] disabled:opacity-60"
                >
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70" onClick={() => setConfirmId(null)} />
          <div className="card relative w-full max-w-sm p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-red-500/10 text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold text-white">Delete this item?</h3>
            </div>
            <p className="mt-3 text-sm text-ink-400">
              This action cannot be undone. The item will be permanently removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="h-10 rounded-lg px-4 text-sm text-ink-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={pending}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-500 px-4 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
