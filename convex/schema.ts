import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

/**
 * Convex owns what changes: posts, projects, testimonials and the headline stats.
 * `content/site.ts` keeps what does not — identity, services, process, About copy.
 * Putting genuinely static text behind a CMS buys an admin screen for prose that
 * changes once a year, at the cost of a database round-trip on every page.
 */

const postBlock = v.union(
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

export default defineSchema({
  // Convex Auth's own tables (users, sessions, refresh tokens, rate limits)
  ...authTables,

  posts: defineTable({
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    category: v.string(),
    body: v.array(postBlock),
    coverId: v.optional(v.id("_storage")),
    readingMinutes: v.number(),
    published: v.boolean(),
    /** Set the first time a post is published; edits afterwards do not move it. */
    publishedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    // Slug lookups drive /blog/[slug]; without the index that is a full scan.
    .index("by_slug", ["slug"])
    // Compound so the public list filters and orders in one indexed read.
    .index("by_published", ["published", "publishedAt"]),

  projects: defineTable({
    slug: v.string(),
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
    /** Manual ordering — the work index is curated, not chronological. */
    order: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"])
    .index("by_featured", ["featured", "order"]),

  testimonials: defineTable({
    quote: v.string(),
    author: v.string(),
    title: v.string(),
    published: v.boolean(),
    order: v.number(),
  }).index("by_published", ["published", "order"]),

  /**
   * Single-row key/value store for the headline figures, so "50+" can be corrected
   * without a deploy.
   */
  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
});
