// Tiqra's business rules. Every write that touches money, responses or trust
// happens here, never in the browser. Runs inside /api routes with the Appwrite
// server key, or against the demo data in mock mode.
import { COLLECTIONS } from "../appwrite.config";
import { analyzeSurvey, SurveyAnalytics } from "../engine/analytics";
import { gateFor, gradeGate, PublicGateQuestion } from "../engine/gate";
import { eligibility, matchSurveys } from "../engine/matching";
import { evaluateResponse, SubmittedAnswer, updateReliability } from "../engine/truthLayer";
import { calculateSurveyCost, MAX_QUESTIONS, MIN_QUESTIONS, MIN_RESPONDENTS } from "../pricing";
import { paidQuestionCount, surveyTitleFrom, withAttentionCheck } from "../survey";
import type { AIProvider, ChatMessage, FeasibilityNarrative, ReportNarrative } from "../ai/types";
import { IdeaIntake, Question, Response, Survey, User, UserDemographics, UserRole, Wallet } from "../types";
import { Db } from "./db";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export interface Ctx {
  db: Db;
  ai: AIProvider;
  /** The signed-in user's account id (verified by the caller). */
  userId: string;
  /** Account name and email from the auth provider, used when bootstrapping. */
  account?: { name: string; email: string };
}

const now = () => new Date().toISOString();

async function requireUser(ctx: Ctx): Promise<User> {
  const user = await ctx.db.get<User>(COLLECTIONS.USERS, ctx.userId);
  if (!user) throw new HttpError(404, "Account not set up");
  return user;
}

async function walletOf(db: Db, userId: string): Promise<Wallet> {
  const [wallet] = await db.list<Wallet>(COLLECTIONS.WALLETS, { userId });
  if (!wallet) throw new HttpError(404, "Wallet not found");
  return wallet;
}

async function ownedSurvey(ctx: Ctx, id: string): Promise<Survey> {
  const survey = await ctx.db.get<Survey>(COLLECTIONS.SURVEYS, id);
  if (!survey) throw new HttpError(404, "Survey not found");
  if (survey.creatorId !== ctx.userId) throw new HttpError(403, "Not your survey");
  return survey;
}

// ---------------------------------------------------------------------------
// Account

/** Creates the user profile and wallet the first time someone signs in. */
export async function bootstrapAccount(ctx: Ctx, input: { role: UserRole; phone?: string; name?: string }) {
  const existing = await ctx.db.get<User>(COLLECTIONS.USERS, ctx.userId);
  if (existing) return existing;
  const user = await ctx.db.create<User>(
    COLLECTIONS.USERS,
    {
      name: input.name || ctx.account?.name || "",
      email: ctx.account?.email ?? "",
      phone: input.phone ?? "",
      role: input.role === "earner" ? "earner" : "founder",
      walletBalance: 0,
      reliabilityScore: 100,
      createdAt: now(),
    },
    ctx.userId,
    ctx.userId
  );
  await ctx.db.create(COLLECTIONS.WALLETS, { userId: ctx.userId, balance: 0, pendingBalance: 0, totalEarned: 0, totalSpent: 0 }, undefined, ctx.userId);
  return user;
}

/** Only these profile fields can be changed by the user. */
export async function updateProfile(ctx: Ctx, input: { name?: string; role?: UserRole; notificationPrefs?: Record<string, boolean> }) {
  await requireUser(ctx);
  const patch: Record<string, unknown> = {};
  if (typeof input.name === "string" && input.name.trim()) patch.name = input.name.trim().slice(0, 80);
  if (input.role === "founder" || input.role === "earner") patch.role = input.role;
  if (input.notificationPrefs && typeof input.notificationPrefs === "object") {
    patch.notificationPrefs = Object.fromEntries(Object.entries(input.notificationPrefs).map(([k, v]) => [k, !!v]));
  }
  return ctx.db.update<User>(COLLECTIONS.USERS, ctx.userId, patch);
}

export async function getGate(ctx: Ctx, input: { interests: string[] }): Promise<PublicGateQuestion[]> {
  return gateFor((input.interests ?? []).slice(0, 3));
}

/** Saves demographics; the timed gate decides which interests are verified. */
export async function completeProfile(
  ctx: Ctx,
  input: {
    name: string;
    demographics: Omit<UserDemographics, "verifiedTags">;
    gateAnswers: { id: string; value: string; ms: number }[];
  }
) {
  await requireUser(ctx);
  const d = input.demographics;
  if (!d?.gender || !d.occupation || !/^\d{4}-\d{2}$/.test(d.birthMonth ?? "")) throw new HttpError(400, "Basic information is incomplete");
  const interests = (d.interests ?? []).slice(0, 3);
  const verified = gradeGate(input.gateAnswers ?? []).filter((i) => interests.includes(i));
  return ctx.db.update<User>(COLLECTIONS.USERS, ctx.userId, {
    name: (input.name || "").trim().slice(0, 80),
    demographics: { ...d, country: d.country || "Nigeria", interests, verifiedTags: verified },
  });
}

// ---------------------------------------------------------------------------
// Founder: surveys

