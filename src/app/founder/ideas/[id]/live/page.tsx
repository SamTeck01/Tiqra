"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSurveyStore } from "@/store/survey.store";
import { ArrowLeft01Icon, UserGroupIcon, Clock01Icon, ChartIncreaseIcon, ChartBarBigIcon, FlashIcon, RefreshIcon, CheckmarkCircle01Icon, RotateLeft01Icon, CancelCircleIcon, ArrowUpRight01Icon, Activity01Icon } from "@hugeicons/core-free-icons";
import { formatNairaShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

const LIVE_RESPONSES = [
  { id: 1, time: "2 min ago", quality: 94, sentiment: "positive" },
  { id: 2, time: "5 min ago", quality: 88, sentiment: "positive" },
  { id: 3, time: "8 min ago", quality: 72, sentiment: "neutral" },
  { id: 4, time: "12 min ago", quality: 91, sentiment: "positive" },
  { id: 5, time: "18 min ago", quality: 45, sentiment: "negative" },
  { id: 6, time: "22 min ago", quality: 83, sentiment: "positive" },
];

const DEMAND_DATA = [12, 28, 45, 52, 61, 68, 72];

export default function LiveTrackPage() {
  const { id } = useParams();
  const router = useRouter();
  const { activeSurvey, fetchSurveyById } = useSurveyStore();
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (id) fetchSurveyById(id as string);
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setLastRefresh(new Date());
    setRefreshing(false);
  };

  const progress = activeSurvey
    ? Math.min(100, (activeSurvey.respondentsCompleted / activeSurvey.respondentsRequired) * 100)
    : 65;

  const demandSignal = 72;
  const verdictProjected: "Proceed" | "Pivot" | "Kill" =
    demandSignal >= 65 ? "Proceed" : demandSignal >= 40 ? "Pivot" : "Kill";

  const verdictConfig = {
    Proceed: { color: "#16A34A", bg: "#DCFCE7", icon: CheckmarkCircle01Icon, label: "Trending: Proceed" },
    Pivot: { color: "#D97706", bg: "#FEF3C7", icon: RotateLeft01Icon, label: "Trending: Pivot" },
    Kill: { color: "#DC2626", bg: "#FEE2E2", icon: CancelCircleIcon, label: "Trending: Kill" },
  };
  const vc = verdictConfig[verdictProjected];

  return (
    <div className="ml-[324px] flex flex-col min-h-screen bg-[#FEFEFE]">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-[#F3F4F6]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-body text-text-secondary hover:text-text-primary transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20}  />
          </button>
          <div>
            <h1 className="text-[24px] font-semibold text-text-primary">
              {activeSurvey?.title || "Live Survey Track"}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="text-sm text-[#16A34A] font-medium">Live</span>
              <span className="text-sm text-text-secondary">·</span>
              <span className="text-sm text-text-secondary">
                Updated {lastRefresh.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className={cn("btn-secondary gap-2", refreshing && "opacity-70")}
        >
          <HugeiconsIcon icon={RefreshIcon} size={16} className={cn(refreshing && "animate-spin")}  />
          Refresh
        </button>
      </div>

      <div className="px-8 py-8 flex flex-col gap-8 max-w-5xl">
        {/* Live metrics strip */}
        <div className="grid grid-cols-4 gap-5">
          {[
            { icon: UserGroupIcon, label: "Responses", value: `${activeSurvey?.respondentsCompleted || 32}/${activeSurvey?.respondentsRequired || 50}`, sub: `${Math.round(progress)}% complete` },
            { icon: Activity01Icon, label: "Demand Signal", value: `${demandSignal}%`, sub: "of respondents interested" },
            { icon: Clock01Icon, label: "Avg. Time", value: "3m 42s", sub: "per response" },
            { icon: ChartBarBigIcon, label: "Quality Score", value: "82%", sub: "avg. response quality" },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="tiqra-card-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <HugeiconsIcon icon={Icon} size={16} />
                <span>{label}</span>
              </div>
              <span className="text-[28px] font-bold text-text-primary">{value}</span>
              <span className="text-sm text-text-secondary">{sub}</span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-sm text-text-secondary">
            <span>Survey Progress</span>
            <span>{activeSurvey?.respondentsCompleted || 32} of {activeSurvey?.respondentsRequired || 50} responses collected</span>
          </div>
          <div className="h-4 rounded-full bg-[#EDE9FE] overflow-hidden">
            <div
              className="h-full bg-brand-primary rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Projected verdict + demand chart */}
        <div className="grid grid-cols-2 gap-6">
          {/* Verdict projection */}
          <div className={cn("p-6 rounded-2xl flex flex-col gap-4")} style={{ backgroundColor: vc.bg }}>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={FlashIcon} size={16} style={{ color: vc.color }}  />
              <span className="text-sm font-medium" style={{ color: vc.color }}>AI Early Projection</span>
            </div>
            <div className="flex items-center gap-4">
              <HugeiconsIcon icon={vc.icon} size={40} style={{ color: vc.color }} />
              <div>
                <p className="text-[28px] font-bold" style={{ color: vc.color }}>{vc.label}</p>
                <p className="text-sm" style={{ color: vc.color, opacity: 0.8 }}>
                  Based on {activeSurvey?.respondentsCompleted || 32} responses so far
                </p>
              </div>
            </div>
            <p className="text-sm" style={{ color: vc.color, opacity: 0.7 }}>
              * Final verdict generated when 100% responses collected
            </p>
          </div>

          {/* Demand trend chart (simplified) */}
          <div className="tiqra-card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-body font-semibold text-text-primary">Demand Signal Trend</h3>
              <HugeiconsIcon icon={ChartIncreaseIcon} size={20} className="text-[#16A34A]"  />
            </div>
            <div className="flex items-end gap-1.5 h-24">
              {DEMAND_DATA.map((val, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-t-sm transition-all",
                    i === DEMAND_DATA.length - 1 ? "bg-brand-primary" : "bg-[#EDE9FE]"
                  )}
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Start</span>
              <span>Now</span>
            </div>
          </div>
        </div>

        {/* Live responses feed */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] font-semibold text-text-primary">Live Response Feed</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="text-sm text-[#16A34A] font-medium">Updating live</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {LIVE_RESPONSES.map((resp) => (
              <div
                key={resp.id}
                className="flex items-center justify-between p-4 bg-white border border-[#F3F4F6] rounded-xl hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EDE9FE] flex items-center justify-center text-sm font-semibold text-brand-primary flex-shrink-0">
                    #{resp.id}
                  </div>
                  <div>
                    <p className="text-body font-medium text-text-primary">Anonymous Respondent</p>
                    <p className="text-sm text-text-secondary">{resp.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-sm px-3 py-1 rounded-full font-medium",
                      resp.quality >= 80 ? "bg-[#DCFCE7] text-[#16A34A]" :
                        resp.quality >= 60 ? "bg-[#FEF3C7] text-[#D97706]" :
                          "bg-[#FEE2E2] text-[#DC2626]"
                    )}
                  >
                    {resp.quality}% quality
                  </span>
                  <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} className="text-text-secondary"  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key insights (early) */}
        <div className="tiqra-card flex flex-col gap-4">
          <h3 className="text-body font-semibold text-text-primary">Early Insights</h3>
          <div className="flex flex-col gap-3">
            {[
              "68% of respondents experience this problem at least weekly",
              "Top objection so far: price point concerns (mentioned by 3 respondents)",
              "Strongest interest from respondents aged 25–35 in Lagos",
            ].map((insight, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                <p className="text-body text-text-secondary">{insight}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-muted border-t border-[#F3F4F6] pt-3">
            Full AI report available when survey completes
          </p>
        </div>
      </div>
    </div>
  );
}
