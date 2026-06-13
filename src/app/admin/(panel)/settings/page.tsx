import { getSettings } from "@/lib/data";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return <SettingsForm settings={settings} />;
}
