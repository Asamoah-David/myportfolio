"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

// Flips the public site between dark and light, persisting the choice in
// localStorage (read back before paint by the inline boot script in layout).
// The admin's Site Settings theme is the default; this lets a visitor override.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [light, setLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("portfolio-theme", next ? "light" : "dark");
    } catch {
      /* storage may be unavailable */
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      title={light ? "Dark mode" : "Light mode"}
      className={`grid h-9 w-9 place-items-center rounded-full text-ink-300 transition-colors hover:bg-white/5 hover:text-white ${className}`}
    >
      {/* Render a stable icon until mounted to avoid a hydration mismatch. */}
      {mounted && light ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
    </button>
  );
}
