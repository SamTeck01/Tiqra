import { User, Survey, Transaction, Wallet, Response, Idea, Question, PaymentMethod } from "./types";

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
    name: "Haleemah Abdulazeez",
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
    balance: 1200,
    pendingBalance: 0,
    totalEarned: 1200,
    totalSpent: 0,
  },
];

const at = (iso: string) => new Date(iso).toISOString();

export const MOCK_TRANSACTIONS: Transaction[] = [
  { $id: "tx_f1", userId: "user_founder_001", type: "credit", amount: 50000, description: "Added funds to wallet via Paystack", status: "completed", reference: "tiqra_mock_ref_5", balanceAfter: 25000, createdAt: at("2026-04-08T10:30:00") },
  { $id: "tx_f2", userId: "user_founder_001", type: "escrow", amount: 25000, description: "AI resume builder", status: "completed", balanceAfter: 0, createdAt: at("2026-04-06T11:30:00") },
  { $id: "tx_f3", userId: "user_founder_001", type: "escrow", amount: 50000, description: "Campus Swap", status: "completed", balanceAfter: 25000, createdAt: at("2026-04-04T11:30:00") },
  { $id: "tx_f4", userId: "user_founder_001", type: "credit", amount: 100000, description: "Added funds to wallet via Paystack", status: "completed", reference: "tiqra_mock_ref_4", balanceAfter: 75000, createdAt: at("2026-04-02T10:30:00") },
  { $id: "tx_e1", userId: "user_earner_001", type: "credit", amount: 300, description: "Reward: Coffee buying behaviour", status: "completed", createdAt: at("2026-04-02T10:30:00") },
  { $id: "tx_e2", userId: "user_earner_001", type: "credit", amount: 300, description: "Reward: Mobile banking habits", status: "completed", createdAt: at("2026-04-03T10:30:00") },
  { $id: "tx_e3", userId: "user_earner_001", type: "credit", amount: 300, description: "Reward: Online grocery preference", status: "completed", createdAt: at("2026-04-04T10:30:00") },
  { $id: "tx_e4", userId: "user_earner_001", type: "credit", amount: 300, description: "Reward: Fitness app habits", status: "completed", createdAt: at("2026-04-05T10:30:00") },
  { $id: "tx_f5", userId: "user_founder_001", type: "escrow", amount: 25000, description: "StudyBuddy", status: "completed", balanceAfter: 0, createdAt: at("2026-03-24T11:30:00") },
];


type Q = [string, Question["type"], string[]?];

function questions(list: Q[]): Question[] {
  return list.map(([text, type, options], i) => ({ id: `q_${i + 1}`, text, type, options, required: true, order: i + 1 }));
}

/** Truth Layer attention check, slotted into every seeded survey. */
const HONEYPOT: Question = {
  id: "q_check",
  text: "For quality control, please select 'Agree' to continue.",
  type: "multiple_choice",
  options: ["Disagree", "Neutral", "Agree"],
  isHoneypot: true,
  honeypotAnswer: "Agree",
  required: true,
  order: 0,
};

function withCheck(qs: Question[], at = 3): Question[] {
  const out = [...qs];
  out.splice(at, 0, HONEYPOT);
  return out.map((q, i) => ({ ...q, order: i + 1 }));
}

const BANKING = withCheck(
  questions([
    ["How often do you use mobile banking app?", "multiple_choice", ["Daily", "A few times a week", "Weekly", "Rarely"]],
    ["How satisfied are you with your current bank?", "scale"],
    ["What feature matters most to you?", "multiple_choice", ["Speed", "Security", "Rewards", "Simplicity"]],
    ["What would make a banking app feel premium to you?", "short_text"],
    ["Which best describes your ideal banking app?", "multiple_choice", ["Minimal", "Feature-Rich", "Social", "Gamified"]],
    ["Have you switched banks in the last two years?", "yes_no"],
    ["How much do you trust app-only banks?", "scale"],
    ["How do you usually send money to friends?", "multiple_choice", ["Bank transfer", "USSD", "Mobile wallet", "Cash"]],
    ["Would you pay a monthly fee for premium banking features?", "yes_no"],
    ["What is the most annoying thing about your banking app today?", "short_text"],
  ])
);

