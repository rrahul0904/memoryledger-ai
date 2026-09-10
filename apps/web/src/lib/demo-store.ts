import { applyOperation, demoMemories, type MemoryOperation, type MemoryRecord } from "@memoryledger/memory";

type Store = Map<string, MemoryRecord[]>;
const globalStore = globalThis as typeof globalThis & { __memoryLedgerDemo?: Store };
const store = globalStore.__memoryLedgerDemo ?? new Map<string, MemoryRecord[]>();
if (process.env.NODE_ENV !== "production") globalStore.__memoryLedgerDemo = store;

export function getDemoMemories(workspaceId: string): MemoryRecord[] {
  if (!store.has(workspaceId)) {
    const seeded = demoMemories
      .filter((memory) => memory.workspaceId === "demo")
      .map((memory) => ({ ...memory, workspaceId }));
    store.set(workspaceId, seeded);
  }
  return store.get(workspaceId) ?? [];
}

export function applyDemoOperations(workspaceId: string, operations: MemoryOperation[]): MemoryRecord[] {
  let memories = getDemoMemories(workspaceId);
  for (const operation of operations) memories = applyOperation(memories, operation, workspaceId);
  store.set(workspaceId, memories);
  return memories;
}

export function addConfirmedDemoMemory(workspaceId: string, memory: Pick<MemoryRecord, "type" | "key" | "value">): MemoryRecord[] {
  const operation: MemoryOperation = { operation: "ADD", ...memory, confidence: 1 };
  const next = applyDemoOperations(workspaceId, [operation]);
  const created = next.find((item) => item.type === memory.type && item.key === memory.key && item.status === "active");
  if (created) created.userConfirmed = true;
  return next;
}
