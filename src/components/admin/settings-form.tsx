"use client";

import { EditorForm, FormSection, Input, Textarea, Toggle } from "./editor-form";
import { SectionsEditor } from "./sections-editor";
import { saveSettings } from "@/lib/actions/singletons";
import { resolveSections } from "@/lib/sections";
import type { SiteSettings } from "@/types/database";

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const sections = resolveSections(settings?.sections);

  return (
    <EditorForm
      action={saveSettings}
      title="Settings"
      description="Branding, theme and homepage layout."
    >
      <FormSection title="Branding">
        <Input name="site_name" label="Site name" defaultValue={settings?.site_name} />
        <div>
          <label htmlFor="accent_color" className="mb-1.5 block text-sm font-medium text-ink-200">
            Accent color
          </label>
          <div className="flex items-center gap-3">
            <input
              id="accent_color"
              name="accent_color"
              type="color"
              defaultValue={settings?.accent_color || "#10b981"}
              className="h-10 w-16 cursor-pointer rounded-lg border border-white/10 bg-transparent"
            />
            <span className="text-sm text-ink-400">Drives the whole site palette.</span>
          </div>
        </div>
        <div>
          <label htmlFor="theme" className="mb-1.5 block text-sm font-medium text-ink-200">
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            defaultValue={settings?.theme || "dark"}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-[var(--accent)]"
          >
            <option value="dark" className="bg-ink-850">Dark</option>
            <option value="light" className="bg-ink-850">Light</option>
          </select>
        </div>
        <Textarea name="footer_text" label="Footer text" defaultValue={settings?.footer_text} rows={2} />
      </FormSection>

      <FormSection title="Announcement bar">
        <Toggle
          name="show_announcement"
          label="Show announcement bar at the top of the site"
          defaultChecked={settings?.show_announcement}
        />
        <Input
          name="announcement"
          label="Announcement message"
          defaultValue={settings?.announcement}
          full
        />
      </FormSection>

      <FormSection title="Homepage sections">
        <SectionsEditor value={sections} />
      </FormSection>
    </EditorForm>
  );
}
