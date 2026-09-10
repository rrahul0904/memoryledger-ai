import { NextResponse } from "next/server";
import { memoryTypeSchema } from "@memoryledger/memory";
import { z } from "zod";
import { addConfirmedDemoMemory, getDemoMemories } from "@/lib/demo-store";

const createSchema = z.object({
  workspaceId: z.string().min(1),
  type: memoryTypeSchema,
  key: z.string().min(1).max(120),
  value: z.string().min(1).max(4000)
});

export async function GET(request: Request) {
  const workspaceId = new URL(request.url).searchParams.get("workspaceId") ?? "demo";
  return NextResponse.json({ items: getDemoMemories(workspaceId).filter((memory) => memory.status === "active") });
}

export async function POST(request: Request) {
  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid memory" }, { status: 400 });
  const { workspaceId, ...memory } = parsed.data;
  const items = addConfirmedDemoMemory(workspaceId, memory);
  return NextResponse.json({ items: items.filter((item) => item.status === "active") }, { status: 201 });
}
