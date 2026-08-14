"use client";

import { useEffect } from "react";
import { MagneticLink } from "@/components/ui/magnetic-link";

/**
 * Route-level error boundary. Without one, a thrown render error falls through to
 * Next's default screen — which in production is an unstyled "Application error"
 * with no way back into the site.
 *
 * The client-side surface here is not hypothetical: the hero mounts a WebGL
 * context and several sections drive GSAP and ScrollTrigger, so this catches the
 * class of failure those can produce on unusual hardware or drivers.
 *
 * Deliberately mirrors `not-found.tsx` rather than inventing a second error
 * language, and does not show `error.message` — it is minified in production and
 * says nothing useful to a visitor.
 */
export default function RouteError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    // Surfaces in Vercel's function/browser logs; the digest correlates a report
    // back to the server-side stack.
    console.error("Route error:", error);
  }, [error]);

  return (
    <section className="shell flex min-h-[100svh] flex-col justify-center py-32">
      <span className="label block text-accent">Error / 500</span>
      <h1 className="display-xl mt-8 max-w-[12ch] text-fg">Something broke.</h1>
      <p className="mt-10 max-w-[44ch] text-sm leading-relaxed text-muted sm:text-base">
        This one is on me, not you. Trying again usually clears it — if it does
        not, the work is still reachable from the links below.
      </p>

      {error.digest ? (
        <p className="label mt-6 text-muted/70">Reference: {error.digest}</p>
      ) : null}

      <div className="mt-12 flex flex-wrap gap-3">
        <MagneticLink onClick={reset}>Try again</MagneticLink>
        <MagneticLink href="/" variant="ghost">
          Back home
        </MagneticLink>
      </div>
    </section>
  );
}
