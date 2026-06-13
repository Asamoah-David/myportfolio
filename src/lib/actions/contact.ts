"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";

export type ContactState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

  // 5 submissions per 10 minutes per IP.
  const limit = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.allowed) {
    return {
      ok: false,
      message: `Too many messages. Please try again in ${Math.ceil(limit.retryAfter / 60)} minutes.`,
    };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    company: formData.get("company"), // honeypot
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Honeypot tripped — silently accept to avoid signalling bots.
  if (parsed.data.company) {
    return { ok: true, message: "Thank you. Your message has been received." };
  }

  // Service-role insert (RLS already allows anon insert, but this keeps the
  // anon key off the write path and lets us persist the IP for moderation).
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
      ip_address: ip,
    });
    if (error) {
      console.error("[contact] insert failed:", error.message);
      return { ok: false, message: "Something went wrong. Please try again." };
    }
  } catch (err) {
    console.error("[contact] unexpected error:", (err as Error).message);
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  return {
    ok: true,
    message: "Thank you. Your message has been received and I'll be in touch shortly.",
  };
}
