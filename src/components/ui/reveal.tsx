"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Fades content up the first time it scrolls into view. Content is fully
// visible if JS is disabled, so it never hurts SEO or accessibility.
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          ob.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={cn("reveal-init", shown && "reveal-in", className)}
    >
      {children}
    </Component>
  );
}
