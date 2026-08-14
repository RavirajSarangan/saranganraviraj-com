import { Hero } from "@/components/sections/hero";
import { WorkReel } from "@/components/sections/work-reel";
import { Marquee } from "@/components/ui/marquee";
import { WorkIndex } from "@/components/sections/work-index";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Testimonials } from "@/components/sections/testimonials";
import { AboutIntro } from "@/components/sections/about-intro";
import { ContactCta } from "@/components/sections/contact-cta";
import { featuredProjects, services, testimonials } from "@/content/site";

/**
 * Section numbering is computed, not hardcoded: Testimonials only renders when
 * real quotes exist, and a hardcoded sequence would leave a visible gap at 04.
 */
function numbering() {
  const order = [
    "work",
    "services",
    "process",
    ...(testimonials.length > 0 ? ["testimonials"] : []),
    "about",
    "contact",
  ];
  return Object.fromEntries(
    order.map((key, i) => [key, String(i + 1).padStart(2, "0")]),
  ) as Record<string, string>;
}

export default function Home() {
  const n = numbering();

  return (
    <>
      <Hero />
      {/* Curved reel bridges the shader hero and the typographic index */}
      <WorkReel projects={featuredProjects} />
      <Marquee items={services.map((s) => s.title)} />
      <WorkIndex projects={featuredProjects} index={n.work} />
      <Services index={n.services} />
      <Process index={n.process} />
      <Testimonials index={n.testimonials} />
      <AboutIntro index={n.about} />
      <ContactCta index={n.contact} />
    </>
  );
}
