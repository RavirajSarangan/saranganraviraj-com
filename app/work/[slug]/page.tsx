import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectPlate } from "@/components/ui/project-plate";
import { MaskText, Reveal, RuleLine } from "@/components/ui/reveal";
import { MagneticLink } from "@/components/ui/magnetic-link";
import { ContactCta } from "@/components/sections/contact-cta";
import { BreadcrumbJsonLd, ProjectJsonLd } from "@/components/seo/json-ld";
import { getProject, projects, site } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.summary,
      type: "article",
    },
  };
}

/** Facts rail — the mono metadata block that makes a case study read like a record. */
function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line py-4">
      <span className="label shrink-0">{label}</span>
      <span className="text-right text-sm text-fg/80">{value}</span>
    </div>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const next = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <ProjectJsonLd project={project} />
      <BreadcrumbJsonLd
        trail={[
          { name: "Work", path: "/work" },
          { name: project.title, path: `/work/${project.slug}` },
        ]}
      />
      <article>
        {/* Header */}
        <header className="shell pt-[calc(72px+4rem)] sm:pt-[calc(72px+6rem)]">
          <Link
            href="/work"
            className="label link-underline inline-block text-fg/60 transition-colors hover:text-accent"
          >
            ← All work
          </Link>

          <div className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="label text-accent">{project.index}</span>
            <span className="label">{project.sector}</span>
            <span className="label">{project.year}</span>
            <span
              className={`label ${
                project.status === "Live" ? "text-fg/60" : "text-accent"
              }`}
            >
              {project.status}
            </span>
          </div>

          <MaskText
            as="h1"
            text={project.title}
            className="display-xl mt-6 max-w-[12ch] text-fg"
          />

          <p className="mt-10 max-w-[54ch] text-[clamp(1rem,1.8vw,1.25rem)] leading-[1.6] text-fg/80">
            {project.summary}
          </p>
        </header>

        {/* Cover */}
        <Reveal className="shell mt-16 sm:mt-20">
          <ProjectPlate
            project={project}
            priority
            className="aspect-[16/10] w-full rounded-sm sm:aspect-[2/1]"
            sizes="(max-width: 1320px) 100vw, 1320px"
          />
        </Reveal>

        {/* Body */}
        <div className="shell mt-20 grid gap-14 sm:mt-28 lg:grid-cols-12 lg:gap-16">
          {/* Facts rail */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <RuleLine />
              <span className="label mt-5 mb-6 block">Project record</span>

              <MetaRow label="Client" value={project.client} />
              <MetaRow label="Year" value={project.year} />
              <MetaRow label="Sector" value={project.sector} />
              <MetaRow label="Status" value={project.status} />
              <MetaRow label="Role" value={project.role.join(", ")} />
              <MetaRow label="Stack" value={project.stack.join(", ")} />

              {project.liveUrl && (
                <div className="mt-8">
                  <MagneticLink href={project.liveUrl} variant="ghost" external>
                    Visit site
                  </MagneticLink>
                </div>
              )}
            </div>
          </aside>

          {/* Narrative */}
          <div className="lg:col-span-7 lg:col-start-6">
            <Section title="Overview" body={project.overview} />
            <Section title="Approach" body={project.approach} />
            {/*
              An unshipped project has no outcome yet, so claiming one would be
              fiction. It has a current state instead — headed honestly.
            */}
            <Section
              title={project.status === "In progress" ? "Where it stands" : "Outcome"}
              body={project.outcome}
            />
          </div>
        </div>

        {/* Next project */}
        <nav aria-label="Next project" className="shell mt-28 sm:mt-40">
          <RuleLine />
          <Link href={`/work/${next.slug}`} className="group block pt-8">
            <span className="label block">Next project</span>
            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-6">
              <h2 className="font-display text-[clamp(2rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.03em] text-fg transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                {next.title}
              </h2>
              <span
                aria-hidden
                className="text-2xl text-fg/40 transition-all duration-500 group-hover:translate-x-2 group-hover:text-accent"
              >
                →
              </span>
            </div>
            <span className="label mt-4 block">
              {next.sector} · {next.year}
            </span>
          </Link>
        </nav>
      </article>

      <div className="mt-28 sm:mt-40">
        <ContactCta />
      </div>
    </>
  );
}

/** Skips itself when the content is still a TODO in content/site.ts. */
function Section({ title, body }: { title: string; body: string }) {
  if (!body.trim()) return null;

  return (
    <Reveal className="mb-14 sm:mb-20">
      <h2 className="label mb-5 text-accent">{title}</h2>
      <p className="max-w-[62ch] text-[clamp(1rem,1.5vw,1.125rem)] leading-[1.7] text-fg/80">
        {body}
      </p>
    </Reveal>
  );
}
