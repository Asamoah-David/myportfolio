// Declarative configuration for every list-managed resource. The generic
// ResourceManager renders list + form purely from these definitions, so adding
// a field is a one-line change here — no bespoke UI per entity.

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "number"
  | "checkbox"
  | "select"
  | "tags"
  | "image"
  | "file"
  | "rating";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  bucket?: "media" | "documents";
  accept?: string; // override file picker accept attribute
  full?: boolean; // span both columns
  rows?: number;
}

export interface ResourceConfig {
  key: string; // matches the crud action registry
  singular: string;
  plural: string;
  description: string;
  primary: string;
  secondary?: string;
  imageField?: string;
  fields: FieldConfig[];
}

// Maps each resource key to its Postgres table (used by the dynamic admin page).
export const RESOURCE_TABLES: Record<string, string> = {
  expertise: "expertise",
  timeline: "timeline",
  categories: "project_categories",
  projects: "projects",
  publications: "publications",
  patents: "patents",
  awards: "awards",
  certifications: "certifications",
  speaking: "speaking_engagements",
  press: "press",
  testimonials: "testimonials",
  media: "media",
};

const sortField: FieldConfig = {
  name: "sort_order",
  label: "Display order",
  type: "number",
  help: "Lower numbers appear first.",
};

export const RESOURCES: Record<string, ResourceConfig> = {
  expertise: {
    key: "expertise",
    singular: "Expertise area",
    plural: "Expertise",
    description: "Domains of mastery shown on the homepage.",
    primary: "title",
    secondary: "description",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, full: true },
      { name: "description", label: "Description", type: "textarea", full: true, rows: 3 },
      {
        name: "icon",
        label: "Icon",
        type: "text",
        placeholder: "ai, security, cloud, data, leadership…",
        help: "Keyword icon (ai, security, cloud, code, data, leadership, innovation…).",
      },
      { name: "skills", label: "Skills", type: "tags", help: "Comma or newline separated." },
      sortField,
    ],
  },
  timeline: {
    key: "timeline",
    singular: "Experience",
    plural: "Experience",
    description: "Career timeline of positions and achievements.",
    primary: "role",
    secondary: "organization",
    fields: [
      { name: "role", label: "Role / Title", type: "text", required: true },
      { name: "organization", label: "Organization", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "start_date", label: "Start", type: "text", placeholder: "2021" },
      { name: "end_date", label: "End", type: "text", placeholder: "2024 (leave blank if current)" },
      { name: "is_current", label: "Current role", type: "checkbox" },
      { name: "description", label: "Description", type: "textarea", full: true, rows: 3 },
      {
        name: "achievements",
        label: "Key achievements",
        type: "tags",
        full: true,
        help: "One achievement per line.",
      },
      sortField,
    ],
  },
  categories: {
    key: "categories",
    singular: "Category",
    plural: "Project Categories",
    description: "Group projects for filtering on the homepage.",
    primary: "name",
    secondary: "slug",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, help: "URL-friendly id." },
      sortField,
    ],
  },
  projects: {
    key: "projects",
    singular: "Project",
    plural: "Projects",
    description: "Featured work with case studies and galleries.",
    primary: "title",
    secondary: "summary",
    imageField: "cover_image",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, help: "URL id, e.g. ai-platform." },
      {
        name: "category_id",
        label: "Category",
        type: "select",
        options: [{ value: "", label: "— None —" }],
        help: "Manage options under Categories.",
        full: true,
      },
      { name: "summary", label: "Summary", type: "textarea", full: true, rows: 2 },
      { name: "description", label: "Description", type: "textarea", full: true, rows: 5 },
      { name: "cover_image", label: "Cover image", type: "image", bucket: "media", full: true },
      { name: "gallery", label: "Gallery images", type: "tags", full: true, help: "One image URL per line." },
      { name: "technologies", label: "Technologies", type: "tags", full: true },
      { name: "outcomes", label: "Outcomes & impact", type: "textarea", full: true, rows: 3 },
      { name: "case_study", label: "Case study", type: "textarea", full: true, rows: 6 },
      { name: "demo_url", label: "Live URL", type: "url" },
      { name: "repo_url", label: "Source URL", type: "url" },
      { name: "year", label: "Year", type: "text" },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "published", label: "Published", type: "checkbox" },
      sortField,
    ],
  },
  publications: {
    key: "publications",
    singular: "Publication",
    plural: "Publications",
    description: "Research papers, articles and white papers.",
    primary: "title",
    secondary: "publisher",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, full: true },
      {
        name: "type",
        label: "Type",
        type: "select",
        options: [
          { value: "research", label: "Research Paper" },
          { value: "article", label: "Article" },
          { value: "whitepaper", label: "White Paper" },
          { value: "technical", label: "Technical Publication" },
        ],
      },
      { name: "published_date", label: "Date", type: "text", placeholder: "2024" },
      { name: "publisher", label: "Publisher / Venue", type: "text" },
      { name: "authors", label: "Authors", type: "text" },
      { name: "abstract", label: "Abstract", type: "textarea", full: true, rows: 4 },
      { name: "url", label: "Link", type: "url" },
      { name: "pdf_url", label: "PDF", type: "file", bucket: "documents" },
      sortField,
    ],
  },
  patents: {
    key: "patents",
    singular: "Patent",
    plural: "Patents & IP",
    description: "Granted and pending intellectual property.",
    primary: "title",
    secondary: "patent_number",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, full: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "granted", label: "Granted" },
          { value: "pending", label: "Pending" },
          { value: "filed", label: "Filed" },
        ],
      },
      { name: "patent_number", label: "Patent number", type: "text" },
      { name: "office", label: "Office", type: "text", placeholder: "USPTO, EPO…" },
      { name: "filing_date", label: "Filing date", type: "text" },
      { name: "grant_date", label: "Grant date", type: "text" },
      { name: "description", label: "Description", type: "textarea", full: true, rows: 3 },
      { name: "url", label: "Filing URL", type: "url", full: true },
      sortField,
    ],
  },
  awards: {
    key: "awards",
    singular: "Award",
    plural: "Awards",
    description: "Honors and recognition.",
    primary: "title",
    secondary: "organization",
    imageField: "image_url",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, full: true },
      { name: "organization", label: "Organization", type: "text" },
      { name: "year", label: "Year", type: "text" },
      { name: "description", label: "Description", type: "textarea", full: true, rows: 3 },
      { name: "image_url", label: "Logo / image", type: "image", bucket: "media" },
      { name: "url", label: "Link", type: "url" },
      sortField,
    ],
  },
  certifications: {
    key: "certifications",
    singular: "Certification",
    plural: "Certifications",
    description: "Professional credentials.",
    primary: "name",
    secondary: "issuer",
    imageField: "image_url",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, full: true },
      { name: "issuer", label: "Issuer", type: "text" },
      { name: "issue_date", label: "Issued", type: "text" },
      { name: "expiry_date", label: "Expires", type: "text" },
      { name: "credential_id", label: "Credential ID", type: "text" },
      { name: "credential_url", label: "Verify URL", type: "url" },
      { name: "image_url", label: "Badge image", type: "image", bucket: "media" },
      sortField,
    ],
  },
  speaking: {
    key: "speaking",
    singular: "Engagement",
    plural: "Speaking",
    description: "Keynotes, panels and workshops.",
    primary: "title",
    secondary: "event",
    fields: [
      { name: "title", label: "Talk title", type: "text", required: true, full: true },
      { name: "event", label: "Event", type: "text" },
      {
        name: "type",
        label: "Type",
        type: "select",
        options: [
          { value: "keynote", label: "Keynote" },
          { value: "panel", label: "Panel" },
          { value: "workshop", label: "Workshop" },
          { value: "conference", label: "Conference" },
        ],
      },
      { name: "location", label: "Location", type: "text" },
      { name: "date", label: "Date", type: "text" },
      { name: "description", label: "Description", type: "textarea", full: true, rows: 3 },
      { name: "video_url", label: "Video URL", type: "url" },
      { name: "slides_url", label: "Slides URL", type: "url" },
      { name: "url", label: "Event URL", type: "url" },
      { name: "image_url", label: "Image", type: "image", bucket: "media" },
      sortField,
    ],
  },
  press: {
    key: "press",
    singular: "Press item",
    plural: "Media & Press",
    description: "Coverage, interviews and features.",
    primary: "title",
    secondary: "outlet",
    imageField: "image_url",
    fields: [
      { name: "title", label: "Headline", type: "text", required: true, full: true },
      { name: "outlet", label: "Outlet", type: "text" },
      {
        name: "type",
        label: "Type",
        type: "select",
        options: [
          { value: "article", label: "Article" },
          { value: "interview", label: "Interview" },
          { value: "feature", label: "Feature" },
          { value: "podcast", label: "Podcast" },
          { value: "video", label: "Video" },
        ],
      },
      { name: "date", label: "Date", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea", full: true, rows: 3 },
      { name: "url", label: "Link", type: "url" },
      { name: "image_url", label: "Image", type: "image", bucket: "media" },
      sortField,
    ],
  },
  testimonials: {
    key: "testimonials",
    singular: "Testimonial",
    plural: "Testimonials",
    description: "Endorsements from leaders and peers.",
    primary: "name",
    secondary: "company",
    imageField: "avatar_url",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "title", label: "Title", type: "text" },
      { name: "company", label: "Company", type: "text" },
      { name: "rating", label: "Rating", type: "rating" },
      { name: "quote", label: "Quote", type: "textarea", required: true, full: true, rows: 4 },
      { name: "avatar_url", label: "Avatar", type: "image", bucket: "media" },
      sortField,
    ],
  },
  media: {
    key: "media",
    singular: "Media item",
    plural: "Gallery & Media",
    description: "Professional gallery images, videos and documents.",
    primary: "title",
    secondary: "category",
    imageField: "url",
    fields: [
      {
        name: "type",
        label: "Type",
        type: "select",
        options: [
          { value: "image", label: "Image" },
          { value: "video", label: "Video" },
          { value: "document", label: "Document" },
        ],
      },
      {
        name: "url",
        label: "File",
        type: "image",
        bucket: "media",
        accept: "image/*,video/*,.pdf,.doc,.docx",
        required: true,
        full: true,
      },
      { name: "title", label: "Title / caption", type: "text", full: true },
      { name: "description", label: "Description", type: "textarea", full: true, rows: 2 },
      { name: "category", label: "Category", type: "text" },
      sortField,
    ],
  },
};
