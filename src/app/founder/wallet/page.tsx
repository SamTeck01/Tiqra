"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useWalletStore } from "@/store/wallet.store";
import {
  Plus, ArrowUpRight, ArrowDownLeft, Clock, CreditCard, Wallet,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import TopBar from "@/components/layout/TopBar";

const MOCK_TRANSACTIONS = [
  { id: "t1", type: "debit", description: "Survey escrow – AI Resume Builder", amount: 25000, date: "2025-05-08", status: "completed" },
  { id: "t2", type: "debit", description: "Survey escrow – Freelancer Tools", amount: 40000, date: "2025-05-06", status: "completed" },
  { id: "t3", type: "credit", description: "Refund – Unused escrow", amount: 5000, date: "2025-05-04", status: "completed" },
  { id: "t4", type: "debit", description: "Survey escrow – Student Meal App", amount: 15000, date: "2025-04-28", status: "completed" },
  { id: "t5", type: "credit", description: "Wallet top-up", amount: 100000, date: "2025-04-20", status: "completed" },
];

export default function FounderWalletPage() {
  const { user } = useAuthStore();
  const { wallet, fetchWallet } = useWalletStore();

  useEffect(() => {
    if (user?.$id) fetchWallet(user.$id);
  }, [user?.$id]);

  const balance = wallet?.balance ?? 0;
  const totalSpent = wallet?.totalSpent ?? 75000;

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="Wallet"
        subtitle="Manage your funds and transactions."
        action={
          <Link href="/founder/wallet/fund" className="btn-primary">
            <Plus size={20} /> Fund Wallet
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
              <p className="text-white/60 text-sm">Total Escrowed</p>
              <p className="text-white text-lg font-medium">₦{totalSpent.toLocaleString()}</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex flex-col gap-1">
              <p className="text-white/60 text-sm">Wallet ID</p>
              <p className="text-white text-lg font-medium">TQ-{user?.$id?.slice(-6).toUpperCase() || "000000"}</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/founder/wallet/fund"
            className="flex items-center gap-4 p-5 bg-white border border-[#F3F4F6] rounded-2xl hover:shadow-card-hover transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
              <Plus size={22} className="text-[#16A34A]" />
            </div>
            <div className="text-left">
              <p className="text-body font-semibold text-text-primary">Add Funds</p>
              <p className="text-sm text-text-secondary">Top up your wallet</p>
            </div>
            <ChevronRight size={20} className="text-text-secondary ml-auto" />
          </Link>
          <Link
            href="/founder/wallet/add-method"
            className="flex items-center gap-4 p-5 bg-white border border-[#F3F4F6] rounded-2xl hover:shadow-card-hover transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#EDE9FE] flex items-center justify-center flex-shrink-0">
              <CreditCard size={22} className="text-brand-primary" />
            </div>
            <div className="text-left">
              <p className="text-body font-semibold text-text-primary">Payment Method</p>
              <p className="text-sm text-text-secondary">Card · Bank Transfer</p>
            </div>
            <ChevronRight size={20} className="text-text-secondary ml-auto" />
          </Link>
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
                className="flex items-center justify-between p-5 bg-white border border-[#F3F4F6] rounded-2xl hover:shadow-card-hover transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                      tx.type === "credit" ? "bg-[#DCFCE7]" : "bg-[#FEE2E2]"
                    )}
                  >
                    {tx.type === "credit" ? (
                      <ArrowDownLeft size={22} className="text-[#16A34A]" />
                    ) : (
                      <ArrowUpRight size={22} className="text-[#DC2626]" />
                    )}
                  </div>
                  <div>
                    <p className="text-body font-medium text-text-primary">{tx.description}</p>
                    <p className="text-sm text-text-secondary flex items-center gap-1">
                      <Clock size={12} /> {new Date(tx.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "text-body font-semibold",
                      tx.type === "credit" ? "text-[#16A34A]" : "text-[#DC2626]"
                    )}
                  >
                    {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-text-secondary capitalize">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
