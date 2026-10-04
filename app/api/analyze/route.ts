import { inputSchema, reportSchema } from "@/lib/schema";
import { systemPrompt, buildMessage } from "@/lib/prompt";
import { createClient } from "@/lib/llm";

export const maxDuration = 60;

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return Response.json({ error: "invalidInput" }, { status: 400 });
  }
  const input = inputSchema.safeParse(body);
  if (!input.success) return Response.json({ error: "invalidInput" }, { status: 400 });
  const { resume, job, lang, password } = input.data;
  if (process.env.APP_PASSWORD && password !== process.env.APP_PASSWORD) {
    return Response.json({ error: "wrongPassword" }, { status: 401 });
  }
  try {
    const response = await createClient().chat.completions.create({
      model: process.env.LLM_MODEL!, temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: buildMessage(resume, job, lang) }],
    });
    const content = (response.choices[0]?.message.content ?? "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    return Response.json(reportSchema.parse(JSON.parse(content)), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Analysis failed", error instanceof Error ? error.name : "UnknownError");
    return Response.json({ error: "analysisFailed" }, { status: 502 });
  }
}