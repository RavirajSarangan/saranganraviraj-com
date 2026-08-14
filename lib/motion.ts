import type { Variants, Transition } from "motion/react";

/** Expo-out — the curve that makes reveals feel like they settle rather than stop. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeInOutQuint = [0.83, 0, 0.17, 1] as const;

export const transition: Transition = {
  duration: 0.9,
  ease: easeOutExpo,
};

/**
 * Mask reveal — the text slides up out of a clipped box.
 * Requires a parent with `overflow-hidden`.
 */
export const maskRise: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%" },
};

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Hairline rules that draw themselves in from the left. */
export const drawLine: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1 },
};

export function stagger(each = 0.06, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: each, delayChildren: delay },
    },
  };
}

/** Shared viewport config so every section triggers at the same point. */
export const viewportOnce = { once: true, margin: "-12% 0px -12% 0px" } as const;
