import { randomUUID } from "node:crypto";
import type { MemoryOperation, MemoryRecord } from "./types";

export function applyOperation(memories: MemoryRecord[], op: MemoryOperation, workspaceId: string, now = new Date().toISOString()): MemoryRecord[] {
  if (op.operation === "IGNORE") return memories;
  if (op.operation === "ADD") {
    if (!op.type || !op.key || !op.value) throw new Error("ADD requires type, key, and value");
    const existing = memories.find((m) => m.status === "active" && m.type === op.type && m.key === op.key);
    if (existing) return applyOperation(memories, { ...op, operation: "SUPERSEDE", memoryId: existing.id }, workspaceId, now);
    return [...memories, {id: randomUUID(), workspaceId, type: op.type, key: op.key, value: op.value, importance: 0.6, confidence: op.confidence, status: "active", userConfirmed: false, createdAt: now, updatedAt: now}];
  }
  const target = memories.find((m) => m.id === op.memoryId);
  if (!target) throw new Error(`${op.operation} requires a valid memoryId`);
  if (op.operation === "DELETE") return memories.map((m) => m.id === target.id ? {...m, status: "deleted", updatedAt: now} : m);
  if (!op.value) throw new Error(`${op.operation} requires value`);
  if (op.operation === "UPDATE") return memories.map((m) => m.id === target.id ? {...m, value: op.value!, confidence: op.confidence, updatedAt: now} : m);
  return memories.map((m) => m.id === target.id ? {...m, value: op.value!, confidence: op.confidence, updatedAt: now} : m);
}
