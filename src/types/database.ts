// Domain types mirroring the Supabase schema in supabase/schema.sql.
// Kept hand-written (rather than generated) so the app has zero extra tooling.

export type SocialLink = { label: string; url: string; icon?: string };
export type Stat = { label: string; value: string };
export type SectionConfig = { key: string; label: string; visible: boolean; order: number };

export interface Profile {
  id: string;
  full_name: string | null;
  title: string | null;
  tagline: string | null;
  bio: string | null;
  mission: string | null;
  executive_summary: string | null;
  philosophy: string | null;
  career_overview: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  avatar_url: string | null;
  hero_image_url: string | null;
  cv_url: string | null;
  cv_filename: string | null;
  available: boolean;
  social_links: SocialLink[];
  stats: Stat[];
  updated_at: string;
}

export interface Expertise {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  skills: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TimelineEntry {
  id: string;
  role: string;
  organization: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  achievements: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  category_id: string | null;
  cover_image: string | null;
  gallery: string[];
  technologies: string[];
  outcomes: string | null;
  case_study: string | null;
  demo_url: string | null;
  repo_url: string | null;
  year: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: ProjectCategory | null;
}

export interface Award {
  id: string;
  title: string;
  organization: string | null;
  year: string | null;
  description: string | null;
  image_url: string | null;
  url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Publication {
  id: string;
  title: string;
  type: string;
  publisher: string | null;
  authors: string | null;
  abstract: string | null;
  url: string | null;
  pdf_url: string | null;
  published_date: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Patent {
  id: string;
  title: string;
  patent_number: string | null;
  status: string;
  office: string | null;
  filing_date: string | null;
  grant_date: string | null;
  description: string | null;
  url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SpeakingEngagement {
  id: string;
  title: string;
  event: string | null;
  type: string;
  location: string | null;
  date: string | null;
  description: string | null;
  url: string | null;
  video_url: string | null;
  slides_url: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Press {
  id: string;
  title: string;
  outlet: string | null;
  type: string;
  date: string | null;
  excerpt: string | null;
  url: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  id: string;
  title: string | null;
  description: string | null;
  type: string;
  url: string;
  category: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  rating: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  ip_address: string | null;
  created_at: string;
}

export interface SeoSettings {
  id: string;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string | null;
  og_image: string | null;
  og_title: string | null;
  og_description: string | null;
  twitter_handle: string | null;
  canonical_url: string | null;
  structured_data: Record<string, unknown>;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string | null;
  accent_color: string | null;
  theme: string | null;
  announcement: string | null;
  show_announcement: boolean;
  sections: SectionConfig[];
  footer_text: string | null;
  updated_at: string;
}

export interface PortfolioData {
  profile: Profile | null;
  expertise: Expertise[];
  timeline: TimelineEntry[];
  projects: Project[];
  categories: ProjectCategory[];
  awards: Award[];
  certifications: Certification[];
  publications: Publication[];
  patents: Patent[];
  speaking: SpeakingEngagement[];
  press: Press[];
  media: MediaItem[];
  testimonials: Testimonial[];
  seo: SeoSettings | null;
  settings: SiteSettings | null;
}
