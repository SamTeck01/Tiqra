// Report and live-tracking content for each survey. Until the AI analysis
// service is connected these come from seeded data, keyed by survey id.
import { Survey, Verdict } from "./types";

export interface Dimension {
  key: "problem" | "behaviour" | "willingness" | "repeat";
  label: string;
  score: number;
  note: string;
}

export interface TaggedLine {
  text: string;
  tag: "Audience" | "Pricing" | "Retention";
}

export interface ValidationReport {
  verdict: Verdict;
  confidence: number;
  summary: string;
  validationScore: number;
  dimensions: Dimension[];
  insights: TaggedLine[];
  voices: { quote: string; name: string }[];
  nextSteps: TaggedLine[];
}

export interface FeasibilityReport {
  description: string;
  score: number;
  scoreNote: string;
  survey: { responses: number; problem: number; willing: number; interest: string };
  overview: { label: string; score: number }[];
  benefits: string[];
  cost: { min: number; max: number };
  months: { min: number; max: number };
  resources: string[];
  technical: { label: string; value: string; highlight?: boolean }[];
  risks: { text: string; level: "Low" | "Medium" | "High" }[];
}

export interface LiveStats {
  confidence: number;
  insight: string;
  timeline: { hour: number; responses: number }[];
  session: { label: string; value: string }[];
  sentiments: { question: string; score: number }[];
  activity: { initials: string; score: number; ago: string }[];
}

const NEXT_STEPS: TaggedLine[] = [
  { text: "Define your MVP scope - focus on the core flow first", tag: "Audience" },
  { text: "Launch a waitlist or early access page to capture and warm demand", tag: "Pricing" },
  { text: "Run a pricing A/B test with cohorts at 3,000 and 5,000", tag: "Retention" },
];

const VALIDATION: Record<string, ValidationReport> = {
  survey_artisan: {
    verdict: "go",
    confidence: 84,
    summary:
      "Strong validation across audience fit, behaviour signal and willingness to pay. This idea has the foundation to become a real product",
    validationScore: 75,
    dimensions: [
      { key: "problem", label: "Problem fit", score: 82, note: "Strong problem awareness" },
      { key: "behaviour", label: "User behaviour", score: 74, note: "Clear user intent" },
      { key: "willingness", label: "Willingness to pay", score: 68, note: "Above viability threshold" },
      { key: "repeat", label: "Repeat intent", score: 77, note: "High retention potential" },
    ],
    insights: [
      { text: "Trust signals (verified reviews) outperform catalogue size by 2.3x in driving purchase intent", tag: "Audience" },
      { text: "78% of respondents are willing to pay within your proposed range, above the 60% viability threshold", tag: "Pricing" },
      { text: "Repeat purchase intent is high in the core segment, retention economics look promising", tag: "Retention" },
    ],
    voices: [
      { quote: "I've been looking for exactly this. The price point is fair for the value it saves.", name: "Muhammed Shuaib" },
      { quote: "If I can trust the sellers are real artisans, I'd buy from here every month.", name: "John Doe" },
    ],
    nextSteps: NEXT_STEPS,
  },
  survey_tutoring: {
    verdict: "pivot",
    confidence: 41,
    summary:
      "Genuine demand exists but a key dimension, likely pricing model or target audience, needs rethinking before committing to build",
    validationScore: 55,
    dimensions: [
      { key: "problem", label: "Problem fit", score: 76, note: "Problem is well understood" },
      { key: "behaviour", label: "User behaviour", score: 58, note: "Moderate user intent" },
      { key: "willingness", label: "Willingness to pay", score: 34, note: "Below viability threshold" },
      { key: "repeat", label: "Repeat intent", score: 51, note: "Moderate retention potential" },
    ],
    insights: [
      { text: "Pay-per-session pricing faces strong resistance — subscriptions are clearly preferred by your audience.", tag: "Audience" },
      { text: "Problem awareness scores high at 82%, but willingness to pay at current price is only 34%.", tag: "Pricing" },
      { text: "An adjacent audience (parents) responds 2× more positively; a segment pivot is worth exploring.", tag: "Retention" },
    ],
    voices: [
      { quote: "I'd love this tool but not at that price per session. A flat monthly plan would change everything.", name: "Muhammed Shuaib" },
      { quote: "The problem is real, but I'd want a free trial before committing to any fee.", name: "John Doe" },
    ],
    nextSteps: NEXT_STEPS,
  },
  survey_crypto: {
    verdict: "kill",
    confidence: 21,
    summary:
      "Audience distrust, low willingness to pay, and absence of a behaviour change trigger make this idea unviable in its current form.",
    validationScore: 21,
    dimensions: [
      { key: "problem", label: "Problem fit", score: 44, note: "Weak problem recognition" },
      { key: "behaviour", label: "User behaviour", score: 31, note: "Low switching intent" },
      { key: "willingness", label: "Willingness to pay", score: 12, note: "Critical, near zero" },
      { key: "repeat", label: "Repeat intent", score: 22, note: "No meaningful retention" },
    ],
    insights: [
      { text: "Audience distrust of the underlying technology significantly outweighs the perceived benefit.", tag: "Audience" },
      { text: "Only 12% indicated any willingness to pay — well below the 40% minimum viability benchmark.", tag: "Pricing" },
      { text: "No clear behaviour-change cue was uncovered; there is no compelling trigger to abandon the status quo.", tag: "Retention" },
    ],
    voices: [
      { quote: "I don't trust crypto for my gaming rewards. Too volatile, too complicated.", name: "Muhammed Shuaib" },
      { quote: "Cool concept on paper, but I'd only use it if I could cash out in naira instantly.", name: "John Doe" },
    ],
    nextSteps: NEXT_STEPS,
  },
};

