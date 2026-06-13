import { getProfile } from "@/lib/data";
import { ProfileForm } from "@/components/admin/profile-form";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await getProfile();
  return <ProfileForm profile={profile} />;
}
