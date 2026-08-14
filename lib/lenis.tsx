"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReduced } from "./gsap";

/**
 * Smooth scroll, driven off GSAP's ticker rather than its own RAF loop.
 *
 * Two loops would mean Lenis and ScrollTrigger reading scroll position on different
 * frames, which shows up as scrubbed animations lagging a frame behind the scroll.
 * Sharing the ticker keeps them exact.
 *
 * Under `prefers-reduced-motion` Lenis is never constructed at all — smooth scroll is
 * itself a motion effect, and hijacking the scroll of someone who asked for less of it
 * is the wrong call even if the animations stop.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReduced()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch is better than anything we can emulate.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anchor links must go through Lenis or they jump while it animates.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.('a[href^="#"], a[href*="/#"]');
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const hash = href.slice(href.indexOf("#"));
      if (hash.length < 2) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
