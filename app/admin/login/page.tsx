import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Admin",
  // Never index or follow anything under /admin.
  robots: { index: false, follow: false, nocache: true },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <span className="label block text-accent">Restricted</span>
        <h1 className="display-md mt-5 text-fg">Admin access</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {site.name} — content management. This area is not public.
        </p>

        {/* useSearchParams needs a Suspense boundary to keep the route static */}
        <Suspense fallback={<div className="mt-12 h-[168px]" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
