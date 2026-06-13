// Resolves a free-text icon name (entered in the dashboard) to a lucide icon.
// Falls back to a sensible default so a typo never breaks the page.
import {
  Brain,
  Shield,
  Cloud,
  Code2,
  Database,
  Cpu,
  Network,
  Rocket,
  LineChart,
  Sparkles,
  Lock,
  Globe,
  Layers,
  Zap,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  ai: Brain,
  brain: Brain,
  "artificial-intelligence": Brain,
  security: Shield,
  cybersecurity: Shield,
  shield: Shield,
  cloud: Cloud,
  code: Code2,
  engineering: Code2,
  software: Code2,
  data: Database,
  database: Database,
  "data-science": LineChart,
  cpu: Cpu,
  hardware: Cpu,
  network: Network,
  product: Rocket,
  leadership: Rocket,
  rocket: Rocket,
  analytics: LineChart,
  innovation: Sparkles,
  strategy: Sparkles,
  lock: Lock,
  privacy: Lock,
  global: Globe,
  cloudops: Globe,
  layers: Layers,
  platform: Layers,
  performance: Zap,
};

export function Icon({ name, className }: { name?: string | null; className?: string }) {
  const key = (name || "").toLowerCase().trim();
  const Cmp = MAP[key] ?? Sparkles;
  return <Cmp className={className} />;
}
