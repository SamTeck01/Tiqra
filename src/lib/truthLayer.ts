// Truth Layer V1, client side: checks each answer as it is given (spec section 8).
import { Question } from "./types";

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
