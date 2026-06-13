"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, X, FileText } from "lucide-react";
import { uploadFile } from "@/lib/actions/upload";

// Uploads to Supabase Storage and stores the resulting public URL in a hidden
// input so it submits with the surrounding form. Also accepts a manual URL.
export function FileUpload({
  name,
  defaultValue,
  bucket = "media",
  accept = "image/*",
  preview = true,
  required,
}: {
  name: string;
  defaultValue?: string | null;
  bucket?: "media" | "documents";
  accept?: string;
  preview?: boolean;
  required?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", bucket);
    const res = await uploadFile(fd);
    setBusy(false);
    if (res.ok && res.url) setUrl(res.url);
    else setError(res.message);
    if (inputRef.current) inputRef.current.value = "";
  }

  const isImage = preview && url && /\.(png|jpe?g|webp|gif|svg)$/i.test(url.split("?")[0]);

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} required={required} />

      <div className="flex items-center gap-3">
        <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm text-ink-200 transition-colors hover:border-[var(--accent)]/40 hover:text-white">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          {busy ? "Uploading…" : "Upload"}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={onPick}
            className="hidden"
            disabled={busy}
          />
        </label>
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm text-ink-400 hover:text-red-300"
          >
            <X className="h-4 w-4" /> Remove
          </button>
        )}
      </div>

      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="…or paste a URL"
        className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-ink-500 outline-none focus:border-[var(--accent)]"
      />

      {error && <p className="text-xs text-red-400">{error}</p>}

      {isImage && (
        <div className="relative h-28 w-28 overflow-hidden rounded-lg border border-white/10 bg-ink-850">
          <Image src={url} alt="Preview" fill className="object-cover" />
        </div>
      )}
      {url && !isImage && (
        <p className="inline-flex items-center gap-1.5 text-xs text-ink-400">
          <FileText className="h-3.5 w-3.5" /> File attached
        </p>
      )}
    </div>
  );
}
