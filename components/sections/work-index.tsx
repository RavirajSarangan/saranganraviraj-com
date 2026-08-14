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
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectPlate } from "@/components/ui/project-plate";
import { MagneticLink } from "@/components/ui/magnetic-link";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import type { Project } from "@/content/site";
import { easeOutExpo } from "@/lib/motion";

/**
 * Work as a numbered index rather than a card grid.
 *
 * On desktop, hovering a row summons a cover plate that trails the cursor —
 * this is the site's signature interaction and the reason the list can stay
 * this typographically spare without feeling empty.
 *
 * On touch, there is no hover, so each row renders its own inline plate.
 */
export function WorkIndex({
  projects,
  showHeading = true,
  eyebrow = "Selected work",
  title = "Projects built with intent, not templates.",
  index = "01",
}: {
  projects: Project[];
  showHeading?: boolean;
  eyebrow?: string;
  title?: string;
  index?: string;
}) {
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
    <section
      id="work"
      className={`shell scroll-mt-24 pb-24 sm:pb-32 ${
        showHeading ? "pt-24 sm:pt-32" : "pt-12 sm:pt-16"
      }`}
    >
      {showHeading && (
        <SectionHeading
          eyebrow={eyebrow}
          index={index}
          title={title}
          aside={`${projects.length} projects`}
        />
      )}

      <div
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setActive(null)}
        className={`relative ${showHeading ? "mt-16 sm:mt-24" : ""}`}
      >
        {/* Cursor-trailing preview — desktop only, pointer-events off so it never blocks a click */}
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
                <ProjectPlate
                  project={projects[active]}
                  className="aspect-[4/3] w-[26rem] rounded-sm shadow-2xl shadow-black/60"
                  sizes="26rem"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <RevealGroup className="border-t border-line" each={0.05}>
          {projects.map((project, i) => (
            <RevealItem key={project.slug}>
              <Link
                href={`/work/${project.slug}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group relative block border-b border-line"
              >
                {/* Row fills with a whisper of surface on hover */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-surface transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                />

                <div className="relative flex flex-col gap-5 px-2 py-7 sm:py-9 lg:flex-row lg:items-baseline lg:gap-8">
                  <span className="label w-10 shrink-0 pt-1 text-accent transition-colors duration-500">
                    {project.index}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[clamp(1.75rem,4.5vw,3.25rem)] leading-[1.02] tracking-[-0.025em] text-fg transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-focus-visible:translate-x-2">
                      {project.title}
                    </h3>
                    <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted lg:hidden">
                      {project.summary}
                    </p>
                  </div>

                  {/* Inline plate for touch — hidden where the cursor preview takes over */}
                  <div className="lg:hidden">
                    <ProjectPlate
                      project={project}
                      className="aspect-[16/10] w-full rounded-sm"
                      sizes="(max-width: 1024px) 100vw, 26rem"
                    />
                  </div>

                  <div className="flex shrink-0 items-baseline gap-5 lg:gap-8">
                    <span className="label hidden lg:block lg:w-28">
                      {project.sector}
                    </span>
                    <span className="label hidden lg:block">{project.year}</span>
                    <span
                      className={`label ${
                        project.status === "Live" ? "text-fg/60" : "text-accent"
                      }`}
                    >
                      {project.status}
                    </span>
                    <span
                      aria-hidden
                      className="text-fg/40 transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent group-focus-visible:translate-x-1 group-focus-visible:text-accent"
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      {showHeading && (
        <div className="mt-14">
          <MagneticLink href="/work" variant="ghost">
            All projects
          </MagneticLink>
        </div>
      )}
    </section>
  );
}
