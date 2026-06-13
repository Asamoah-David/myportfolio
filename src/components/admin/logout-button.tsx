"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/lib/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-300 transition-colors hover:bg-red-500/10 hover:text-red-300"
      >
        <LogOut className="h-4 w-4 text-ink-500" />
        Sign out
      </button>
    </form>
  );
}
