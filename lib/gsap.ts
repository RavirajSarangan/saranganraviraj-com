"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Single registration point. Importing plugins in more than one module registers
 * them repeatedly and ScrollTrigger starts double-counting scroll positions.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // One shared easing vocabulary, matching the CSS custom properties in globals.css
  // so a GSAP tween and a CSS transition on the same element agree.
  gsap.registerEase("expo-out", (p) => 1 - Math.pow(2, -10 * p));
  gsap.defaults({ ease: "power3.out", duration: 1 });
}

export { gsap, ScrollTrigger, SplitText };

/** True when the visitor has asked for less motion. Read at call time, not module time. */
export function prefersReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Scopes GSAP work to a container and reverts every tween, ScrollTrigger and inline
 * style it created on unmount. Without the revert, React strict-mode double-invokes
 * leave duplicate ScrollTriggers behind and scroll positions drift.
 *
 * The callback receives the live context so it can `self.add()` if it needs to.
 * It is skipped entirely under reduced motion — callers are responsible for making
 * sure the un-animated DOM is already in its final, readable state.
 */
export function useGsap(
  callback: (ctx: gsap.Context) => void,
  scope?: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useLayoutEffect(() => {
    if (prefersReduced()) return;

    const ctx = gsap.context((self) => callback(self), scope?.current ?? undefined);
    return () => ctx.revert();
    // The callback is re-read on every `deps` change; capturing it in a ref and
    // writing that ref during render is a render side effect React forbids.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Standard entrance: children rise and fade as the container enters the viewport.
 * `once: true` semantics come from ScrollTrigger's default (no toggleActions replay).
 */
export function revealFrom(
  targets: gsap.TweenTarget,
  trigger: Element,
  options: { y?: number; stagger?: number; delay?: number } = {},
) {
  const { y = 28, stagger = 0.07, delay = 0 } = options;

  return gsap.from(targets, {
    y,
    opacity: 0,
    duration: 1,
    delay,
    stagger,
    ease: "expo-out",
    scrollTrigger: { trigger, start: "top 85%" },
  });
}
