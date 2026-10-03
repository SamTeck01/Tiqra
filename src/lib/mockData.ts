import { User, Survey, Transaction, Wallet, Response, Idea } from "./types";

export const MOCK_USERS: User[] = [
  {
    $id: "user_founder_001",
    name: "Haleemah Abdulazeez",
    email: "founder@tiqra.com",
    role: "founder",
    walletBalance: 25000,
    reliabilityScore: 100,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    $id: "user_earner_001",
    name: "Sam Earner",
    email: "earner@tiqra.com",
    role: "earner",
    walletBalance: 2500,
    reliabilityScore: 98,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_WALLETS: Wallet[] = [
  {
    $id: "wallet_founder_001",
    userId: "user_founder_001",
    balance: 25000,
    pendingBalance: 0,
    totalEarned: 0,
    totalSpent: 120000,
  },
  {
    $id: "wallet_earner_001",
    userId: "user_earner_001",
    balance: 2500,
    pendingBalance: 300,
    totalEarned: 12500,
    totalSpent: 10000,
  },
];

const at = (iso: string) => new Date(iso).toISOString();

export const MOCK_TRANSACTIONS: Transaction[] = [
  { $id: "tx_f1", userId: "user_founder_001", type: "credit", amount: 50000, description: "Added funds to wallet via Paystack", status: "completed", reference: "tiqra_mock_ref_5", balanceAfter: 25000, createdAt: at("2026-04-08T10:30:00") },
  { $id: "tx_f2", userId: "user_founder_001", type: "escrow", amount: 25000, description: "AI resume builder", status: "completed", balanceAfter: 0, createdAt: at("2026-04-06T11:30:00") },
  { $id: "tx_f3", userId: "user_founder_001", type: "escrow", amount: 50000, description: "Campus Swap", status: "completed", balanceAfter: 25000, createdAt: at("2026-04-04T11:30:00") },
  { $id: "tx_f4", userId: "user_founder_001", type: "credit", amount: 100000, description: "Added funds to wallet via Paystack", status: "completed", reference: "tiqra_mock_ref_4", balanceAfter: 75000, createdAt: at("2026-04-02T10:30:00") },
  { $id: "tx_f5", userId: "user_founder_001", type: "escrow", amount: 25000, description: "StudyBuddy", status: "completed", balanceAfter: 0, createdAt: at("2026-03-24T11:30:00") },
  {
    $id: "tx_003",
    userId: "user_earner_001",
    type: "credit",
    amount: 300,
    description: "Reward: E-commerce Shopping Habits",
    status: "completed",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    $id: "tx_004",
    userId: "user_earner_001",
    type: "withdrawal",
    amount: 10000,
    description: "Bank Withdrawal to GTBank",
    status: "completed",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const NG = { country: "Nigeria", ageRange: { min: 18, max: 45 } };

function seedSurvey(
  id: string,
  title: string,
  summary: string,
  status: Survey["status"],
  required: number,
  completed: number,
  extra: Partial<Survey> = {}
): Survey {
  const questions = 11;
  const payoutPerResponse = questions * 30;
  const payout = payoutPerResponse * required;
  return {
    $id: id,
    title,
    description: summary,
    summary,
    creatorId: "user_founder_001",
    status,
    questions: [],
    targetAudience: NG,
    respondentsRequired: required,
    respondentsCompleted: completed,
    payoutPerResponse,
    platformFee: Math.round(payout * 0.15),
    totalCost: Math.round(payout * 1.15),
    escrowAmount: Math.round(payout * 1.15),
    aiReportGenerated: status === "completed",
    createdAt: at("2026-04-26T09:00:00"),
    ...extra,
  };
}

export const MOCK_SURVEYS: Survey[] = [
  seedSurvey("survey_resume", "AI powered Resume builder", "Helping job seekers pass ATS filters", "live", 50, 32),
  seedSurvey("survey_invoice", "Freelancer Invoice Tools", "Invoicing and reminders for freelancers", "live", 50, 20),
  seedSurvey("survey_meal", "Student Meal Planner App", "Affordable meals near campus", "live", 50, 47),
  seedSurvey("survey_standup", "Remote Team Standup Bot", "Async standups for remote teams", "live", 50, 18),
  seedSurvey("survey_artisan", "Local artisan marketplace", "Connecting local artisans to urban buyers", "completed", 80, 80, { verdict: "go", confidence: 84, createdAt: at("2026-04-12T09:00:00") }),
  seedSurvey("survey_tutoring", "On-demand tutoring for SS3", "Exam prep tutors on demand for SS3 students", "completed", 60, 60, { verdict: "pivot", confidence: 41, createdAt: at("2026-04-04T09:00:00") }),
  seedSurvey("survey_crypto", "Crypto rewards for gamers", "Paying gamers in crypto for achievements", "completed", 50, 50, { verdict: "kill", confidence: 21, createdAt: at("2026-03-20T09:00:00") }),
  seedSurvey("survey_diabetes", "Meal plan generator for diabetes", "Generic meal plans don't account for medical needs", "draft", 50, 0),
];

export const MOCK_RESPONSES: Response[] = [
  {
    $id: "resp_001",
    surveyId: "survey_001",
    respondentId: "user_earner_001",
    answers: [
      { questionId: "q_1", value: "Monthly", timeTaken: 12 },
      { questionId: "q_2", value: "High fees and delayed transfers", timeTaken: 45 },
    ],
    validatedByTruthLayer: true,
    flagged: false,
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    timeTaken: 57,
  },
];

export const MOCK_IDEAS: Idea[] = [
  {
    $id: "idea_001",
    title: "AI-Powered Recipe Generator",
    description: "An app that generates recipes based on what's in your fridge.",
    creatorId: "user_founder_001",
    status: "draft",
    targetAudience: { country: "Global", ageRange: { min: 18, max: 65 } },
    respondentsRequired: 100,
    respondentsCompleted: 0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    $id: "idea_002",
    title: "Peer-to-Peer Car Rental",
    description: "Rent cars directly from your neighbors.",
    creatorId: "user_founder_001",
    status: "live",
    targetAudience: { country: "Nigeria", ageRange: { min: 21, max: 50 } },
    respondentsRequired: 200,
    respondentsCompleted: 45,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    $id: "idea_003",
    title: "Virtual Reality Therapy",
    description: "Exposure therapy using VR headsets for common phobias.",
    creatorId: "user_founder_001",
    status: "completed",
    targetAudience: { country: "Global", ageRange: { min: 18, max: 45 } },
    respondentsRequired: 50,
    respondentsCompleted: 50,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// In-memory runtime data containers so they can be mutated during the session
export const runtimeData = {
  users: [...MOCK_USERS],
  wallets: [...MOCK_WALLETS],
  transactions: [...MOCK_TRANSACTIONS],
  surveys: [...MOCK_SURVEYS],
  responses: [...MOCK_RESPONSES],
  ideas: [...MOCK_IDEAS],
  sessions: [] as { userId: string; sessionId: string; token: string }[],
};
