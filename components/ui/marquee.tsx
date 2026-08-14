/**
 * Infinite horizontal marquee. Pure CSS (see `.marquee-track` in globals.css)
 * so it costs nothing on the main thread and stops dead under reduced-motion.
 *
 * The content is duplicated once and the track translates -50%, which is what
 * makes the loop seamless.
 */
export function Marquee({
  items,
  separator = "✦",
}: {
  items: readonly string[];
  separator?: string;
}) {
  const run = [...items, ...items];

  return (
    <div
      className="relative flex overflow-hidden border-y border-line py-5"
      aria-hidden
    >
      {/* Feathered edges so words dissolve rather than clip */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent sm:w-32" />

      <div className="marquee-track flex shrink-0 items-center gap-8 pr-8 whitespace-nowrap sm:gap-12 sm:pr-12">
        {run.map((item, i) => (
          <span key={i} className="flex items-center gap-8 sm:gap-12">
            <span className="font-display text-[clamp(1.5rem,3vw,2.25rem)] tracking-[-0.01em] text-fg/70">
              {item}
            </span>
            <span className="text-accent/60 text-xs">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
