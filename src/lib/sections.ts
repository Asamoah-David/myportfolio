// Canonical list of public homepage sections. The dashboard can override
// visibility and ordering via site_settings.sections; this is the default.
import type { SectionConfig } from "@/types/database";

export const DEFAULT_SECTIONS: SectionConfig[] = [
  { key: "about", label: "About", visible: true, order: 0 },
  { key: "expertise", label: "Expertise", visible: true, order: 1 },
  { key: "timeline", label: "Experience", visible: true, order: 2 },
  { key: "projects", label: "Projects", visible: true, order: 3 },
  { key: "publications", label: "Research", visible: true, order: 4 },
  { key: "patents", label: "Patents", visible: true, order: 5 },
  { key: "awards", label: "Awards", visible: true, order: 6 },
  { key: "press", label: "Press", visible: true, order: 7 },
  { key: "speaking", label: "Speaking", visible: true, order: 8 },
  { key: "certifications", label: "Certifications", visible: true, order: 9 },
  { key: "testimonials", label: "Testimonials", visible: true, order: 10 },
  { key: "gallery", label: "Gallery", visible: true, order: 11 },
  { key: "contact", label: "Contact", visible: true, order: 12 },
];

// Merge stored config over defaults so newly-added sections still appear.
export function resolveSections(stored?: SectionConfig[] | null): SectionConfig[] {
  if (!stored || stored.length === 0) return DEFAULT_SECTIONS;
  const byKey = new Map(stored.map((s) => [s.key, s]));
  return DEFAULT_SECTIONS.map((d) => ({ ...d, ...(byKey.get(d.key) ?? {}) })).sort(
    (a, b) => a.order - b.order,
  );
}
