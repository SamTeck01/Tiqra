// Adapter for any provider with an OpenAI-compatible chat completions API
// (OpenAI, OpenRouter, Groq, DeepSeek, Together, Gemini's OpenAI endpoint, ...).
// Configure with AI_API_KEY, AI_MODEL and AI_BASE_URL. Server only.
import { IdeaIntake, Question } from "../types";
import { stubProvider } from "./stub";
import type { AIProvider, ChatMessage, FeasibilityNarrative, ReportContext, ReportNarrative } from "./types";

const SYSTEM = `You are Tiqra's validation analyst. Tiqra helps Nigerian founders validate startup ideas with real survey responses.
Be concrete, honest and brief. Never invent numbers that are not in the data you are given. Reply with JSON only when asked for JSON.`;

export function createOpenAICompatibleProvider(opts: { apiKey: string; model: string; baseUrl: string }): AIProvider {
  async function complete(messages: { role: string; content: string }[], json: boolean): Promise<string> {
    const res = await fetch(`${opts.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${opts.apiKey}` },
      body: JSON.stringify({
        model: opts.model,
        messages: [{ role: "system", content: SYSTEM }, ...messages],
        temperature: 0.4,
        ...(json ? { response_format: { type: "json_object" } } : {}),
      }),
    });
    if (!res.ok) throw new Error(`AI provider error ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }

  async function json<T>(prompt: string): Promise<T> {
    const text = await complete([{ role: "user", content: prompt }], true);
    return JSON.parse(text.replace(/^```(json)?|```$/g, "").trim()) as T;
  }

  const facts = ({ survey, analytics }: ReportContext) =>
    JSON.stringify({
      idea: survey.intake ?? { title: survey.title, summary: survey.summary },
      verifiedResponses: analytics.validResponses,
      dimensions: analytics.dimensions,
      verdict: analytics.verdict,
      confidence: analytics.confidence,
      questions: analytics.questions.map((q) => ({ text: q.question.text, sentiment: q.sentiment, distribution: q.distribution, samples: q.samples })),
    });

  return {
    name: `openai-compatible:${opts.model}`,
    isReal: true,

    structureIdea: (transcript) =>
      json<IdeaIntake>(
        `Turn this founder's spoken description into JSON with string keys problem, audience, solution, alternatives, advantage, pricing (empty string if not mentioned).\n\n"""${transcript}"""`
      ),

    async generateQuestions(intake) {
      const out = await json<{ questions: Omit<Question, "id" | "order" | "required">[] }>(
        `Write 12 survey questions that validate this idea with its target audience. Mostly tap-based: types are multiple_choice (with 3-5 options), scale (1-5), yes_no, short_text (use at most 2).
Tag each with dimension: problem | behaviour | willingness | repeat (or omit for screening/open questions). Cover all four dimensions.
Return {"questions":[{"text","type","options"?,"dimension"?}]}.\n\nIdea: ${JSON.stringify(intake)}`
      );
      return out.questions.map((q, i) => ({ ...q, id: `q${i + 1}`, order: i + 1, required: true }));
    },

    async rewriteQuestion(text, instruction) {
      const out = await json<{ text: string }>(`Rewrite this survey question (${instruction}). Max 200 characters. Return {"text"}.\n\n${text}`);
      return out.text.slice(0, 200);
    },

    writeReport: (ctx) =>
      json<ReportNarrative>(
        `From this validated survey data, write {"summary": one or two sentences, "insights": 3 items {"text","tag"}, "nextSteps": 3 items {"text","tag"}}. tag is Audience | Pricing | Retention. Only use numbers present in the data.\n\n${facts(ctx)}`
      ),

    writeFeasibility: (ctx) =>
      json<FeasibilityNarrative>(
        `Write a feasibility assessment for building this idea in Nigeria as JSON: {"description","scoreNote","overview":[{"label","score"}] for Market, Technical, Financial, Operational, Legal feasibility,"benefits":[string],"cost":{"min","max"} in naira,"months":{"min","max"},"resources":[string],"technical":[{"label","value"}],"risks":[{"text","level":"Low|Medium|High"}]}. Ground market feasibility in the survey data.\n\n${facts(ctx)}`
      ),

    chat: (ctx, history: ChatMessage[]) =>
      complete(
        [
          { role: "user", content: `Survey data for the founder's questions:\n${facts(ctx)}` },
          { role: "assistant", content: "Understood. Ask me anything about these results." },
          ...history,
        ],
        false
      ),
  };
}

export { stubProvider };
