// Next.js instrumentation: register() runs once when the server boots (both
// dev and production/standalone). We use it to auto-provision the database so a
// deployment only needs environment variables — nothing to run by hand.
export async function register() {
  // Only on the Node.js server runtime (never edge), and never during build.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { initializeDatabase } = await import("@/lib/db/init");
  await initializeDatabase();
}
