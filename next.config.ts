import type { NextConfig } from "next";

// Restrict next/image to the Supabase Storage host (derived from env) so the
// image optimizer can't be abused as an open proxy. Localhost is allowed for dev.
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : undefined;
  } catch {
    return undefined;
  }
})();

const isProd = process.env.NODE_ENV === "production";

// Content-Security-Policy. In dev, Turbopack needs 'unsafe-eval'. Inline styles
// (runtime accent theme) and inline JSON-LD require 'unsafe-inline'.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co https://*.supabase.in${isProd ? "" : " ws: http://localhost:*"}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
]
  .join("; ")
  .concat(isProd ? "; upgrade-insecure-requests" : "");

const nextConfig: NextConfig = {
  // Standalone output keeps the Railway image small and boots fast.
  output: "standalone",

  // Pin the workspace root so file tracing ignores unrelated parent lockfiles.
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },

  // Keep the Postgres driver (used by startup provisioning) external so it is
  // resolved from node_modules at runtime rather than bundled.
  serverExternalPackages: ["pg"],

  // Ship the schema file with the standalone server so startup provisioning
  // can read it.
  outputFileTracingIncludes: {
    "/": ["./supabase/schema.sql"],
  },

  images: {
    remotePatterns: [
      ...(supabaseHost
        ? [{ protocol: "https" as const, hostname: supabaseHost }]
        : [{ protocol: "https" as const, hostname: "*.supabase.co" }]),
      { protocol: "http" as const, hostname: "localhost" },
    ],
  },

  // Security headers applied to every response.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
