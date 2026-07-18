"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useSurveyStore } from "@/store/survey.store";
import { useWalletStore } from "@/store/wallet.store";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Activity01Icon, CheckmarkCircle01Icon, Wallet01Icon,
  ArrowRight01Icon, Search01Icon, Notification01Icon,
  Add01Icon, Idea01Icon
} from "@hugeicons/core-free-icons";
import { formatNairaShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

const MOCK_ACTIVITIES = [
  { id: "a1", title: "AI Resume Builder Survey", type: "Survey Live", amount: "₦25,000", date: "April 8 2026 · 10:30 AM", status: "live" },
  { id: "a2", title: "Freelancer Invoice Tool", type: "Survey Completed", amount: "₦18,500", date: "April 5 2026 · 02:14 PM", status: "completed" },
  { id: "a3", title: "Remote Work App", type: "Survey Draft", amount: "₦12,000", date: "April 2 2026 · 09:00 AM", status: "draft" },
];

const MOCK_TRANSACTIONS = [
  { id: "t1", title: "Wallet Top-up", type: "Credit", amount: "+₦50,000", date: "April 8 2026 · 10:30 AM", positive: true },
  { id: "t2", title: "Survey Escrow", type: "Debit", amount: "-₦25,000", date: "April 8 2026 · 11:00 AM", positive: false },
  { id: "t3", title: "Survey Escrow", type: "Debit", amount: "-₦18,500", date: "April 5 2026 · 02:14 PM", positive: false },
  { id: "t4", title: "Wallet Top-up", type: "Credit", amount: "+₦30,000", date: "April 2 2026 · 09:00 AM", positive: true },
];

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
  const balance = wallet?.balance ?? 0;
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 bg-[#FEFEFE] border-b border-[#E5E7EB]">
        <div className="flex flex-col gap-1">
          <h1 className="text-[40px] font-bold text-[#111827] leading-[1.5em] tracking-[-0.03em]">
            Dashboard
          </h1>
          <p className="text-[#6B7280] text-base tracking-[-0.02em]">
            Turn your ideas into clear decisions using real user insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 w-[300px]">
            <HugeiconsIcon icon={Search01Icon} size={22} className="text-[#111827]" />
            <span className="text-[#6B7280] text-sm tracking-[-0.02em]">Search</span>
          </div>
          {/* Bell — purple circle per Figma */}
          <div className="w-[60px] h-[60px] bg-[#9F4EF5] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#8B3DE8] transition-colors">
            <HugeiconsIcon icon={Notification01Icon} size={28} className="text-white" />
          </div>
        </div>
      </div>


      <div className="px-8 py-8 flex flex-col gap-8">
        {/* Stats row: 3 cards */}
        <div className="flex items-center gap-6">
          {/* Active Ideas — purple */}
          <div
            className="rounded-xl flex flex-col justify-between"
            style={{ width: 320, height: 150, background: "#9F4EF5", padding: "0" }}
          >
            <div className="px-7 pt-7">
              <p className="text-[#FEFEFE] text-lg tracking-[-0.02em]">Active Ideas</p>
            </div>
            <div className="px-7 pb-7 flex items-end justify-between">
              <span className="text-[#FEFEFE] text-[32px] font-semibold leading-[1.5em] tracking-[-0.03em]">
                {loading ? "…" : liveSurveys.length}
              </span>
              <div className="w-[60px] h-[60px] rounded-full border border-[#E5E7EB] flex items-center justify-center">
                <HugeiconsIcon icon={Activity01Icon} size={30} className="text-white" />
              </div>
            </div>
          </div>

          {/* Completed Ideas — white */}
          <div
            className="bg-white border border-[#E5E7EB] rounded-xl flex flex-col justify-between"
            style={{ width: 320, height: 150 }}
          >
            <div className="px-7 pt-7">
              <p className="text-[#6B7280] text-lg tracking-[-0.02em]">Completed Ideas</p>
            </div>
            <div className="px-7 pb-7 flex items-end justify-between">
              <span className="text-[#111827] text-[32px] font-semibold leading-[1.5em] tracking-[-0.03em]">
                {loading ? "…" : completedSurveys.length}
              </span>
              <div className="w-[60px] h-[60px] rounded-full bg-[#9F4EF5] flex items-center justify-center">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={30} className="text-white" />
              </div>
            </div>
          </div>

          {/* Total spent — white */}
          <div
            className="bg-white border border-[#E5E7EB] rounded-xl flex flex-col justify-between"
            style={{ width: 320, height: 150 }}
          >
            <div className="px-7 pt-7">
              <p className="text-[#6B7280] text-lg tracking-[-0.02em]">Total spent</p>
            </div>
            <div className="px-7 pb-7 flex items-end justify-between">
              <span className="text-[#111827] text-[32px] font-semibold leading-[1.5em] tracking-[-0.03em]">
                {formatNairaShort(balance)}
              </span>
              <div className="w-[60px] h-[60px] rounded-full bg-[#9F4EF5] flex items-center justify-center">
                <HugeiconsIcon icon={Wallet01Icon} size={30} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action + Manage row */}
        <div className="flex items-center gap-7">
          {/* Quick Action — brand/secondary lavender */}
          <div
            className="rounded-[20px] relative overflow-hidden flex flex-col justify-between"
            style={{ width: 490, height: 250, background: "#E5CAFC" }}
          >
            {/* Decorative circles */}
            <div className="absolute" style={{ width: 300, height: 300, borderRadius: "50%", background: "rgba(159,78,245,0.05)", top: -125, left: 357 }} />
            <div className="absolute" style={{ width: 200, height: 200, borderRadius: "50%", background: "rgba(159,78,245,0.05)", top: 25, left: 145 }}>
              <div className="absolute" style={{ width: 150, height: 150, borderRadius: "50%", background: "rgba(159,78,245,0.05)", top: 25, left: 25 }} />
            </div>
            <div className="absolute" style={{ width: 300, height: 300, borderRadius: "50%", background: "rgba(159,78,245,0.05)", bottom: -150, left: -116 }} />

            <div className="relative px-8 pt-7">
              <p className="text-[#111827] text-lg tracking-[-0.02em] mb-2">QUICK ACTION</p>
              <div className="flex flex-col gap-2">
                <h3 className="text-[#111827] text-[24px] font-semibold tracking-[-0.02em]">Submit a new idea</h3>
                <p className="text-[#111827] text-base tracking-[-0.02em]">AI will draft validation question in seconds</p>
              </div>
            </div>
            <div className="relative px-8 pb-7">
              <Link
                href="/founder/ideas/new"
                className="inline-flex items-center gap-2 bg-[#9F4EF5] text-white px-3 py-4 rounded-[16px] text-base tracking-[-0.02em] hover:bg-[#8B3DE8] transition-colors"
              >
                Start Now <HugeiconsIcon icon={ArrowRight01Icon} size={24} className="text-white" />
              </Link>
            </div>
          </div>

          {/* Manage — white card */}
          <div
            className="bg-white border border-[#E5E7EB] rounded-[20px] flex flex-col justify-between"
            style={{ width: 490, height: 250 }}
          >
            <div className="px-10 pt-7">
              <p className="text-[#111827] text-lg tracking-[-0.02em] mb-3">MANAGE</p>
              <div className="flex flex-col gap-2">
                <h3 className="text-[#111827] text-[24px] font-semibold tracking-[-0.02em]">View all ideas</h3>
                <p className="text-[#111827] text-base tracking-[-0.02em]">Track active runs, draft and reports</p>
              </div>
            </div>
            <div className="px-10 pb-7">
              <Link
                href="/founder/ideas"
                className="inline-flex items-center gap-2 text-[#9F4EF5] text-base tracking-[-0.02em] rounded-[16px] px-3 py-4 hover:bg-[#F8F9FC] transition-colors"
              >
                Open ideas <HugeiconsIcon icon={ArrowRight01Icon} size={24} className="text-[#9F4EF5]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="flex flex-col gap-3" style={{ width: 1017 }}>
          <div className="flex items-center justify-between">
            <h3 className="text-[#111827] text-[24px] font-semibold tracking-[-0.02em]">Recent Activities</h3>
            <Link
              href="/founder/ideas"
              className="flex items-center gap-2 bg-white border border-[#E5E7EB] px-4 py-4 rounded-[16px] text-[#9F4EF5] text-base"
            >
              View All <HugeiconsIcon icon={ArrowRight01Icon} size={24} className="text-[#9F4EF5]" />
            </Link>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-[30px] overflow-hidden">
            {MOCK_ACTIVITIES.map((act, idx) => (
              <div
                key={act.id}
                className={cn(
                  "flex items-center justify-between px-0 py-4",
                  idx < MOCK_ACTIVITIES.length - 1 && "border-b border-[#E5E7EB]"
                )}
                style={{ padding: "16px 0 18px" }}
              >
                <div className="flex items-center gap-3 pl-6">
                  <div className="w-[60px] h-[60px] rounded-full bg-[#F8F9FC] flex items-center justify-center flex-shrink-0">
                    <HugeiconsIcon icon={Idea01Icon} size={24} className="text-[#9F4EF5]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[#111827] text-lg font-medium tracking-[-0.02em]">{act.title}</p>
                    <p className="text-[#6B7280] text-base tracking-[-0.02em]">{act.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pr-6">
                  <p className="text-[#6B7280] text-base">{act.date}</p>
                  <div className="flex flex-col items-center gap-1" style={{ width: 140 }}>
                    <span className="text-[#111827] text-lg font-semibold tracking-[-0.02em]">{act.amount}</span>
                    <span className={cn(
                      "text-sm px-3 py-1 rounded-full",
                      act.status === "live" ? "bg-[#ECFDF5] text-[#16A34A]" :
                      act.status === "completed" ? "bg-[#EDE9FE] text-[#9F4EF5]" :
                      "bg-[#F8F9FC] text-[#6B7280]"
                    )}>
                      {act.status === "live" ? "● Live" : act.status === "completed" ? "✓ Completed" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="flex flex-col gap-3" style={{ width: 1017 }}>
          <div className="flex items-center justify-between">
            <h3 className="text-[#111827] text-[24px] font-semibold tracking-[-0.02em]">Recent Transactions</h3>
            <Link
              href="/founder/wallet"
              className="flex items-center gap-2 bg-white border border-[#E5E7EB] px-4 py-4 rounded-[16px] text-[#9F4EF5] text-base"
            >
              View All <HugeiconsIcon icon={ArrowRight01Icon} size={24} className="text-[#9F4EF5]" />
            </Link>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-[30px] overflow-hidden">
            {MOCK_TRANSACTIONS.map((tx, idx) => (
              <div
                key={tx.id}
                className={cn(
                  "flex items-center justify-between",
                  idx < MOCK_TRANSACTIONS.length - 1 && "border-b border-[#E5E7EB]"
                )}
                style={{ padding: "16px 0 18px" }}
              >
                <div className="flex items-center gap-3 pl-6">
                  <div className="w-[60px] h-[60px] rounded-full bg-[#F8F9FC] flex items-center justify-center flex-shrink-0">
                    <HugeiconsIcon icon={Wallet01Icon} size={24} className="text-[#9F4EF5]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[#111827] text-lg font-medium tracking-[-0.02em]">{tx.title}</p>
                    <p className="text-[#6B7280] text-base tracking-[-0.02em]">{tx.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-16 pr-6">
                  <p className="text-[#6B7280] text-base">{tx.date}</p>
                  <div className="flex flex-col items-center gap-1" style={{ width: 127 }}>
                    <span className={cn(
                      "text-lg font-semibold tracking-[-0.02em]",
                      tx.positive ? "text-[#16A34A]" : "text-[#DC2626]"
                    )}>{tx.amount}</span>
                    <span className={cn(
                      "text-sm px-3 py-1 rounded-full",
                      tx.positive ? "bg-[#ECFDF5] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"
                    )}>
                      {tx.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
