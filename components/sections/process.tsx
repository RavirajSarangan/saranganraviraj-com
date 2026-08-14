import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { process } from "@/content/site";

/**
 * A five-step ledger. Sticky heading on the left, steps scrolling past on the
 * right — the layout itself communicates "this is a defined process".
 */
export function Process({ index = "03" }: { index?: string }) {
  return (
    <section id="process" className="scroll-mt-24 border-t border-line bg-ink-deep">
      <div className="shell py-24 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow="How it works"
                index={index}
                title="A process built to remove surprises."
              />
              <p className="mt-8 max-w-[42ch] text-sm leading-relaxed text-muted">
                No stage begins until we both agree what finishing it looks like.
                You will always know where the project stands and what happens next.
              </p>
            </div>
          </div>

          <RevealGroup className="lg:col-span-6 lg:col-start-7" each={0.08}>
            {process.map((step) => (
              <RevealItem key={step.step}>
                <div className="group flex gap-6 border-b border-line py-8 first:border-t sm:gap-10">
                  <span className="label w-8 shrink-0 pt-1.5 text-accent">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="font-display text-[clamp(1.375rem,2.4vw,1.75rem)] leading-tight tracking-[-0.015em] text-fg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted">
                      {step.body}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
