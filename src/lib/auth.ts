// Server-side authentication / authorization helpers.
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Optional allowlist of emails permitted to hold admin access. Secure by
// default: when unset, NOBODY is auto-granted — admins must be inserted into
// public.admins manually (see supabase/schema.sql).
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isAllowlisted(email?: string | null): boolean {
  return Boolean(email) && ADMIN_EMAILS.includes(String(email).toLowerCase());
}

// Idempotently grants admin to an allowlisted, authenticated user. This is the
// only automatic path to admin and it is gated entirely by the ADMIN_EMAILS env
// var, which only the deploy owner controls.
async function ensureAllowlistedAdmin(user: User): Promise<boolean> {
  if (!isAllowlisted(user.email)) return false;
  const admin = createAdminClient();
  await admin.from("admins").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: (user.user_metadata?.full_name as string) || user.email,
    },
    { onConflict: "id" },
  );
  return true;
}

// Returns the authenticated user, or null. Always uses getUser() so the token
// is verified against Supabase Auth rather than trusting the cookie payload.
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// True when the current user is an administrator (row in public.admins, or
// an allowlisted email which is then granted on the fly).
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (data) return true;

  return ensureAllowlistedAdmin(user);
}

// Guard for server actions / pages: redirects if not an admin.
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (data) return user;

  // Not yet an admin — grant only if the email is on the env allowlist.
  if (await ensureAllowlistedAdmin(user)) return user;

  redirect("/admin/login?error=not_authorized");
}

export { isAllowlisted, ensureAllowlistedAdmin };
