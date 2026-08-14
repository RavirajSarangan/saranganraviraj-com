"use client";

import { useEffect, useState } from "react";
import { headingId } from "@/lib/slug";

/**
 * Sticky contents list, built from the post's heading blocks.
 *
 * **Hidden below three headings.** These posts run 250–350 words; a contents list on
 * a two-minute read is furniture, not navigation. The threshold means it appears only
 * where it earns its place.
 *
 * Active tracking uses IntersectionObserver rather than a scroll handler — it fires
 * only when a heading actually crosses the band, instead of on every scroll frame.
 */
export function TableOfContents({ headings }: { headings: string[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length < 3) return;

    const ids = headings.map(headingId);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The topmost heading currently inside the band wins, so scrolling up and
        // down lands on the same entry rather than flickering between neighbours.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Band across the upper third: a heading is "current" once it reaches reading height.
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-28">
      <span className="label block">On this page</span>
      <ol className="mt-5 space-y-1">
        {headings.map((h, i) => {
          const id = headingId(h);
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                className={`flex gap-3 border-l py-2 pl-4 text-sm leading-snug transition-colors duration-300 ${
                  isActive
                    ? "border-accent text-fg"
                    : "border-line text-muted hover:border-line-strong hover:text-fg/80"
                }`}
              >
                <span className="label shrink-0 pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{h}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
