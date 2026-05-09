"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, RotateCcw, XCircle, TrendingUp,
  Users, AlertTriangle, Target, ArrowRight, Download
} from "lucide-react";
import { cn } from "@/lib/utils";

type Verdict = "proceed" | "pivot" | "kill";

const REPORTS: Record<string, {
  title: string;
  verdict: Verdict;
  demandSignal: number;
  confidenceCeiling: number;
  willingnessToPay: string;
  audienceInsights: string;
  summary: string;
  topObjections: string[];
  topStrengths: string[];
  respondents: number;
}> = {
  "s1": {
    title: "AI powered Resume builder",
    verdict: "proceed",
    demandSignal: 72,
    confidenceCeiling: 87,
    willingnessToPay: "₦2,000–₦8,000/month",
    audienceInsights: "Strong demand among Lagos-based professionals aged 25–35. 68% indicated they face resume challenges weekly and would switch from current tools.",
    summary: "Your idea shows strong market pull with clear demand signals. The majority of respondents face this pain point frequently and expressed willingness to pay. Focus on data privacy messaging and competitive pricing to address key objections.",
    topObjections: ["Unsure about data privacy", "Already using a free alternative", "Price point concerns"],
    topStrengths: ["Clear pain point", "Strong weekly frequency", "LinkedIn integration appeal"],
    respondents: 50,
  },
  "s2": {
    title: "Freelancer Invoice Tools",
    verdict: "pivot",
    demandSignal: 54,
    confidenceCeiling: 61,
    willingnessToPay: "₦500–₦2,000/month",
    audienceInsights: "Moderate interest from Lagos-based freelancers. Many are already using WhatsApp and Google Docs. There is demand but the solution needs better differentiation.",
    summary: "The market exists but your positioning needs work. Respondents see the pain point but aren't convinced your approach is different enough. Consider focusing on Nigerian-specific features like Naira invoicing and USSD payment reminders.",
    topObjections: ["Already using free tools", "Price sensitivity", "Trust in new platforms"],
    topStrengths: ["Real pain point", "Naira payment interest", "USSD reminder interest"],
    respondents: 50,
  },
  "default": {
    title: "Market Validation Survey",
    verdict: "kill",
    demandSignal: 28,
    confidenceCeiling: 35,
    willingnessToPay: "Most prefer free only",
    audienceInsights: "Low market demand detected. Respondents do not frequently encounter this problem or are satisfied with existing solutions.",
    summary: "The data suggests this idea may not have sufficient market demand in its current form. Consider whether the problem is urgent enough, or if a completely different approach or target audience might yield better results.",
    topObjections: ["Problem not frequent enough", "Existing solutions adequate", "Low willingness to pay"],
    topStrengths: [],
    respondents: 50,
  },
};

const VERDICT_CONFIG = {
  proceed: {
    label: "✓ Proceed",
    description: "Strong market signal. Move forward with confidence.",
    color: "#16A34A",
    bg: "#DCFCE7",
    border: "#16A34A",
    icon: CheckCircle2,
    badge: "GO",
  },
  pivot: {
    label: "↩ Pivot",
    description: "Adjust your approach based on respondent feedback.",
    color: "#D97706",
    bg: "#FEF3C7",
    border: "#D97706",
    icon: RotateCcw,
    badge: "PIVOT",
  },
  kill: {
    label: "✕ Kill",
    description: "Insufficient market demand. Reconsider this direction.",
    color: "#DC2626",
    bg: "#FEE2E2",
    border: "#DC2626",
    icon: XCircle,
    badge: "KILL",
  },
};

