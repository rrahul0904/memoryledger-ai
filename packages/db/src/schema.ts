import { boolean, index, jsonb, pgEnum, pgTable, real, text, timestamp, uniqueIndex, uuid, vector } from "drizzle-orm/pg-core";

export const memoryType = pgEnum("memory_type", ["fact","decision","requirement","constraint","preference"]);
export const memoryStatus = pgEnum("memory_status", ["active","superseded","deleted"]);

export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", {withTimezone:true}).defaultNow().notNull()
});

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").notNull().references(()=>workspaces.id,{onDelete:"cascade"}),
  title: text("title").notNull().default("New conversation"),
  createdAt: timestamp("created_at", {withTimezone:true}).defaultNow().notNull()
}, (t)=>[index("conversation_workspace_idx").on(t.workspaceId)]);

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").notNull().references(()=>conversations.id,{onDelete:"cascade"}),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", {withTimezone:true}).defaultNow().notNull()
}, (t)=>[index("message_conversation_idx").on(t.conversationId,t.createdAt)]);

export const memories = pgTable("memories", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id").notNull().references(()=>workspaces.id,{onDelete:"cascade"}),
  type: memoryType("type").notNull(),
  key: text("key").notNull(),
  value: text("value").notNull(),
  valueJson: jsonb("value_json"),
  importance: real("importance").notNull().default(0.5),
  confidence: real("confidence").notNull().default(1),
  status: memoryStatus("status").notNull().default("active"),
  userConfirmed: boolean("user_confirmed").notNull().default(false),
  sourceMessageId: uuid("source_message_id"),
  sourceQuote: text("source_quote"),
  embedding: vector("embedding", {dimensions:1536}),
  validFrom: timestamp("valid_from", {withTimezone:true}).defaultNow().notNull(),
  validUntil: timestamp("valid_until", {withTimezone:true}),
  createdAt: timestamp("created_at", {withTimezone:true}).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", {withTimezone:true}).defaultNow().notNull()
}, (t)=>[
  uniqueIndex("memory_canonical_idx").on(t.workspaceId,t.type,t.key),
  index("memory_workspace_status_idx").on(t.workspaceId,t.status)
]);

export const memoryVersions = pgTable("memory_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  memoryId: uuid("memory_id").notNull().references(()=>memories.id,{onDelete:"cascade"}),
  value: text("value").notNull(),
  sourceMessageId: uuid("source_message_id"),
  sourceQuote: text("source_quote"),
  confidence: real("confidence").notNull(),
  createdAt: timestamp("created_at", {withTimezone:true}).defaultNow().notNull()
}, (t)=>[index("memory_version_memory_idx").on(t.memoryId,t.createdAt)]);
