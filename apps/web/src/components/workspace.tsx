"use client";
import { useMemo, useState } from "react";
import { ArrowUp, BrainCircuit, MessageSquarePlus, Sparkles } from "lucide-react";
import { applyOperation, demoMemories, type MemoryOperation, type MemoryRecord } from "@memoryledger/memory";

type ChatMessage={role:"user"|"assistant";content:string};
const initialMessages:ChatMessage[]=[
  {role:"assistant",content:"This workspace keeps important project state outside the rolling chat window. Ask me about deployment, requirements, or change a decision and watch the Memory Inspector update."},
  {role:"user",content:"What do you remember about how this product should handle memory?"},
  {role:"assistant",content:"Three durable rules stand out: every memory should retain provenance, model-inferred memory cannot silently override user-confirmed memory, and you prefer end-to-end implementation rather than partial scaffolding."}
];

export function Workspace(){
  const [messages,setMessages]=useState<ChatMessage[]>(initialMessages); const [memories,setMemories]=useState<MemoryRecord[]>(demoMemories); const [value,setValue]=useState(""); const [busy,setBusy]=useState(false);
  const counts=useMemo(()=>Object.fromEntries(["decision","requirement","constraint","preference","fact"].map(t=>[t,memories.filter(m=>m.type===t&&m.status==="active").length])),[memories]);
  async function send(){const message=value.trim();if(!message||busy)return;setValue("");setBusy(true);setMessages(m=>[...m,{role:"user",content:message}]);try{const res=await fetch("/api/chat",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({workspaceId:"demo",message})});const body=await res.json();setMessages(m=>[...m,body.message]);if(Array.isArray(body.memories)) setMemories(body.memories); else for(const op of (body.memoryOperations??[]) as MemoryOperation[]) setMemories(ms=>applyOperation(ms,op,"demo"));}catch{setMessages(m=>[...m,{role:"assistant",content:"I couldn't reach the chat endpoint. The UI is still usable, but the request was not processed."}]);}finally{setBusy(false)}}
  return <div className="app">
    <aside className="sidebar"><div className="brand"><div className="brand-mark"><BrainCircuit size={16}/></div>MemoryLedger</div><div className="eyebrow">Workspaces</div><button className="workspace-item active">Product memory<span>4 durable memories</span></button><button className="workspace-item">Research<span>Evidence workspace</span></button><div className="eyebrow">Conversations</div><button className="chat-item">Architecture direction<span>Today</span></button><button className="chat-item">Memory behavior<span>Yesterday</span></button><button className="new-chat"><MessageSquarePlus size={14} style={{verticalAlign:"middle",marginRight:7}}/>New conversation</button></aside>
    <section className="center"><header className="topbar"><div><h1>Product memory</h1></div><div style={{display:"flex",gap:12,alignItems:"center"}}><button className="mobile-inspector">Memory</button><div className="status"><span className="dot"/>Durable state active</div></div></header>
      <div className="messages">{messages.map((m,i)=><div className="message" key={i}><div className="avatar">{m.role==="assistant"?<Sparkles size={14}/>:"You"}</div><div className="bubble">{m.content}</div></div>)}</div>
      <div className="composer-wrap"><div className="composer"><textarea value={value} onChange={e=>setValue(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();void send()}}} placeholder="Message this workspace…"/><div className="composer-actions"><span className="hint">Try: “Move production hosting to Render.”</span><button className="send" aria-label="Send" onClick={()=>void send()} disabled={busy}><ArrowUp size={17}/></button></div></div></div>
    </section>
    <aside className="inspector"><h2>Memory Inspector</h2><p className="lead">Durable facts and decisions this workspace can use across conversations.</p><div className="chips"><span className="chip">{counts.decision} decisions</span><span className="chip">{counts.requirement} requirements</span><span className="chip">{counts.constraint} constraints</span><span className="chip">{counts.preference} preferences</span></div>{memories.filter(m=>m.status==="active").map(m=><div className="memory" key={m.id}><div className="memory-head"><span className="memory-type">{m.type}</span>{m.userConfirmed&&<span className="confirmed">✓ confirmed</span>}</div><div className="memory-key">{m.key.replaceAll("_"," ")}</div><div className="memory-value">{m.value}</div>{m.sourceQuote&&<div className="source">Source: “{m.sourceQuote}”</div>}</div>)}<div className="inspector-footer">Memory is explicit and inspectable. Production persistence stores immutable versions so a changed decision remains auditable without polluting the active context.</div></aside>
  </div>
}
