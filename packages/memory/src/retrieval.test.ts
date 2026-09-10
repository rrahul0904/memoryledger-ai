import { describe, expect, it } from "vitest";
import { demoMemories, rankMemories } from "./index";

describe("rankMemories", () => {
  it("prioritizes deployment decision for deployment query", () => {
    const ranked = rankMemories("where should we deploy production", demoMemories, 2);
    expect(ranked.some((m) => m.key === "deployment_provider")).toBe(true);
  });
});
