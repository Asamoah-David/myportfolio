import { createClient } from "@/lib/supabase/server";
import { MessagesManager } from "@/components/admin/messages-manager";
import type { ContactMessage } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  return <MessagesManager messages={(data ?? []) as ContactMessage[]} />;
}
