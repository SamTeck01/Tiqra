"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useWalletStore } from "@/store/wallet.store";
import {
  ArrowDownLeft, Clock, CreditCard, Wallet, ChevronRight,
  BanknoteIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import TopBar from "@/components/layout/TopBar";

const MOCK_TRANSACTIONS = [
  { id: "t1", type: "credit", description: "Survey reward – AI Resume Builder", amount: 500, date: "2025-05-08", status: "completed" },
  { id: "t2", type: "credit", description: "Survey reward – Freelancer Tools", amount: 800, date: "2025-05-07", status: "completed" },
  { id: "t3", type: "debit", description: "Withdrawal to Bank", amount: 5000, date: "2025-05-04", status: "completed" },
  { id: "t4", type: "credit", description: "Survey reward – Meal Planner App", amount: 600, date: "2025-04-30", status: "completed" },
  { id: "t5", type: "credit", description: "Bonus – Reliability reward", amount: 200, date: "2025-04-28", status: "completed" },
  { id: "t6", type: "credit", description: "Survey reward – Health Tracker", amount: 1000, date: "2025-04-25", status: "completed" },
];

export default function EarnerWalletPage() {
  const { user } = useAuthStore();
  const { wallet, fetchWallet } = useWalletStore();

  useEffect(() => {
    if (user?.$id) fetchWallet(user.$id);
  }, [user?.$id]);

  const balance = wallet?.balance ?? 12500;
  const totalEarned = wallet?.totalEarned ?? 28400;
  const pendingBalance = wallet?.pendingBalance ?? 1300;

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="Wallet"
        subtitle="Track your earnings and withdraw funds."
        action={
          <Link href="/earner/wallet/withdraw" className="btn-primary">
            <BanknoteIcon size={20} /> Withdraw
          </Link>
        }
      />

      <div className="px-8 py-8 flex flex-col gap-8">
        {/* Balance card */}
        <div className="bg-brand-primary rounded-[30px] p-8 flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-lg mb-1">Available Balance</p>
              <h2 className="text-[48px] font-bold text-white leading-none">
                ₦{balance.toLocaleString()}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Wallet size={28} className="text-white" />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-white/60 text-sm">Total Earned</p>
              <p className="text-white text-lg font-medium">₦{totalEarned.toLocaleString()}</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex flex-col gap-1">
              <p className="text-white/60 text-sm">Pending</p>
              <p className="text-white text-lg font-medium">₦{pendingBalance.toLocaleString()}</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex flex-col gap-1">
              <p className="text-white/60 text-sm">Reliability Score</p>
              <p className="text-white text-lg font-medium">{user?.reliabilityScore ?? 92}%</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "This week", value: "₦2,300", sub: "from 3 surveys" },
            { label: "This month", value: "₦8,500", sub: "from 11 surveys" },
            { label: "Surveys done", value: "24", sub: "all time" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-[#F8F9FC] rounded-2xl p-5 flex flex-col gap-1">
              <p className="text-sm text-text-secondary">{label}</p>
              <p className="text-[24px] font-bold text-text-primary">{value}</p>
              <p className="text-sm text-text-muted">{sub}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/earner/wallet/withdraw"
            className="flex items-center gap-4 p-5 bg-white border border-[#F3F4F6] rounded-2xl hover:shadow-card-hover transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#EDE9FE] flex items-center justify-center flex-shrink-0">
              <ArrowDownLeft size={22} className="text-brand-primary" />
            </div>
            <div className="text-left">
              <p className="text-body font-semibold text-text-primary">Withdraw Funds</p>
              <p className="text-sm text-text-secondary">Send to bank account</p>
            </div>
            <ChevronRight size={20} className="text-text-secondary ml-auto" />
          </Link>
          <div className="flex items-center gap-4 p-5 bg-white border border-[#F3F4F6] rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
              <CreditCard size={22} className="text-[#16A34A]" />
            </div>
            <div className="text-left">
              <p className="text-body font-semibold text-text-primary">Bank Details</p>
              <p className="text-sm text-text-secondary">Manage payout methods</p>
            </div>
            <ChevronRight size={20} className="text-text-secondary ml-auto" />
          </div>
        </div>

        {/* Transactions */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] font-semibold text-text-primary">Transaction History</h2>
            <button className="btn-ghost text-sm">View all</button>
          </div>

          <div className="flex flex-col gap-3">
            {MOCK_TRANSACTIONS.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-5 bg-white border border-[#F3F4F6] rounded-2xl hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                      tx.type === "credit" ? "bg-[#DCFCE7]" : "bg-[#FEE2E2]"
                    )}
                  >
                    <ArrowDownLeft
                      size={22}
                      className={tx.type === "credit" ? "text-[#16A34A]" : "text-[#DC2626] rotate-180"}
                    />
                  </div>
                  <div>
                    <p className="text-body font-medium text-text-primary">{tx.description}</p>
                    <p className="text-sm text-text-secondary flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(tx.date).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-body font-semibold",
                    tx.type === "credit" ? "text-[#16A34A]" : "text-[#DC2626]"
                  )}
                >
                  {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
