"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function markMessageRead(id: string, isRead: boolean) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("contact_messages").update({ is_read: isRead }).eq("id", id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function archiveMessage(id: string, archived: boolean) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("contact_messages").update({ is_archived: archived }).eq("id", id);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
