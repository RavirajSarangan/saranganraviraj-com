import { MagneticLink } from "@/components/ui/magnetic-link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[100svh] flex-col justify-center py-32">
      <span className="label block text-accent">Error / 404</span>
      <h1 className="display-xl mt-8 max-w-[10ch] text-fg">Nothing here.</h1>
      <p className="mt-10 max-w-[44ch] text-sm leading-relaxed text-muted sm:text-base">
        This page has either moved or never existed. The work is still where you
        left it.
      </p>
      <div className="mt-12 flex flex-wrap gap-3">
        <MagneticLink href="/">Back home</MagneticLink>
        <MagneticLink href="/work" variant="ghost">
          See the work
        </MagneticLink>
      </div>
    </section>
  );
}
