import { describe, expect, it } from "vitest";
import { Db, Filters, newId } from "./db";
import { availableSurveys, bootstrapAccount, createSurvey, Ctx, openSurvey, submitResponse } from "./handlers";
import { stubProvider } from "../ai/stub";
import { EMPTY_INTAKE } from "../survey";
import { Survey, User, Wallet } from "../types";

/* eslint-disable @typescript-eslint/no-explicit-any */
function memoryDb(): Db & { all: Record<string, any[]> } {
  // Loosely typed in-memory store for tests.
  const all: Record<string, any[]> = {};
  const t = (c: string) => (all[c] ??= []);
  const match = (d: any, f: Filters) => Object.entries(f).every(([k, v]) => d[k] === v);
  const db: any = {
    all,
    list: async (c: string, f: Filters = {}) => t(c).filter((d) => match(d, f)).map((d) => structuredClone(d)),
    get: async (c: string, id: string) => structuredClone(t(c).find((d) => d.$id === id) ?? null),
    create: async (c: string, data: any, id?: string) => {
      const doc = { ...structuredClone(data), $id: id ?? newId() };
      t(c).push(doc);
      return structuredClone(doc);
    },
    update: async (c: string, id: string, data: any) => {
      const doc = t(c).find((d) => d.$id === id);
      Object.assign(doc, structuredClone(data));
      return structuredClone(doc);
    },
    remove: async (c: string, id: string) => {
      all[c] = t(c).filter((d) => d.$id !== id);
    },
  };
  return db;
}

const ctx = (db: Db, userId: string): Ctx => ({ db, ai: stubProvider, userId, account: { name: userId, email: `${userId}@x.com` } });

async function setup() {
  const db = memoryDb();
  await bootstrapAccount(ctx(db, "founder"), { role: "founder" });
  const fw = (await db.list<Wallet>("wallets", { userId: "founder" }))[0];
  await db.update("wallets", fw.$id, { balance: 100000 });
  const questions = await stubProvider.generateQuestions({ ...EMPTY_INTAKE, problem: "p", audience: "students", solution: "an app" });
  const survey = await createSurvey(ctx(db, "founder"), { intake: { ...EMPTY_INTAKE, solution: "A study app" }, questions, respondents: 50 });
  return { db, survey, questions };
}

async function earner(db: Db, id: string) {
  await bootstrapAccount(ctx(db, id), { role: "earner" });
  await db.update("users", id, {
    demographics: { gender: "Male", occupation: "Student", birthMonth: "2000-01", country: "Nigeria", interests: [], verifiedTags: [] },
  });
}

const goodAnswers = (s: Survey) =>
  s.questions.map((q) => ({
    questionId: q.id,
    timeTaken: 6000,
    value: q.isHoneypot ? "Agree" : q.type === "scale" ? 4 : q.type === "yes_no" ? (q.reverseOf ? "No" : "Yes") : q.options?.[0] ?? "A thoughtful answer here",
  }));

describe("createSurvey", () => {
  it("prices per spec, escrows the money and adds the attention check", async () => {
    const { db, survey, questions } = await setup();
    expect(questions).toHaveLength(12);
    expect(survey.payoutPerResponse).toBe(360);
    expect(survey.totalCost).toBe(Math.round(360 * 50 * 1.15));
    expect(survey.questions.filter((q) => q.isHoneypot)).toHaveLength(1);
    const w = (await db.list<Wallet>("wallets", { userId: "founder" }))[0];
    expect(w.balance).toBe(100000 - survey.totalCost);
  });
  it("refuses when the wallet is short", async () => {
    const db = memoryDb();
    await bootstrapAccount(ctx(db, "f2"), { role: "founder" });
    const questions = await stubProvider.generateQuestions(EMPTY_INTAKE);
    await expect(createSurvey(ctx(db, "f2"), { intake: EMPTY_INTAKE, questions, respondents: 50 })).rejects.toThrow("Insufficient");
  });
});

describe("answering", () => {
  it("hides own surveys and blocks earners without a profile", async () => {
    const { db, survey } = await setup();
    expect((await availableSurveys(ctx(db, "founder"))).surveys).toHaveLength(0);
    await bootstrapAccount(ctx(db, "newbie"), { role: "earner" });
    await expect(openSurvey(ctx(db, "newbie"), { surveyId: survey.$id })).rejects.toThrow("profile");
  });

  it("accepts once, then locks; pays into pending", async () => {
    const { db, survey } = await setup();
    await earner(db, "e1");
    const res = await submitResponse(ctx(db, "e1"), { surveyId: survey.$id, answers: goodAnswers(survey) });
    expect(res).toMatchObject({ accepted: true, reward: 360 });
    await expect(submitResponse(ctx(db, "e1"), { surveyId: survey.$id, answers: goodAnswers(survey) })).rejects.toThrow("already");
    const w = (await db.list<Wallet>("wallets", { userId: "e1" }))[0];
    expect(w.pendingBalance).toBe(360);
  });

  it("rejects a failed attention check without pay and lowers reliability", async () => {
    const { db, survey } = await setup();
    await earner(db, "e2");
    const answers = goodAnswers(survey).map((a) => (a.questionId === "q_check" ? { ...a, value: "Disagree" } : a));
    const res = await submitResponse(ctx(db, "e2"), { surveyId: survey.$id, answers });
    expect(res.accepted).toBe(false);
    expect((await db.get<User>("users", "e2"))!.reliabilityScore).toBe(80);
    expect((await db.get<Survey>("surveys", survey.$id))!.respondentsCompleted).toBe(0);
  });

  it("releases payouts and sets the verdict when the survey fills", async () => {
    const { db, survey } = await setup();
    await db.update("surveys", survey.$id, { respondentsRequired: 2 });
    for (const id of ["a1", "a2"]) {
      await earner(db, id);
      const s = (await db.get<Survey>("surveys", survey.$id))!;
      await submitResponse(ctx(db, id), { surveyId: s.$id, answers: goodAnswers(s) });
    }
    const done = (await db.get<Survey>("surveys", survey.$id))!;
    expect(done.status).toBe("completed");
    expect(done.verdict).toBeDefined();
    const w = (await db.list<Wallet>("wallets", { userId: "a1" }))[0];
    expect(w).toMatchObject({ balance: 360, pendingBalance: 0, totalEarned: 360 });
  });
});
