"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useWalletStore } from "@/store/wallet.store";
import TopBar from "@/components/layout/TopBar";
import { HugeiconsIcon } from "@hugeicons/react";
import { DashboardSquare01Icon, Search01Icon, File01Icon, Wallet01Icon, User02Icon, FlashIcon, StarIcon, ArrowRight01Icon, Clock01Icon, Money01Icon, CheckmarkCircle01Icon, ChartIncreaseIcon } from "@hugeicons/core-free-icons";
import { formatNairaShort } from "@/lib/utils";

const RECENT_SURVEYS = [
  { id: "s1", title: "AI powered Resume builder", reward: 500, duration: "2 mins", category: "Tech", status: "available" },
  { id: "s2", title: "Freelancer invoice tools", reward: 800, duration: "5 mins", category: "Finance", status: "available" },
  { id: "s3", title: "Remote work productivity", reward: 600, duration: "3 mins", category: "Productivity", status: "available" },
];

export default function EarnerDashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { wallet, fetchWallet } = useWalletStore();

  useEffect(() => {
    if (user?.$id) fetchWallet(user.$id);
  }, [user?.$id]);

  const balance = wallet?.balance ?? 0;
  const totalEarned = wallet?.totalEarned ?? 12500;
  const completedSurveys = 8;
  const reliabilityScore = user?.reliabilityScore ?? 92;

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title={`Good morning, ${firstName} 👋`}
        subtitle="Here's what's available for you today."
      />

      <div className="page-content flex flex-col gap-6 lg:gap-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-4 lg:p-5 flex flex-col gap-2 lg:gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-xs lg:text-sm text-text-secondary">Wallet Balance</span>
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-[#EDE9FE] flex items-center justify-center">
                <HugeiconsIcon icon={Money01Icon} size={15} className="text-brand-primary"  />
              </div>
            </div>
            <span className="text-[20px] lg:text-[24px] font-bold text-text-primary">₦{balance.toLocaleString()}</span>
            <Link href="/earner/wallet" className="text-xs lg:text-sm text-brand-primary hover:underline">
              View wallet →
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-4 lg:p-5 flex flex-col gap-2 lg:gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-xs lg:text-sm text-text-secondary">Total Earned</span>
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                <HugeiconsIcon icon={ChartIncreaseIcon} size={15} className="text-[#16A34A]"  />
              </div>
            </div>
            <span className="text-[20px] lg:text-[24px] font-bold text-text-primary">₦{totalEarned.toLocaleString()}</span>
            <span className="text-xs lg:text-sm text-text-secondary">All time</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-4 lg:p-5 flex flex-col gap-2 lg:gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-xs lg:text-sm text-text-secondary">Surveys Done</span>
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-[#EDE9FE] flex items-center justify-center">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={15} className="text-brand-primary"  />
              </div>
            </div>
            <span className="text-[20px] lg:text-[24px] font-bold text-text-primary">{completedSurveys}</span>
            <span className="text-xs lg:text-sm text-text-secondary">Completed</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#F3F4F6] p-4 lg:p-5 flex flex-col gap-2 lg:gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-xs lg:text-sm text-text-secondary">Reliability</span>
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                <HugeiconsIcon icon={StarIcon} size={15} className="text-[#D97706]"  />
              </div>
            </div>
            <span className="text-[20px] lg:text-[24px] font-bold text-text-primary">{reliabilityScore}%</span>
            <span className="text-xs lg:text-sm text-[#16A34A] font-medium">Excellent</span>
          </div>
        </div>

        {/* Quick earn banner */}
        <div className="bg-brand-primary rounded-[20px] lg:rounded-[30px] p-5 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <HugeiconsIcon icon={FlashIcon} size={24} className="text-white"  />
            </div>
            <div>
              <p className="text-white font-semibold text-base lg:text-lg">
                {RECENT_SURVEYS.length} new surveys available
              </p>
              <p className="text-white/70 text-sm lg:text-base">
                Earn up to ₦{RECENT_SURVEYS.reduce((a, s) => Math.max(a, s.reward), 0).toLocaleString()} today
              </p>
            </div>
          </div>
          <Link href="/earner/surveys" className="flex items-center gap-2 bg-white text-brand-primary font-medium px-4 py-2.5 lg:px-5 rounded-xl hover:bg-[#F8F9FC] transition-colors text-sm lg:text-base whitespace-nowrap">
            Browse Surveys <HugeiconsIcon icon={ArrowRight01Icon} size={16}  />
          </Link>
        </div>

        {/* Available surveys */}
        <div className="flex flex-col gap-4 lg:gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] lg:text-[24px] font-semibold text-text-primary">Available Surveys</h2>
            <Link href="/earner/surveys" className="btn-ghost text-sm flex items-center gap-1">
              View all <HugeiconsIcon icon={ArrowRight01Icon} size={14}  />
            </Link>
          </div>

          <div className="flex flex-col gap-3 lg:gap-4">
            {RECENT_SURVEYS.map((survey) => (
              <div
                key={survey.id}
                onClick={() => router.push(`/earner/surveys/${survey.id}`)}
                className="flex items-center justify-between p-4 lg:p-5 bg-white border border-[#F3F4F6] rounded-2xl hover:shadow-card-hover transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-[#EDE9FE] flex items-center justify-center flex-shrink-0">
                    <HugeiconsIcon icon={User02Icon} size={20} className="text-brand-primary" />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-sm lg:text-body font-semibold text-text-primary line-clamp-1">{survey.title}</h3>
                    <div className="flex items-center gap-2 lg:gap-3 text-xs lg:text-sm text-text-secondary">
                      <span className="flex items-center gap-1"><HugeiconsIcon icon={Clock01Icon} size={11}  /> {survey.duration}</span>
                      <span className="px-2 py-0.5 bg-[#EDE9FE] text-brand-primary rounded-full text-xs font-medium">
                        {survey.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-[16px] lg:text-[20px] font-bold text-text-primary">₦{survey.reward.toLocaleString()}</p>
                    <p className="text-xs lg:text-sm text-text-secondary">Reward</p>
                  </div>
                  <div className="flex items-center gap-1.5 lg:gap-2 bg-[#EDE9FE] text-brand-primary px-3 py-2 lg:px-4 rounded-xl text-sm lg:text-body font-medium group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <span className="hidden sm:inline">Start</span> <HugeiconsIcon icon={ArrowRight01Icon} size={14}  />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent earnings */}
        <div className="flex flex-col gap-4 lg:gap-5">
          <h2 className="text-[18px] lg:text-[24px] font-semibold text-text-primary">Recent Earnings</h2>
          <div className="grid grid-cols-3 gap-3 lg:gap-4">
            {[
              { label: "This week", amount: 2300, change: "+12%" },
              { label: "This month", amount: 8500, change: "+28%" },
              { label: "Last month", amount: 4000, change: "" },
            ].map(({ label, amount, change }) => (
              <div key={label} className="bg-white rounded-2xl border border-[#F3F4F6] p-3 lg:p-5 flex flex-col gap-1.5 lg:gap-2 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <p className="text-xs lg:text-sm text-text-secondary">{label}</p>
                <p className="text-[16px] lg:text-[24px] font-bold text-text-primary">₦{amount.toLocaleString()}</p>
                {change && (
                  <span className="text-xs lg:text-sm text-[#16A34A] font-medium">{change} vs prev.</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