export async function createSurvey(
  ctx: Ctx,
  input: { intake: IdeaIntake; questions: Question[]; respondents: number; ageRange?: { min: number; max: number }; interests?: string[] }
): Promise<Survey> {
  await requireUser(ctx);
  const questions = (input.questions ?? []).filter((q) => q?.text?.trim());
  const paid = paidQuestionCount(questions);
  if (paid < MIN_QUESTIONS || paid > MAX_QUESTIONS) throw new HttpError(400, `Surveys need ${MIN_QUESTIONS}-${MAX_QUESTIONS} questions`);
  const respondents = Math.floor(Number(input.respondents));
  if (!(respondents >= MIN_RESPONDENTS)) throw new HttpError(400, `Minimum of ${MIN_RESPONDENTS} respondents`);

  const cost = calculateSurveyCost(paid, respondents);
  const wallet = await walletOf(ctx.db, ctx.userId);
  if (wallet.balance < cost.total) throw new HttpError(402, "Insufficient wallet balance");

  const title = surveyTitleFrom(input.intake);
  const balance = wallet.balance - cost.total;
  await ctx.db.update(COLLECTIONS.WALLETS, wallet.$id, { balance, totalSpent: (wallet.totalSpent ?? 0) + cost.total });
  await ctx.db.create(COLLECTIONS.TRANSACTIONS, {
    userId: ctx.userId,
    type: "escrow",
    amount: cost.total,
    description: title,
    status: "completed",
    balanceAfter: balance,
    createdAt: now(),
  }, undefined, ctx.userId);

  const age = input.ageRange && input.ageRange.min >= 16 && input.ageRange.max <= 99 ? input.ageRange : { min: 18, max: 65 };
  return ctx.db.create<Survey>(COLLECTIONS.SURVEYS, {
    title,
    description: input.intake.problem,
    summary: input.intake.solution || input.intake.problem,
    intake: input.intake,
    creatorId: ctx.userId,
    status: "live",
    questions: withAttentionCheck(questions.map((q, i) => ({ ...q, id: q.id || `q${i + 1}`, required: true }))),
    targetAudience: { country: "Nigeria", ageRange: age, interests: (input.interests ?? []).slice(0, 3) },
    respondentsRequired: respondents,
    respondentsCompleted: 0,
    payoutPerResponse: cost.payoutPerResponse,
    platformFee: cost.platformFee,
    totalCost: cost.total,
    escrowAmount: cost.total,
    aiReportGenerated: false,
    createdAt: now(),
  });
}

export async function surveyAnalytics(ctx: Ctx, input: { surveyId: string }): Promise<{ survey: Survey; analytics: SurveyAnalytics }> {
  const survey = await ownedSurvey(ctx, input.surveyId);
  const responses = await ctx.db.list<Response>(COLLECTIONS.RESPONSES, { surveyId: survey.$id });
  return { survey, analytics: analyzeSurvey(survey, responses) };
}

export async function surveyReport(ctx: Ctx, input: { surveyId: string }) {
  const { survey, analytics } = await surveyAnalytics(ctx, input);
  const narrative: ReportNarrative = await ctx.ai.writeReport({ survey, analytics });
  return { survey, analytics, narrative, aiConnected: ctx.ai.isReal };
}

export async function feasibilityReport(ctx: Ctx, input: { surveyId: string }) {
  const { survey, analytics } = await surveyAnalytics(ctx, input);
  const feasibility: FeasibilityNarrative | null = await ctx.ai.writeFeasibility({ survey, analytics });
  return { survey, analytics, feasibility, aiConnected: ctx.ai.isReal };
}

export async function dashboardChat(ctx: Ctx, input: { surveyId: string; history: ChatMessage[] }) {
  const { survey, analytics } = await surveyAnalytics(ctx, input);
  const history = (input.history ?? []).slice(-12).map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content).slice(0, 2000) })) as ChatMessage[];
  return { reply: await ctx.ai.chat({ survey, analytics }, history) };
}

// ---------------------------------------------------------------------------
// Earner: answering

export async function availableSurveys(ctx: Ctx) {
  const user = await requireUser(ctx);
  const [surveys, mine] = await Promise.all([
    ctx.db.list<Survey>(COLLECTIONS.SURVEYS, { status: "live" }),
    ctx.db.list<Response>(COLLECTIONS.RESPONSES, { respondentId: ctx.userId }),
  ]);
  return {
    surveys: matchSurveys(surveys, user, new Set(mine.map((r) => r.surveyId))),
    completed: mine.filter((r) => r.validatedByTruthLayer).length,
  };
}

/** The survey to answer, if this user may answer it. */
export async function openSurvey(ctx: Ctx, input: { surveyId: string }) {
  const user = await requireUser(ctx);
  const survey = await ctx.db.get<Survey>(COLLECTIONS.SURVEYS, input.surveyId);
  if (!survey) throw new HttpError(404, "Survey not found");
  const ok = eligibility(survey, user);
  if (!ok.ok) throw new HttpError(403, ok.reason!);
  const answered = await ctx.db.list<Response>(COLLECTIONS.RESPONSES, { surveyId: survey.$id, respondentId: ctx.userId });
  if (answered.length) throw new HttpError(409, "You have already answered this survey");
  return survey;
}

