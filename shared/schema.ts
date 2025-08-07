import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  capability: text("capability").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id).notNull(),
  role: text("role").notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // for code blocks, attachments, etc.
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// AI capability types
export const aiCapabilities = [
  {
    id: 'coding',
    name: 'Advanced Coding',
    description: 'Python, JS, C++, Node.js & more',
    icon: 'fas fa-code',
    color: 'primary',
    tags: ['Python', 'JavaScript', 'C++', 'Node.js'],
  },
  {
    id: 'web-dev',
    name: 'Web Development',
    description: 'Full-stack web applications',
    icon: 'fas fa-globe',
    color: 'accent',
    tags: ['React', 'Node.js', 'API'],
  },
  {
    id: 'automation',
    name: 'Automation',
    description: 'Scripts & workflow automation',
    icon: 'fas fa-robot',
    color: 'yellow-500',
    tags: ['Scripts', 'Workflows'],
  },
  {
    id: 'app-dev',
    name: 'App Development',
    description: 'Mobile & desktop applications',
    icon: 'fas fa-mobile-alt',
    color: 'pink-500',
    tags: ['React Native', 'Flutter'],
  },
  {
    id: 'data-analytics',
    name: 'Data Analytics',
    description: 'Advanced data science & ML',
    icon: 'fas fa-chart-line',
    color: 'blue-400',
    tags: ['Pandas', 'ML', 'Analytics'],
  },
  {
    id: 'music',
    name: 'Music Generation',
    description: 'AI-powered music creation',
    icon: 'fas fa-music',
    color: 'purple-400',
    tags: ['MIDI', 'Audio'],
  },
  {
    id: 'search',
    name: 'Deep Search',
    description: 'Advanced information retrieval',
    icon: 'fas fa-search',
    color: 'emerald-400',
    tags: ['Web', 'Research'],
  },
] as const;

export type AICapability = typeof aiCapabilities[number];
