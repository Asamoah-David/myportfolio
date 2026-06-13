"use server";

import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export type UploadState = { ok: boolean; url?: string; message: string };

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

function safeName(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot).toLowerCase().replace(/[^a-z0-9.]/g, "") : "";
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  // Deterministic-but-unique key; counter+time keep collisions away.
  const unique = `${Date.now().toString(36)}-${Math.round(performance.now() % 1e6).toString(36)}`;
  return `${base || "file"}-${unique}${ext}`;
}

// Validates and stores a file in Supabase Storage, returning its public URL.
export async function uploadFile(formData: FormData): Promise<UploadState> {
  await requireAdmin();

  const file = formData.get("file");
  const bucket = String(formData.get("bucket") || "media");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "No file provided." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: "File exceeds the 25 MB limit." };
  }

  const allowed = [...IMAGE_TYPES, ...DOC_TYPES, ...VIDEO_TYPES];
  if (!allowed.includes(file.type)) {
    return { ok: false, message: `Unsupported file type: ${file.type || "unknown"}.` };
  }

  const targetBucket = bucket === "documents" ? "documents" : "media";
  const path = safeName(file.name);

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(targetBucket)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) return { ok: false, message: error.message };

  const { data } = supabase.storage.from(targetBucket).getPublicUrl(path);
  return { ok: true, url: data.publicUrl, message: "Uploaded." };
}
