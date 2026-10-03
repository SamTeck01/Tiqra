"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown02Icon, ArrowDownRight01Icon, ArrowRight02Icon, ArrowUpRight01Icon, Wallet02Icon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { useWalletStore } from "@/store/wallet.store";
import BalanceCard from "@/components/wallet/BalanceCard";
import TransactionRow from "@/components/shared/TransactionRow";
import { PageTitle, primaryBtn } from "@/components/ui/Primitives";
import { cn, formatNairaFull } from "@/lib/utils";

export default function EarnerWalletPage() {
  const { user } = useAuthStore();
  const { wallet, transactions, fetchWallet, fetchTransactions } = useWalletStore();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!user?.$id) return;
    fetchWallet(user.$id);
    fetchTransactions(user.$id);
  }, [user?.$id, fetchWallet, fetchTransactions]);

  const withdrawn = transactions.filter((t) => t.type === "withdrawal").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex flex-col gap-4 pt-8">
      <PageTitle title="Wallet" subtitle="Your earnings, ready to be withdrawn" />

      <div className="mt-2 grid gap-4 md:grid-cols-[1.45fr_0.5fr_0.5fr]">
        <BalanceCard balance={wallet?.balance ?? 0} variant="solid" />
        {[
          { label: "Total withdrawn", value: withdrawn, icon: ArrowUpRight01Icon },
          { label: "Total earned", value: wallet?.totalEarned ?? 0, icon: ArrowDown02Icon, green: true },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center justify-center gap-3 rounded-[20px] border border-[#E5E7EB] p-4 text-center">
            <p className="flex items-center gap-2 text-[14px]" style={{ color: s.green ? "#16A34A" : "#4F46E5" }}>
              <HugeiconsIcon icon={s.icon} size={18} /> {s.label}
            </p>
            <p className="text-[20px] text-[#111827]">{formatNairaFull(s.value)}</p>
          </div>
        ))}
      </div>
      {(wallet?.pendingBalance ?? 0) > 0 && (
        <p className="text-[13px] text-[#6B7280]">
          {formatNairaFull(wallet!.pendingBalance)} pending — rewards move to your balance once each survey is approved.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/earner/wallet/withdraw" className={cn(primaryBtn, "h-12")}>
          Withdraw <HugeiconsIcon icon={ArrowDownRight01Icon} size={20} />
        </Link>
        <Link
          href="/earner/wallet/payment-methods"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F8F9FC] text-[16px] text-[#4F46E5] hover:bg-[#EEF2FF]"
        >
          Manage account <HugeiconsIcon icon={Wallet02Icon} size={20} />
        </Link>
      </div>

      <section className="mt-4 rounded-[24px] bg-[#F8F9FC] px-3 pb-3">
        <div className="flex items-center justify-between py-4">
          <h2 className="text-[20px] font-medium tracking-[-0.02em] text-[#111827]">Transaction History</h2>
          {transactions.length > 5 && (
            <button onClick={() => setShowAll(!showAll)} className="inline-flex items-center gap-2 text-[14px] text-[#4F46E5]">
              {showAll ? "Show less" : "View All"} <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {transactions.length === 0 ? (
            <p className="rounded-2xl bg-white py-10 text-center text-[14px] text-[#6B7280]">No transactions yet. Answer a survey to start earning.</p>
          ) : (
            (showAll ? transactions : transactions.slice(0, 5)).map((tx) => <TransactionRow key={tx.$id} tx={tx} />)
          )}
        </div>
      </section>
    </div>
  );
}
