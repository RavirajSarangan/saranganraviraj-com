import Image from "next/image";
import type { Project } from "@/content/site";

/**
 * Cover art for a project.
 *
 * The previous site's imagery lives on Framer's CDN and there are no local
 * copies, so rather than ship broken frames or stock photography, each project
 * gets a generated typographic plate in its own duotone. It reads as a design
 * decision, not a missing asset.
 *
 * Drop a real screenshot at /public/work/<slug>.webp and set `image` in
 * content/site.ts — this component swaps to it with no other change.
 */
export function ProjectPlate({
  project,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  compact = false,
}: {
  project: Project;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Scales the type down for small renditions (the reel). Full-size type overflows below ~200px. */
  compact?: boolean;
}) {
  const [from, to] = project.duotone;

  if (project.image) {
    return (
      <div className={`relative overflow-hidden bg-surface ${className}`}>
        <Image
          src={project.image}
          alt={`${project.title} — ${project.sector} project`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 100% at 15% 0%, ${from} 0%, ${to} 72%)`,
      }}
      role="img"
      aria-label={`${project.title} — ${project.sector}`}
    >
      {/* Hairline grid — structure under the type */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(237,234,228,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,234,228,0.05) 1px, transparent 1px)",
          backgroundSize: "clamp(40px, 8%, 72px) clamp(40px, 8%, 72px)",
        }}
      />

      {/* Oversized index, bled off the bottom-right corner */}
      <span
        aria-hidden
        // Explicit light values, not `text-fg`: the plate is a dark duotone in BOTH
        // themes (cover art does not invert), so a theme-reactive colour would turn
        // this dark-on-dark in light mode.
        style={{ color: "rgba(237,234,228,0.055)" }}
        className={`font-display absolute -right-[0.08em] -bottom-[0.34em] leading-none select-none ${
          compact ? "text-[5rem]" : "text-[13rem] sm:text-[17rem]"
        }`}
      >
        {project.index}
      </span>

      <div
        className={`relative flex h-full flex-col justify-between ${
          compact ? "p-3" : "p-6 sm:p-8"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <span
            style={{ color: "rgba(237,234,228,0.45)" }}
            className={`label truncate ${compact ? "text-[0.5rem] tracking-[0.12em]" : ""}`}
          >
            {project.sector}
          </span>
          {!compact && (
            <span className="label" style={{ color: "rgba(237,234,228,0.45)" }}>
              {project.year}
            </span>
          )}
        </div>

        <div>
          <h3
            style={{ color: "rgba(237,234,228,0.90)" }}
            className={`font-display tracking-[-0.02em] ${
              compact
                ? "text-[0.95rem] leading-[1.08]"
                : "text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.02]"
            }`}
          >
            {project.title}
          </h3>
          {!compact && (
            <span
              className="label mt-3 block"
              style={{ color: "rgba(237,234,228,0.35)" }}
            >
              {project.client}
            </span>
          )}
        </div>
      </div>

      {/* Vignette to seat the plate against the page */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(140% 110% at 50% 0%, transparent 40%, rgba(10,10,11,0.55) 100%)",
        }}
      />
    </div>
  );
}
