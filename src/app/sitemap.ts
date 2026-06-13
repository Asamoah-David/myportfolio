import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const projects = await getProjects();

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/print`, changeFrequency: "monthly", priority: 0.4 },
    ...projectRoutes,
  ];
}
