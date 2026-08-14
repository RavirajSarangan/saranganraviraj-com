import type { Metadata } from "next";
import { WorkIndex } from "@/components/sections/work-index";
import { ContactCta } from "@/components/sections/contact-cta";
import { MaskText } from "@/components/ui/reveal";
import { behance, projects } from "@/content/site";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Twelve projects — commerce, hospitality, education, product, security research and AI, designed and built end to end.",
};

export default function WorkPage() {
  return (
    <>
      <section className="shell pt-[calc(72px+5rem)] pb-4 sm:pt-[calc(72px+8rem)]">
        <span className="label block">Index / Work</span>
        <MaskText
          as="h1"
          text="Every project, start to finish."
          className="display-xl mt-8 max-w-[13ch] text-fg"
        />
        <p className="mt-10 max-w-[52ch] text-sm leading-relaxed text-muted sm:text-base">
          Twelve projects across commerce, hospitality, education, product,
          security research and AI. Each one designed and built end to end — open
          any of them for the reasoning behind the result.
        </p>
      </section>

      <WorkIndex projects={projects} showHeading={false} />

      {/* Renders only once a Behance URL is set — see `behance` in content/site.ts */}
      {behance.url && (
        <section className="shell pb-24 sm:pb-32">
          <a
            href={behance.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-8"
          >
            <span className="font-display text-[clamp(1.25rem,2.6vw,1.875rem)] leading-tight tracking-[-0.02em] text-fg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
              {behance.label}
            </span>
            <span className="label text-accent">
              View on Behance{" "}
              <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-1">↗</span>
            </span>
          </a>
        </section>
      )}

      <ContactCta />
    </>
  );
}