export default function SurveyReportPage() {
  const { id } = useParams();
  const router = useRouter();

  const report = REPORTS[id as string] || REPORTS["default"];
  const vc = VERDICT_CONFIG[report.verdict];
  const Icon = vc.icon;

  return (
    <div className="ml-[324px] flex flex-col min-h-screen bg-[#FEFEFE]">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-body text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[24px] font-semibold text-text-primary">AI Validation Report</h1>
            <p className="text-sm text-text-secondary">{report.title} · {report.respondents} responses</p>
          </div>
        </div>
        <button className="btn-secondary gap-2">
          <Download size={18} /> Export PDF
        </button>
      </div>

      <div className="px-8 py-8 max-w-4xl flex flex-col gap-8">

        {/* Big verdict card */}
        <div
          className="p-8 rounded-[24px] border-2 flex items-center justify-between"
          style={{ backgroundColor: vc.bg, borderColor: vc.border }}
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium opacity-70" style={{ color: vc.color }}>AI Verdict</p>
            <div className="flex items-center gap-4">
              <Icon size={48} style={{ color: vc.color }} />
              <div>
                <p className="text-[40px] font-bold leading-none" style={{ color: vc.color }}>
                  {vc.label}
                </p>
                <p className="text-body mt-2" style={{ color: vc.color, opacity: 0.8 }}>
                  {vc.description}
                </p>
              </div>
            </div>
          </div>
          <div
            className="text-[56px] font-black opacity-10 select-none"
            style={{ color: vc.color }}
          >
            {vc.badge}
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-5">
          <div className="tiqra-card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-body text-text-secondary">Demand Signal</p>
              <TrendingUp size={18} style={{ color: vc.color }} />
            </div>
            <span className="text-[40px] font-bold text-text-primary">{report.demandSignal}%</span>
            <div>
              <div className="h-3 rounded-full bg-[#F3F4F6] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${report.demandSignal}%`, backgroundColor: vc.color }}
                />
              </div>
              <p className="text-sm text-text-secondary mt-1">
                of respondents are interested
              </p>
            </div>
          </div>

          <div className="tiqra-card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-body text-text-secondary">Confidence Ceiling</p>
              <Target size={18} className="text-brand-primary" />
            </div>
            <span className="text-[40px] font-bold text-text-primary">{report.confidenceCeiling}%</span>
            <div>
              <div className="h-3 rounded-full bg-[#EDE9FE] overflow-hidden">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all"
                  style={{ width: `${report.confidenceCeiling}%` }}
                />
              </div>
              <p className="text-sm text-text-secondary mt-1">data reliability score</p>
            </div>
          </div>
        </div>

        {/* Willingness to Pay */}
        <div className="tiqra-card flex flex-col gap-3">
          <p className="text-body font-semibold text-text-primary">Willingness to Pay</p>
          <div className="bg-[#EDE9FE] rounded-xl px-6 py-4 flex items-center justify-between">
            <span className="text-[28px] font-bold text-brand-primary">{report.willingnessToPay}</span>
            <span className="text-sm text-brand-primary bg-white px-3 py-1 rounded-full font-medium">
              per respondent
            </span>
          </div>
        </div>

        {/* Audience Insights */}
        <div className="tiqra-card flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-brand-primary" />
            <p className="text-body font-semibold text-text-primary">Audience Insights</p>
          </div>
          <p className="text-body text-text-secondary leading-relaxed">{report.audienceInsights}</p>
        </div>

        {/* AI Summary */}
        <div className="tiqra-card flex flex-col gap-3">
          <p className="text-body font-semibold text-text-primary">AI Summary</p>
          <p className="text-body text-text-secondary leading-relaxed">{report.summary}</p>
        </div>

        {/* Strengths & Objections */}
        <div className="grid grid-cols-2 gap-5">
          {report.topStrengths.length > 0 && (
            <div className="tiqra-card flex flex-col gap-3">
              <p className="text-body font-semibold text-text-primary">Top Strengths</p>
              <div className="flex flex-col gap-2">
                {report.topStrengths.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-[#DCFCE7] rounded-xl">
                    <CheckCircle2 size={14} className="text-[#16A34A] flex-shrink-0" />
                    <span className="text-sm text-[#16A34A]">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={cn("tiqra-card flex flex-col gap-3", !report.topStrengths.length && "col-span-2")}>
            <p className="text-body font-semibold text-text-primary">Top Objections</p>
            <div className="flex flex-col gap-2">
              {report.topObjections.map((obj, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-[#FEF3C7] rounded-xl">
                  <AlertTriangle size={14} className="text-[#D97706] flex-shrink-0" />
                  <span className="text-sm text-[#D97706]">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <button onClick={() => router.back()} className="btn-secondary flex-shrink-0">
            <ArrowLeft size={18} /> Back to Idea
          </button>
          {report.verdict === "proceed" && (
            <Link href="/founder/ideas/new" className="btn-primary flex-1 justify-center">
              Launch Next Idea <ArrowRight size={20} />
            </Link>
          )}
          {report.verdict === "pivot" && (
            <Link href="/founder/ideas/new" className="btn-primary flex-1 justify-center"
              style={{ backgroundColor: "#D97706" }}>
              Pivot & Re-validate <ArrowRight size={20} />
            </Link>
          )}
          {report.verdict === "kill" && (
            <Link href="/founder/dashboard" className="btn-secondary flex-1 justify-center">
              Back to Dashboard <ArrowRight size={20} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
