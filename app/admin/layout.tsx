import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The session guard lives in `proxy.ts` (Next 16's rename of `middleware.ts`),
 * which runs before this renders — an
 * unauthenticated request is redirected at the edge and never reaches admin code.
 * This layout is only chrome.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-[100svh] bg-ink">{children}</div>;
}
