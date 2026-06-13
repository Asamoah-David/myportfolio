"use client";

import { FileUpload } from "./file-upload";
import type { FieldConfig } from "@/lib/admin-config";

// Renders a single form control from a FieldConfig. Array values (tags) are
// joined to newline text; the server action's zod schema splits them back.
export function Field({
  field,
  value,
  options,
  error,
}: {
  field: FieldConfig;
  value: unknown;
  options?: { value: string; label: string }[];
  error?: string[];
}) {
  const id = `f_${field.name}`;
  const labelEl = (
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-200">
      {field.label}
      {field.required && <span className="text-[var(--accent)]"> *</span>}
    </label>
  );

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-ink-500 outline-none focus:border-[var(--accent)]";

  let control: React.ReactNode;

  switch (field.type) {
    case "textarea":
      control = (
        <textarea
          id={id}
          name={field.name}
          rows={field.rows ?? 3}
          required={field.required}
          defaultValue={(value as string) ?? ""}
          placeholder={field.placeholder}
          className={`${inputCls} resize-y`}
        />
      );
      break;

    case "tags":
      control = (
        <textarea
          id={id}
          name={field.name}
          rows={field.rows ?? 3}
          defaultValue={Array.isArray(value) ? value.join("\n") : ((value as string) ?? "")}
          placeholder={field.placeholder || "One per line"}
          className={`${inputCls} resize-y`}
        />
      );
      break;

    case "checkbox":
      control = (
        <label className="flex cursor-pointer items-center gap-2.5">
          {/* Hidden companion guarantees a "false" is submitted when unchecked. */}
          <input type="hidden" name={field.name} value="false" />
          <input
            id={id}
            name={field.name}
            type="checkbox"
            value="true"
            defaultChecked={Boolean(value)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          <span className="text-sm text-ink-300">{field.help || "Enabled"}</span>
        </label>
      );
      break;

    case "select": {
      const opts = options ?? field.options ?? [];
      control = (
        <select
          id={id}
          name={field.name}
          defaultValue={(value as string) ?? opts[0]?.value ?? ""}
          className={inputCls}
        >
          {opts.map((o) => (
            <option key={o.value} value={o.value} className="bg-ink-850">
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    }

    case "rating":
      control = (
        <select
          id={id}
          name={field.name}
          defaultValue={String(value ?? 5)}
          className={inputCls}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n} className="bg-ink-850">
              {n} star{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      );
      break;

    case "image":
    case "file":
      control = (
        <FileUpload
          name={field.name}
          defaultValue={(value as string) ?? ""}
          bucket={field.bucket ?? "media"}
          accept={field.accept ?? (field.type === "file" ? ".pdf,.doc,.docx" : "image/*")}
          preview={field.type === "image"}
          required={field.required}
        />
      );
      break;

    case "number":
      control = (
        <input
          id={id}
          name={field.name}
          type="number"
          defaultValue={(value as number) ?? 0}
          className={inputCls}
        />
      );
      break;

    default:
      control = (
        <input
          id={id}
          name={field.name}
          type={field.type === "url" ? "url" : "text"}
          required={field.required}
          defaultValue={(value as string) ?? ""}
          placeholder={field.placeholder}
          className={inputCls}
        />
      );
  }

  return (
    <div className={field.full ? "sm:col-span-2" : ""}>
      {field.type !== "checkbox" && labelEl}
      {control}
      {field.help && field.type !== "checkbox" && (
        <p className="mt-1 text-xs text-ink-500">{field.help}</p>
      )}
      {error && <p className="mt-1 text-xs text-red-400">{error[0]}</p>}
    </div>
  );
}
