import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactCta } from "@/components/sections/contact-cta";
import { MaskText, Reveal, RuleLine } from "@/components/ui/reveal";
import { PostPlate } from "@/components/ui/post-plate";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getPost, posts } from "@/content/posts";
import { site } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} — ${site.name}`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [site.name],
    },
  };
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = posts.findIndex((p) => p.slug === slug);
  const next = posts[(index + 1) % posts.length];

  return (
    <>
      <ArticleJsonLd post={post} />
      <BreadcrumbJsonLd
        trail={[
          { name: "Writing", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <article>
        <header className="shell pt-[calc(72px+4rem)] sm:pt-[calc(72px+6rem)]">
          <Link
            href="/blog"
            className="label link-underline inline-block text-fg/60 transition-colors hover:text-accent"
          >
            ← All writing
          </Link>

          <div className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="label text-accent">{post.category}</span>
            <time className="label" dateTime={post.date}>
              {dateFormat.format(new Date(post.date))}
            </time>
            <span className="label">{post.readingMinutes} min read</span>
          </div>

          <MaskText
            as="h1"
            text={post.title}
            className="display-lg mt-6 max-w-[18ch] text-fg"
          />

          <p className="mt-10 max-w-[54ch] text-[clamp(1rem,1.8vw,1.25rem)] leading-[1.6] text-fg/80">
            {post.excerpt}
          </p>
        </header>

        {/* Full-bleed cover */}
        <Reveal className="shell mt-14 sm:mt-18">
          <PostPlate
            post={post}
            priority
            className="aspect-[16/10] w-full rounded-sm sm:aspect-[2.2/1]"
            sizes="(max-width: 1320px) 100vw, 1320px"
          />
        </Reveal>

        <div className="shell mt-16 sm:mt-20">
          <RuleLine />
        </div>

        {/* Body — measure capped near 68ch, the readable range for long prose */}
        <div className="shell mt-14 sm:mt-20">
          <div className="max-w-[68ch]">
            {post.body.map((block, i) => {
              if (block.type === "heading") {
                return (
                  <Reveal key={i}>
                    <h2 className="font-display mt-14 mb-5 text-[clamp(1.5rem,3vw,2.125rem)] leading-[1.1] tracking-[-0.02em] text-fg first:mt-0">
                      {block.text}
                    </h2>
                  </Reveal>
                );
              }
              return (
                <Reveal key={i}>
                  <p className="mb-6 text-[clamp(1rem,1.5vw,1.125rem)] leading-[1.75] text-fg/80">
                    {block.text}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>

        <nav aria-label="Next post" className="shell mt-24 sm:mt-32">
          <RuleLine />
          <Link href={`/blog/${next.slug}`} className="group block pt-8">
            <span className="label block">Next</span>
            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-6">
              <h2 className="font-display max-w-[20ch] text-[clamp(1.5rem,4.5vw,3rem)] leading-[1.05] tracking-[-0.025em] text-fg transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                {next.title}
              </h2>
              <span
                aria-hidden
                className="text-2xl text-fg/40 transition-all duration-500 group-hover:translate-x-2 group-hover:text-accent"
              >
                →
              </span>
            </div>
          </Link>
        </nav>
      </article>

      <div className="mt-24 sm:mt-32">
        <ContactCta />
      </div>
    </>
  );
}
