"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { CONTENT_TAG } from "@/lib/data";
import { profileSchema, seoSchema, settingsSchema } from "@/lib/validations";

export type CrudState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

const JSON_FIELDS = new Set(["social_links", "stats", "sections"]);

function formToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) continue;
    if (JSON_FIELDS.has(key)) {
      try {
        obj[key] = JSON.parse(String(value || "[]"));
        continue;
      } catch {
        /* ignore */
      }
    }
    obj[key] = value;
  }
  return obj;
}

async function saveSingleton(
  table: string,
  schema: z.ZodType,
  formData: FormData,
  boolKeys: string[] = [],
): Promise<CrudState> {
  await requireAdmin();
  const raw = formToObject(formData);
  for (const k of boolKeys) raw[k] = raw[k] === "on" || raw[k] === "true";

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      errors: (parsed.error as z.ZodError).flatten().fieldErrors,
    };
  }

  const supabase = createAdminClient();
  // Singleton tables always hold exactly one row (seeded by schema.sql).
  const { data: existing } = await supabase.from(table).select("id").limit(1).maybeSingle();

  const payload = parsed.data as Record<string, unknown>;
  let error;
  if (existing?.id) {
    ({ error } = await supabase.from(table).update(payload).eq("id", existing.id));
  } else {
    ({ error } = await supabase.from(table).insert(payload));
  }

  if (error) return { ok: false, message: error.message };

  revalidateTag(CONTENT_TAG, "max");
  return { ok: true, message: "Saved." };
}

export async function saveProfile(_prev: CrudState, formData: FormData) {
  return saveSingleton("profile", profileSchema, formData, ["available"]);
}

export async function saveSeo(_prev: CrudState, formData: FormData) {
  return saveSingleton("seo_settings", seoSchema, formData);
}

export async function saveSettings(_prev: CrudState, formData: FormData) {
  return saveSingleton("site_settings", settingsSchema, formData, ["show_announcement"]);
}
