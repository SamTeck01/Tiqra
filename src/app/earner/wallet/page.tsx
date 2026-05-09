"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useWalletStore } from "@/store/wallet.store";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDownLeft01Icon, ArrowUpRight01Icon, Clock01Icon, CreditCardIcon, Wallet01Icon, ArrowRight01Icon, BankIcon } from "@hugeicons/core-free-icons";;
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
          <Link href="/earner/wallet/withdraw" className="btn-primary text-sm lg:text-base px-3 lg:px-6 py-2 lg:py-3">
            <HugeiconsIcon icon={BankIcon} size={18}  /> <span className="hidden sm:inline">Withdraw</span>
          </Link>
        }
      />

      <div className="page-content flex flex-col gap-6 lg:gap-8">
        {/* Balance card */}
        <div className="bg-brand-primary rounded-[20px] lg:rounded-[30px] p-5 lg:p-8 flex flex-col gap-4 lg:gap-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-sm lg:text-lg mb-1">Available Balance</p>
              <h2 className="text-[36px] lg:text-[48px] font-bold text-white leading-none">
                ₦{balance.toLocaleString()}
              </h2>
            </div>
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <HugeiconsIcon icon={Wallet01Icon} size={24} className="text-white"  />
            </div>
          </div>
          <div className="flex gap-4 lg:gap-6 flex-wrap">
            <div className="flex flex-col gap-1">
              <p className="text-white/60 text-xs lg:text-sm">Total Earned</p>
              <p className="text-white text-base lg:text-lg font-medium">₦{totalEarned.toLocaleString()}</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex flex-col gap-1">
              <p className="text-white/60 text-xs lg:text-sm">Pending</p>
              <p className="text-white text-base lg:text-lg font-medium">₦{pendingBalance.toLocaleString()}</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex flex-col gap-1">
              <p className="text-white/60 text-xs lg:text-sm">Reliability</p>
              <p className="text-white text-base lg:text-lg font-medium">{user?.reliabilityScore ?? 92}%</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 lg:gap-4">
          {[
            { label: "This week", value: "₦2,300", sub: "from 3 surveys" },
            { label: "This month", value: "₦8,500", sub: "from 11 surveys" },
            { label: "Surveys done", value: "24", sub: "all time" },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-[#F8F9FC] rounded-2xl p-3 lg:p-5 flex flex-col gap-1">
              <p className="text-xs lg:text-sm text-text-secondary">{label}</p>
              <p className="text-[18px] lg:text-[24px] font-bold text-text-primary">{value}</p>
              <p className="text-xs text-text-muted hidden sm:block">{sub}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
          <Link
            href="/earner/wallet/withdraw"
            className="flex items-center gap-3 lg:gap-4 p-4 lg:p-5 bg-white border border-[#F3F4F6] rounded-2xl hover:shadow-card-hover transition-all"
          >
            <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-[#EDE9FE] flex items-center justify-center flex-shrink-0">
              <HugeiconsIcon icon={ArrowDownLeft01Icon} size={20} className="text-brand-primary"  />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm lg:text-body font-semibold text-text-primary">Withdraw Funds</p>
              <p className="text-xs lg:text-sm text-text-secondary">Send to bank account</p>
            </div>
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-text-secondary"  />
          </Link>
          <div className="flex items-center gap-3 lg:gap-4 p-4 lg:p-5 bg-white border border-[#F3F4F6] rounded-2xl">
            <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
              <HugeiconsIcon icon={CreditCardIcon} size={20} className="text-[#16A34A]"  />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm lg:text-body font-semibold text-text-primary">Bank Details</p>
              <p className="text-xs lg:text-sm text-text-secondary">Manage payout methods</p>
            </div>
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-text-secondary"  />
          </div>
        </div>

        {/* Transactions */}
        <div className="flex flex-col gap-4 lg:gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] lg:text-[24px] font-semibold text-text-primary">Transaction History</h2>
            <button className="btn-ghost text-sm">View all</button>
          </div>

          <div className="flex flex-col gap-2 lg:gap-3">
            {MOCK_TRANSACTIONS.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 lg:p-5 bg-white border border-[#F3F4F6] rounded-2xl hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
                  <div
                    className={cn(
                      "w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0",
                      tx.type === "credit" ? "bg-[#DCFCE7]" : "bg-[#FEE2E2]"
                    )}
                  >
                    {tx.type === "credit" ? (
                      <HugeiconsIcon icon={ArrowDownLeft01Icon} size={20} className="text-[#16A34A]"  />
                    ) : (
                      <HugeiconsIcon icon={ArrowUpRight01Icon} size={20} className="text-[#DC2626]"  />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm lg:text-body font-medium text-text-primary truncate">{tx.description}</p>
                    <p className="text-xs lg:text-sm text-text-secondary flex items-center gap-1">
                      <HugeiconsIcon icon={Clock01Icon} size={11}  />
                      {new Date(tx.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-sm lg:text-body font-semibold flex-shrink-0 ml-2",
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
