import { SectionHeading } from "@/components/ui/section-heading";
import { renderTagIcon } from "@/components/ui/tag-icon";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import type { Role, Credential, SkillGroup, Certification } from "@/content/site";

/**
 * Résumé sections, built from the same editorial ledger the rest of the site uses:
 * a numbered `SectionHeading`, a hairline-divided list, mono metadata in a fixed-width
 * rail on the left. Nothing new is invented here visually — that consistency is what
 * makes the page read as part of the site rather than a pasted CV.
 */

/** Renders "Feb 2024 — Present" from a role whose `end` may be null. */
function period(role: Role) {
  return `${role.start} — ${role.end ?? "Present"}`;
}

export function RoleList({
  roles,
  eyebrow,
  index,
  title,
  aside,
}: {
  roles: Role[];
  eyebrow: string;
  index: string;
  title: string;
  aside?: string;
}) {
  if (roles.length === 0) return null;

  return (
    <section className="shell scroll-mt-24 py-20 sm:py-28">
      <SectionHeading eyebrow={eyebrow} index={index} title={title} aside={aside} />

      <RevealGroup className="mt-14 border-t border-line sm:mt-20" each={0.05}>
        {roles.map((role) => (
          <RevealItem key={`${role.org}-${role.title}-${role.start}`}>
            <article className="grid gap-4 border-b border-line py-8 sm:py-10 lg:grid-cols-12 lg:gap-8">
              {/* Year rail. Roles legitimately overlap, so this is a label, not a
                  position on a single exclusive timeline. */}
              <div className="lg:col-span-3">
                <span className="label whitespace-nowrap">{period(role)}</span>
              </div>

              <div className="lg:col-span-9">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-[clamp(1.25rem,2.4vw,1.75rem)] leading-tight tracking-[-0.015em] text-fg">
                    {role.title}
                  </h3>
                  <span className="text-accent">·</span>
                  <span className="font-display text-[clamp(1.125rem,2vw,1.5rem)] leading-tight tracking-[-0.015em] text-fg/70">
                    {role.org}
                  </span>
                </div>

                <span className="label mt-2.5 block">{role.location}</span>

                <ul className="mt-5 space-y-2.5">
                  {role.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="relative max-w-[68ch] pl-5 text-sm leading-relaxed text-muted"
                    >
                      <span
                        aria-hidden
                        className="absolute top-[0.6em] left-0 h-px w-2.5 bg-accent/60"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

export function EducationList({
  credentials,
  index,
}: {
  credentials: Credential[];
  index: string;
}) {
  if (credentials.length === 0) return null;

  return (
    <section className="scroll-mt-24 border-t border-line bg-ink-deep">
      <div className="shell py-20 sm:py-28">
        <SectionHeading
          eyebrow="Education"
          index={index}
          title="Where the foundations came from."
          aside={`${credentials.length} qualifications`}
        />

        <RevealGroup className="mt-14 border-t border-line sm:mt-20" each={0.06}>
          {credentials.map((c) => (
            <RevealItem key={c.qualification}>
              <article className="grid gap-3 border-b border-line py-7 sm:py-9 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-3">
                  <span className="label whitespace-nowrap">{c.period}</span>
                </div>
                <div className="lg:col-span-9">
                  <h3 className="font-display text-[clamp(1.25rem,2.4vw,1.75rem)] leading-tight tracking-[-0.015em] text-fg">
                    {c.qualification}
                  </h3>
                  <span className="mt-2 block text-sm text-muted">{c.institution}</span>
                  {c.note && (
                    <span className="label mt-3 inline-block rounded-full border border-accent/40 px-3.5 py-2 text-accent">
                      {c.note}
                    </span>
                  )}
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export function SkillGroups({
  groups,
  eyebrow,
  index,
  title,
  aside,
}: {
  groups: SkillGroup[];
  eyebrow: string;
  index: string;
  title: string;
  aside?: string;
}) {
  if (groups.length === 0) return null;

  return (
    <section className="shell scroll-mt-24 py-20 sm:py-28">
      <SectionHeading eyebrow={eyebrow} index={index} title={title} aside={aside} />

      <RevealGroup className="mt-14 border-t border-line sm:mt-20" each={0.07}>
        {groups.map((group) => (
          <RevealItem key={group.label}>
            <div className="grid gap-4 border-b border-line py-8 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-3">
                <span className="label">{group.label}</span>
              </div>
              <ul className="flex flex-wrap gap-2 lg:col-span-9">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2 font-mono text-[0.6875rem] tracking-[0.08em] text-fg/70 transition-colors duration-500 hover:border-line-strong hover:text-fg"
                  >
                    {renderTagIcon(item)}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

export function CertificationList({
  certifications,
  index,
}: {
  certifications: Certification[];
  index: string;
}) {
  if (certifications.length === 0) return null;

  return (
    <section className="scroll-mt-24 border-t border-line bg-ink-deep">
      <div className="shell py-20 sm:py-28">
        <SectionHeading
          eyebrow="Certifications"
          index={index}
          title="Independently verifiable."
          aside={`${certifications.length} credentials`}
        />

        <RevealGroup className="mt-14 border-t border-line sm:mt-20" each={0.05}>
          {certifications.map((c) => (
            <RevealItem key={`${c.name}-${c.issuer}`}>
              {/* The verify link is the whole point of this section — a badge image
                  proves nothing, a resolvable URL does. */}
              <a
                href={c.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-line py-6 transition-colors"
              >
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-display text-[clamp(1.125rem,2vw,1.5rem)] leading-tight tracking-[-0.015em] text-fg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
                    {c.name}
                  </span>
                  <span className="label">{c.issuer}</span>
                </span>
                <span className="flex items-baseline gap-4">
                  {c.date && <span className="label">{c.date}</span>}
                  <span className="label text-accent">
                    Verify{" "}
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-500 group-hover:translate-x-1"
                    >
                      ↗
                    </span>
                  </span>
                </span>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