const GENERIC = withCheck(
  questions([
    ["How often do you face this problem?", "multiple_choice", ["Daily", "A few times a week", "Rarely", "Never"]],
    ["How frustrating is the way you deal with it today?", "scale"],
    ["Do you currently use any tool or app for this?", "yes_no"],
    ["What is the biggest challenge with your current option?", "short_text"],
    ["How useful would a new solution be to you?", "scale"],
    ["Would you pay for a solution like this?", "yes_no"],
    ["How much would you be willing to pay per month?", "multiple_choice", ["Nothing", "Under ₦1,000", "₦1,000 – ₦3,000", "Above ₦3,000"]],
    ["How likely are you to keep using it after the first month?", "scale"],
    ["Would you recommend a tool like this to a friend?", "yes_no"],
    ["What would stop you from using a tool like this?", "short_text"],
  ])
);

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
  const qs = extra.questions ?? GENERIC;
  const payoutPerResponse = qs.filter((q) => !q.isHoneypot).length * 30;
  const payout = payoutPerResponse * required;
  return {
    $id: id,
    title,
    description: summary,
    summary,
    creatorId: "user_founder_001",
    status,
    questions: qs,
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
  // Other founders' live surveys, shown to earners.
  seedSurvey("survey_grocery", "Online grocery preference", "How people shop for groceries online", "live", 100, 41, { creatorId: "user_founder_002" }),
  seedSurvey("survey_banking", "Mobile banking habit", "Everyday mobile banking behaviour", "live", 80, 12, { creatorId: "user_founder_002", questions: BANKING }),
  seedSurvey("survey_streaming", "Streaming subscription pricing", "What people pay for streaming", "live", 60, 30, { creatorId: "user_founder_002" }),
  seedSurvey("survey_travel", "Travel booking experience", "Booking flights and hotels in Nigeria", "live", 50, 9, { creatorId: "user_founder_002", questions: BANKING }),
  seedSurvey("survey_hostel", "Hostel balloting", "Fairer hostel allocation for students", "live", 120, 77, { creatorId: "user_founder_002" }),
  seedSurvey("survey_diabetes", "Meal plan generator for diabetes", "Generic meal plans don't account for medical needs", "draft", 50, 0),
];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { $id: "pm_card_1", userId: "user_founder_001", kind: "card", provider: "Mastercard", last4: "4242", holderName: "Haleemah Abdulazeez", expiry: "09/27", isDefault: true, createdAt: at("2026-03-01T09:00:00") },
  { $id: "pm_bank_1", userId: "user_earner_001", kind: "bank", provider: "GTBank", last4: "6789", holderName: "Haleemah Abdulazeez", isDefault: true, createdAt: at("2026-03-01T09:00:00") },
  { $id: "pm_bank_2", userId: "user_earner_001", kind: "bank", provider: "Opay", last4: "3004", holderName: "Haleemah Abdulazeez", isDefault: false, createdAt: at("2026-03-02T09:00:00") },
];

// Earner history: surveys already answered and paid out.
export const MOCK_RESPONSES: Response[] = ["survey_coffee", "survey_banking_old", "survey_grocery_old", "survey_fitness"].map((surveyId, i) => ({
  $id: `resp_seed_${i}`,
  surveyId,
  respondentId: "user_earner_001",
  answers: [],
  validatedByTruthLayer: true,
  flagged: false,
  completedAt: at(`2026-04-0${i + 2}T10:30:00`),
  timeTaken: 240,
}));

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
  paymentMethods: [...MOCK_PAYMENT_METHODS],
  ideas: [...MOCK_IDEAS],
  sessions: [] as { userId: string; sessionId: string; token: string }[],
};
