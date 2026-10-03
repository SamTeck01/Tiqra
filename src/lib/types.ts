export type UserRole = "founder" | "earner";
export type SurveyStatus = "draft" | "live" | "completed" | "paused";
export type IdeaStatus = "draft" | "live" | "completed";
export type QuestionType = "multiple_choice" | "scale" | "short_text" | "yes_no";
export type TransactionType = "credit" | "debit" | "withdrawal" | "escrow";
export type Verdict = "go" | "pivot" | "kill";

/** What the founder tells Tiqra about their idea (voice intake or manual form). */
export interface IdeaIntake {
  problem: string;
  audience: string;
  solution: string;
  alternatives: string;
  advantage: string;
  pricing: string;
}

export interface Idea {
  $id: string;
  title: string;
  description: string;
  creatorId: string;
  status: IdeaStatus;
  targetAudience: TargetAudience;
  respondentsRequired: number;
  respondentsCompleted: number;
  createdAt: string;
}

export interface User {
  $id: string;
  name: string;
  email: string;
  role: UserRole;
  walletBalance: number;
  reliabilityScore: number;
  demographics?: UserDemographics;
  notificationPrefs?: Record<string, boolean>;
  createdAt: string;
}

export interface UserDemographics {
  country?: string;
  gender: string;
  occupation: string;
  birthMonth: string;
  location?: string;
  industry?: string;
  incomeBracket?: string;
  education?: string;
  interests: string[];
  /** Answers to the niche questions asked for each chosen interest. */
  interestAnswers?: Record<string, string>;
  verifiedTags: string[];
}

export interface Survey {
  $id: string;
  title: string;
  description: string;
  creatorId: string;
  status: SurveyStatus;
  questions: Question[];
  targetAudience: TargetAudience;
  respondentsRequired: number;
  respondentsCompleted: number;
  payoutPerResponse: number;
  platformFee: number;
  totalCost: number;
  escrowAmount: number;
  aiReportGenerated: boolean;
  createdAt: string;
  expiresAt?: string;
  /** One-line pitch shown under the title on idea cards. */
  summary?: string;
  intake?: IdeaIntake;
  verdict?: Verdict;
  confidence?: number;
}

/** Which validation dimension a question measures; drives the report scores. */
export type DimensionKey = "problem" | "behaviour" | "willingness" | "repeat";

export interface Question {
  id: string;
  dimension?: DimensionKey;
  /** For a contradiction check: the id of a question asking the same thing the opposite way. */
  reverseOf?: string;
  text: string;
  type: QuestionType;
  options?: string[];
  isHoneypot?: boolean;
  /** The only acceptable answer for a honeypot (attention check) question. */
  honeypotAnswer?: string;
  required: boolean;
  order: number;
}

export interface TargetAudience {
  country: string;
  ageRange: { min: number; max: number };
  interests?: string[];
  /** Respondents below this reliability score don't see the survey. */
  minReliability?: number;
}

export interface Response {
  $id: string;
  surveyId: string;
  respondentId: string;
  answers: Answer[];
  validatedByTruthLayer: boolean;
  flagged: boolean;
  flagReason?: string;
  /** Truth Layer quality score, 0-100. */
  qualityScore?: number;
  completedAt: string;
  timeTaken: number;
}

export interface Answer {
  questionId: string;
  value: string | number | string[];
  timeTaken: number;
}

export interface Transaction {
  $id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: "pending" | "completed" | "failed";
  reference?: string;
  balanceAfter?: number;
  createdAt: string;
}

export interface Wallet {
  $id: string;
  userId: string;
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  totalSpent: number;
}

export interface AIReport {
  surveyId: string;
  type: "mini" | "full";
  demandPercentage: number;
  willingnessToPay: string;
  topObjections: string[];
  audienceInsights: string;
  verdict: "Proceed" | "Pivot" | "Kill";
  confidenceCeiling: number;
  createdAt: string;
}

/** A saved card (funding) or bank account (withdrawals). Only display details are stored. */
export interface PaymentMethod {
  $id: string;
  userId: string;
  kind: "card" | "bank";
  /** Card brand or bank name. */
  provider: string;
  last4: string;
  holderName: string;
  expiry?: string;
  isDefault: boolean;
  createdAt: string;
}
