export type UserRole = "founder" | "earner";
export type SurveyStatus = "draft" | "live" | "completed" | "paused";
export type QuestionType = "multiple_choice" | "scale" | "short_text" | "yes_no";
export type TransactionType = "credit" | "debit" | "withdrawal" | "escrow";

export interface User {
  $id: string;
  name: string;
  email: string;
  role: UserRole;
  walletBalance: number;
  reliabilityScore: number;
  demographics?: UserDemographics;
  createdAt: string;
}

export interface UserDemographics {
  age: number;
  gender: string;
  location: string;
  occupation: string;
  industry: string;
  incomeBracket: string;
  interests: string[];
  education: string;
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
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  isHoneypot?: boolean;
  required: boolean;
  order: number;
}

export interface TargetAudience {
  country: string;
  ageRange: { min: number; max: number };
  interests?: string[];
}

export interface Response {
  $id: string;
  surveyId: string;
  respondentId: string;
  answers: Answer[];
  validatedByTruthLayer: boolean;
  flagged: boolean;
  flagReason?: string;
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
