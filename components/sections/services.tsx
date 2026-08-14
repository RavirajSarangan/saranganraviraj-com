import { SectionHeading } from "@/components/ui/section-heading";
import { renderTagIcon } from "@/components/ui/tag-icon";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { services } from "@/content/site";

/**
 * Services as a two-column ledger. The index numbers and hairlines carry the
 * structure so the cards need no borders, shadows or fills of their own.
 */
export function Services({ index = "02" }: { index?: string }) {
  return (
    <section id="services" className="shell scroll-mt-24 py-24 sm:py-32">
      <SectionHeading
        eyebrow="What I do"
        index={index}
        title="Four ways I can help you ship."
        aside="Services"
      />

      <RevealGroup className="mt-16 grid gap-px border-t border-line sm:mt-24 lg:grid-cols-2">
        {services.map((service) => (
          <RevealItem key={service.index}>
            <article className="group relative h-full border-b border-line py-10 lg:odd:pr-12 lg:even:border-l lg:even:pl-12">
              <div className="flex items-baseline gap-5">
                <span className="label text-accent">{service.index}</span>
                <h3 className="font-display text-[clamp(1.5rem,3vw,2.125rem)] leading-[1.05] tracking-[-0.02em] text-fg">
                  {service.title}
                </h3>
              </div>

              <p className="mt-5 max-w-[54ch] pl-0 text-sm leading-relaxed text-muted sm:pl-[3.75rem]">
                {service.body}
              </p>

              <ul className="mt-7 flex flex-wrap gap-2 sm:pl-[3.75rem]">
                {service.tags.map((tag) => (
                  <li
                    key={tag}
                    // text-fg/55 measured 3.94:1 on ivory — below AA for 11px text.
                    // `text-muted` is the token already tuned for this: 6.01:1 light,
                    // 5.61:1 dark.
                    className="label flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-muted transition-colors duration-500 group-hover:border-line-strong group-hover:text-fg"
                  >
                    {renderTagIcon(tag)}
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
