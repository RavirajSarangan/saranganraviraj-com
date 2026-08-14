import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialMarquee } from "@/components/ui/testimonial-marquee";
import { testimonials } from "@/content/site";

/**
 * Renders nothing while `testimonials` is empty.
 *
 * The previous site carried template quotes crediting a person who was never a
 * client. Showing nothing is more credible than showing fiction — add real
 * entries to content/site.ts and this section appears on its own.
 */
export function Testimonials({ index = "04" }: { index?: string }) {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="In their words"
          index={index}
          title="What clients say afterwards."
          aside={`${testimonials.length} references`}
        />
      </div>

      <div className="mt-16 sm:mt-20">
        <TestimonialMarquee items={testimonials} />
      </div>
    </section>
  );
}
