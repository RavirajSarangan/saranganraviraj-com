import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./auth";

const blockValidator = v.union(
  v.object({ type: v.literal("heading"), text: v.string() }),
  v.object({ type: v.literal("paragraph"), text: v.string() }),
  v.object({ type: v.literal("quote"), text: v.string() }),
  v.object({
    type: v.literal("image"),
    storageId: v.id("_storage"),
    alt: v.string(),
    caption: v.optional(v.string()),
  }),
);

/** ~200 wpm, the usual reading estimate. Recomputed on every save so it never drifts. */
function readingMinutes(body: { text?: string }[]) {
  const words = body.reduce((n, b) => n + (b.text?.split(/\s+/).length ?? 0), 0);
  return Math.max(1, Math.round(words / 200));
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/* ---------------------------------------------------------------- public --- */

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .collect();

    return Promise.all(
      posts.map(async (p) => ({
        ...p,
        coverUrl: p.coverId ? await ctx.storage.getUrl(p.coverId) : null,
      })),
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    // Drafts are invisible on the public route; the admin reads through `getById`.
    if (!post?.published) return null;

    return {
      ...post,
      coverUrl: post.coverId ? await ctx.storage.getUrl(post.coverId) : null,
    };
  },
});

/* ---------------------------------------------------------------- admin ---- */

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return ctx.db.query("posts").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const post = await ctx.db.get(id);
    if (!post) return null;
    return {
      ...post,
      coverUrl: post.coverId ? await ctx.storage.getUrl(post.coverId) : null,
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    excerpt: v.string(),
    category: v.string(),
    body: v.array(blockValidator),
    coverId: v.optional(v.id("_storage")),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    // Slugs are the public URL and must stay unique; suffix rather than reject so
    // the editor never loses a draft to a name collision.
    const base = slugify(args.title) || "untitled";
    let slug = base;
    let n = 2;
    while (
      await ctx.db
        .query("posts")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique()
    ) {
      slug = `${base}-${n++}`;
    }

    const now = Date.now();
    return ctx.db.insert("posts", {
      ...args,
      slug,
      readingMinutes: readingMinutes(args.body),
      publishedAt: args.published ? now : undefined,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.string(),
    excerpt: v.string(),
    category: v.string(),
    body: v.array(blockValidator),
    coverId: v.optional(v.id("_storage")),
    published: v.boolean(),
  },
  handler: async (ctx, { id, ...rest }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Post not found.");

    await ctx.db.patch(id, {
      ...rest,
      readingMinutes: readingMinutes(rest.body),
      // First publish stamps the date; later edits must not reorder the blog.
      publishedAt:
        rest.published && !existing.publishedAt ? Date.now() : existing.publishedAt,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const post = await ctx.db.get(id);
    // Delete the cover too, or storage accumulates orphans nothing references.
    if (post?.coverId) await ctx.storage.delete(post.coverId);
    await ctx.db.delete(id);
  },
});
