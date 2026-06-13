// True only when the Supabase connection variables are present. Lets the app
// render gracefully (skeletons, no auth) before it is wired to a project.
export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
