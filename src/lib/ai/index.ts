// Picks the AI provider from environment variables. Server only.
import "server-only";
import { createOpenAICompatibleProvider } from "./openaiCompatible";
import { stubProvider } from "./stub";
import type { AIProvider } from "./types";

const DEFAULT_BASE_URL: Record<string, string> = {
  openai: "https://api.openai.com/v1",
  openrouter: "https://openrouter.ai/api/v1",
  groq: "https://api.groq.com/openai/v1",
  deepseek: "https://api.deepseek.com/v1",
  gemini: "https://generativelanguage.googleapis.com/v1beta/openai",
};

export function getAIProvider(): AIProvider {
  const key = process.env.AI_API_KEY;
  if (!key) return stubProvider;
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();
  const baseUrl = process.env.AI_BASE_URL || DEFAULT_BASE_URL[provider];
  if (!baseUrl || !process.env.AI_MODEL) {
    console.warn("AI_API_KEY is set but AI_MODEL or AI_BASE_URL is missing; using the placeholder provider.");
    return stubProvider;
  }
  return createOpenAICompatibleProvider({ apiKey: key, model: process.env.AI_MODEL, baseUrl });
}
