// Automatic, idempotent database provisioning — runs once at server startup
// (see src/instrumentation.ts). With DATABASE_URL set, the app applies
// supabase/schema.sql itself on every boot, so a deploy needs only environment
// variables: no manual SQL, no dashboard clicks.
//
// Optionally, when ADMIN_EMAILS + ADMIN_PASSWORD are set, it also creates the
// admin auth user(s) and grants them admin — making the dashboard usable
// immediately after the first deploy.
import { readFileSync } from "node:fs";
import { join } from "node:path";

let started = false;

function log(msg: string) {
  console.log(`[init-db] ${msg}`);
}

function loadSchemaSql(): string | null {
  // Try a few locations so it works in dev, standalone, and tests.
  const candidates = [
    join(process.cwd(), "supabase", "schema.sql"),
    join(process.cwd(), "..", "supabase", "schema.sql"),
  ];
  for (const path of candidates) {
    try {
      return readFileSync(path, "utf8");
    } catch {
      /* try next */
    }
  }
  return null;
}

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function initializeDatabase(): Promise<void> {
  if (started) return; // guard against double-invocation in one process
  started = true;

  // (1) Ensure the admin auth user(s) exist — works with or without DATABASE_URL.
  await ensureAdminUsers();

  // (2) Apply the schema (needs a direct Postgres connection).
  const url = process.env.DATABASE_URL;
  if (!url) {
    log(
      "DATABASE_URL not set — skipping automatic schema. Run supabase/schema.sql once in the Supabase SQL editor (admin grant still happens on first login via ADMIN_EMAILS).",
    );
    return;
  }

  const sql = loadSchemaSql();
  if (!sql) {
    log("Could not locate supabase/schema.sql — skipping automatic schema.");
    return;
  }

  const isLocal = /localhost|127\.0\.0\.1/.test(url);

  try {
    const { Client } = await import("pg");
    const client = new Client({
      connectionString: url,
      // Supabase requires TLS; its cert chain isn't in the default store.
      ssl: isLocal ? undefined : { rejectUnauthorized: false },
      connectionTimeoutMillis: 15_000,
      statement_timeout: 120_000,
    });

    await client.connect();
    log("connected — applying schema (idempotent)…");
    await client.query(sql);
    log("schema applied ✓");

    await grantAdmins(client);

    await client.end();
  } catch (err) {
    // Never crash the server because provisioning failed — the app still runs
    // (degrading to skeletons if tables are missing). Surfaced clearly in logs.
    log(`automatic provisioning failed: ${(err as Error).message}`);
  }
}

// Creates the admin auth user(s) from ADMIN_EMAILS + ADMIN_PASSWORD via the
// service role. Safe to re-run: an "already registered" error is expected and
// ignored on later deploys. The actual admin grant happens in grantAdmins() or,
// without DATABASE_URL, on first login via the ADMIN_EMAILS allowlist.
async function ensureAdminUsers(): Promise<void> {
  const emails = adminEmails();
  const password = process.env.ADMIN_PASSWORD;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (emails.length === 0 || !password || !serviceKey || !supabaseUrl) return;

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    for (const email of emails) {
      const { error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (!error) log(`created admin user ${email}`);
    }
  } catch (err) {
    log(`admin user creation skipped: ${(err as Error).message}`);
  }
}

// Grants admin to any matching, existing auth user (idempotent).
async function grantAdmins(client: import("pg").Client): Promise<void> {
  const emails = adminEmails();
  if (emails.length === 0) return;
  try {
    await client.query(
      `insert into public.admins (id, email, full_name)
         select u.id, u.email, coalesce(u.raw_user_meta_data->>'full_name', u.email)
         from auth.users u
         where lower(u.email) = any($1::text[])
       on conflict (id) do nothing;`,
      [emails],
    );
    log(`ensured admin grants for: ${emails.join(", ")}`);
  } catch (err) {
    log(`admin grant skipped: ${(err as Error).message}`);
  }
}
