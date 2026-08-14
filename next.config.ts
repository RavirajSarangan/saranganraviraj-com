import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The home directory is itself a git repo with a lockfile, so Turbopack's
  // root inference walks too far up. Pin it to this project.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },

  /**
   * Security headers.
   *
   * No Content-Security-Policy here on purpose. A strict CSP needs a per-request
   * nonce for the inline JSON-LD and the inline `style` props, and generating one
   * forces every page out of the static prerender and into dynamic rendering —
   * trading the site's entire performance model for a header. If a CSP is wanted
   * later, the honest options are hash-based (brittle) or Report-Only (no
   * enforcement); neither is free.
   *
   * HSTS omits `preload` and `includeSubDomains`: both are effectively
   * irreversible once browsers cache them, and `includeSubDomains` would break
   * any future plain-HTTP subdomain. Worth strengthening deliberately, not by
   * default.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000",
          },
          // The site asks for none of these; deny them rather than leave them open.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
