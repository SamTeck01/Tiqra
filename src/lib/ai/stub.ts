// Placeholder AI provider used until a real model key is configured. It returns
// output in exactly the shape the real provider must return.
import { DimensionKey, IdeaIntake, Question, QuestionType } from "../types";
import { EMPTY_INTAKE } from "../survey";
import type { AIProvider, ChatMessage, ReportContext, ReportNarrative, TaggedLine } from "./types";

/** Turn a spoken description into the structured idea fields. */
export async function structureIdea(transcript: string): Promise<IdeaIntake> {
  const text = transcript.trim();
  const audience = text.match(/for ([a-z ]+?)(?:[.,]|$| who| that| to)/i)?.[1]?.trim() ?? "";
  return {
    ...EMPTY_INTAKE,
    problem: text,
    audience: audience ? audience[0].toUpperCase() + audience.slice(1) : "",
    solution: text.match(/(?:an? |the )?(app|platform|tool|service|marketplace)[^.]*/i)?.[0] ?? "",
  };
}

function q(order: number, text: string, type: QuestionType, options?: string[], dimension?: DimensionKey): Question {
  return { id: `q${order}`, text, type, options, dimension, required: true, order };
}

/** Generate the validation question set (problem, behaviour, willingness to pay, repeat intent). */
export async function generateQuestions(intake: IdeaIntake): Promise<Question[]> {
  const who = intake.audience.trim() || "you";
  const solution = intake.solution.trim().replace(/\.$/, "") || "a new solution";
  const set: [string, QuestionType, string[] | undefined, DimensionKey | undefined][] = [
    ["Which of these best describes you?", "multiple_choice", [who, "Something else"], undefined],
    ["How often do you face this problem?", "multiple_choice", ["Daily", "A few times a week", "Rarely", "Never"], "problem"],
    ["How frustrating is the way you deal with it today?", "scale", undefined, "problem"],
    [intake.alternatives ? `Do you currently use ${intake.alternatives}?` : "Do you currently use any tool or app for this?", "yes_no", undefined, "behaviour"],
    ["What is the biggest challenge with your current option?", "short_text", undefined, "problem"],
    [`How useful would ${solution.toLowerCase()} be to you?`, "scale", undefined, "behaviour"],
    ["Would you switch from what you use today if this worked well?", "yes_no", undefined, "behaviour"],
    [intake.pricing ? `Would you pay ${intake.pricing} for this?` : "Would you pay for a solution like this?", "yes_no", undefined, "willingness"],
    ["How much would you be willing to pay per month?", "multiple_choice", ["Nothing", "Under ₦1,000", "₦1,000 – ₦3,000", "Above ₦3,000"], "willingness"],
    ["How likely are you to keep using it after the first month?", "scale", undefined, "repeat"],
    ["Would you rather keep doing things the way you do today?", "yes_no", undefined, undefined],
    ["What would stop you from using a tool like this?", "short_text", undefined, undefined],
  ];
  const out = set.map(([text, type, options, dim], i) => q(i + 1, text, type, options, dim));
  // Contradiction pair: "rather keep things as they are" mirrors "would switch".
  out[10].reverseOf = out[6].id;
  return out;
}
/** AI Assist inside the Edit Question modal. */
export async function rewriteQuestion(text: string, instruction: "simpler" | "shorter" | string): Promise<string> {
  const t = text.trim();
  if (instruction === "shorter") {
    return t.replace(/^(how|what|do|would|are)\s+/i, (m) => m).replace(/\s+(currently|really|actually|of yours)\b/gi, "").replace(/\s{2,}/g, " ");
  }
  if (instruction === "simpler") {
    return t.replace(/\butili[sz]e\b/gi, "use").replace(/\ballocation system\b/gi, "system").replace(/\baccommodation\b/gi, "housing");
  }
  return t;
}


// ---------------------------------------------------------------------------
// Report text from the computed numbers only. A real model replaces these.

const TAGS: TaggedLine["tag"][] = ["Audience", "Pricing", "Retention"];

export async function writeReport({ analytics }: ReportContext): Promise<ReportNarrative> {
  const summaries = {
    go: "Strong validation across audience fit, behaviour signal and willingness to pay. This idea has the foundation to become a real product.",
    pivot: "Genuine demand exists but a key dimension, likely pricing or target audience, needs rethinking before committing to build.",
    kill: "Weak problem signal or low willingness to pay make this idea unviable in its current form.",
  };
  const steps = {
    go: ["Define your MVP scope around the strongest pain point", "Launch a waitlist or early access page to capture demand", "Test pricing with two cohorts before launch"],
    pivot: ["Re-test with a narrower audience segment", "Try a different pricing model (subscription vs one-off)", "Run a follow-up survey on the weakest dimension"],
    kill: ["Revisit the core problem with interviews", "Look for an adjacent audience with a sharper pain", "Archive this idea and validate the next one"],
  };
  return {
    summary: summaries[analytics.verdict],
    insights: analytics.insights.map((text, i) => ({ text, tag: TAGS[i % 3] })),
    nextSteps: steps[analytics.verdict].map((text, i) => ({ text, tag: TAGS[i % 3] })),
  };
}

export async function chat({ survey, analytics }: ReportContext, history: ChatMessage[]): Promise<string> {
  const q = history[history.length - 1]?.content.toLowerCase() ?? "";
  const dim = analytics.dimensions;
  if (q.includes("pay") || q.includes("price")) {
    const w = dim.find((d) => d.key === "willingness")!;
    return `Willingness to pay is ${w.score}% across ${analytics.validResponses} verified responses.`;
  }
  if (q.includes("verdict") || q.includes("build") || q.includes("should")) {
    return `The current verdict is ${analytics.verdict.toUpperCase()} with ${analytics.confidence}% confidence. ${analytics.insights.join(" ")}`;
  }
  const lines = dim.map((d) => `${d.label}: ${d.score}%`).join(", ");
  return `For "${survey.title}": ${lines}. Detailed answers to free-form questions need an AI provider, which isn't connected yet.`;
}

export const stubProvider: AIProvider = {
  name: "placeholder",
  isReal: false,
  structureIdea,
  generateQuestions,
  rewriteQuestion,
  writeReport,
  writeFeasibility: async () => null,
  chat,
};
