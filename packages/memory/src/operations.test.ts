import { describe, expect, it } from "vitest";
import { applyOperation, demoMemories } from "./index";

describe("applyOperation", () => {
  it("updates a canonical decision without duplicating the key", () => {
    const next = applyOperation(demoMemories, {operation:"SUPERSEDE",memoryId:"m1",value:"Render",confidence:1}, "demo", "2026-09-03T00:00:00.000Z");
    const active = next.filter((m) => m.status === "active" && m.key === "deployment_provider");
    expect(active).toHaveLength(1);
    expect(active[0]?.value).toBe("Render");
  });
});
