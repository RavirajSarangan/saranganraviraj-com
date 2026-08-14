import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./auth";

const projectFields = {
  title: v.string(),
  sector: v.string(),
  client: v.string(),
  year: v.string(),
  status: v.union(
      v.literal("Live"),
      v.literal("In progress"),
      v.literal("Shipped"),
      v.literal("Research"),
    ),
  summary: v.string(),
  overview: v.string(),
  approach: v.string(),
  outcome: v.string(),
  role: v.array(v.string()),
  stack: v.array(v.string()),
  liveUrl: v.optional(v.string()),
  duotone: v.array(v.string()),
  coverId: v.optional(v.id("_storage")),
  featured: v.boolean(),
  order: v.number(),
};

async function withCover<T extends { coverId?: unknown }>(
  ctx: { storage: { getUrl: (id: never) => Promise<string | null> } },
  rows: T[],
) {
  return Promise.all(
    rows.map(async (r) => ({
      ...r,
      coverUrl: r.coverId ? await ctx.storage.getUrl(r.coverId as never) : null,
    })),
  );
}

/* ---------------------------------------------------------------- public --- */

export const listFeatured = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("projects")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect();
    return withCover(ctx, rows);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("projects").withIndex("by_order").collect();
    return withCover(ctx, rows);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const p = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!p) return null;
    return { ...p, coverUrl: p.coverId ? await ctx.storage.getUrl(p.coverId) : null };
  },
});

/* ---------------------------------------------------------------- admin ---- */

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const create = mutation({
  args: projectFields,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const base = slugify(args.title) || "project";
    let slug = base;
    let n = 2;
    while (
      await ctx.db
        .query("projects")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique()
    ) {
      slug = `${base}-${n++}`;
    }

    return ctx.db.insert("projects", { ...args, slug, updatedAt: Date.now() });
  },
});

export const update = mutation({
  args: { id: v.id("projects"), ...projectFields },
  handler: async (ctx, { id, ...rest }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { ...rest, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const p = await ctx.db.get(id);
    if (p?.coverId) await ctx.storage.delete(p.coverId);
    await ctx.db.delete(id);
  },
});

/** Reorder in one pass so the work index never renders a half-applied order. */
export const reorder = mutation({
  args: { ids: v.array(v.id("projects")) },
  handler: async (ctx, { ids }) => {
    await requireAdmin(ctx);
    await Promise.all(ids.map((id, i) => ctx.db.patch(id, { order: i })));
  },
});
