import { OllamaStream, OllamaStreamPayload } from "@/lib/interview/ollama-client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { prompt } = (await req.json()) as {
    prompt?: string;
  };

  if (!prompt) {
    return new Response("No prompt in request", { status: 400 });
  }

  const payload: OllamaStreamPayload = {
    model: "ministral-3:14b-cloud",
    messages: [
      {
        role: "system",
        content:
          "You are a tech hiring manager. You are to only provide feedback on interview candidate's transcript. If it is not relevant and does not answer the question, make sure to say that. Do not be overly verbose and focus on candidate's response.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 450,
    stream: true,
  };

  const stream = await OllamaStream(payload);
  return new Response(stream);
}