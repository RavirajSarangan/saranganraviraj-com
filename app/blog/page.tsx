import type { Metadata } from "next";
import { ContactCta } from "@/components/sections/contact-cta";
import { MaskText } from "@/components/ui/reveal";
import { BlogIndex } from "@/components/sections/blog-index";
import { posts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on design, pricing, process and the craft of building websites that hold up.",
};

export default function BlogPage() {
  return (
    <>
      <section className="shell pt-[calc(72px+5rem)] sm:pt-[calc(72px+8rem)]">
        <span className="label block">Index / Writing</span>
        <MaskText
          as="h1"
          text="Notes from the work."
          className="display-xl mt-8 max-w-[12ch] text-fg"
        />
        <p className="mt-10 max-w-[52ch] text-sm leading-relaxed text-muted sm:text-base">
          Thinking about design, pricing, process and the parts of freelancing
          nobody writes down — collected as I go.
        </p>
      </section>

      <BlogIndex posts={posts} />
      <ContactCta />
    </>
  );
}
