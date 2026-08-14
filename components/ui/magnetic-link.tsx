"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useRef, type ReactNode, type MouseEvent } from "react";

/**
 * The primary CTA. The button drifts toward the cursor within a small radius —
 * enough to feel alive on hover, small enough that it never fights the pointer.
 * Disabled entirely under reduced-motion and on touch (no hover to trigger it).
 */
export function MagneticLink({
  href,
  children,
  className = "",
  variant = "solid",
  external = false,
  strength = 0.28,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "solid" | "ghost";
  external?: boolean;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 16, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 180, damping: 16, mass: 0.35 });

  function handleMove(e: MouseEvent<HTMLAnchorElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  const base =
    "group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] transition-colors duration-500";

  const styles =
    variant === "solid"
      ? "bg-fg text-ink hover:bg-accent"
      : "border border-line-strong text-fg hover:border-accent hover:text-accent";

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
      >
        →
      </span>
    </>
  );

  const props = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div style={{ x: springX, y: springY }} className="inline-block">
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className={`${base} ${styles} ${className}`}
        {...props}
      >
        {inner}
      </Link>
    </motion.div>
  );
}
