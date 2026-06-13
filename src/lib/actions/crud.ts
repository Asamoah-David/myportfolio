"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { CONTENT_TAG } from "@/lib/data";
import {
  expertiseSchema,
  timelineSchema,
  categorySchema,
  projectSchema,
  awardSchema,
  certificationSchema,
  publicationSchema,
  patentSchema,
  speakingSchema,
  pressSchema,
  mediaSchema,
  testimonialSchema,
} from "@/lib/validations";

// Registry of every list-style resource the dashboard manages.
const RESOURCES = {
  expertise: { table: "expertise", schema: expertiseSchema },
  timeline: { table: "timeline", schema: timelineSchema },
  categories: { table: "project_categories", schema: categorySchema },
  projects: { table: "projects", schema: projectSchema },
  awards: { table: "awards", schema: awardSchema },
  certifications: { table: "certifications", schema: certificationSchema },
  publications: { table: "publications", schema: publicationSchema },
  patents: { table: "patents", schema: patentSchema },
  speaking: { table: "speaking_engagements", schema: speakingSchema },
  press: { table: "press", schema: pressSchema },
  media: { table: "media", schema: mediaSchema },
  testimonials: { table: "testimonials", schema: testimonialSchema },
} as const;

export type ResourceKey = keyof typeof RESOURCES;

export type CrudState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

// Fields submitted as JSON strings (arrays of objects) rather than scalars.
const JSON_FIELDS = new Set(["social_links", "stats", "sections", "gallery"]);

function formToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) continue;
    if (JSON_FIELDS.has(key)) {
      try {
        obj[key] = JSON.parse(String(value || "[]"));
        continue;
      } catch {
        // fall through and store raw value
      }
    }
    // Checkboxes: an unchecked box submits nothing; presence means true.
    obj[key] = value;
  }
  return obj;
}

function revalidateContent() {
  // Invalidate every cached public read in one shot. "max" satisfies the Next 16
  // revalidateTag signature and applies immediate, full invalidation.
  revalidateTag(CONTENT_TAG, "max");
}

export async function saveRecord(
  resource: ResourceKey,
  id: string | null,
  formData: FormData,
): Promise<CrudState> {
  await requireAdmin();
  const def = RESOURCES[resource];
  if (!def) return { ok: false, message: "Unknown resource." };

  const raw = formToObject(formData);
  const parsed = (def.schema as z.ZodType).safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      errors: (parsed.error as z.ZodError).flatten().fieldErrors,
    };
  }

  const supabase = createAdminClient();
  const payload = parsed.data as Record<string, unknown>;
  let error;
  if (id) {
    ({ error } = await supabase.from(def.table).update(payload).eq("id", id));
  } else {
    ({ error } = await supabase.from(def.table).insert(payload));
  }

  if (error) return { ok: false, message: error.message };

  revalidateContent();
  return { ok: true, message: id ? "Saved." : "Created." };
}

export async function deleteRecord(
  resource: ResourceKey,
  id: string,
): Promise<CrudState> {
  await requireAdmin();
  const def = RESOURCES[resource];
  if (!def) return { ok: false, message: "Unknown resource." };

  const supabase = createAdminClient();
  const { error } = await supabase.from(def.table).delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidateContent();
  return { ok: true, message: "Deleted." };
}

// Persist a new ordering (array of ids) for a resource.
export async function reorderRecords(
  resource: ResourceKey,
  ids: string[],
): Promise<CrudState> {
  await requireAdmin();
  const def = RESOURCES[resource];
  if (!def) return { ok: false, message: "Unknown resource." };

  const supabase = createAdminClient();
  await Promise.all(
    ids.map((id, index) =>
      supabase.from(def.table).update({ sort_order: index }).eq("id", id),
    ),
  );

  revalidateContent();
  return { ok: true, message: "Order updated." };
}
