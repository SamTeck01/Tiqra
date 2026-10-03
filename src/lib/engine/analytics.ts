// Analytics engine: everything on the live tracking and report pages that can be
// computed from responses without AI.
import { DimensionKey, Question, Response, Survey, Verdict } from "../types";

const NEGATIVE = new Set([
  "no", "never", "rarely", "nothing", "not at all", "dissatisfied", "very dissatisfied",
  "unlikely", "very unlikely", "something else",
]);

export const DIMENSION_LABEL: Record<DimensionKey, string> = {
  problem: "Problem fit",
  behaviour: "User behaviour",
  willingness: "Willingness to pay",
  repeat: "Repeat intent",
};

export interface QuestionStats {
  question: Question;
  answered: number;
  /** 0-100: share of favourable answers (or scaled mean for ratings). */
  sentiment: number | null;
  distribution: { label: string; count: number }[];
  samples: string[];
}

export interface SurveyAnalytics {
  validResponses: number;
  flaggedResponses: number;
  progress: number;
  timeline: { hour: number; responses: number }[];
  questions: QuestionStats[];
  dimensions: { key: DimensionKey; label: string; score: number }[];
  validationScore: number;
  confidence: number;
  verdict: Verdict;
  session: { avgSeconds: number; answeredAvg: number; questionCount: number; dropOff: number; quality: number };
  quotes: string[];
  insights: string[];
  /** Latest verified responses for the activity feed. */
  recent: { id: string; score: number; completedAt: string; answered: number }[];
}

function favourable(q: Question, v: string | number): number | null {
  if (q.type === "scale") return ((Number(v) - 1) / 4) * 100;
  if (q.type === "yes_no") return String(v).toLowerCase() === "yes" ? 100 : 0;
  if (q.type === "multiple_choice") return NEGATIVE.has(String(v).toLowerCase()) ? 0 : 100;
  return null;
}

const round = (n: number) => Math.round(n);

export function analyzeSurvey(survey: Survey, responses: Response[], now = new Date()): SurveyAnalytics {
  const valid = responses.filter((r) => r.validatedByTruthLayer);
  const questions = survey.questions.filter((q) => !q.isHoneypot);

  const stats: QuestionStats[] = questions.map((q) => {
    const values = valid.map((r) => r.answers.find((a) => a.questionId === q.id)?.value).filter((v) => v !== undefined && v !== "");
    const scores = values.map((v) => favourable(q, v as string | number)).filter((s): s is number => s !== null);
    const labels = q.type === "scale" ? ["1", "2", "3", "4", "5"] : q.type === "yes_no" ? ["Yes", "No"] : q.options ?? [];
    return {
      question: q,
      answered: values.length,
      sentiment: scores.length ? round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
      distribution: labels.map((label) => ({ label, count: values.filter((v) => String(v) === label).length })),
      samples: q.type === "short_text" ? [...new Set(values as string[])].slice(0, 5) : [],
    };
  });

  const dimensions = (Object.keys(DIMENSION_LABEL) as DimensionKey[]).map((key) => {
    const s = stats.filter((x) => x.question.dimension === key && x.sentiment !== null).map((x) => x.sentiment!);
    return { key, label: DIMENSION_LABEL[key], score: s.length ? round(s.reduce((a, b) => a + b, 0) / s.length) : 0 };
  });
  const measured = dimensions.filter((d) => stats.some((x) => x.question.dimension === d.key));
  const validationScore = measured.length ? round(measured.reduce((a, d) => a + d.score, 0) / measured.length) : 0;
  const willingness = dimensions.find((d) => d.key === "willingness")!.score;

  // Confidence: the signal, discounted while the sample is still small.
  const sample = Math.min(1, valid.length / Math.max(1, survey.respondentsRequired));
  const confidence = round(validationScore * (0.4 + 0.6 * sample));

  let verdict: Verdict = "pivot";
  if (validationScore >= 65 && willingness >= 55) verdict = "go";
  else if (validationScore < 40 || willingness < 25) verdict = "kill";

  // Cumulative responses in 12-hour buckets since launch.
  const start = new Date(survey.createdAt).getTime();
  const hours = valid.map((r) => (new Date(r.completedAt).getTime() - start) / 3_600_000);
  const span = survey.status === "live" ? Math.min((now.getTime() - start) / 3_600_000, Math.max(72, ...hours)) : Math.max(0, ...hours);
  const lastHour = Math.max(12, Math.ceil(Math.max(span, ...hours) / 12) * 12);
  const timeline = [];
  for (let h = 0; h <= Math.min(lastHour, 24 * 14); h += 12) timeline.push({ hour: h, responses: hours.filter((x) => x <= h).length });

  const answeredCounts = valid.map((r) => r.answers.filter((a) => a.value !== "" && a.value !== undefined).length);
  const quotes = [...new Set(stats.flatMap((s) => s.samples))]
    .filter((t) => t.split(" ").length >= 5)
    .sort((a, b) => b.length - a.length)
    .slice(0, 2);

  const ranked = [...measured].sort((a, b) => b.score - a.score);
  const insights: string[] = [];
  if (ranked.length) {
    insights.push(`${ranked[0].label} is the strongest signal at ${ranked[0].score}%.`);
    const weakest = ranked[ranked.length - 1];
    if (ranked.length > 1) insights.push(`${weakest.label} is the weakest at ${weakest.score}%${weakest.score < 45 ? " and needs attention before you build" : ""}.`);
  }
  if (measured.some((d) => d.key === "willingness"))
    insights.push(`${willingness}% of respondents show willingness to pay${willingness < 40 ? ", below the 40% viability benchmark" : ""}.`);

  return {
    validResponses: valid.length,
    flaggedResponses: responses.length - valid.length,
    progress: round((survey.respondentsCompleted / Math.max(1, survey.respondentsRequired)) * 100),
    timeline,
    questions: stats,
    dimensions,
    validationScore,
    confidence,
    verdict,
    session: {
      avgSeconds: valid.length ? round(valid.reduce((a, r) => a + r.timeTaken, 0) / valid.length) : 0,
      answeredAvg: answeredCounts.length ? Math.round((answeredCounts.reduce((a, b) => a + b, 0) / answeredCounts.length) * 10) / 10 : 0,
      questionCount: survey.questions.length,
      dropOff: responses.length ? round(((responses.length - valid.length) / responses.length) * 100) : 0,
      quality: valid.length ? round(valid.reduce((a, r) => a + (r.qualityScore ?? 100), 0) / valid.length) : 0,
    },
    quotes,
    insights,
    recent: [...valid]
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
      .slice(0, 4)
      .map((r) => ({ id: r.$id, score: r.qualityScore ?? 100, completedAt: r.completedAt, answered: r.answers.length })),
  };
}
