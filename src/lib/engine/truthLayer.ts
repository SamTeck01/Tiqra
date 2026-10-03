// Truth Layer V1, client side: checks each answer as it is given (spec section 8).
import { Question } from "../types";

export const MAX_STRIKES = 3;

export type AnswerValue = string | number | undefined;

export interface Flag {
  kind: "missing" | "speed" | "honeypot";
  message: string;
}

/** Minimum believable time to read and answer a question. */
function minMillis(q: Question): number {
  return Math.max(1500, q.text.length * 25);
}

export function checkAnswer(q: Question, value: AnswerValue, elapsedMs: number): Flag | null {
  if (value === undefined || value === "" || (typeof value === "string" && !value.trim())) {
    return { kind: "missing", message: "Please answer to continue" };
  }
  if (q.isHoneypot && value !== q.honeypotAnswer) {
    return { kind: "honeypot", message: "Please read the question carefully and answer again" };
  }
  if (elapsedMs < minMillis(q)) {
    return { kind: "speed", message: "That was quick. Take a moment to read the question and answer again" };
  }
  return null;
}

/** Missing answers are just prompts; the other flags count against the respondent. */
export function isStrike(flag: Flag): boolean {
  return flag.kind !== "missing";
}

// ---------------------------------------------------------------------------
// Whole-response evaluation, run on the server when a response is submitted.

export interface SubmittedAnswer {
  questionId: string;
  value: string | number;
  /** Milliseconds spent on the question. */
  timeTaken: number;
}

export interface Evaluation {
  valid: boolean;
  score: number;
  flags: string[];
}

/** Below this many seconds per question on average, the whole response is treated as rushed. */
const MIN_SECONDS_PER_QUESTION = 3;

function answerOf(answers: SubmittedAnswer[], id: string) {
  return answers.find((a) => a.questionId === id)?.value;
}

export function evaluateResponse(questions: Question[], answers: SubmittedAnswer[]): Evaluation {
  const flags: string[] = [];
  let hardFail = false;

  const missing = questions.filter((q) => q.required && (answerOf(answers, q.id) === undefined || answerOf(answers, q.id) === ""));
  if (missing.length) {
    flags.push(`${missing.length} required question(s) unanswered`);
    hardFail = true;
  }

  for (const q of questions.filter((x) => x.isHoneypot)) {
    if (answerOf(answers, q.id) !== q.honeypotAnswer) {
      flags.push("Failed attention check");
      hardFail = true;
    }
  }

  const totalSeconds = answers.reduce((s, a) => s + a.timeTaken, 0) / 1000;
  if (totalSeconds < questions.length * MIN_SECONDS_PER_QUESTION) flags.push("Completed too quickly");

  // Straight-lining: every scale answer identical, or the same option position picked throughout.
  const scales = questions.filter((q) => q.type === "scale").map((q) => answerOf(answers, q.id));
  if (scales.length >= 3 && scales.every((v) => v === scales[0])) flags.push("Same rating on every scale question");
  const choices = questions.filter((q) => q.type === "multiple_choice" && !q.isHoneypot && q.options?.length);
  const positions = choices.map((q) => q.options!.indexOf(String(answerOf(answers, q.id))));
  if (positions.length >= 4 && positions.every((p) => p === positions[0])) flags.push("Same option position on every question");

  // Contradictions between a question and its reversed twin.
  for (const q of questions.filter((x) => x.reverseOf)) {
    const a = answerOf(answers, q.id);
    const b = answerOf(answers, q.reverseOf!);
    if (a === undefined || b === undefined) continue;
    const contradicts =
      q.type === "yes_no" ? a === b : q.type === "scale" ? Math.abs(Number(a) - (6 - Number(b))) >= 3 : false;
    if (contradicts) flags.push("Contradictory answers");
  }

  const score = hardFail ? 0 : Math.max(0, 100 - flags.length * 30);
  return { valid: !hardFail && flags.length < 2, score, flags };
}

/** Reliability moves slowly toward each new response's quality score. */
export function updateReliability(current: number, responseScore: number): number {
  return Math.round(current * 0.8 + responseScore * 0.2);
}
