"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useWalletStore } from "@/store/wallet.store";
import TopBar from "@/components/layout/TopBar";
import {
  ArrowRight, Clock, DollarSign, CheckCircle2, Star,
  TrendingUp, FileText, Zap
} from "lucide-react";
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

      <div className="px-8 py-8 flex flex-col gap-8">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-5">
          <div className="tiqra-card-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Wallet Balance</span>
              <div className="w-8 h-8 rounded-full bg-[#EDE9FE] flex items-center justify-center">
                <DollarSign size={16} className="text-brand-primary" />
              </div>
            </div>
            <span className="text-[24px] font-bold text-text-primary">₦{balance.toLocaleString()}</span>
            <Link href="/earner/wallet" className="text-sm text-brand-primary hover:underline">
              View wallet →
            </Link>
          </div>

          <div className="tiqra-card-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Total Earned</span>
              <div className="w-8 h-8 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                <TrendingUp size={16} className="text-[#16A34A]" />
              </div>
            </div>
            <span className="text-[24px] font-bold text-text-primary">₦{totalEarned.toLocaleString()}</span>
            <span className="text-sm text-text-secondary">All time</span>
          </div>

          <div className="tiqra-card-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Surveys Done</span>
              <div className="w-8 h-8 rounded-full bg-[#EDE9FE] flex items-center justify-center">
                <CheckCircle2 size={16} className="text-brand-primary" />
              </div>
            </div>
            <span className="text-[24px] font-bold text-text-primary">{completedSurveys}</span>
            <span className="text-sm text-text-secondary">Completed</span>
          </div>

          <div className="tiqra-card-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Reliability</span>
              <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                <Star size={16} className="text-[#D97706]" />
              </div>
            </div>
            <span className="text-[24px] font-bold text-text-primary">{reliabilityScore}%</span>
            <span className="text-sm text-[#16A34A] font-medium">Excellent</span>
          </div>
        </div>

        {/* Quick earn banner */}
        <div className="bg-brand-primary rounded-[30px] p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Zap size={28} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                {RECENT_SURVEYS.length} new surveys available
              </p>
              <p className="text-white/70">
                Earn up to ₦{RECENT_SURVEYS.reduce((a, s) => Math.max(a, s.reward), 0).toLocaleString()} today
              </p>
            </div>
          </div>
          <Link href="/earner/surveys" className="flex items-center gap-2 bg-white text-brand-primary font-medium px-5 py-2.5 rounded-xl hover:bg-[#F8F9FC] transition-colors">
            Browse Surveys <ArrowRight size={18} />
          </Link>
        </div>

        {/* Available surveys */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] font-semibold text-text-primary">Available Surveys</h2>
            <Link href="/earner/surveys" className="btn-ghost text-sm">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {RECENT_SURVEYS.map((survey) => (
              <div
                key={survey.id}
                onClick={() => router.push(`/earner/surveys/${survey.id}`)}
                className="flex items-center justify-between p-5 bg-white border border-[#F3F4F6] rounded-2xl hover:shadow-card-hover transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EDE9FE] flex items-center justify-center flex-shrink-0">
                    <FileText size={22} className="text-brand-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-body font-semibold text-text-primary">{survey.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                      <span className="flex items-center gap-1"><Clock size={13} /> {survey.duration}</span>
                      <span className="px-2 py-0.5 bg-[#EDE9FE] text-brand-primary rounded-full text-xs font-medium">
                        {survey.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[20px] font-bold text-text-primary">₦{survey.reward.toLocaleString()}</p>
                    <p className="text-sm text-text-secondary">Reward</p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#EDE9FE] text-brand-primary px-4 py-2 rounded-xl text-body font-medium group-hover:bg-brand-primary group-hover:text-white transition-all">
                    Start <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent earnings */}
        <div className="flex flex-col gap-5">
          <h2 className="text-[24px] font-semibold text-text-primary">Recent Earnings</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "This week", amount: 2300, change: "+12%" },
              { label: "This month", amount: 8500, change: "+28%" },
              { label: "Last month", amount: 4000, change: "" },
            ].map(({ label, amount, change }) => (
              <div key={label} className="tiqra-card-sm flex flex-col gap-2">
                <p className="text-sm text-text-secondary">{label}</p>
                <p className="text-[24px] font-bold text-text-primary">₦{amount.toLocaleString()}</p>
                {change && (
                  <span className="text-sm text-[#16A34A] font-medium">{change} vs prev.</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
