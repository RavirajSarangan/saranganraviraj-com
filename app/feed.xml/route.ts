import { posts } from "@/content/posts";
import { site } from "@/content/site";

/**
 * RSS 2.0, generated from the same `posts` array the site renders from, so the feed
 * can never drift from what is published.
 *
 * Static: there is no request-time data, so Next prerenders this at build time.
 */
export const dynamic = "force-static";

/** XML has five predefined entities; everything else in the text is safe as-is. */
function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const items = sorted
    .map((post) => {
      const url = `${site.url}/blog/${post.slug}`;
      // RSS wants RFC-822 dates, not ISO.
      const pubDate = new Date(`${post.date}T09:00:00Z`).toUTCString();

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} — Writing`)}</title>
    <link>${site.url}/blog</link>
    <description>${escapeXml("Notes on design, pricing, process and the craft of building websites that hold up.")}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
