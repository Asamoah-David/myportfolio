// Service-role Supabase client. SERVER-ONLY — bypasses RLS.
// Never import this into a client component. Used by trusted server actions
// after they have verified the caller is an authenticated admin.
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}