const FEASIBILITY: Record<string, FeasibilityReport> = {
  survey_artisan: {
    description: "An online platform connecting local artisans with customers seeking unique, handcrafted goods",
    score: 84,
    scoreNote: "This idea is highly feasible and has strong potential for success if executed well.",
    survey: { responses: 80, problem: 78, willing: 68, interest: "High" },
    overview: [
      { label: "Market feasibility", score: 80 },
      { label: "Technical feasibility", score: 70 },
      { label: "Financial feasibility", score: 80 },
      { label: "Operational feasibility", score: 90 },
      { label: "Legal feasibility", score: 78 },
      { label: "Environmental feasibility", score: 80 },
    ],
    benefits: [
      "Empower local artisans and grow the local economy",
      "Provide customers with access to unique handmade products",
      "Create jobs and support small businesses",
      "Scalable business model with high growth potential",
      "Strong alignment with community and sustainability",
    ],
    cost: { min: 4_800_000, max: 6_200_000 },
    months: { min: 4, max: 6 },
    resources: [
      "Development team (3-4 people)",
      "UI/UX designers",
      "Marketing and community managers",
      "Customer support staff",
      "Cloud hosting and tech infrastructure",
      "Partnership with artisan groups & logistics providers",
    ],
    technical: [
      { label: "Platform type", value: "Web + Mobile (iOS & Android)" },
      { label: "Recommended tech", value: "React/Next.js, Node.js" },
      { label: "Integrations needed", value: "Payments, Notifications" },
      { label: "Scalability", value: "High, can scale with demand" },
      { label: "Technical risk", value: "Low", highlight: true },
    ],
    risks: [
      { text: "Logistics and delivery reliability", level: "Medium" },
      { text: "Low initial adoption from artisans", level: "Medium" },
      { text: "Competition from larger marketplaces", level: "Medium" },
      { text: "Dependence on internet access & digital literacy", level: "Medium" },
    ],
  },
};

const LIVE: LiveStats = {
  confidence: 72,
  insight: "People are interested but price sensitivity is high",
  timeline: [
    { hour: 0, responses: 0 },
    { hour: 12, responses: 10 },
    { hour: 24, responses: 24 },
    { hour: 36, responses: 32 },
  ],
  session: [
    { label: "Avg completion time", value: "4m 12s" },
    { label: "Questions answered (Avg)", value: "10.6/11" },
    { label: "Drop-off rate", value: "6%" },
    { label: "Respondent satisfaction", value: "4.5/5" },
  ],
  sentiments: [
    { question: "How often do you struggle with writing your resume?", score: 88 },
    { question: "How frustrating is the current process for you?", score: 79 },
    { question: "What tools do you currently use for your resume?", score: 65 },
    { question: "How many job applications do you send per month?", score: 72 },
    { question: "Would an AI resume tool be valuable?", score: 84 },
    { question: "Would you pay monthly for this kind of tool?", score: 54 },
    { question: "What would stop you from using a tool like this?", score: 41 },
  ],
  activity: [
    { initials: "AA", score: 91, ago: "2 mins ago" },
    { initials: "ZK", score: 78, ago: "11 mins ago" },
    { initials: "ZH", score: 85, ago: "17 mins ago" },
    { initials: "MK", score: 88, ago: "1 hr ago" },
  ],
};

function fallbackValidation(survey: Survey): ValidationReport {
  const verdict = survey.verdict ?? "pivot";
  const base = VALIDATION[verdict === "go" ? "survey_artisan" : verdict === "kill" ? "survey_crypto" : "survey_tutoring"];
  return { ...base, confidence: survey.confidence ?? base.confidence };
}

export function getValidationReport(survey: Survey): ValidationReport {
  return VALIDATION[survey.$id] ?? fallbackValidation(survey);
}

export function getFeasibilityReport(survey: Survey): FeasibilityReport {
  const seeded = FEASIBILITY[survey.$id];
  if (seeded) return seeded;
  const v = getValidationReport(survey);
  const dim = (k: Dimension["key"]) => v.dimensions.find((d) => d.key === k)?.score ?? 0;
  return {
    ...FEASIBILITY.survey_artisan,
    description: survey.summary ?? survey.description,
    score: v.confidence,
    scoreNote:
      v.verdict === "go"
        ? "This idea is highly feasible and has strong potential for success if executed well."
        : "This idea needs changes to its audience or pricing before it is feasible to build.",
    survey: {
      responses: survey.respondentsCompleted,
      problem: dim("problem"),
      willing: dim("willingness"),
      interest: v.verdict === "go" ? "High" : v.verdict === "pivot" ? "Medium" : "Low",
    },
  };
}

export function getLiveStats(): LiveStats {
  return LIVE;
}

export function levelOf(score: number): "High" | "Medium" | "Low" {
  if (score >= 65) return "High";
  if (score >= 45) return "Medium";
  return "Low";
}
