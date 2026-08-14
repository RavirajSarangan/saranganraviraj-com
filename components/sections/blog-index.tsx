"use client";

import Link from "next/link";
import { useRef, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { PostPlate } from "@/components/ui/post-plate";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import type { Post } from "@/content/posts";
import { easeOutExpo } from "@/lib/motion";

/**
 * The writing index — a numbered typographic list whose covers appear only as a
 * cursor-trailing preview on hover, reusing the interaction from
 * `components/sections/work-index.tsx` so the two indexes behave identically.
 *
 * Touch devices have no hover, so each row renders its own inline plate instead.
 */

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function BlogIndex({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 140, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 140, damping: 20, mass: 0.5 });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (reduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  return (
    <section className="shell pt-12 pb-24 sm:pt-16 sm:pb-32">
      <div
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setActive(null)}
        className="relative"
      >
        <AnimatePresence>
          {active !== null && !reduced && (
            <motion.div
              key="preview"
              style={{ x: springX, y: springY }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.42, ease: easeOutExpo }}
              className="pointer-events-none absolute top-0 left-0 z-20 hidden lg:block"
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <PostPlate
                  post={posts[active]}
                  className="aspect-[4/3] w-[24rem] rounded-sm shadow-2xl shadow-black/50"
                  sizes="24rem"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <RevealGroup className="border-t border-line" each={0.05}>
          {posts.map((post, i) => (
            <RevealItem key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group relative block border-b border-line"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-surface transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                />

                <article className="relative flex flex-col gap-5 px-2 py-8 sm:py-10 lg:flex-row lg:items-baseline lg:gap-10">
                  <span className="label w-10 shrink-0 pt-1 text-accent">
                    {post.index}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-[clamp(1.5rem,3.4vw,2.5rem)] leading-[1.05] tracking-[-0.02em] text-fg transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-focus-visible:translate-x-2">
                      {post.title}
                    </h2>
                    <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Inline plate for touch — hidden where the cursor preview takes over */}
                  <div className="lg:hidden">
                    <PostPlate
                      post={post}
                      className="aspect-[16/10] w-full rounded-sm"
                      sizes="(max-width: 1024px) 100vw, 24rem"
                    />
                  </div>

                  <div className="flex shrink-0 items-baseline gap-5 lg:gap-8">
                    <span className="label hidden lg:block lg:w-28">
                      {post.category}
                    </span>
                    <time className="label" dateTime={post.date}>
                      {dateFormat.format(new Date(post.date))}
                    </time>
                    <span className="label hidden sm:block">
                      {post.readingMinutes} min
                    </span>
                    <span
                      aria-hidden
                      className="text-fg/40 transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent group-focus-visible:translate-x-1 group-focus-visible:text-accent"
                    >
                      →
                    </span>
                  </div>
                </article>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
