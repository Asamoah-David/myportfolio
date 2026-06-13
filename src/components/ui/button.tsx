import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const sizes = {
  sm: "h-9 px-4",
  md: "h-11 px-6",
  lg: "h-12 px-7 text-[15px]",
};

const variants = {
  primary:
    "bg-[var(--accent)] text-black hover:bg-[var(--accent-soft)] shadow-[0_8px_30px_-8px_var(--accent)]",
  outline:
    "border border-white/15 text-white hover:border-[var(--accent)] hover:text-[var(--accent-soft)] bg-white/[0.02]",
  ghost: "text-ink-200 hover:text-white hover:bg-white/5",
  subtle: "bg-white/[0.06] text-white hover:bg-white/10 border border-white/10",
};

type Common = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
  ...props
}: Common & {
  href: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = cn(base, sizes[size], variants[variant], className);
  if (external || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...props}>
      {children}
    </Link>
  );
}
