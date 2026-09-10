import type { MemoryRecord } from "./types";

const typeBoost: Record<MemoryRecord["type"], number> = {
  constraint: 0.28,
  requirement: 0.24,
  decision: 0.22,
  preference: 0.12,
  fact: 0.1
};

function tokenize(input: string) {
  return new Set(input.toLowerCase().split(/[^a-z0-9]+/).filter((x) => x.length > 2));
}

export function rankMemories(query: string, memories: MemoryRecord[], limit = 8): MemoryRecord[] {
  const q = tokenize(query);
  return memories
    .filter((m) => m.status === "active")
    .map((memory) => {
      const words = tokenize(`${memory.key} ${memory.value}`);
      let overlap = 0;
      for (const word of q) if (words.has(word)) overlap++;
      const lexical = q.size ? overlap / q.size : 0;
      const score = lexical * 0.46 + memory.importance * 0.26 + typeBoost[memory.type];
      return { memory, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ memory }) => memory);
}
