"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  AddCircleIcon,
  ArrowDownRight01Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  CreditCardIcon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { useWalletStore } from "@/store/wallet.store";
import BalanceCard from "@/components/wallet/BalanceCard";
import { CardBrand } from "@/components/wallet/Visuals";
import TransactionRow from "@/components/shared/TransactionRow";
import { PageTitle, primaryBtn } from "@/components/ui/Primitives";
import { cn, formatNairaFull } from "@/lib/utils";

export default function FounderWalletPage() {
  const { user } = useAuthStore();
  const { wallet, transactions, methods, fetchWallet, fetchTransactions, fetchMethods, setDefaultMethod, removeMethod } = useWalletStore();
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!user?.$id) return;
    fetchWallet(user.$id);
    fetchTransactions(user.$id);
    fetchMethods(user.$id);
  }, [user?.$id, fetchWallet, fetchTransactions, fetchMethods]);

  const cards = methods.filter((m) => m.kind === "card");
  const totalSpent = transactions.filter((t) => t.type === "escrow" || t.type === "debit").reduce((s, t) => s + t.amount, 0);
  const totalAdded = transactions.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex flex-col gap-6 pt-8">
      <PageTitle title="Wallet" subtitle="Manage your balance, transactions and payment methods." />

      <div className="grid gap-6 md:grid-cols-[1.75fr_1fr]">
        <BalanceCard balance={wallet?.balance ?? 0} variant="soft">
          <Link href="/founder/wallet/fund" className={cn(primaryBtn, "h-[50px]")}>
            Add funds <HugeiconsIcon icon={Add01Icon} size={20} />
          </Link>
          <Link
            href="/founder/wallet/withdraw"
            className="inline-flex h-[50px] items-center justify-center gap-2 rounded-xl bg-white text-[16px] text-[#111827] hover:bg-[#F8F9FC]"
          >
            Withdraw <HugeiconsIcon icon={ArrowDownRight01Icon} size={20} />
          </Link>
        </BalanceCard>

        <div className="rounded-[24px] p-2 shadow-[0_4px_24px_rgba(17,24,39,0.06)]">
          <p className="px-2 py-4 text-[18px] tracking-[-0.02em] text-[#111827]">Wallet Summary</p>
          {[
            { label: "Total Spent", value: totalSpent, icon: CreditCardIcon, color: "#4F46E5", bg: "#E0E7FF" },
            { label: "Add funds", value: totalAdded, icon: AddCircleIcon, color: "#16A34A", bg: "#E8F8EE" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3 border-t border-[#F3F4F6] px-2 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: row.bg }}>
                <HugeiconsIcon icon={row.icon} size={18} color={row.color} />
              </span>
              <div className="flex-1">
                <p className="text-[12px] text-[#6B7280]">{row.label}</p>
                <p className="text-[16px] text-[#111827]">{formatNairaFull(row.value)}</p>
              </div>
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-[#6B7280]" />
            </div>
          ))}
        </div>
      </div>

      <section className="rounded-[24px] bg-[#F8F9FC] px-3 pb-3">
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
            <p className="rounded-2xl bg-white py-10 text-center text-[14px] text-[#6B7280]">No transactions yet.</p>
          ) : (
            (showAll ? transactions : transactions.slice(0, 5)).map((tx) => <TransactionRow key={tx.$id} tx={tx} />)
          )}
        </div>
      </section>

      <section className="rounded-[24px] bg-[#F8F9FC] p-3">
        <h2 className="px-1 pt-2 text-[22px] font-medium tracking-[-0.02em] text-[#111827]">Payment Methods</h2>
        <p className="px-1 text-[14px] text-[#6B7280]">Manage your saved payment methods</p>
        <div className="mt-4 flex flex-col gap-2">
          {cards.map((c) => (
            <div key={c.$id} className="relative flex items-center gap-3 rounded-2xl bg-white px-3 py-3">
              <CardBrand />
              <div className="flex-1">
                <p className="flex items-center gap-2 text-[16px] text-[#111827]">
                  **** **** **** {c.last4}
                  {c.isDefault && <span className="rounded-full border border-[#16A34A] px-2 text-[12px] text-[#16A34A]">Primary</span>}
                </p>
                <p className="text-[12px] text-[#6B7280]">Expires {c.expiry}</p>
              </div>
              <button aria-label="Card options" onClick={() => setMenuFor(menuFor === c.$id ? null : c.$id)} className="p-2 text-[#111827]">
                <HugeiconsIcon icon={MoreHorizontalIcon} size={20} />
              </button>
              {menuFor === c.$id && user && (
                <div className="absolute right-3 top-12 z-10 w-44 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
                  {!c.isDefault && (
                    <button
                      onClick={() => setDefaultMethod(user.$id, c.$id).then(() => setMenuFor(null))}
                      className="block w-full px-4 py-2 text-left text-[14px] text-[#111827] hover:bg-[#F8F9FC]"
                    >
                      Make primary
                    </button>
                  )}
                  <button
                    onClick={() => removeMethod(user.$id, c.$id).then(() => setMenuFor(null))}
                    className="block w-full px-4 py-2 text-left text-[14px] text-[#DC2626] hover:bg-[#FEF2F2]"
                  >
                    Remove card
                  </button>
                </div>
              )}
            </div>
          ))}
          <Link
            href="/founder/wallet/add-method"
            className="flex h-[52px] items-center justify-center gap-2 rounded-xl border border-dashed border-[#4F46E5] text-[16px] text-[#4F46E5] hover:bg-[#EEF2FF]"
          >
            <HugeiconsIcon icon={AddCircleIcon} size={20} /> Add Payment Method
          </Link>
        </div>
      </section>
    </div>
  );
}
