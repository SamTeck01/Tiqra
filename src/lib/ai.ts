// Client-side stand-ins for the AI Survey Architect. They produce structured
// output with the same shape the real model endpoint will return.
import { IdeaIntake, Question, QuestionType } from "./types";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const EMPTY_INTAKE: IdeaIntake = {
  problem: "",
  audience: "",
  solution: "",
  alternatives: "",
  advantage: "",
  pricing: "",
};

/** Turn a spoken description into the structured idea fields. */
export async function structureIdea(transcript: string): Promise<IdeaIntake> {
  await wait(1800);
  const text = transcript.trim();
  const audience = text.match(/for ([a-z ]+?)(?:[.,]|$| who| that| to)/i)?.[1]?.trim() ?? "";
  return {
    ...EMPTY_INTAKE,
    problem: text,
    audience: audience ? audience[0].toUpperCase() + audience.slice(1) : "",
    solution: text.match(/(?:an? |the )?(app|platform|tool|service|marketplace)[^.]*/i)?.[0] ?? "",
  };
}

function q(order: number, text: string, type: QuestionType, options?: string[]): Question {
  return { id: `q_${Date.now()}_${order}`, text, type, options, required: true, order };
}

/** Generate the validation question set (problem, behaviour, willingness to pay, repeat intent). */
export async function generateQuestions(intake: IdeaIntake): Promise<Question[]> {
  await wait(2200);
  const who = intake.audience.trim() || "you";
  const solution = intake.solution.trim().replace(/\.$/, "") || "a new solution";
  const set: [string, QuestionType, string[]?][] = [
    ["Which of these best describes you?", "multiple_choice", [who, "Something else"]],
    ["How often do you face this problem?", "multiple_choice", ["Daily", "A few times a week", "Rarely", "Never"]],
    ["How frustrating is the way you deal with it today?", "scale"],
    [intake.alternatives ? `Do you currently use ${intake.alternatives}?` : "Do you currently use any tool or app for this?", "yes_no"],
    ["What is the biggest challenge with your current option?", "short_text"],
    [`How useful would ${solution.toLowerCase()} be to you?`, "scale"],
    ["Would you switch from what you use today if this worked well?", "yes_no"],
    [intake.pricing ? `Would you pay ${intake.pricing} for this?` : "Would you pay for a solution like this?", "yes_no"],
    ["How much would you be willing to pay per month?", "multiple_choice", ["Nothing", "Under ₦1,000", "₦1,000 – ₦3,000", "Above ₦3,000"]],
    ["How likely are you to keep using it after the first month?", "scale"],
    ["What would stop you from using a tool like this?", "short_text"],
  ];
  return set.map(([text, type, options], i) => q(i + 1, text, type, options));
}

/** AI Assist inside the Edit Question modal. */
export async function rewriteQuestion(text: string, instruction: "simpler" | "shorter" | string): Promise<string> {
  await wait(900);
  const t = text.trim();
  if (instruction === "shorter") {
    return t.replace(/^(how|what|do|would|are)\s+/i, (m) => m).replace(/\s+(currently|really|actually|of yours)\b/gi, "").replace(/\s{2,}/g, " ");
  }
  if (instruction === "simpler") {
    return t.replace(/\butili[sz]e\b/gi, "use").replace(/\ballocation system\b/gi, "system").replace(/\baccommodation\b/gi, "housing");
  }
  return t;
}

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  multiple_choice: "Multiple choice",
  scale: "Scale (1-5)",
  short_text: "Open end",
  yes_no: "Yes / No",
};

/** Short survey title derived from the idea intake. */
export function surveyTitleFrom(intake: IdeaIntake): string {
  const source = intake.solution.trim() || intake.problem.trim();
  const words = source.replace(/^(an?|the)\s+/i, "").split(/\s+/).slice(0, 6).join(" ");
  return words ? words[0].toUpperCase() + words.slice(1).replace(/[.,;:]$/, "") : "Untitled idea";
}
