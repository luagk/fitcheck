import OpenAI from "openai";

export function createClient() {
  if (!process.env.LLM_API_KEY || !process.env.LLM_BASE_URL || !process.env.LLM_MODEL) {
    throw new Error("Missing server model configuration");
  }
  return new OpenAI({ apiKey: process.env.LLM_API_KEY, baseURL: process.env.LLM_BASE_URL, timeout: 45000, maxRetries: 0 });
}