export async function submitResponse(ctx: Ctx, input: { surveyId: string; answers: SubmittedAnswer[] }) {
  const user = await requireUser(ctx);
  const survey = await ctx.db.get<Survey>(COLLECTIONS.SURVEYS, input.surveyId);
  if (!survey) throw new HttpError(404, "Survey not found");
  const ok = eligibility(survey, user);
  if (!ok.ok) throw new HttpError(403, ok.reason!);
  // Single submission lock.
  const previous = await ctx.db.list<Response>(COLLECTIONS.RESPONSES, { surveyId: survey.$id, respondentId: ctx.userId });
  if (previous.length) throw new HttpError(409, "You have already answered this survey");

  const answers = (input.answers ?? [])
    .filter((a) => survey.questions.some((q) => q.id === a.questionId))
    .map((a) => ({ questionId: a.questionId, value: typeof a.value === "number" ? a.value : String(a.value ?? "").slice(0, 2000), timeTaken: Math.max(0, Number(a.timeTaken) || 0) }));
  const evaluation = evaluateResponse(survey.questions, answers);
  const totalSeconds = Math.round(answers.reduce((s, a) => s + a.timeTaken, 0) / 1000);

  await ctx.db.create(COLLECTIONS.RESPONSES, {
    surveyId: survey.$id,
    respondentId: ctx.userId,
    answers,
    validatedByTruthLayer: evaluation.valid,
    flagged: !evaluation.valid,
    flagReason: evaluation.flags.join("; "),
    qualityScore: evaluation.score,
    completedAt: now(),
    timeTaken: totalSeconds,
  }, undefined, ctx.userId);
  await ctx.db.update(COLLECTIONS.USERS, ctx.userId, { reliabilityScore: updateReliability(user.reliabilityScore ?? 100, evaluation.score) });

  if (!evaluation.valid) return { accepted: false, flags: evaluation.flags, reward: 0 };

  const completed = survey.respondentsCompleted + 1;
  const finished = completed >= survey.respondentsRequired;
  let verdictFields = {};
  if (finished) {
    const all = await ctx.db.list<Response>(COLLECTIONS.RESPONSES, { surveyId: survey.$id });
    const result = analyzeSurvey({ ...survey, respondentsCompleted: completed }, all);
    verdictFields = { status: "completed", aiReportGenerated: true, verdict: result.verdict, confidence: result.confidence };
  }
  await ctx.db.update(COLLECTIONS.SURVEYS, survey.$id, { respondentsCompleted: completed, ...verdictFields });
  const wallet = await walletOf(ctx.db, ctx.userId);
  await ctx.db.update(COLLECTIONS.WALLETS, wallet.$id, { pendingBalance: wallet.pendingBalance + survey.payoutPerResponse });
  if (finished) await releasePayouts(ctx.db, { ...survey, respondentsCompleted: completed });
  return { accepted: true, flags: evaluation.flags, reward: survey.payoutPerResponse };
}

/** When a survey fills, pending rewards for every validated response move to the respondents' balances. */
async function releasePayouts(db: Db, survey: Survey) {
  const responses = await db.list<Response>(COLLECTIONS.RESPONSES, { surveyId: survey.$id });
  for (const r of responses.filter((x) => x.validatedByTruthLayer)) {
    const wallet = await walletOf(db, r.respondentId).catch(() => null);
    if (!wallet) continue;
    const amount = survey.payoutPerResponse;
    const balance = wallet.balance + amount;
    await db.update(COLLECTIONS.WALLETS, wallet.$id, {
      balance,
      pendingBalance: Math.max(0, wallet.pendingBalance - amount),
      totalEarned: wallet.totalEarned + amount,
    });
    await db.create(COLLECTIONS.TRANSACTIONS, {
      userId: r.respondentId,
      type: "credit",
      amount,
      description: `Reward: ${survey.title}`,
      status: "completed",
      balanceAfter: balance,
      createdAt: now(),
    }, undefined, r.respondentId);
  }
}

// ---------------------------------------------------------------------------
// AI helpers (no data access)

export const structureIdea = (ctx: Ctx, input: { transcript: string }) => ctx.ai.structureIdea(String(input.transcript ?? "").slice(0, 5000));
export const generateQuestions = (ctx: Ctx, input: { intake: IdeaIntake }) => ctx.ai.generateQuestions(input.intake);
export const rewriteQuestion = async (ctx: Ctx, input: { text: string; instruction: string }) => ({
  text: await ctx.ai.rewriteQuestion(String(input.text ?? "").slice(0, 200), String(input.instruction ?? "").slice(0, 300)),
});

export const HANDLERS = {
  bootstrapAccount,
  updateProfile,
  getGate,
  completeProfile,
  createSurvey,
  surveyAnalytics,
  surveyReport,
  feasibilityReport,
  dashboardChat,
  availableSurveys,
  openSurvey,
  submitResponse,
  structureIdea,
  generateQuestions,
  rewriteQuestion,
} as const;

export type HandlerName = keyof typeof HANDLERS;
