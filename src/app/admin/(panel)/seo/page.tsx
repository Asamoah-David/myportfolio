import { getSeo } from "@/lib/data";
import { SeoForm } from "@/components/admin/seo-form";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  const seo = await getSeo();
  return <SeoForm seo={seo} />;
}
