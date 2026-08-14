import { MaskText, Reveal, RuleLine } from "@/components/ui/reveal";
import { MagneticLink } from "@/components/ui/magnetic-link";
import { contact, site, socials } from "@/content/site";

/**
 * Closing section. The email is set large and is itself the primary link —
 * a contact form would add a backend for no gain at this scale.
 */
export function ContactCta({ index }: { index?: string }) {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden border-t border-line"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 100%, rgba(200,162,74,0.10) 0%, transparent 65%)",
        }}
      />

      <div className="shell relative py-28 sm:py-40">
        <RuleLine />
        <span className="label mt-5 block">
          {index ? <span className="text-accent">{index} / </span> : null}
          Contact
        </span>

        <MaskText
          as="h2"
          text={contact.heading}
          className="display-lg mt-10 max-w-[18ch] text-fg sm:mt-14"
        />

        <Reveal delay={0.15}>
          <p className="mt-8 max-w-[48ch] text-sm leading-relaxed text-muted sm:text-base">
            {contact.body}
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <a
            href={`mailto:${site.email}`}
            className="link-underline font-display mt-14 inline-block text-[clamp(1.5rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.025em] break-all text-fg transition-colors duration-500 hover:text-accent"
          >
            {site.email}
          </a>
        </Reveal>

        <Reveal delay={0.28}>
          <div className="mt-14 flex flex-wrap items-center gap-3">
            <MagneticLink href={`mailto:${site.email}`}>Send an email</MagneticLink>
            {socials
              .filter((s) => !s.href.startsWith("mailto:"))
              .map((s) => (
                <MagneticLink key={s.label} href={s.href} variant="ghost" external>
                  {s.label}
                </MagneticLink>
              ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
