import { z } from "zod";

// Coerce optional text inputs: "" -> null so the DB stores NULL (-> skeleton).
const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

const url = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional()
  .refine((v) => v == null || /^https?:\/\/|^\//.test(v), {
    message: "Must be a valid URL",
  });

// Robust checkbox coercion. Each checkbox is paired with a hidden "false"
// companion input in the UI, so the submitted value is the literal string
// "true" or "false" (never absent). z.coerce.boolean() can't be used because it
// treats the string "false" as truthy.
const checkbox = z.preprocess(
  (v) => v === true || v === "true" || v === "on",
  z.boolean(),
);

// Accepts a comma- or newline-separated string OR an array, yields string[].
const stringList = z
  .union([z.string(), z.array(z.string())])
  .transform((v) =>
    (Array.isArray(v) ? v : v.split(/[\n,]/))
      .map((s) => s.trim())
      .filter(Boolean),
  )
  .default([]);

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(10, "Message is too short").max(5000),
  // Honeypot — must stay empty. Bots tend to fill every field.
  company: z.string().max(0).optional().default(""),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const profileSchema = z.object({
  full_name: optionalText,
  title: optionalText,
  tagline: optionalText,
  bio: optionalText,
  mission: optionalText,
  executive_summary: optionalText,
  philosophy: optionalText,
  career_overview: optionalText,
  email: optionalText,
  phone: optionalText,
  location: optionalText,
  avatar_url: url,
  hero_image_url: url,
  cv_url: url,
  cv_filename: optionalText,
  available: checkbox.default(true),
  social_links: z
    .array(z.object({ label: z.string(), url: z.string(), icon: z.string().optional() }))
    .default([]),
  stats: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
});

export const expertiseSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: optionalText,
  icon: optionalText,
  skills: stringList,
  sort_order: z.coerce.number().int().default(0),
});

export const timelineSchema = z.object({
  role: z.string().trim().min(1, "Role is required"),
  organization: optionalText,
  location: optionalText,
  start_date: optionalText,
  end_date: optionalText,
  is_current: checkbox.default(false),
  description: optionalText,
  achievements: stringList,
  sort_order: z.coerce.number().int().default(0),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().min(1),
  sort_order: z.coerce.number().int().default(0),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z.string().trim().min(1),
  summary: optionalText,
  description: optionalText,
  category_id: z
    .string()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional(),
  cover_image: url,
  gallery: stringList,
  technologies: stringList,
  outcomes: optionalText,
  case_study: optionalText,
  demo_url: url,
  repo_url: url,
  year: optionalText,
  featured: checkbox.default(false),
  published: checkbox.default(true),
  sort_order: z.coerce.number().int().default(0),
});

export const awardSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  organization: optionalText,
  year: optionalText,
  description: optionalText,
  image_url: url,
  url: url,
  sort_order: z.coerce.number().int().default(0),
});

export const certificationSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  issuer: optionalText,
  issue_date: optionalText,
  expiry_date: optionalText,
  credential_id: optionalText,
  credential_url: url,
  image_url: url,
  sort_order: z.coerce.number().int().default(0),
});

export const publicationSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  type: z.enum(["research", "article", "whitepaper", "technical"]).default("article"),
  publisher: optionalText,
  authors: optionalText,
  abstract: optionalText,
  url: url,
  pdf_url: url,
  published_date: optionalText,
  sort_order: z.coerce.number().int().default(0),
});

export const patentSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  patent_number: optionalText,
  status: z.enum(["filed", "pending", "granted"]).default("granted"),
  office: optionalText,
  filing_date: optionalText,
  grant_date: optionalText,
  description: optionalText,
  url: url,
  sort_order: z.coerce.number().int().default(0),
});

export const speakingSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  event: optionalText,
  type: z.enum(["keynote", "workshop", "panel", "conference"]).default("keynote"),
  location: optionalText,
  date: optionalText,
  description: optionalText,
  url: url,
  video_url: url,
  slides_url: url,
  image_url: url,
  sort_order: z.coerce.number().int().default(0),
});

export const pressSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  outlet: optionalText,
  type: z.enum(["article", "interview", "feature", "podcast", "video"]).default("article"),
  date: optionalText,
  excerpt: optionalText,
  url: url,
  image_url: url,
  sort_order: z.coerce.number().int().default(0),
});

export const mediaSchema = z.object({
  title: optionalText,
  description: optionalText,
  type: z.enum(["image", "video", "document"]).default("image"),
  url: z.string().trim().min(1, "A URL is required"),
  category: optionalText,
  sort_order: z.coerce.number().int().default(0),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  title: optionalText,
  company: optionalText,
  quote: z.string().trim().min(1, "Quote is required"),
  avatar_url: url,
  rating: z.coerce.number().int().min(1).max(5).default(5),
  sort_order: z.coerce.number().int().default(0),
});

export const seoSchema = z.object({
  meta_title: optionalText,
  meta_description: optionalText,
  keywords: optionalText,
  og_image: url,
  og_title: optionalText,
  og_description: optionalText,
  twitter_handle: optionalText,
  canonical_url: url,
});

export const settingsSchema = z.object({
  site_name: optionalText,
  accent_color: optionalText,
  theme: z.enum(["dark", "light"]).default("dark"),
  announcement: optionalText,
  show_announcement: checkbox.default(false),
  footer_text: optionalText,
  sections: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        visible: z.boolean(),
        order: z.number(),
      }),
    )
    .default([]),
});
