import type { Metadata } from "next";
import { PortraitFrame } from "@/components/sections/about-intro";
import { ContactCta } from "@/components/sections/contact-cta";
import { MaskText, Reveal, RevealGroup, RevealItem, RuleLine } from "@/components/ui/reveal";
import { about, facts, resume, services, site, socials } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: about.lede,
};

export default function AboutPage() {
  return (
    <>
      <section className="shell pt-[calc(72px+5rem)] sm:pt-[calc(72px+8rem)]">
        <span className="label block">Index / About</span>
        <MaskText
          as="h1"
          text={about.lede}
          className="display-xl mt-8 max-w-[13ch] text-fg"
        />
      </section>

      <div className="shell mt-20 grid gap-14 sm:mt-28 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <PortraitFrame className="aspect-[4/5] w-full" />

          <div className="mt-10">
            <RuleLine />
            <span className="label mt-5 mb-5 block">Details</span>
            {[
              { k: "Based", v: site.location },
              { k: "Timezone", v: site.timezone },
              { k: "Role", v: site.role },
              {
                k: "Status",
                v: site.availability.open
                  ? `Available ${site.availability.window}`
                  : "Currently booked",
              },
            ].map((row) => (
              <div
                key={row.k}
                className="flex items-baseline justify-between gap-6 border-b border-line py-4"
              >
                <span className="label shrink-0">{row.k}</span>
                <span className="text-right text-sm text-fg/80">{row.v}</span>
              </div>
            ))}

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <a
                href={resume.href}
                className="label link-underline text-accent transition-colors hover:text-fg"
              >
                Download CV ↓
              </a>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="label link-underline text-fg/70 transition-colors hover:text-accent"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <div className="space-y-7">
              {about.body.map((para, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-[clamp(1.125rem,2vw,1.5rem)] leading-[1.55] text-fg/90"
                      : "text-sm leading-[1.75] text-muted sm:text-base"
                  }
                >
                  {para}
                </p>
              ))}
            </div>
          </Reveal>

          {/* Capability list — the disciplines, stated plainly */}
          <div className="mt-16">
            <RuleLine />
            <span className="label mt-5 block">Disciplines</span>
            <RevealGroup className="mt-8" each={0.06}>
              {services.map((s) => (
                <RevealItem key={s.index}>
                  <div className="flex gap-5 border-b border-line py-5">
                    <span className="label w-8 shrink-0 pt-1 text-accent">
                      {s.index}
                    </span>
                    <div>
                      <h2 className="font-display text-xl leading-tight tracking-[-0.015em] text-fg">
                        {s.title}
                      </h2>
                      <p className="mt-2 text-sm text-muted">
                        {s.tags.join(" · ")}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>

      {/* Facts strip */}
      <section className="shell mt-24 sm:mt-32">
        <div className="grid grid-cols-2 border-t border-line sm:grid-cols-4">
          {facts.map((fact, i) => (
            <div
              key={fact.label}
              className={`py-8 ${i > 0 ? "sm:border-l sm:border-line sm:pl-6" : ""} ${
                i % 2 === 1 ? "border-l border-line pl-6 sm:pl-6" : ""
              } ${i < 2 ? "border-b border-line sm:border-b-0" : ""}`}
            >
              <span className="font-display block text-[clamp(1.75rem,4vw,2.5rem)] leading-none tracking-[-0.02em] text-fg">
                {fact.value}
              </span>
              <span className="label mt-2.5 block">{fact.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-24 sm:mt-32">
        <ContactCta />
      </div>
    </>
  );
}
