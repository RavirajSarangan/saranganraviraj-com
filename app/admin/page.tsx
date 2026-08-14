import Link from "next/link";
import {
  FileText,
  FolderKanban,
  MessageSquareQuote,
  LogOut,
  Database,
} from "lucide-react";
import { logout } from "./actions";
import { posts } from "@/content/posts";
import { projects, testimonials, site } from "@/content/site";

export const dynamic = "force-dynamic";

const cards = [
  { href: "/admin/posts", label: "Posts", icon: FileText, count: posts.length },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: FolderKanban,
    count: projects.length,
  },
  {
    href: "/admin/testimonials",
    label: "Testimonials",
    icon: MessageSquareQuote,
    count: testimonials.length,
  },
];

export default function AdminDashboard() {
  return (
    <div className="shell py-16 sm:py-20">
      <div className="flex flex-wrap items-baseline justify-between gap-6 border-b border-line pb-8">
        <div>
          <span className="label block text-accent">Admin</span>
          <h1 className="display-md mt-4 text-fg">
            {site.shortName}&rsquo;s desk
          </h1>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="label inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-muted transition-colors duration-500 hover:border-accent hover:text-accent"
          >
            <LogOut aria-hidden size={13} strokeWidth={1.6} />
            Sign out
          </button>
        </form>
      </div>

      <div className="mt-10 grid gap-px sm:grid-cols-3">
        {cards.map(({ href, label, icon: Icon, count }) => (
          <Link
            key={href}
            href={href}
            className="group border border-line p-8 transition-colors duration-500 hover:border-line-strong"
          >
            <Icon
              aria-hidden
              size={18}
              strokeWidth={1.5}
              className="text-accent"
            />
            <span className="font-display mt-6 block text-2xl tracking-[-0.015em] text-fg">
              {label}
            </span>
            <span className="label mt-2 block">{count} entries</span>
          </Link>
        ))}
      </div>

      {/*
        Honest state-of-the-world. The counts above are read from the TypeScript
        content files, which are baked in at build time and cannot be written to at
        runtime on Vercel — the filesystem is read-only. Editing needs the database.
      */}
      <div className="mt-12 flex gap-4 rounded-sm border border-accent/30 bg-accent-dim p-6">
        <Database
          aria-hidden
          size={18}
          strokeWidth={1.5}
          className="mt-0.5 shrink-0 text-accent"
        />
        <div>
          <p className="text-sm text-fg">
            Read-only until the database is connected.
          </p>
          <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-muted">
            Content currently lives in{" "}
            <code className="text-fg/80">content/site.ts</code> and{" "}
            <code className="text-fg/80">content/posts.ts</code>, which are
            compiled into the build. Vercel&rsquo;s filesystem is read-only at
            runtime, so saving an edit here needs Convex. The schema and CRUD
            functions are already written in{" "}
            <code className="text-fg/80">convex/</code> — they just need
            provisioning.
          </p>
        </div>
      </div>
    </div>
  );
}
