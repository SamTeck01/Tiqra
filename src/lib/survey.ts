// Survey helpers shared by the client and the server.
import { IdeaIntake, Question, QuestionType } from "./types";

export const EMPTY_INTAKE: IdeaIntake = {
  problem: "",
  audience: "",
  solution: "",
  alternatives: "",
  advantage: "",
  pricing: "",
};

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

/** Truth Layer attention check added to every survey at launch. Not paid, not priced. */
export const HONEYPOT: Question = {
  id: "q_check",
  text: "For quality control, please select 'Agree' to continue.",
  type: "multiple_choice",
  options: ["Disagree", "Neutral", "Agree"],
  isHoneypot: true,
  honeypotAnswer: "Agree",
  required: true,
  order: 0,
};

export function withAttentionCheck(questions: Question[], at = 3): Question[] {
  const out = questions.filter((q) => !q.isHoneypot);
  out.splice(Math.min(at, out.length), 0, HONEYPOT);
  return out.map((q, i) => ({ ...q, order: i + 1 }));
}

export const paidQuestionCount = (questions: Question[]) => questions.filter((q) => !q.isHoneypot).length;
