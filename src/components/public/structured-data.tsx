import type { Profile, SeoSettings } from "@/types/database";

// Emits schema.org Person + WebSite JSON-LD for rich search results.
export function StructuredData({
  profile,
  seo,
}: {
  profile: Profile | null;
  seo: SeoSettings | null;
}) {
  if (!profile?.full_name) return null;

  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.full_name,
    jobTitle: profile.title || undefined,
    description: seo?.meta_description || profile.executive_summary || profile.tagline || undefined,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    address: profile.location || undefined,
    image: profile.avatar_url || seo?.og_image || undefined,
    url: base || undefined,
    sameAs: (profile.social_links ?? []).map((l) => l.url).filter(Boolean),
    ...(seo?.structured_data && Object.keys(seo.structured_data).length ? seo.structured_data : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
