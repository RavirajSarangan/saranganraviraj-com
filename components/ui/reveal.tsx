"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGsap, revealFrom } from "@/lib/gsap";

/**
 * Reveal primitives, rebuilt on GSAP ScrollTrigger + SplitText.
 *
 * The public API is unchanged from the Motion version so sections did not need
 * rewriting. The contract that matters: **the un-animated DOM is always the final,
 * readable state.** GSAP animates *from* an offset rather than *to* one, so if
 * reduced motion is set (or JS never runs) the content is simply already there.
 */

type BaseProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Fades and lifts a block into place as it enters the viewport. */
export function Reveal({ children, className, delay = 0 }: BaseProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(() => {
    if (!ref.current) return;
    revealFrom(ref.current, ref.current, { delay });
  }, ref);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Splits a heading into lines, then rises each line out of its own clipping box.
 *
 * Lines rather than characters: at display sizes a per-character stagger on a long
 * heading reads as noise, and SplitText's line masking is what produces the
 * "expensive" editorial reveal.
 */
export function MaskText({
  text,
  className,
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement>(null);

  useGsap(() => {
    const el = ref.current;
    if (!el) return;

    const split = new SplitText(el, {
      type: "lines",
      linesClass: "split-line",
      // Wrap each line so overflow-hidden has something to clip against.
      mask: "lines",
    });

    gsap.from(split.lines, {
      yPercent: 110,
      duration: 1.1,
      delay,
      stagger: 0.09,
      ease: "expo-out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });

    // SplitText rewrites the DOM; revert restores the original markup so screen
    // readers and copy-paste get clean text back.
    return () => split.revert();
  }, ref);

  return (
    <Tag ref={ref as never} className={className}>
      {text}
    </Tag>
  );
}

/** A hairline that draws in from the left. Used as section dividers. */
export function RuleLine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(() => {
    if (!ref.current) return;
    gsap.from(ref.current, {
      scaleX: 0,
      duration: 1.2,
      ease: "expo-out",
      scrollTrigger: { trigger: ref.current, start: "top 92%" },
    });
  }, ref);

  return <div ref={ref} className={`h-px w-full origin-left bg-line ${className}`} />;
}

/** Staggers direct `RevealItem` children in sequence as the group enters view. */
export function RevealGroup({
  children,
  className,
  each = 0.07,
  delay = 0,
}: BaseProps & { each?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-reveal-item]");
    if (!items.length) return;
    revealFrom(items, el, { stagger: each, delay });
  }, ref);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function RevealItem({ children, className }: BaseProps) {
  return (
    <div data-reveal-item className={className}>
      {children}
    </div>
  );
}
