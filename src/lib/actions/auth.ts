"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureAllowlistedAdmin } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export type AuthState = { error?: string };

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirect") || "/admin");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";

  // 8 login attempts per 15 minutes per IP.
  const limit = rateLimit(`login:${ip}`, 8, 15 * 60 * 1000);
  if (!limit.allowed) {
    return {
      error: `Too many attempts. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes.`,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: "Invalid email or password." };
  }

  // Confirm the account is an administrator, or grant it if the email is on the
  // ADMIN_EMAILS allowlist. Otherwise sign the session back out immediately.
  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!admin && !(await ensureAllowlistedAdmin(data.user))) {
    await supabase.auth.signOut();
    return { error: "This account does not have administrator access." };
  }

  // Allow only internal redirects.
  redirect(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
