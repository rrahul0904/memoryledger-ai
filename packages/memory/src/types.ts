import { z } from "zod";

export const memoryTypeSchema = z.enum(["fact", "decision", "requirement", "constraint", "preference"]);
export type MemoryType = z.infer<typeof memoryTypeSchema>;

export const memorySchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  type: memoryTypeSchema,
  key: z.string().min(1),
  value: z.string().min(1),
  importance: z.number().min(0).max(1).default(0.5),
  confidence: z.number().min(0).max(1).default(1),
  status: z.enum(["active", "superseded", "deleted"]).default("active"),
  sourceMessageId: z.string().optional(),
  sourceQuote: z.string().optional(),
  userConfirmed: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string()
});
export type MemoryRecord = z.infer<typeof memorySchema>;

export const operationSchema = z.object({
  operation: z.enum(["ADD", "UPDATE", "SUPERSEDE", "DELETE", "IGNORE"]),
  memoryId: z.string().optional(),
  type: memoryTypeSchema.optional(),
  key: z.string().optional(),
  value: z.string().optional(),
  confidence: z.number().min(0).max(1).default(0.8),
  rationale: z.string().max(300).optional()
});
export type MemoryOperation = z.infer<typeof operationSchema>;
