"use client";

import { EditorForm, FormSection, Input, Textarea } from "./editor-form";
import { FileUpload } from "./file-upload";
import { saveSeo } from "@/lib/actions/singletons";
import type { SeoSettings } from "@/types/database";

export function SeoForm({ seo }: { seo: SeoSettings | null }) {
  return (
    <EditorForm
      action={saveSeo}
      title="SEO"
      description="Control how your portfolio appears in search engines and social shares."
    >
      <FormSection title="Search">
        <Input name="meta_title" label="Meta title" defaultValue={seo?.meta_title} full help="Falls back to your name + title." />
        <Textarea name="meta_description" label="Meta description" defaultValue={seo?.meta_description} rows={3} help="~155 characters recommended." />
        <Textarea name="keywords" label="Keywords" defaultValue={seo?.keywords} rows={2} help="Comma-separated." />
        <Input name="canonical_url" label="Canonical URL" defaultValue={seo?.canonical_url} full />
      </FormSection>

      <FormSection title="Social sharing (Open Graph / Twitter)">
        <Input name="og_title" label="OG / Twitter title" defaultValue={seo?.og_title} />
        <Input name="twitter_handle" label="Twitter handle" defaultValue={seo?.twitter_handle} placeholder="@handle" />
        <Textarea name="og_description" label="OG / Twitter description" defaultValue={seo?.og_description} rows={2} />
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-ink-200">
            Social share image (1200×630)
          </label>
          <FileUpload name="og_image" defaultValue={seo?.og_image} bucket="media" />
        </div>
      </FormSection>
    </EditorForm>
  );
}
