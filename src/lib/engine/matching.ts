// Demographic Engine: which surveys a respondent may see (spec section 15).
import { Survey, User } from "../types";

export const DEFAULT_MIN_RELIABILITY = 40;

export function ageFrom(birthMonth: string | undefined, now = new Date()): number | null {
  if (!birthMonth || !/^\d{4}-\d{2}$/.test(birthMonth)) return null;
  const [y, m] = birthMonth.split("-").map(Number);
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m) age -= 1;
  return age;
}

export function eligibility(survey: Survey, user: User, now = new Date()): { ok: boolean; reason?: string } {
  if (survey.creatorId === user.$id) return { ok: false, reason: "You can't answer your own survey" };
  if (survey.status !== "live") return { ok: false, reason: "This survey is closed" };
  if (survey.respondentsCompleted >= survey.respondentsRequired) return { ok: false, reason: "This survey is full" };
  const d = user.demographics;
  if (!d) return { ok: false, reason: "Complete your profile first" };
  const t = survey.targetAudience;
  if (t.country && (d.country ?? "Nigeria") !== t.country) return { ok: false, reason: "Not available in your country" };
  const age = ageFrom(d.birthMonth, now);
  if (age === null || age < t.ageRange.min || age > t.ageRange.max) return { ok: false, reason: "Outside the target age range" };
  if ((user.reliabilityScore ?? 100) < (t.minReliability ?? DEFAULT_MIN_RELIABILITY)) return { ok: false, reason: "Reliability too low" };
  if (t.interests?.length && !t.interests.some((i) => d.interests.includes(i))) return { ok: false, reason: "Outside the target interests" };
  return { ok: true };
}

/** Matching surveys, best fits first: verified interest overlap, then reward. */
export function matchSurveys(surveys: Survey[], user: User, answeredIds: Set<string>, now = new Date()): Survey[] {
  const verified = new Set(user.demographics?.verifiedTags ?? []);
  const fit = (s: Survey) => (s.targetAudience.interests ?? []).filter((i) => verified.has(i)).length;
  return surveys
    .filter((s) => !answeredIds.has(s.$id) && eligibility(s, user, now).ok)
    .sort((a, b) => fit(b) - fit(a) || b.payoutPerResponse - a.payoutPerResponse);
}
