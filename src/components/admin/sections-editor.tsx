"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";
import type { SectionConfig } from "@/types/database";

// Reorder + toggle visibility of homepage sections. Serialises to a hidden
// JSON input consumed by the settings server action.
export function SectionsEditor({ value }: { value: SectionConfig[] }) {
  const [sections, setSections] = useState<SectionConfig[]>(value);

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const next = [...sections];
    [next[i], next[j]] = [next[j], next[i]];
    setSections(next.map((s, idx) => ({ ...s, order: idx })));
  }
  function toggle(i: number) {
    setSections((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, visible: !s.visible } : s)),
    );
  }

  return (
    <div className="sm:col-span-2">
      <input type="hidden" name="sections" value={JSON.stringify(sections)} />
      <div className="overflow-hidden rounded-xl border border-white/8">
        <ul className="divide-y divide-white/5">
          {sections.map((s, i) => (
            <li
              key={s.key}
              className={`flex items-center gap-3 px-4 py-2.5 ${
                s.visible ? "bg-white/[0.01]" : "bg-transparent opacity-60"
              }`}
            >
              <span className="text-xs tabular-nums text-ink-600">{i + 1}</span>
              <span className="flex-1 text-sm text-white">{s.label}</span>
              <button
                type="button"
                onClick={() => toggle(i)}
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 hover:bg-white/5 hover:text-white"
                aria-label="Toggle visibility"
              >
                {s.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 hover:bg-white/5 hover:text-white disabled:opacity-30"
                aria-label="Move up"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === sections.length - 1}
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 hover:bg-white/5 hover:text-white disabled:opacity-30"
                aria-label="Move down"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-2 text-xs text-ink-500">
        Reorder or hide sections on the public homepage.
      </p>
    </div>
  );
}
