import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { getSeo, getProfile, getSettings } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Metadata is fully driven by the SEO + Profile records edited in the dashboard.
export async function generateMetadata(): Promise<Metadata> {
  const [seo, profile] = await Promise.all([getSeo(), getProfile()]);

  const name = profile?.full_name || "Executive Portfolio";
  const role = profile?.title ? ` — ${profile.title}` : "";
  const title = seo?.meta_title || `${name}${role}`;
  const description =
    seo?.meta_description ||
    profile?.tagline ||
    profile?.executive_summary ||
    "Executive portfolio showcasing leadership, innovation and technical excellence.";
  const base = process.env.NEXT_PUBLIC_SITE_URL || undefined;

  return {
    metadataBase: base ? new URL(base) : undefined,
    title: { default: title, template: `%s | ${name}` },
    description,
    keywords: seo?.keywords || undefined,
    authors: [{ name }],
    creator: name,
    openGraph: {
      type: "profile",
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      images: seo?.og_image
        ? [{ url: seo.og_image }]
        : profile?.avatar_url
          ? [{ url: profile.avatar_url }]
          : undefined,
      siteName: name,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      creator: seo?.twitter_handle || undefined,
      images: seo?.og_image ? [seo.og_image] : undefined,
    },
    robots: { index: true, follow: true },
    alternates: seo?.canonical_url ? { canonical: seo.canonical_url } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();
  const accent = settings?.accent_color || "#10b981";
  const defaultLight = settings?.theme === "light";

  // Derived accent shades so a single picked color drives the whole palette.
  const themeVars = `:root{--accent:${accent};--accent-soft:color-mix(in srgb, ${accent} 70%, white);--accent-deep:color-mix(in srgb, ${accent} 80%, black);}`;

  // Runs before paint: flags JS (for scroll-reveal) and applies the visitor's
  // saved theme preference over the admin default — no flash, no hydration race
  // (the <html> class is suppressHydrationWarning'd).
  const boot = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('portfolio-theme');if(t==='light')d.classList.add('light');else if(t==='dark')d.classList.remove('light');}catch(e){}})();`;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable}${defaultLight ? " light" : ""}`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeVars }} />
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
