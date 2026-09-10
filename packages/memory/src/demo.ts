import type { MemoryOperation, MemoryRecord } from "./types";

export const demoMemories: MemoryRecord[] = [
  {id:"m1",workspaceId:"demo",type:"decision",key:"deployment_provider",value:"Vercel",importance:0.9,confidence:1,status:"active",sourceMessageId:"msg-12",sourceQuote:"Deploy the web app on Vercel.",userConfirmed:true,createdAt:"2026-08-28T10:00:00.000Z",updatedAt:"2026-08-28T10:00:00.000Z"},
  {id:"m2",workspaceId:"demo",type:"requirement",key:"memory_provenance",value:"Every durable memory must link back to its source message or document chunk.",importance:1,confidence:1,status:"active",sourceMessageId:"msg-18",userConfirmed:true,createdAt:"2026-08-29T10:00:00.000Z",updatedAt:"2026-08-29T10:00:00.000Z"},
  {id:"m3",workspaceId:"demo",type:"constraint",key:"memory_overwrite",value:"Model-inferred memory cannot silently override user-confirmed memory.",importance:1,confidence:1,status:"active",sourceMessageId:"msg-22",userConfirmed:true,createdAt:"2026-08-30T10:00:00.000Z",updatedAt:"2026-08-30T10:00:00.000Z"},
  {id:"m4",workspaceId:"demo",type:"preference",key:"implementation_quality",value:"Prefer complete end-to-end implementation over partial scaffolding.",importance:0.9,confidence:1,status:"active",sourceMessageId:"msg-25",userConfirmed:true,createdAt:"2026-08-31T10:00:00.000Z",updatedAt:"2026-08-31T10:00:00.000Z"}
];

export function inferDemoOperations(message: string): MemoryOperation[] {
  const lower = message.toLowerCase();
  const deployMatch = lower.match(/(?:move|switch|deploy|host).*?(vercel|render|netlify|aws|azure|gcp|cloudflare)/);
  if (deployMatch) return [{operation:"SUPERSEDE",memoryId:"m1",key:"deployment_provider",value:deployMatch[1][0].toUpperCase()+deployMatch[1].slice(1),confidence:0.96,rationale:"User changed the deployment decision."}];
  if (lower.includes("must") || lower.includes("require")) return [{operation:"ADD",type:"requirement",key:"new_requirement",value:message,confidence:0.84,rationale:"User stated an explicit requirement."}];
  return [];
}
