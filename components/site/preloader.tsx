"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReduced } from "@/lib/gsap";
import { site } from "@/content/site";

const SEEN_KEY = "sr:intro-seen";
/** Hard ceiling. A preloader that outstays this is just a delay. */
const MAX_MS = 1400;

/**
 * First-visit intro.
 *
 * A preloader is a deliberate delay in front of your content, so four constraints
 * keep it defensible:
 *
 * 1. **Once per session** — gated on `sessionStorage`.
 * 2. **Never under reduced motion.**
 * 3. **Capped at ~1.4s**, and it resolves as soon as fonts are ready rather than
 *    animating a fake progress bar to a fixed duration.
 * 4. **Overlay only.** The page renders underneath from the first byte — this is
 *    painted on top, never gating it — so crawlers, JS-disabled visitors and LCP are
 *    all unaffected.
 */
export function Preloader() {
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  // Decide in an effect, not during render: sessionStorage is not available on the
  // server, and reading it during render would desync hydration.
  useEffect(() => {
    if (prefersReduced()) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Private mode or blocked storage — skip the intro rather than repeat it.
      return;
    }
    // Deferred to a frame callback: a synchronous setState in an effect body
    // triggers a cascading render, and it also lets the page paint underneath first.
    const id = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!active) return;

    const root = rootRef.current;
    const count = countRef.current;
    if (!root || !count) return;

    // Lock scroll only while the overlay is up.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = prevOverflow;
        setActive(false);
      },
    });

    tl.to(counter, {
      value: 100,
      duration: MAX_MS / 1000,
      ease: "power2.inOut",
      onUpdate: () => {
        count.textContent = String(Math.round(counter.value)).padStart(3, "0");
      },
    })
      .to("[data-intro-line]", { scaleX: 1, duration: 0.5, ease: "expo-out" }, 0)
      .to("[data-intro-content]", { opacity: 0, duration: 0.3 }, "-=0.15")
      // Wipe upward to hand off to the hero underneath
      .to(root, { yPercent: -100, duration: 0.7, ease: "expo-out" }, "-=0.1");

    // Resolve early once fonts have settled — no point holding a finished page.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) tl.timeScale(1.6);
    });

    return () => {
      cancelled = true;
      tl.kill();
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      // Decorative: the real page is already rendered underneath this.
      aria-hidden
      data-preloader
      className="fixed inset-0 z-[100] flex flex-col justify-end bg-ink"
    >
      <div data-intro-content className="shell pb-14 sm:pb-20">
        <div
          data-intro-line
          className="mb-10 h-px w-full origin-left scale-x-0 bg-line"
        />
        <div className="flex items-end justify-between gap-6">
          <span className="font-display text-[clamp(2rem,6vw,4rem)] leading-none tracking-[-0.03em] text-fg">
            {site.name}
          </span>
          <span
            ref={countRef}
            className="font-mono text-[clamp(2rem,6vw,4rem)] leading-none text-accent tabular-nums"
          >
            000
          </span>
        </div>
      </div>
    </div>
  );
}
