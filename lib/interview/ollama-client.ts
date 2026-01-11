import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

export type ChatAgent = "user" | "system";

export interface ChatMessage {
  role: ChatAgent;
  content: string;
}

export interface OllamaStreamPayload {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  max_tokens?: number;
  stream: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    num_predict?: number;
  };
}

export async function OllamaStream(payload: OllamaStreamPayload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

  const requestBody = {
    model: payload.model,
    messages: payload.messages,
    stream: payload.stream,
    options: {
      temperature: payload.temperature,
      top_p: payload.top_p,
      frequency_penalty: payload.frequency_penalty,
      presence_penalty: payload.presence_penalty,
      num_predict: payload.max_tokens,
      ...payload.options,
    },
  };

  const res = await fetch(`${ollamaUrl}/api/chat`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.message?.content || "";
            if (counter < 2 && (text.match(/\n/) || []).length) {
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            controller.error(e);
          }
        }
      }

      const parser = createParser(onParse);
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}

export async function generateWithOllama(messages: ChatMessage[], model = "ministral-3:14b-cloud") {
  const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  
  const requestBody = {
    model,
    messages,
    stream: false,
  };

  const response = await fetch(`${ollamaUrl}/api/chat`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.message?.content || "";
}