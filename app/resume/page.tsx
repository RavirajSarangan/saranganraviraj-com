import type { Metadata } from "next";
import { ContactCta } from "@/components/sections/contact-cta";
import { MagneticLink } from "@/components/ui/magnetic-link";
import { MaskText, Reveal } from "@/components/ui/reveal";
import {
  RoleList,
  EducationList,
  SkillGroups,
  CertificationList,
} from "@/components/sections/resume-sections";
import {
  certifications,
  education,
  experience,
  leadership,
  resume,
  site,
  skills,
  stack,
} from "@/content/site";

export const metadata: Metadata = {
  title: "Résumé",
  description: resume.summary,
};

export default function ResumePage() {
  return (
    <>
      <section className="shell pt-[calc(72px+5rem)] pb-4 sm:pt-[calc(72px+8rem)]">
        <span className="label block">Index / Résumé</span>
        <MaskText
          as="h1"
          text={resume.lede}
          className="display-xl mt-8 max-w-[14ch] text-fg"
        />

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-[58ch] text-[clamp(1rem,1.6vw,1.1875rem)] leading-[1.65] text-fg/80">
            {resume.summary}
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <MagneticLink href={resume.href} external>
              Download CV
            </MagneticLink>
            <MagneticLink href={`mailto:${site.email}`} variant="ghost">
              Get in touch
            </MagneticLink>
          </div>
        </Reveal>
      </section>

      <RoleList
        roles={experience}
        eyebrow="Experience"
        index="01"
        title="Nine roles, one throughline."
        aside={`${experience.length} positions`}
      />

      <EducationList credentials={education} index="02" />

      <SkillGroups
        groups={skills}
        eyebrow="Skills"
        index="03"
        title="What the work actually involves."
      />

      <SkillGroups
        groups={stack}
        eyebrow="Stack"
        index="04"
        title="The tools it gets built with."
      />

      <RoleList
        roles={leadership}
        eyebrow="Leadership"
        index="05"
        title="Work outside the client list."
        aside={`${leadership.length} positions`}
      />

      <CertificationList certifications={certifications} index="06" />

      <ContactCta />
    </>
  );
}
