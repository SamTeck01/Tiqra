import { describe, expect, it } from "vitest";
import { evaluateResponse, updateReliability } from "./truthLayer";
import { ageFrom, eligibility, matchSurveys } from "./matching";
import { analyzeSurvey } from "./analytics";
import { gateFor, gradeGate } from "./gate";
import { withAttentionCheck } from "../survey";
import { Question, Response, Survey, User } from "../types";

const qs: Question[] = withAttentionCheck([
  { id: "a", text: "How often?", type: "multiple_choice", options: ["Daily", "Weekly", "Never"], dimension: "problem", required: true, order: 1 },
  { id: "b", text: "Rate it", type: "scale", dimension: "problem", required: true, order: 2 },
  { id: "c", text: "Would you switch?", type: "yes_no", dimension: "behaviour", required: true, order: 3 },
  { id: "d", text: "Would you pay?", type: "yes_no", dimension: "willingness", required: true, order: 4 },
  { id: "e", text: "Keep using?", type: "scale", dimension: "repeat", required: true, order: 5 },
  { id: "f", text: "Rather keep things as they are?", type: "yes_no", reverseOf: "c", required: true, order: 6 },
]);

const answer = (values: Record<string, string | number>, ms = 5000) =>
  qs.map((q) => ({ questionId: q.id, value: q.isHoneypot ? values.check ?? "Agree" : values[q.id], timeTaken: ms }));

const survey = (over: Partial<Survey> = {}): Survey => ({
  $id: "s1", title: "Test", description: "", creatorId: "founder", status: "live", questions: qs,
  targetAudience: { country: "Nigeria", ageRange: { min: 18, max: 40 } }, respondentsRequired: 4, respondentsCompleted: 0,
  payoutPerResponse: 180, platformFee: 0, totalCost: 0, escrowAmount: 0, aiReportGenerated: false, createdAt: "2026-04-01T00:00:00Z", ...over,
});

const user = (over: Partial<User> = {}): User => ({
  $id: "earner", name: "E", email: "e@x.com", role: "earner", walletBalance: 0, reliabilityScore: 100, createdAt: "",
  demographics: { gender: "Female", occupation: "Student", birthMonth: "2001-05", interests: ["Technology"], verifiedTags: ["Technology"] },
  ...over,
});

describe("Truth Layer", () => {
  it("accepts a careful response", () => {
    const r = evaluateResponse(qs, answer({ a: "Daily", b: 4, c: "Yes", d: "Yes", e: 5, f: "No" }));
    expect(r).toEqual({ valid: true, score: 100, flags: [] });
  });
  it("rejects a failed attention check", () => {
    const r = evaluateResponse(qs, answer({ a: "Daily", b: 4, c: "Yes", d: "Yes", e: 5, f: "No", check: "Disagree" }));
    expect(r.valid).toBe(false);
    expect(r.score).toBe(0);
  });
  it("flags contradictions and rushing together as invalid", () => {
    const r = evaluateResponse(qs, answer({ a: "Daily", b: 4, c: "Yes", d: "Yes", e: 5, f: "Yes" }, 500));
    expect(r.flags).toEqual(expect.arrayContaining(["Contradictory answers", "Completed too quickly"]));
    expect(r.valid).toBe(false);
  });
  it("moves reliability slowly", () => {
    expect(updateReliability(100, 0)).toBe(80);
    expect(updateReliability(50, 100)).toBe(60);
  });
});

describe("Demographic matching", () => {
  const now = new Date("2026-10-01");
  it("computes age from birth month", () => {
    expect(ageFrom("2001-05", now)).toBe(25);
    expect(ageFrom("2001-12", now)).toBe(24);
  });
  it("blocks own surveys, wrong age and missing profile", () => {
    expect(eligibility(survey({ creatorId: "earner" }), user(), now).ok).toBe(false);
    expect(eligibility(survey({ targetAudience: { country: "Nigeria", ageRange: { min: 30, max: 40 } } }), user(), now).ok).toBe(false);
    expect(eligibility(survey(), user({ demographics: undefined }), now).ok).toBe(false);
    expect(eligibility(survey(), user(), now).ok).toBe(true);
  });
  it("ranks verified-interest surveys first and hides answered ones", () => {
    const general = survey({ $id: "g", payoutPerResponse: 900 });
    const tech = survey({ $id: "t", targetAudience: { country: "Nigeria", ageRange: { min: 18, max: 40 }, interests: ["Technology"] } });
    const sport = survey({ $id: "s", targetAudience: { country: "Nigeria", ageRange: { min: 18, max: 40 }, interests: ["Sport"] } });
    expect(matchSurveys([general, tech, sport], user(), new Set(), now).map((s) => s.$id)).toEqual(["t", "g"]);
    expect(matchSurveys([general, tech], user(), new Set(["t"]), now).map((s) => s.$id)).toEqual(["g"]);
  });
});

describe("Analytics", () => {
  const resp = (i: number, values: Record<string, string | number>, valid = true): Response => ({
    $id: `r${i}`, surveyId: "s1", respondentId: `u${i}`, answers: answer(values), validatedByTruthLayer: valid, flagged: !valid,
    completedAt: `2026-04-01T0${i}:00:00Z`, timeTaken: 60,
  });
  it("gives GO for strong positive answers", () => {
    const rs = [1, 2, 3, 4].map((i) => resp(i, { a: "Daily", b: 5, c: "Yes", d: "Yes", e: 5, f: "No" }));
    const a = analyzeSurvey(survey({ respondentsCompleted: 4 }), rs);
    expect(a.verdict).toBe("go");
    expect(a.validationScore).toBe(100);
    expect(a.confidence).toBe(100);
  });
  it("gives KILL when nobody will pay and ignores flagged responses", () => {
    const rs = [1, 2, 3].map((i) => resp(i, { a: "Daily", b: 3, c: "No", d: "No", e: 2, f: "Yes" }));
    rs.push(resp(4, { a: "Daily", b: 5, c: "Yes", d: "Yes", e: 5, f: "No" }, false));
    const a = analyzeSurvey(survey({ respondentsCompleted: 3 }), rs);
    expect(a.validResponses).toBe(3);
    expect(a.dimensions.find((d) => d.key === "willingness")!.score).toBe(0);
    expect(a.verdict).toBe("kill");
  });
});

describe("Interest gate", () => {
  it("serves questions without answers and grades them", () => {
    const g = gateFor(["Sport"], 0);
    expect(g).toHaveLength(2);
    expect(g[0]).not.toHaveProperty("answer");
    expect(gradeGate([{ id: "spo1", value: "11", ms: 4000 }, { id: "spo2", value: "Super Eagles", ms: 4000 }])).toEqual(["Sport"]);
    expect(gradeGate([{ id: "spo1", value: "11", ms: 40000 }, { id: "spo2", value: "Black Stars", ms: 4000 }])).toEqual([]);
  });
});
