import Image from "next/image";
import type { Post } from "@/content/posts";

/**
 * Cover art for a blog post — the same system as
 * `components/ui/project-plate.tsx`, so work and writing read as one family.
 *
 * Like the project plates, this **stays a dark duotone in both themes**: it is cover
 * art, not UI. Its inner type is therefore set with explicit light values rather than
 * `text-fg`, which would flip to dark-on-dark in light mode.
 *
 * Drop an image at /public/blog/<slug>.webp and set `image` on the post in
 * content/posts.ts — this component swaps to it with no other change.
 */
export function PostPlate({
  post,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  compact = false,
}: {
  post: Post;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Scales the type down for small renditions. Full-size type overflows below ~200px. */
  compact?: boolean;
}) {
  const [from, to] = post.duotone;

  if (post.image) {
    return (
      <div className={`relative overflow-hidden bg-surface ${className}`}>
        <Image
          src={post.image}
          alt={`${post.title} — ${post.category}`}
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
      aria-label={`${post.title} — ${post.category}`}
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
        style={{ color: "rgba(237,234,228,0.055)" }}
        className={`font-display absolute -right-[0.08em] -bottom-[0.34em] leading-none select-none ${
          compact ? "text-[5rem]" : "text-[13rem] sm:text-[17rem]"
        }`}
      >
        {post.index}
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
            {post.category}
          </span>
          {!compact && (
            <span className="label" style={{ color: "rgba(237,234,228,0.45)" }}>
              {post.readingMinutes} min
            </span>
          )}
        </div>

        <div>
          <h3
            style={{ color: "rgba(237,234,228,0.90)" }}
            className={`font-display tracking-[-0.02em] ${
              compact
                ? "text-[0.95rem] leading-[1.08]"
                : "text-[clamp(1.5rem,3.2vw,2.375rem)] leading-[1.05]"
            }`}
          >
            {post.title}
          </h3>
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
