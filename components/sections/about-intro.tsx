import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { MagneticLink } from "@/components/ui/magnetic-link";
import { about, site } from "@/content/site";

/**
 * Portrait frame doubles as a placeholder: with no photo it renders a duotone
 * plate carrying the initials, which reads as intentional rather than broken.
 * Add `portrait` in content/site.ts and the image takes over.
 */
export function PortraitFrame({ className = "" }: { className?: string }) {
  const initials = site.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <div
      className={`relative overflow-hidden rounded-sm border border-line ${className}`}
      // Unlike the project plates (fixed cover art), the portrait frame is UI —
      // it sits inline with body copy and has to follow the theme.
      style={
        about.portrait
          ? undefined
          : {
              background:
                "radial-gradient(120% 100% at 30% 0%, var(--color-surface-2) 0%, var(--color-ink-deep) 70%)",
            }
      }
    >
      {about.portrait ? (
        <Image
          src={about.portrait}
          alt={`Portrait of ${site.name}`}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
      ) : (
        <>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              aria-hidden
              className="font-display text-[clamp(4rem,12vw,8rem)] leading-none tracking-[-0.03em] text-fg/15 select-none"
            >
              {initials}
            </span>
          </div>
          <span className="label absolute bottom-5 left-5 text-muted">
            {site.location}
          </span>
        </>
      )}
    </div>
  );
}

export function AboutIntro({ index = "05" }: { index?: string }) {
  return (
    <section id="about" className="shell scroll-mt-24 py-24 sm:py-32">
      <SectionHeading
        eyebrow="About"
        index={index}
        title={about.lede}
        aside={site.timezone}
      />

      <div className="mt-16 grid gap-12 sm:mt-24 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <PortraitFrame className="aspect-[4/5] w-full" />
        </Reveal>

        <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
          <div className="space-y-6">
            {about.body.slice(0, 2).map((para, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.65] text-fg/85"
                    : "text-sm leading-relaxed text-muted sm:text-[0.9375rem]"
                }
              >
                {para}
              </p>
            ))}
          </div>

          <div className="mt-10">
            <MagneticLink href="/about" variant="ghost">
              More about me
            </MagneticLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
