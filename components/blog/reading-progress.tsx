"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGsap } from "@/lib/gsap";

/**
 * Hairline progress bar pinned under the nav.
 *
 * Driven by a ScrollTrigger `scrub` on the article rather than its own scroll
 * listener, so it shares the clock with Lenis and every other scroll animation on
 * the page — a separate listener would drift a frame behind them.
 *
 * `useGsap` skips entirely under reduced motion, which leaves the bar at scaleX(0).
 * That is the correct resting state: a progress indicator that cannot update should
 * not imply a position, and it is `aria-hidden` so nothing is announced either way.
 */
export function ReadingProgress({ target = "article" }: { target?: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useGsap(() => {
    const el = barRef.current;
    const article = document.querySelector(target);
    if (!el || !article) return;

    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: article,
          start: "top top+=72",
          end: "bottom bottom",
          scrub: 0.3,
        },
      },
    );

    // Late-loading fonts change the article height; without this the bar finishes early.
    ScrollTrigger.refresh();
  }, barRef);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-[72px] z-40 h-px bg-line"
    >
      <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-accent" />
    </div>
  );
}
