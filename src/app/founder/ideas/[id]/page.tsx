"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSurveyStore } from "@/store/survey.store";
import { formatNairaShort } from "@/lib/utils";
import { ArrowLeft01Icon, UserGroupIcon, Clock01Icon, ChartIncreaseIcon, Alert02Icon, CheckmarkCircle01Icon, RotateLeft01Icon, CancelCircleIcon, ChartBarBigIcon, ListViewIcon, File01Icon, ArrowRight01Icon, PauseIcon, PlayIcon, Activity01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const MOCK_RESPONSES = [
  { id: "r1", respondent: "Respondent #1", completedAt: "2025-05-08", timeTaken: 240, score: 92, flagged: false },
  { id: "r2", respondent: "Respondent #2", completedAt: "2025-05-08", timeTaken: 185, score: 88, flagged: false },
  { id: "r3", respondent: "Respondent #3", completedAt: "2025-05-07", timeTaken: 67, score: 34, flagged: true },
  { id: "r4", respondent: "Respondent #4", completedAt: "2025-05-07", timeTaken: 220, score: 95, flagged: false },
  { id: "r5", respondent: "Respondent #5", completedAt: "2025-05-06", timeTaken: 198, score: 85, flagged: false },
];

const MOCK_REPORT = {
  demandPercentage: 72,
  willingnessToPay: "₦5,000–₦15,000/month",
  topObjections: [
    "Unsure about data privacy",
    "Already using a competitor",
    "Price point too high",
  ],
  audienceInsights:
    "Strong demand among Lagos-based freelancers aged 25–35. 68% indicated they face this problem weekly.",
  verdict: "Proceed" as "Proceed" | "Pivot" | "Kill",
  confidenceCeiling: 87,
  summary:
    "Your idea shows strong market pull. The majority of respondents face this pain point frequently and expressed willingness to pay. Focus on data privacy messaging to overcome the primary objection.",
};

const verdictConfig = {
  Proceed: {
    class: "bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]",
    icon: CheckmarkCircle01Icon,
    label: "✓ Proceed",
    description: "Strong market signal. Move forward.",
  },
  Pivot: {
    class: "bg-[#FEF3C7] text-[#D97706] border-[#D97706]",
    icon: RotateLeft01Icon,
    label: "↩ Pivot",
    description: "Adjust your approach based on feedback.",
  },
  Kill: {
    class: "bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]",
    icon: CancelCircleIcon,
    label: "✕ Kill",
    description: "Insufficient market demand. Reconsider.",
  },
};

type Tab = "overview" | "responses" | "report";

export default function IdeaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { activeSurvey, fetchSurveyById, loading } = useSurveyStore();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (id) fetchSurveyById(id as string);
  }, [id]);

  if (loading)
    return (
      <div className="ml-[324px] p-8">
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-[#F8F9FC] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );

  if (!activeSurvey)
    return (
      <div className="ml-[324px] p-8">
        <button onClick={() => router.back()} className="btn-secondary mb-6">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18}  /> Back
        </button>
        <p className="text-h3 text-text-secondary">Survey not found</p>
      </div>
    );

  const progress = Math.min(
    100,
    (activeSurvey.respondentsCompleted / activeSurvey.respondentsRequired) * 100
  );
  const verdict = MOCK_REPORT.verdict;
  const verdictCfg = verdictConfig[verdict];

  return (
    <div className="ml-[324px] flex flex-col min-h-screen bg-[#FEFEFE]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-[#F3F4F6] bg-[#FEFEFE]">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-body text-text-secondary hover:text-text-primary transition-colors mb-2"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18}  /> Back to ideas
          </button>
          <h1 className="text-[32px] font-semibold text-text-primary">{activeSurvey.title}</h1>
          <p className="text-lg text-text-secondary">
            Created {new Date(activeSurvey.createdAt).toLocaleDateString("en-NG")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeSurvey.status === "live" && (
            <button className="btn-secondary gap-2">
              <HugeiconsIcon icon={PauseIcon} size={18}  /> PauseIcon
            </button>
          )}
          {activeSurvey.status === "paused" && (
            <button className="btn-primary gap-2">
              <HugeiconsIcon icon={PlayIcon} size={18}  /> Resume
            </button>
          )}
          <span
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium",
              activeSurvey.status === "live"
                ? "bg-[#DCFCE7] text-[#16A34A]"
                : activeSurvey.status === "completed"
                ? "bg-[#EDE9FE] text-brand-primary"
                : "bg-[#F3F4F6] text-text-secondary"
            )}
          >
            {activeSurvey.status === "live"
              ? "● Live"
              : activeSurvey.status === "completed"
              ? "✓ Completed"
              : "Draft"}
          </span>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-5 px-8 py-6 border-b border-[#F3F4F6]">
        {[
          {
            icon: UserGroupIcon,
            label: "Responses",
            value: `${activeSurvey.respondentsCompleted}/${activeSurvey.respondentsRequired}`,
          },
          {
            icon: ChartIncreaseIcon,
            label: "Completion",
            value: `${Math.round(progress)}%`,
          },
          {
            icon: Clock01Icon,
            label: "Avg. time",
            value: "3m 42s",
          },
          {
            icon: ChartBarBigIcon,
            label: "Escrowed",
            value: formatNairaShort(activeSurvey.escrowAmount || 0),
          },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <HugeiconsIcon icon={Icon} size={16} /> {label}
            </div>
            <span className="text-[24px] font-semibold text-text-primary">{value}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="px-8 py-4 border-b border-[#F3F4F6]">
        <div className="flex justify-between text-sm text-text-secondary mb-2">
          <span>Survey Progress</span>
          <span>{activeSurvey.respondentsCompleted} of {activeSurvey.respondentsRequired} responses collected</span>
        </div>
        <div className="progress-bar h-3">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-8 pt-6 border-b border-[#F3F4F6]">
        {(["overview", "responses", "report"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-5 py-3 text-lg capitalize transition-all border-b-2 -mb-px",
              tab === t
                ? "border-brand-primary text-brand-primary font-medium"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            {t === "overview" ? "Overview" : t === "responses" ? "Responses" : "AI Report"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-8 py-8 max-w-4xl">
        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="flex flex-col gap-6">
            <div className="tiqra-card">
              <h2 className="text-[24px] font-semibold text-text-primary mb-4">About this Idea</h2>
              <p className="text-body text-text-secondary leading-relaxed">
                {activeSurvey.description || "No description provided."}
              </p>
            </div>

            <div className="tiqra-card">
              <h2 className="text-[24px] font-semibold text-text-primary mb-4">
                Survey Questions ({activeSurvey.questions?.length || 0})
              </h2>
              <div className="flex flex-col gap-3">
                {(activeSurvey.questions || []).map((q, i) => (
                  <div key={q.id} className="flex gap-4 p-4 bg-[#F8F9FC] rounded-2xl">
                    <span className="w-7 h-7 rounded-full bg-[#EDE9FE] flex items-center justify-center text-sm font-semibold text-brand-primary flex-shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-body text-text-primary">{q.text}</p>
                      <span className="text-sm text-text-muted capitalize mt-1 block">
                        {q.type.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          {activeSurvey.status === "live" && (
              <Link
                href={`/founder/ideas/${activeSurvey.$id}/live`}
                className="flex items-center justify-between p-5 bg-white border border-[#F3F4F6] rounded-2xl cursor-pointer hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EDE9FE] flex items-center justify-center">
                    <HugeiconsIcon icon={File01Icon} size={20} className="text-brand-primary"  />
                  </div>
                  <div>
                    <p className="text-body font-medium text-text-primary">Live Track</p>
                    <p className="text-sm text-text-secondary">See real-time data as responses come in</p>
                  </div>
                </div>
                <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-text-secondary"  />
              </Link>
            )}
            {activeSurvey.status === "completed" && (
              <Link
                href={`/founder/ideas/${activeSurvey.$id}/report`}
                className="flex items-center justify-between p-5 bg-[#EDE9FE] border border-brand-primary/20 rounded-2xl cursor-pointer hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
                    <HugeiconsIcon icon={File01Icon} size={20} className="text-white"  />
                  </div>
                  <div>
                    <p className="text-body font-medium text-text-primary">View AI Report</p>
                    <p className="text-sm text-text-secondary">See the full GO / PIVOT / KILL verdict</p>
                  </div>
                </div>
                <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-brand-primary"  />
              </Link>
            )}
          </div>
        )}

        {/* ── Responses ── */}
        {tab === "responses" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[24px] font-semibold text-text-primary">
                All Responses ({MOCK_RESPONSES.length})
              </h2>
              <button className="btn-secondary gap-2">
                <HugeiconsIcon icon={ListViewIcon} size={18}  /> Export CSV
              </button>
            </div>
            {MOCK_RESPONSES.map((resp) => (
              <div
                key={resp.id}
                className="flex items-center justify-between p-5 bg-white border border-[#F3F4F6] rounded-2xl hover:shadow-card-hover transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#EDE9FE] flex items-center justify-center">
                    <HugeiconsIcon icon={UserGroupIcon} size={18} className="text-brand-primary"  />
                  </div>
                  <div>
                    <p className="text-body font-medium text-text-primary">{resp.respondent}</p>
                    <p className="text-sm text-text-secondary">
                      {new Date(resp.completedAt).toLocaleDateString("en-NG")} · {Math.floor(resp.timeTaken / 60)}m {resp.timeTaken % 60}s
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {resp.flagged && (
                    <span className="flex items-center gap-1 text-sm text-[#D97706] bg-[#FEF3C7] px-3 py-1 rounded-full">
                      <HugeiconsIcon icon={Alert02Icon} size={14}  /> Flagged
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium px-3 py-1 rounded-full",
                      resp.score >= 80
                        ? "bg-[#DCFCE7] text-[#16A34A]"
                        : resp.score >= 60
                        ? "bg-[#FEF3C7] text-[#D97706]"
                        : "bg-[#FEE2E2] text-[#DC2626]"
                    )}
                  >
                    {resp.score}% quality
                  </span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-text-secondary"  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── AI Report ── */}
        {tab === "report" && (
          <div className="flex flex-col gap-6">
            {/* Verdict */}
            <div className={cn("p-6 rounded-2xl border-2 flex items-center justify-between", verdictCfg.class)}>
              <div>
                <p className="text-sm font-medium opacity-70 mb-1">AI Verdict</p>
                <span className="text-[32px] font-bold">{verdictCfg.label}</span>
                <p className="text-body mt-1">{verdictCfg.description}</p>
              </div>
              <HugeiconsIcon icon={verdictCfg.icon} size={48} />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-5">
              <div className="tiqra-card-sm">
                <p className="text-body text-text-secondary mb-2">Demand Signal</p>
                <span className="text-[32px] font-bold text-text-primary">{MOCK_REPORT.demandPercentage}%</span>
                <div className="progress-bar mt-3 h-3">
                  <div className="progress-fill" style={{ width: `${MOCK_REPORT.demandPercentage}%` }} />
                </div>
              </div>
              <div className="tiqra-card-sm">
                <p className="text-body text-text-secondary mb-2">Confidence Ceiling</p>
                <span className="text-[32px] font-bold text-text-primary">{MOCK_REPORT.confidenceCeiling}%</span>
                <div className="progress-bar mt-3 h-3">
                  <div className="progress-fill" style={{ width: `${MOCK_REPORT.confidenceCeiling}%` }} />
                </div>
              </div>
            </div>

            {/* WTP */}
            <div className="tiqra-card">
              <p className="text-body font-semibold text-text-primary mb-3">Willingness to Pay</p>
              <div className="bg-[#EDE9FE] rounded-xl px-5 py-4">
                <span className="text-[24px] font-bold text-brand-primary">{MOCK_REPORT.willingnessToPay}</span>
              </div>
            </div>

            {/* Insights */}
            <div className="tiqra-card">
              <p className="text-body font-semibold text-text-primary mb-3">Audience Insights</p>
              <p className="text-body text-text-secondary leading-relaxed">{MOCK_REPORT.audienceInsights}</p>
            </div>

            {/* Summary */}
            <div className="tiqra-card">
              <p className="text-body font-semibold text-text-primary mb-3">AI Summary</p>
              <p className="text-body text-text-secondary leading-relaxed">{MOCK_REPORT.summary}</p>
            </div>

            {/* Objections */}
            <div className="tiqra-card">
              <p className="text-body font-semibold text-text-primary mb-3">Top Objections</p>
              <div className="flex flex-col gap-3">
                {MOCK_REPORT.topObjections.map((obj, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#FEF3C7] rounded-xl">
                    <HugeiconsIcon icon={Alert02Icon} size={16} className="text-[#D97706] flex-shrink-0"  />
                    <span className="text-body text-[#D97706]">{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
