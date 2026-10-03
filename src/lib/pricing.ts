// Survey pricing rules from the Tiqra product spec (Notion, sections 6 & 13).

export const PAY_PER_QUESTION = 30;
export const MIN_RESPONDENTS = 50;
export const MIN_QUESTIONS = 10;
export const MAX_QUESTIONS = 30;
export const PLATFORM_FEE = { free: 0.15, pro: 0.1 } as const;

export type FounderPlan = keyof typeof PLATFORM_FEE;

export interface SurveyCost {
  payoutPerResponse: number;
  respondentPayout: number;
  feeRate: number;
  platformFee: number;
  total: number;
}

export function calculateSurveyCost(
  questionCount: number,
  respondents: number,
  plan: FounderPlan = "free"
): SurveyCost {
  const payoutPerResponse = questionCount * PAY_PER_QUESTION;
  const respondentPayout = payoutPerResponse * respondents;
  const feeRate = PLATFORM_FEE[plan];
  const platformFee = Math.round(respondentPayout * feeRate);
  return { payoutPerResponse, respondentPayout, feeRate, platformFee, total: respondentPayout + platformFee };
}

/** Rough completion estimate shown in the setup summary. */
export function estimateCompletion(respondents: number): string {
  if (respondents <= 100) return "1-2 days";
  if (respondents <= 300) return "2-4 days";
  return "4-7 days";
}

/** About 20 seconds per tap-first question. */
export function estimateMinutes(questionCount: number): string {
  const mins = Math.max(1, Math.round((questionCount * 20) / 60));
  return `${mins}-${mins + 1} minutes`;
}
