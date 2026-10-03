import { IdeaIntake, Question, Survey } from "../types";
import { SurveyAnalytics } from "../engine/analytics";

export interface TaggedLine {
  text: string;
  tag: "Audience" | "Pricing" | "Retention";
}

export interface ReportNarrative {
  summary: string;
  insights: TaggedLine[];
  nextSteps: TaggedLine[];
}

export interface FeasibilityNarrative {
  description: string;
  scoreNote: string;
  overview: { label: string; score: number }[];
  benefits: string[];
  cost: { min: number; max: number };
  months: { min: number; max: number };
  resources: string[];
  technical: { label: string; value: string }[];
  risks: { text: string; level: "Low" | "Medium" | "High" }[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ReportContext {
  survey: Survey;
  analytics: SurveyAnalytics;
}

/** Everything Tiqra asks of an AI model. Swap providers by implementing this. */
export interface AIProvider {
  readonly name: string;
  /** False for the placeholder: the UI then labels AI-only sections as pending. */
  readonly isReal: boolean;
  structureIdea(transcript: string): Promise<IdeaIntake>;
  generateQuestions(intake: IdeaIntake): Promise<Question[]>;
  rewriteQuestion(text: string, instruction: string): Promise<string>;
  writeReport(ctx: ReportContext): Promise<ReportNarrative>;
  writeFeasibility(ctx: ReportContext): Promise<FeasibilityNarrative | null>;
  chat(ctx: ReportContext, history: ChatMessage[]): Promise<string>;
}
