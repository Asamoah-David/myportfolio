"use client";

import { useState } from "react";
import { Plus, GripVertical, X } from "lucide-react";

type Row = Record<string, string>;

// Generic key/value list editor (used for social links & hero stats).
// Serialises its rows to a hidden JSON input named `name` on every change.
export function Repeater({
  name,
  label,
  columns,
  defaultValue = [],
  addLabel = "Add",
}: {
  name: string;
  label: string;
  columns: { key: string; placeholder: string }[];
  defaultValue?: Row[];
  addLabel?: string;
}) {
  const [rows, setRows] = useState<Row[]>(defaultValue);

  function update(i: number, key: string, value: string) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  }
  function add() {
    setRows((prev) => [...prev, Object.fromEntries(columns.map((c) => [c.key, ""]))]);
  }
  function remove(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Only persist rows that have at least one non-empty value.
  const cleaned = rows.filter((r) => Object.values(r).some((v) => v.trim()));

  return (
    <div className="sm:col-span-2">
      <label className="mb-1.5 block text-sm font-medium text-ink-200">{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(cleaned)} />
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 shrink-0 text-ink-600" />
            {columns.map((c) => (
              <input
                key={c.key}
                value={row[c.key] ?? ""}
                onChange={(e) => update(i, c.key, e.target.value)}
                placeholder={c.placeholder}
                className="h-9 flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-white placeholder-ink-500 outline-none focus:border-[var(--accent)]"
              />
            ))}
            <button
              type="button"
              onClick={() => remove(i)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-400 hover:bg-red-500/10 hover:text-red-300"
              aria-label="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-ink-300 transition-colors hover:border-[var(--accent)]/40 hover:text-white"
      >
        <Plus className="h-4 w-4" /> {addLabel}
      </button>
    </div>
  );
}
