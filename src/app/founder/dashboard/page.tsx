"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useSurveyStore } from "@/store/survey.store";
import { useWalletStore } from "@/store/wallet.store";
import TopBar from "@/components/layout/TopBar";
import {
  Plus, ArrowRight, TrendingUp, Users, CheckCircle2,
  Clock, Lightbulb, DollarSign, BarChart3, Zap
} from "lucide-react";
import { formatNairaShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function FounderDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { surveys, fetchSurveys, loading } = useSurveyStore();
  const { wallet, fetchWallet } = useWalletStore();

  useEffect(() => {
    if (user?.$id) {
      fetchSurveys(user.$id);
      fetchWallet(user.$id);
    }
  }, [user?.$id]);

  const liveSurveys = surveys.filter((s) => s.status === "live");
  const completedSurveys = surveys.filter((s) => s.status === "completed");
  const draftSurveys = surveys.filter((s) => s.status === "draft");
  const totalSpent = surveys.reduce((acc, s) => acc + (s.totalCost || 0), 0);
  const totalResponses = surveys.reduce((acc, s) => acc + (s.respondentsCompleted || 0), 0);
  const balance = wallet?.balance ?? 0;

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title={`Welcome back, ${firstName} 👋`}
        subtitle="Here's how your ideas are performing."
        action={
          <Link href="/founder/ideas/new" className="btn-primary">
            <Plus size={20} /> New Idea
          </Link>
        }
      />

      <div className="px-8 py-8 flex flex-col gap-8">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-5">
          {[
            {
              icon: TrendingUp, label: "Live Surveys", value: liveSurveys.length,
              bg: "bg-[#EDE9FE]", iconColor: "text-brand-primary",
              sub: liveSurveys.length > 0 ? "Currently collecting" : "None active",
            },
            {
              icon: CheckCircle2, label: "Completed", value: completedSurveys.length,
              bg: "bg-[#DCFCE7]", iconColor: "text-[#16A34A]",
              sub: "Validated ideas",
            },
            {
              icon: Users, label: "Total Responses", value: totalResponses,
              bg: "bg-[#FEF3C7]", iconColor: "text-[#D97706]",
              sub: "Across all surveys",
            },
            {
              icon: DollarSign, label: "Wallet Balance", value: `₦${balance.toLocaleString()}`,
              bg: "bg-[#EDE9FE]", iconColor: "text-brand-primary",
              sub: <Link href="/founder/wallet" className="text-brand-primary hover:underline text-sm">Top up →</Link>,
            },
          ].map(({ icon: Icon, label, value, bg, iconColor, sub }) => (
            <div key={label} className="tiqra-card-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">{label}</span>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", bg)}>
                  <Icon size={16} className={iconColor} />
                </div>
              </div>
              <span className="text-[24px] font-bold text-text-primary">{value}</span>
              <span className="text-sm text-text-muted">{sub}</span>
            </div>
          ))}
        </div>

        {/* CTA banner when no ideas */}
        {!loading && surveys.length === 0 && (
          <div className="bg-brand-primary rounded-[30px] p-8 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <Zap size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-[24px] font-bold text-white">Validate your first idea</h2>
                <p className="text-white/70 text-body mt-1">
                  Get real feedback from real people. It takes less than 5 minutes to set up.
                </p>
              </div>
            </div>
            <Link
              href="/founder/ideas/new"
              className="flex items-center gap-2 bg-white text-brand-primary font-semibold px-6 py-3 rounded-xl hover:bg-[#F8F9FC] transition-colors"
            >
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* My Ideas */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] font-semibold text-text-primary">
              My Ideas
              {surveys.length > 0 && (
                <span className="ml-2 text-sm text-text-secondary font-normal">({surveys.length})</span>
              )}
            </h2>
            {surveys.length > 0 && (
              <Link href="/founder/ideas" className="btn-ghost text-sm">
                View all <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-5">
              {[1, 2].map((i) => (
                <div key={i} className="tiqra-card h-48 animate-pulse bg-[#F8F9FC]" />
              ))}
            </div>
          ) : surveys.length === 0 ? (
            <div className="tiqra-card flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EDE9FE] flex items-center justify-center">
                <Lightbulb size={32} className="text-brand-primary" />
              </div>
              <div className="text-center">
                <p className="text-[24px] font-semibold text-text-primary">No ideas yet</p>
                <p className="text-body text-text-secondary mt-1">
                  Start validating your first startup idea
                </p>
              </div>
              <Link href="/founder/ideas/new" className="btn-primary mt-2">
                <Plus size={20} /> Create first idea
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5">
              {surveys.slice(0, 4).map((survey) => (
                <div
                  key={survey.$id}
                  onClick={() => router.push(`/founder/ideas/${survey.$id}`)}
                  className="survey-card group cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <h3 className="text-body font-semibold text-text-primary leading-tight line-clamp-2">
                        {survey.title}
                      </h3>
                      <p className="text-sm text-text-secondary line-clamp-1">{survey.description}</p>
                    </div>
                    <span
                      className={cn(
                        "flex-shrink-0 ml-3",
                        survey.status === "live"
                          ? "badge-live"
                          : survey.status === "completed"
                          ? "badge-completed"
                          : "badge-draft"
                      )}
                    >
                      {survey.status === "live"
                        ? "● Live"
                        : survey.status === "completed"
                        ? "✓ Done"
                        : "Draft"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary flex items-center gap-1">
                        <Users size={13} /> Responses
                      </span>
                      <span className="text-text-primary font-medium">
                        {survey.respondentsCompleted}/{survey.respondentsRequired}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(100, (survey.respondentsCompleted / survey.respondentsRequired) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {new Date(survey.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric", month: "short",
                      })}
                    </span>
                    <span>{formatNairaShort(survey.totalCost)} escrowed</span>
                    <span className="flex items-center gap-1 text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      View <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick tips / activity */}
        {surveys.length > 0 && (
          <div className="grid grid-cols-2 gap-5">
            <div className="tiqra-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
                  <BarChart3 size={20} className="text-brand-primary" />
                </div>
                <h3 className="text-body font-semibold text-text-primary">Survey Breakdown</h3>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Live", count: liveSurveys.length, color: "bg-[#16A34A]" },
                  { label: "Completed", count: completedSurveys.length, color: "bg-brand-primary" },
                  { label: "Draft", count: draftSurveys.length, color: "bg-[#E5E7EB]" },
                ].map(({ label, count, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", color)} />
                    <span className="text-body text-text-secondary flex-1">{label}</span>
                    <span className="text-body font-semibold text-text-primary">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="tiqra-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                  <Lightbulb size={20} className="text-[#D97706]" />
                </div>
                <h3 className="text-body font-semibold text-text-primary">Pro Tips</h3>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  "Write a specific problem statement for 40% better responses",
                  "Target 50+ respondents for statistically reliable results",
                  "Higher payout = faster, higher quality responses",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-text-secondary">{tip}</p>
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
