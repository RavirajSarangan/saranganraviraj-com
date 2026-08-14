"use client";

import { useRef } from "react";
import { HeroBackdrop } from "@/components/hero/shader-canvas";
import { MagneticLink } from "@/components/ui/magnetic-link";
import { facts, site } from "@/content/site";
import { gsap, SplitText, useGsap } from "@/lib/gsap";

/**
 * The hero runs one orchestrated entrance and then hands the page over.
 *
 * The name is real DOM text in the server HTML — SplitText only takes over once JS
 * runs, so with JS disabled, reduced motion set, or WebGL unavailable the hero still
 * reads as a finished composition. The shader is strictly additive.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useGsap(() => {
    const el = nameRef.current;
    if (!el || !root.current) return;

    const split = new SplitText(el, { type: "chars,lines", mask: "lines" });
    const tl = gsap.timeline();

    // Characters rise and un-blur out of the masked line box
    tl.from(split.chars, {
      yPercent: 118,
      rotateZ: 4,
      filter: "blur(9px)",
      duration: 1.25,
      stagger: { each: 0.028, from: "start" },
      ease: "expo-out",
      delay: 0.15,
    })
      .from(
        "[data-hero-meta]",
        { opacity: 0, y: 14, duration: 0.9, stagger: 0.08, ease: "power3.out" },
        0.35,
      )
      .from(
        "[data-hero-body]",
        { opacity: 0, y: 22, duration: 1, stagger: 0.1, ease: "expo-out" },
        0.7,
      )
      .from(
        "[data-hero-fact]",
        { opacity: 0, y: 18, duration: 0.9, stagger: 0.07, ease: "expo-out" },
        0.95,
      );

    // Drift the whole composition up and out as the next section arrives
    gsap.to("[data-hero-inner]", {
      yPercent: -14,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => split.revert();
  }, root);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-[72px]"
    >
      <HeroBackdrop />

      <div
        data-hero-inner
        className="shell relative flex flex-1 flex-col justify-center py-10 sm:py-14"
      >
        {/* Status line */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span data-hero-meta className="flex items-center gap-2.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="label text-accent">
              {site.availability.open
                ? `Available ${site.availability.window}`
                : "Currently booked"}
            </span>
          </span>
          <span data-hero-meta className="label">
            {site.reach}
          </span>
          <span data-hero-meta className="label hidden sm:inline">
            {site.role}
          </span>
        </div>

        {/* The name, set as large as the viewport allows */}
        <h1 ref={nameRef} className="display-xl mt-9 max-w-[13ch] text-fg sm:mt-12">
          {site.name}
        </h1>

        <div className="mt-10 grid gap-10 sm:mt-12 lg:grid-cols-12">
          <div data-hero-body className="lg:col-span-5">
            <p className="font-display text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.02em] text-fg/90">
              {site.tagline}
            </p>
          </div>

          <div data-hero-body className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted sm:text-base">
              {site.heroSub}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticLink href="/#contact">Start a project</MagneticLink>
              <MagneticLink href="/work" variant="ghost">
                See the work
              </MagneticLink>
            </div>
          </div>
        </div>
      </div>

      {/* Fact strip along the base */}
      <div className="relative border-t border-line backdrop-blur-[2px]">
        <div className="shell grid grid-cols-2 sm:grid-cols-4">
          {facts.map((fact, i) => (
            <div
              data-hero-fact
              key={fact.label}
              className={`py-6 sm:py-7 ${
                i > 0 ? "sm:border-l sm:border-line sm:pl-6" : ""
              } ${i % 2 === 1 ? "border-l border-line pl-6 sm:pl-6" : ""} ${
                i < 2 ? "border-b border-line sm:border-b-0" : ""
              }`}
            >
              <span className="font-display block text-[clamp(1.75rem,4vw,2.5rem)] leading-none tracking-[-0.02em] text-fg">
                {fact.value}
              </span>
              <span className="label mt-2.5 block">{fact.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
