import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chats: defineTable({
    userId: v.optional(v.string()), 
    title: v.string(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
  
  messages: defineTable({
    chatId: v.id("chats"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    products: v.optional(v.array(v.number())),
    createdAt: v.number(),
  }).index("by_chatId", ["chatId"]),

  comments: defineTable({
    videoId: v.string(),
    userId: v.optional(v.string()), // Optional user ID
    author: v.string(), // Display name
    content: v.string(),
    createdAt: v.number(),
  }).index("by_videoId", ["videoId"]),
});