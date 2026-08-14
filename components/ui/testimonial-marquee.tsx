"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/content/site";

/**
 * Testimonial capsules drifting in opposing rows; clicking one opens the full quote.
 *
 * Adapted from a supplied component, with five substantive changes:
 *
 * 1. **Data-driven, and empty by default.** The original shipped nine invented people
 *    praising a fictional product. This renders `null` until real quotes exist in
 *    `content/site.ts` — the whole point of a testimonial is that someone said it.
 * 2. **No external images.** The original pointed at a Cloudinary account we do not
 *    own. Avatars fall back to a generated initials plate, with a drop-in slot for a
 *    real headshot, so there is no third-party host and no stock photo of a stranger
 *    standing in for a client.
 * 3. **Themed to the design tokens.** The original hardcoded `#003AF9`, `bg-white`
 *    and `dark:bg-background` — the last of which is a shadcn token this project does
 *    not define, so it would have rendered transparent.
 * 4. **Reduced motion.** The original looped `repeat: Infinity` unconditionally. Here
 *    it becomes a static grid, which is a better reading experience anyway.
 * 5. **Accessible modal** — labelled dialog, Escape to close, focus moved in and
 *    restored on close, and background scroll locked.
 */

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** Deterministic hue per person so a given name always gets the same plate. */
function hueFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}

function Avatar({
  person,
  size = 56,
  className = "",
}: {
  person: Testimonial;
  size?: number;
  className?: string;
}) {
  if (person.image) {
    return (
      <div
        className={cn("relative overflow-hidden rounded-full", className)}
        style={{ width: size, height: size }}
      >
        <Image
          src={person.image}
          alt={person.author}
          fill
          sizes={`${size}px`}
          className="object-cover object-top"
        />
      </div>
    );
  }

  const hue = hueFor(person.author);
  return (
    <div
      aria-hidden
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(145deg, hsl(${hue} 32% 26%), hsl(${(hue + 40) % 360} 28% 12%))`,
      }}
    >
      <span
        className="font-display leading-none"
        style={{ color: "rgba(237,234,228,0.82)", fontSize: size * 0.38 }}
      >
        {initials(person.author)}
      </span>
    </div>
  );
}

function Capsule({
  person,
  onClick,
}: {
  person: Testimonial;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group flex shrink-0 items-center gap-4 rounded-full border border-line bg-surface p-2 pr-7 text-left transition-colors duration-500 hover:border-accent"
    >
      <Avatar person={person} size={52} className="ring-1 ring-line" />
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-medium text-fg">{person.author}</span>
        <span className="label mt-1">{person.title}</span>
      </span>
    </motion.button>
  );
}

export function TestimonialMarquee({ items }: { items: Testimonial[] }) {
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Escape closes, focus moves into the dialog and returns on close, page locked behind it.
  useEffect(() => {
    if (!selected) return;
    returnFocusRef.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      returnFocusRef.current?.focus();
    };
  }, [selected]);

  if (items.length === 0) return null;

  // Three rows of roughly equal length, so short lists still read as rows.
  const perRow = Math.ceil(items.length / 3);
  const rows = [
    items.slice(0, perRow),
    items.slice(perRow, perRow * 2),
    items.slice(perRow * 2),
  ].filter((r) => r.length > 0);

  return (
    <>
      <div className="relative">
        {/* Diagonal hatch, drawn from the current text colour so it themes itself */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 border-y border-line opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(315deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
            backgroundSize: "10px 10px",
          }}
        />

        {/* Edge fades so capsules dissolve rather than clip */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-ink to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-ink to-transparent sm:w-40" />

        {reduced ? (
          // Static grid: an infinite loop is exactly what reduced motion asks us not to do.
          <div className="relative z-10 flex flex-wrap justify-center gap-4 px-6 py-12">
            {items.map((t) => (
              <Capsule key={t.id} person={t} onClick={() => setSelected(t)} />
            ))}
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-6 overflow-hidden py-12">
            {rows.map((row, rowIndex) => (
              <motion.div
                key={rowIndex}
                className="flex min-w-max items-center gap-5"
                animate={{ x: rowIndex % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
                transition={{
                  duration: 46 + rowIndex * 6,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {/* Duplicated once — the track translates 50%, which is what makes
                    the loop seamless regardless of how many items there are. */}
                {[...row, ...row].map((t, i) => (
                  <Capsule
                    key={`${t.id}-${i}`}
                    person={t}
                    onClick={() => setSelected(t)}
                  />
                ))}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Testimonial from ${selected.author}`}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-ink/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.15 } }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-xl rounded-sm border border-line-strong bg-surface p-8 shadow-2xl shadow-black/50 sm:p-12"
            >
              <button
                ref={closeRef}
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close testimonial"
                className="absolute top-4 right-4 rounded-full p-2 text-muted transition-colors hover:text-accent"
              >
                <X size={18} strokeWidth={1.6} />
              </button>

              <Quote
                aria-hidden
                size={28}
                strokeWidth={1.4}
                className="text-accent/60"
              />

              <blockquote className="font-display mt-6 text-[clamp(1.25rem,2.6vw,1.875rem)] leading-[1.35] tracking-[-0.015em] text-fg">
                {selected.quote}
              </blockquote>

              <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-6">
                <Avatar person={selected} size={44} className="ring-1 ring-line" />
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-fg">
                    {selected.author}
                  </span>
                  <span className="label mt-1">{selected.title}</span>
                </span>
              </figcaption>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
