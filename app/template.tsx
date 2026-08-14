"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGsap } from "@/lib/gsap";

/**
 * Page transition.
 *
 * `template.tsx` re-mounts on every navigation (unlike `layout.tsx`, which persists),
 * which is the idiomatic App Router hook for an enter animation.
 *
 * React's `<ViewTransition>` is not available in this install — neither
 * `unstable_ViewTransition` in React 19.2.8 nor `experimental.viewTransition` in Next
 * 16.3.1 — so this is a plain GSAP enter rather than the React component.
 *
 * `useGsap` no-ops under reduced motion, and because the tween animates *from* an
 * offset the un-animated DOM is already the settled state. Content is never hidden
 * waiting for an animation that may not run.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(() => {
    const el = ref.current;
    if (!el) return;

    gsap.from(el, {
      opacity: 0,
      y: 14,
      duration: 0.55,
      ease: "expo-out",
      // Scroll position and trigger positions are both stale immediately after a
      // route change; refreshing once the enter settles keeps them in sync.
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, ref);

  return <div ref={ref}>{children}</div>;
}
