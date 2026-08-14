/**
 * Easing tokens for the handful of components still animated by Motion rather
 * than GSAP — currently the cover previews in `work-index` and `blog-index`.
 *
 * This file used to also export a set of Motion `Variants` (maskRise, fadeRise,
 * fadeIn, drawLine, stagger, viewportOnce) and a shared `transition`. The GSAP
 * rewrite in `components/ui/reveal.tsx` superseded all of them and nothing had
 * imported them since, so they were removed rather than left to look load-bearing.
 *
 * GSAP has its own easing vocabulary, registered once in `lib/gsap.ts` as
 * `expo-out`. The two are deliberately the same curve so a GSAP tween and a
 * Motion transition on adjacent elements agree.
 */

/** Expo-out — the curve that makes reveals feel like they settle rather than stop. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
