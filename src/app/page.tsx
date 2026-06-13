import { getPortfolioData } from "@/lib/data";
import { resolveSections } from "@/lib/sections";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { StructuredData } from "@/components/public/structured-data";
import { Hero } from "@/components/public/sections/hero";
import { About } from "@/components/public/sections/about";
import { Expertise } from "@/components/public/sections/expertise";
import { Timeline } from "@/components/public/sections/timeline";
import { Projects } from "@/components/public/sections/projects";
import { Publications } from "@/components/public/sections/publications";
import { Patents } from "@/components/public/sections/patents";
import { Awards } from "@/components/public/sections/awards";
import { Press } from "@/components/public/sections/press";
import { Speaking } from "@/components/public/sections/speaking";
import { Certifications } from "@/components/public/sections/certifications";
import { Testimonials } from "@/components/public/sections/testimonials";
import { Gallery } from "@/components/public/sections/gallery";
import { Contact } from "@/components/public/sections/contact";

// Statically cached; revalidated on-demand when admins edit (see CONTENT_TAG).
export const revalidate = 3600;

export default async function HomePage() {
  const data = await getPortfolioData();
  const sections = resolveSections(data.settings?.sections);

  // Map each section key to its rendered component.
  const blocks: Record<string, React.ReactNode> = {
    about: <About profile={data.profile} />,
    expertise: <Expertise items={data.expertise} />,
    timeline: <Timeline items={data.timeline} />,
    projects: <Projects projects={data.projects} categories={data.categories} />,
    publications: <Publications items={data.publications} />,
    patents: <Patents items={data.patents} />,
    awards: <Awards items={data.awards} />,
    press: <Press items={data.press} />,
    speaking: <Speaking items={data.speaking} />,
    certifications: <Certifications items={data.certifications} />,
    testimonials: <Testimonials items={data.testimonials} />,
    gallery: <Gallery items={data.media} />,
    contact: <Contact profile={data.profile} />,
  };

  const name = data.profile?.full_name || data.settings?.site_name || "Portfolio";

  return (
    <>
      <StructuredData profile={data.profile} seo={data.seo} />
      <Navbar name={name} sections={sections} cvUrl={data.profile?.cv_url} />

      {data.settings?.show_announcement && data.settings.announcement && (
        <div className="fixed inset-x-0 top-16 z-40 bg-[var(--accent)] py-2 text-center text-sm font-medium text-black">
          {data.settings.announcement}
        </div>
      )}

      <main>
        <Hero profile={data.profile} />
        {sections
          .filter((s) => s.visible && blocks[s.key])
          .map((s) => (
            <div key={s.key}>{blocks[s.key]}</div>
          ))}
      </main>

      <Footer profile={data.profile} settings={data.settings} sections={sections} />
    </>
  );
}
