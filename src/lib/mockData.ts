import { User, Survey, Transaction, Wallet, Response, Idea } from "./types";

export const MOCK_USERS: User[] = [
  {
    $id: "user_founder_001",
    name: "Alex Founder",
    email: "founder@tiqra.com",
    role: "founder",
    walletBalance: 15000,
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
    balance: 15000,
    pendingBalance: 5000,
    totalEarned: 0,
    totalSpent: 45000,
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

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    $id: "tx_001",
    userId: "user_founder_001",
    type: "credit",
    amount: 20000,
    description: "Wallet Funding via Paystack",
    status: "completed",
    reference: "tiqra_mock_ref_1",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    $id: "tx_002",
    userId: "user_founder_001",
    type: "escrow",
    amount: 5000,
    description: "Escrow for 'Fintech App Validation' survey",
    status: "completed",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
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

export const MOCK_SURVEYS: Survey[] = [
  {
    $id: "survey_001",
    title: "Fintech App Validation in Nigeria",
    description: "We are validating a new cross-border payment application.",
    creatorId: "user_founder_001",
    status: "live",
    questions: [
      {
        id: "q_1",
        text: "How often do you send money across borders?",
        type: "multiple_choice",
        options: ["Weekly", "Monthly", "Rarely", "Never"],
        required: true,
        order: 1,
      },
      {
        id: "q_2",
        text: "What is your biggest frustration with current solutions?",
        type: "short_text",
        required: true,
        order: 2,
      },
    ],
    targetAudience: {
      country: "Nigeria",
      ageRange: { min: 18, max: 45 },
    },
    respondentsRequired: 100,
    respondentsCompleted: 42,
    payoutPerResponse: 200,
    platformFee: 1000,
    totalCost: 21000,
    escrowAmount: 21000,
    aiReportGenerated: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    $id: "survey_002",
    title: "E-commerce Shopping Habits",
    description: "Understanding how millennials shop online.",
    creatorId: "user_founder_001",
    status: "completed",
    questions: [],
    targetAudience: {
      country: "Global",
      ageRange: { min: 18, max: 35 },
    },
    respondentsRequired: 50,
    respondentsCompleted: 50,
    payoutPerResponse: 300,
    platformFee: 1500,
    totalCost: 16500,
    escrowAmount: 16500,
    aiReportGenerated: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
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
