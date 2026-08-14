import Link from "next/link";
import { PostPlate } from "@/components/ui/post-plate";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { RuleLine } from "@/components/ui/reveal";
import { posts, type Post } from "@/content/posts";

/**
 * Two or three posts to read next.
 *
 * Same category first, then most recent as filler — so the section is never empty
 * and never shows fewer than it promises, even when a category has only one post.
 */
export function relatedTo(current: Post, count = 3): Post[] {
  const others = posts.filter((p) => p.slug !== current.slug);
  const sameCategory = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);

  const byDate = (a: Post, b: Post) =>
    new Date(b.date).getTime() - new Date(a.date).getTime();

  return [...sameCategory.sort(byDate), ...rest.sort(byDate)].slice(0, count);
}

export function RelatedPosts({ current }: { current: Post }) {
  const related = relatedTo(current);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="shell mt-24 sm:mt-32">
      <RuleLine />
      <div className="flex items-baseline justify-between gap-6 pt-5">
        <span className="label" id="related-heading">
          Keep reading
        </span>
        <span className="label hidden sm:block">{related.length} posts</span>
      </div>

      <RevealGroup className="mt-10 grid gap-8 sm:grid-cols-3" each={0.07}>
        {related.map((post) => (
          <RevealItem key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <PostPlate
                post={post}
                compact
                className="aspect-[4/3] w-full rounded-sm ring-1 ring-line transition-all duration-500 group-hover:ring-accent/50"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <h3 className="font-display mt-4 text-[clamp(1.125rem,2vw,1.375rem)] leading-tight tracking-[-0.015em] text-fg transition-colors duration-500 group-hover:text-accent">
                {post.title}
              </h3>
              <span className="label mt-2.5 block">
                {post.category} · {post.readingMinutes} min
              </span>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
