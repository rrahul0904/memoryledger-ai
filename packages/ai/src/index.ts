export type ChatInput = { system: string; messages: Array<{role:"user"|"assistant"; content:string}>; model?: string };
export type ChatOutput = { text: string; model: string; inputTokens?: number; outputTokens?: number };
export interface AIProvider { generate(input: ChatInput): Promise<ChatOutput>; }

export class OpenAIProvider implements AIProvider {
  constructor(private readonly apiKey: string, private readonly defaultModel = "gpt-5-mini") {}
  async generate(input: ChatInput): Promise<ChatOutput> {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {"content-type":"application/json","authorization":`Bearer ${this.apiKey}`},
      body: JSON.stringify({model: input.model ?? this.defaultModel, instructions: input.system, input: input.messages})
    });
    if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
    const body = await response.json() as any;
    return {text: body.output_text ?? body.output?.flatMap((x:any)=>x.content??[]).map((x:any)=>x.text??"").join("") ?? "",model:body.model ?? input.model ?? this.defaultModel,inputTokens:body.usage?.input_tokens,outputTokens:body.usage?.output_tokens};
  }
}
