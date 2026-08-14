import Link from "next/link";
import { nav, resume, site, socials } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="shell py-16 sm:py-20">
        {/* The name, set enormous, as a sign-off */}
        <div className="overflow-hidden">
          <span
            aria-hidden
            className="font-display block text-[clamp(3rem,15vw,13rem)] leading-[0.82] tracking-[-0.035em] text-fg/[0.07] select-none"
          >
            {site.name}
          </span>
        </div>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="label block">Index</span>
            <ul className="mt-5 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-underline text-sm text-fg/70 transition-colors hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="label block">Elsewhere</span>
            <ul className="mt-5 space-y-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="link-underline text-sm text-fg/70 transition-colors hover:text-fg"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="label block">Located</span>
            <p className="mt-5 text-sm text-fg/70">
              {site.location}
              <br />
              <span className="text-muted">{site.timezone}</span>
            </p>
          </div>

          <div>
            <span className="label block">Say hello</span>
            <a
              href={`mailto:${site.email}`}
              className="link-underline mt-5 block text-sm break-all text-accent"
            >
              {site.email}
            </a>
            <a
              href={resume.href}
              className="link-underline mt-3 block text-sm text-fg/70 transition-colors hover:text-fg"
            >
              Download CV ↓
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <span className="label">
            © {year} {site.name}
          </span>
          <span className="label">Designed & built in Jaffna</span>
        </div>
      </div>
    </footer>
  );
}
