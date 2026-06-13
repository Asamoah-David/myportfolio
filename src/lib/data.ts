// Centralised read layer for the PUBLIC site.
//
// Reads are served from the Next.js Data Cache via unstable_cache, tagged with
// CONTENT_TAG. Admin mutations call revalidateTag(CONTENT_TAG, "max") so the
// public site is fast (no per-request DB round-trips) yet always reflects the
// latest edits. A cookieless anon client is used so caching is legal.
//
// Every query is wrapped so a missing/misconfigured Supabase connection
// degrades to empty content (skeletons) instead of crashing the page.
import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { supabaseConfigured } from "@/lib/supabase/env";
import type {
  Profile,
  Expertise,
  TimelineEntry,
  Project,
  ProjectCategory,
  Award,
  Certification,
  Publication,
  Patent,
  SpeakingEngagement,
  Press,
  MediaItem,
  Testimonial,
  SeoSettings,
  SiteSettings,
  PortfolioData,
} from "@/types/database";

// Shared cache tag. Invalidated by every content mutation.
export const CONTENT_TAG = "portfolio-content";

// Wrap a reader in the Data Cache under CONTENT_TAG.
function cached<A extends unknown[], T>(
  fn: (...args: A) => Promise<T>,
  keyParts: string[],
) {
  return unstable_cache(fn, keyParts, { tags: [CONTENT_TAG], revalidate: 3600 });
}

async function one<T>(table: string): Promise<T | null> {
  if (!supabaseConfigured) return null;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase.from(table).select("*").limit(1).maybeSingle();
    return (data as T) ?? null;
  } catch {
    return null;
  }
}

async function many<T>(table: string): Promise<T[]> {
  if (!supabaseConfigured) return [];
  try {
    const supabase = createPublicClient();
    const { data } = await supabase.from(table).select("*").order("sort_order");
    return (data ?? []) as T[];
  } catch {
    return [];
  }
}

export const getProfile = cached(() => one<Profile>("profile"), ["profile"]);
export const getSeo = cached(() => one<SeoSettings>("seo_settings"), ["seo"]);
export const getSettings = cached(() => one<SiteSettings>("site_settings"), ["settings"]);
export const getExpertise = cached(() => many<Expertise>("expertise"), ["expertise"]);
export const getTimeline = cached(() => many<TimelineEntry>("timeline"), ["timeline"]);
export const getCategories = cached(
  () => many<ProjectCategory>("project_categories"),
  ["categories"],
);
export const getAwards = cached(() => many<Award>("awards"), ["awards"]);
export const getCertifications = cached(
  () => many<Certification>("certifications"),
  ["certifications"],
);
export const getPublications = cached(() => many<Publication>("publications"), ["publications"]);
export const getPatents = cached(() => many<Patent>("patents"), ["patents"]);
export const getSpeaking = cached(
  () => many<SpeakingEngagement>("speaking_engagements"),
  ["speaking"],
);
export const getPress = cached(() => many<Press>("press"), ["press"]);
export const getMedia = cached(() => many<MediaItem>("media"), ["media"]);
export const getTestimonials = cached(() => many<Testimonial>("testimonials"), ["testimonials"]);

export const getProjects = cached(async (): Promise<Project[]> => {
  if (!supabaseConfigured) return [];
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("projects")
      .select("*, category:project_categories(*)")
      .eq("published", true)
      .order("sort_order");
    return (data ?? []) as Project[];
  } catch {
    return [];
  }
}, ["projects"]);

export const getProjectBySlug = cached(async (slug: string): Promise<Project | null> => {
  if (!supabaseConfigured) return null;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("projects")
      .select("*, category:project_categories(*)")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return (data as Project) ?? null;
  } catch {
    return null;
  }
}, ["project-by-slug"]);

// Loads the entire portfolio in parallel for the homepage / print view.
export async function getPortfolioData(): Promise<PortfolioData> {
  const [
    profile,
    expertise,
    timeline,
    projects,
    categories,
    awards,
    certifications,
    publications,
    patents,
    speaking,
    press,
    media,
    testimonials,
    seo,
    settings,
  ] = await Promise.all([
    getProfile(),
    getExpertise(),
    getTimeline(),
    getProjects(),
    getCategories(),
    getAwards(),
    getCertifications(),
    getPublications(),
    getPatents(),
    getSpeaking(),
    getPress(),
    getMedia(),
    getTestimonials(),
    getSeo(),
    getSettings(),
  ]);

  return {
    profile,
    expertise,
    timeline,
    projects,
    categories,
    awards,
    certifications,
    publications,
    patents,
    speaking,
    press,
    media,
    testimonials,
    seo,
    settings,
  };
}
