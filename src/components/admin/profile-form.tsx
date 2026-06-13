"use client";

import { EditorForm, FormSection, Input, Textarea, Toggle } from "./editor-form";
import { FileUpload } from "./file-upload";
import { Repeater } from "./repeater";
import { saveProfile } from "@/lib/actions/singletons";
import type { Profile } from "@/types/database";

export function ProfileForm({ profile }: { profile: Profile | null }) {
  return (
    <EditorForm
      action={saveProfile}
      title="Profile"
      description="Your identity, story and contact details — shown across the public site."
    >
      <FormSection title="Identity">
        <Input name="full_name" label="Full name" defaultValue={profile?.full_name} />
        <Input name="title" label="Professional title" defaultValue={profile?.title} />
        <Textarea
          name="tagline"
          label="Tagline"
          defaultValue={profile?.tagline}
          rows={2}
          help="Short hero subtitle."
        />
        <Toggle
          name="available"
          label="Show “available for engagements” badge"
          defaultChecked={profile?.available ?? true}
        />
      </FormSection>

      <FormSection title="Imagery">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-200">Avatar</label>
          <FileUpload name="avatar_url" defaultValue={profile?.avatar_url} bucket="media" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-200">Hero portrait</label>
          <FileUpload name="hero_image_url" defaultValue={profile?.hero_image_url} bucket="media" />
        </div>
      </FormSection>

      <FormSection title="Story">
        <Textarea
          name="bio"
          label="Biography"
          defaultValue={profile?.bio}
          rows={5}
          help="Use blank lines to separate paragraphs."
        />
        <Textarea name="executive_summary" label="Executive summary" defaultValue={profile?.executive_summary} rows={3} />
        <Textarea name="mission" label="Mission statement" defaultValue={profile?.mission} rows={3} />
        <Textarea name="philosophy" label="Leadership philosophy" defaultValue={profile?.philosophy} rows={3} />
        <Textarea name="career_overview" label="Career overview" defaultValue={profile?.career_overview} rows={3} />
      </FormSection>

      <FormSection title="Contact">
        <Input name="email" label="Email" type="email" defaultValue={profile?.email} />
        <Input name="phone" label="Phone" defaultValue={profile?.phone} />
        <Input name="location" label="Location" defaultValue={profile?.location} full />
        <Repeater
          name="social_links"
          label="Social links"
          addLabel="Add link"
          columns={[
            { key: "label", placeholder: "LinkedIn" },
            { key: "url", placeholder: "https://…" },
          ]}
          defaultValue={(profile?.social_links ?? []) as never}
        />
        <Repeater
          name="stats"
          label="Hero statistics"
          addLabel="Add stat"
          columns={[
            { key: "value", placeholder: "20+" },
            { key: "label", placeholder: "Years leading" },
          ]}
          defaultValue={(profile?.stats ?? []) as never}
        />
      </FormSection>

      <FormSection title="CV / Resume">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-ink-200">
            CV / Resume document
          </label>
          <FileUpload
            name="cv_url"
            defaultValue={profile?.cv_url}
            bucket="documents"
            accept=".pdf,.doc,.docx"
            preview={false}
          />
        </div>
        <Input name="cv_filename" label="Display filename" defaultValue={profile?.cv_filename} placeholder="Jane-Doe-CV.pdf" />
      </FormSection>
    </EditorForm>
  );
}
