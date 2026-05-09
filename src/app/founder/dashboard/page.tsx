"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useSurveyStore } from "@/store/survey.store";
import { useWalletStore } from "@/store/wallet.store";
import TopBar from "@/components/layout/TopBar";
import { HugeiconsIcon } from "@hugeicons/react";
import { DashboardSquare01Icon, Add01Icon, Idea01Icon, File01Icon, Wallet01Icon, ArrowRight01Icon, Clock01Icon, BarChartIcon, UserGroupIcon, Money01Icon, FlashIcon } from "@hugeicons/core-free-icons";
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
  const totalResponses = surveys.reduce((acc, s) => acc + (s.respondentsCompleted || 0), 0);
  const balance = wallet?.balance ?? 0;

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title={`Welcome back, ${firstName} 👋`}
        subtitle="Here's how your ideas are performing."
        action={
          <Link href="/founder/ideas/new" className="btn-primary text-sm lg:text-base px-3 lg:px-6 py-2 lg:py-3">
            <HugeiconsIcon icon={Add01Icon} size={18}  /> <span className="hidden sm:inline">New Idea</span>
          </Link>
        }
      />

      <div className="page-content flex flex-col gap-6 lg:gap-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
          {[
            {
              icon: BarChartIcon, label: "Live Surveys", value: liveSurveys.length,
              bg: "bg-[#EDE9FE]", iconColor: "text-brand-primary",
              sub: liveSurveys.length > 0 ? "Currently collecting" : "None active",
            },
            {
              icon: File01Icon, label: "Completed", value: completedSurveys.length,
              bg: "bg-[#DCFCE7]", iconColor: "text-[#16A34A]",
              sub: "Validated ideas",
            },
            {
              icon: BarChartIcon, label: "Total Ideas Validated", value: "12",
              bg: "bg-[#E0F2FE]", iconColor: "text-[#0284C7]",
              sub: "Across all surveys",
            },
            {
              icon: Money01Icon, label: "Wallet Balance", value: `₦${balance.toLocaleString()}`,
              bg: "bg-[#EDE9FE]", iconColor: "text-brand-primary",
              sub: <Link href="/founder/wallet" className="text-brand-primary hover:underline text-sm">Top up →</Link>,
            },
          ].map(({ icon: Icon, label, value, bg, iconColor, sub }) => (
            <div key={label} className="bg-white rounded-2xl border border-[#F3F4F6] p-4 lg:p-5 flex flex-col gap-2 lg:gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm text-text-secondary">{label}</span>
                <div className={cn("w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center", bg)}>
                <HugeiconsIcon icon={Icon} size={15} className={iconColor} />
              </div>
              </div>
              <span className="text-[22px] lg:text-[24px] font-bold text-text-primary">{value}</span>
              <span className="text-xs lg:text-sm text-text-muted">{sub}</span>
            </div>
          ))}
        </div>

        {/* CTA banner when no ideas */}
        {!loading && surveys.length === 0 && (
          <div className="bg-brand-primary rounded-[20px] lg:rounded-[30px] p-5 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <HugeiconsIcon icon={FlashIcon} size={24} className="text-white lg:w-8 lg:h-8" />
              </div>
              <div>
                <h2 className="text-[18px] lg:text-[24px] font-bold text-white">Validate your first idea</h2>
                <p className="text-white/70 text-sm lg:text-body mt-1">
                  Get real feedback from real people. Less than 5 minutes to set up.
                </p>
              </div>
            </div>
            <Link
              href="/founder/ideas/new"
              className="flex items-center gap-2 bg-white text-brand-primary font-semibold px-5 py-2.5 lg:px-6 lg:py-3 rounded-xl hover:bg-[#F8F9FC] transition-colors text-sm lg:text-base whitespace-nowrap"
            >
              Get Started <HugeiconsIcon icon={ArrowRight01Icon} size={16}  />
            </Link>
          </div>
        )}

        {/* My Ideas */}
        <div className="flex flex-col gap-4 lg:gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] lg:text-[24px] font-semibold text-text-primary">
              My Ideas
              {surveys.length > 0 && (
                <span className="ml-2 text-sm text-text-secondary font-normal">({surveys.length})</span>
              )}
            </h2>
            {surveys.length > 0 && (
              <Link href="/founder/ideas" className="btn-ghost text-sm flex items-center gap-1">
                View all <HugeiconsIcon icon={ArrowRight01Icon} size={14}  />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
              {[1, 2].map((i) => (
                <div key={i} className="tiqra-card h-40 animate-pulse bg-[#F8F9FC]" />
              ))}
            </div>
          ) : surveys.length === 0 ? (
            <div className="tiqra-card flex flex-col items-center justify-center py-16 lg:py-20 gap-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-[#EDE9FE] flex items-center justify-center">
                <HugeiconsIcon icon={Idea01Icon} size={28} className="text-brand-primary"  />
              </div>
              <div className="text-center">
                <p className="text-[20px] lg:text-[24px] font-semibold text-text-primary">No ideas yet</p>
                <p className="text-sm lg:text-body text-text-secondary mt-1">
                  Start validating your first startup idea
                </p>
              </div>
              <Link href="/founder/ideas/new" className="btn-primary mt-2">
                <HugeiconsIcon icon={Add01Icon} size={18}  /> Create first idea
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
              {surveys.slice(0, 4).map((survey) => (
                <div
                  key={survey.$id}
                  onClick={() => router.push(`/founder/ideas/${survey.$id}`)}
                  className="survey-card group cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <h3 className="text-[15px] lg:text-body font-semibold text-text-primary leading-tight line-clamp-2">
                        {survey.title}
                      </h3>
                      <p className="text-sm text-text-secondary line-clamp-1">{survey.description}</p>
                    </div>
                    <span
                      className={cn(
                        "flex-shrink-0 ml-3 text-xs lg:text-sm",
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
                        <HugeiconsIcon icon={UserGroupIcon} size={12}  /> Responses
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

                  <div className="flex items-center justify-between text-xs lg:text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Clock01Icon} size={12}  />
                      {new Date(survey.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric", month: "short",
                      })}
                    </span>
                    <span>{formatNairaShort(survey.totalCost)} escrowed</span>
                    <span className="flex items-center gap-1 text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      View <HugeiconsIcon icon={ArrowRight01Icon} size={12}  />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick tips / activity */}
        {surveys.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            <div className="tiqra-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
                  <HugeiconsIcon icon={BarChartIcon} size={20} className="text-brand-primary"  />
                </div>
                <h3 className="text-sm lg:text-body font-semibold text-text-primary">Survey Breakdown</h3>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Live", count: liveSurveys.length, color: "bg-[#16A34A]" },
                  { label: "Completed", count: completedSurveys.length, color: "bg-brand-primary" },
                  { label: "Draft", count: draftSurveys.length, color: "bg-[#E5E7EB]" },
                ].map(({ label, count, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", color)} />
                    <span className="text-sm text-text-secondary flex-1">{label}</span>
                    <span className="text-sm font-semibold text-text-primary">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="tiqra-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                  <HugeiconsIcon icon={Idea01Icon} size={20} className="text-[#D97706]"  />
                </div>
                <h3 className="text-sm lg:text-body font-semibold text-text-primary">Pro Tips</h3>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  "Write a specific problem statement for 40% better responses",
                  "Target01Icon 50+ respondents for statistically reliable results",
                  "Higher payout = faster, higher quality responses",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs lg:text-sm text-text-secondary">{tip}</p>
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
