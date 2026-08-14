"use client";

import Link from "next/link";
import MarqueeAlongSvgPath from "@/components/ui/marquee-along-svg-path";
import { ProjectPlate } from "@/components/ui/project-plate";
import type { Project } from "@/content/site";

/**
 * The bridge between the shader hero and the typographic work index: project covers
 * travelling along a shallow S-curve.
 *
 * The covers are the site's own `ProjectPlate`, not stock imagery — so this shows real
 * work today and picks up real screenshots automatically once they land in
 * `public/work/`. The path is a wide, shallow arc; anything steeper and the plates
 * read as falling rather than flowing.
 */

const PATH =
  "M-60 214C180 268 380 150 640 176C900 202 1040 256 1260 210C1400 180 1490 152 1580 128";

export function WorkReel({ projects }: { projects: Project[] }) {
  return (
    <section
      aria-label="Project reel"
      className="relative overflow-hidden border-y border-line py-6 sm:py-10"
    >
      <MarqueeAlongSvgPath
        path={PATH}
        viewBox="0 0 1520 340"
        baseVelocity={5}
        repeat={2}
        slowdownOnHover
        slowDownFactor={0.18}
        draggable
        grabCursor
        dragSensitivity={0.1}
        useScrollVelocity
        scrollAwareDirection
        className="h-[260px] w-full sm:h-[340px]"
        responsive
        // Plates recede slightly as they travel, so the curve reads with depth
        cssVariableInterpolation={[
          { property: "opacity", from: 0.45, to: 1 },
          { property: "--plate-scale", from: 0.82, to: 1.05 },
        ]}
      >
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            aria-label={`${project.title} — ${project.sector}`}
            className="group block w-[104px] sm:w-[132px]"
            style={{ scale: "var(--plate-scale, 1)" }}
            draggable={false}
          >
            <ProjectPlate
              project={project}
              compact
              className="aspect-[3/4] w-full rounded-sm shadow-2xl shadow-black/50 ring-1 ring-white/10 transition-all duration-500 group-hover:ring-accent/60"
              sizes="132px"
            />
          </Link>
        ))}
      </MarqueeAlongSvgPath>
    </section>
  );
}
