import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const createChat = mutation({
  args: {
    title: v.string(),
    userId: v.optional(v.string()), // Optional for now, can be passed from client or auth
  },
  handler: async (ctx, args) => {
    const chatId = await ctx.db.insert("chats", {
      title: args.title,
      userId: args.userId,
      createdAt: Date.now(),
    });
    return chatId;
  },
});

export const getChats = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // If userId is provided, filter by it. Otherwise, return all (or handle as needed).
    // The schema has an index "by_userId", so we can use it if we had a userId.
    // For now, based on the simple usage in page.tsx (calling without args or with unknown args),
    // we'll just return all chats ordered by creation time if no userId is strictly enforced.
    // However, the page.tsx calls `useQuery(api.messages.getChats)`.
    
    // Let's return all chats for now to match likely previous behavior for a simple app.
    // If strict user scoping is needed, we'd use the index.
    return await ctx.db.query("chats").order("desc").collect();
  },
});

export const getMessages = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();
  },
});

export const deleteChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    // Delete the chat
    await ctx.db.delete(args.chatId);
    
    // Delete all messages in the chat
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();
      
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
  },
});

export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    products: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      chatId: args.chatId,
      role: args.role,
      content: args.content,
      products: args.products,
      createdAt: Date.now(),
    });
  },
});