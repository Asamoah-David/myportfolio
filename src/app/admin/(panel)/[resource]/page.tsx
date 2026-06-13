import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RESOURCES, RESOURCE_TABLES } from "@/lib/admin-config";
import { ResourceManager } from "@/components/admin/resource-manager";

export const dynamic = "force-dynamic";

// Single dynamic page that drives every list-managed resource from config.
export default async function ResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = await params;
  const config = RESOURCES[resource];
  const table = RESOURCE_TABLES[resource];
  if (!config || !table) notFound();

  const supabase = await createClient();
  const { data: records } = await supabase.from(table).select("*").order("sort_order");

  // Projects use a category selector populated from the categories table.
  let selectOptions: Record<string, { value: string; label: string }[]> = {};
  if (resource === "projects") {
    const { data: cats } = await supabase
      .from("project_categories")
      .select("id, name")
      .order("sort_order");
    selectOptions = {
      category_id: [
        { value: "", label: "— None —" },
        ...(cats ?? []).map((c) => ({ value: c.id as string, label: c.name as string })),
      ],
    };
  }

  return (
    <ResourceManager
      config={config}
      records={(records ?? []) as never}
      selectOptions={selectOptions}
    />
  );
}
