import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: { videoId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_videoId", (q) => q.eq("videoId", args.videoId))
      .order("desc")
      .collect();
  },
});

export const send = mutation({
  args: {
    videoId: v.string(),
    content: v.string(),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("comments", {
      videoId: args.videoId,
      content: args.content,
      author: args.author,
      createdAt: Date.now(),
    });
  },
});
