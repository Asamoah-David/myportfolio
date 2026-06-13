// Cookieless anon Supabase client for PUBLIC reads only.
// Because it never touches request cookies/headers, its queries are safe to
// wrap in unstable_cache() — unlike the request-bound server client.
// RLS still applies (anon role → published, public-readable content only).
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
