"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Activity01Icon,
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
  SparklesIcon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { useSurveyStore } from "@/store/survey.store";
import { useWalletStore } from "@/store/wallet.store";
import TransactionRow from "@/components/founder/TransactionRow";
import { PageTitle } from "@/components/ui/Primitives";
import { formatNairaFull } from "@/lib/utils";
import { Transaction } from "@/lib/types";

function StatCard({
  label,
  value,
  icon,
  highlighted,
}: {
  label: string;
  value: string;
  icon: typeof Activity01Icon;
  highlighted?: boolean;
}) {
  return (
    <div
      className="relative flex h-[150px] flex-col justify-between overflow-hidden rounded-[24px] p-6"
      style={{ background: highlighted ? "#4F46E5" : "#F8F9FC" }}
    >
      {highlighted && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-10" viewBox="0 0 320 150" preserveAspectRatio="none">
          <path d="M0 110 C80 60 160 150 320 70" stroke="white" strokeWidth="18" fill="none" />
          <path d="M0 140 C90 90 170 170 320 110" stroke="white" strokeWidth="10" fill="none" />
        </svg>
      )}
      <div className="relative flex items-center justify-between">
        <p className="text-[16px] tracking-[-0.02em]" style={{ color: highlighted ? "#E0E7FF" : "#111827" }}>
          {label}
        </p>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: highlighted ? "white" : "#4F46E5" }}
        >
          <HugeiconsIcon icon={icon} size={22} color={highlighted ? "#111827" : "white"} />
        </span>
      </div>
      <p className="relative text-[36px] font-semibold tracking-[-0.03em]" style={{ color: highlighted ? "white" : "#111827" }}>
        {value}
      </p>
    </div>
  );
}

function ListSection({ title, href, items }: { title: string; href: string; items: Transaction[] }) {
  return (
    <section className="rounded-[24px] bg-[#F8F9FC] p-4">
      <div className="flex items-center justify-between px-0 py-4">
        <h2 className="text-[20px] font-medium tracking-[-0.02em] text-[#111827]">{title}</h2>
        <Link href={href} className="inline-flex items-center gap-2 text-[14px] text-[#4F46E5]">
          View All <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="rounded-2xl bg-white px-4 py-8 text-center text-[14px] text-[#6B7280]">No transactions yet.</p>
        ) : (
          items.map((tx) => <TransactionRow key={tx.$id} tx={tx} />)
        )}
      </div>
    </section>
  );
}

export default function FounderDashboard() {
  const { user } = useAuthStore();
  const { surveys, fetchSurveys } = useSurveyStore();
  const { transactions, fetchTransactions } = useWalletStore();

  useEffect(() => {
    if (!user?.$id) return;
    fetchSurveys(user.$id);
    fetchTransactions(user.$id);
  }, [user?.$id, fetchSurveys, fetchTransactions]);

  const active = surveys.filter((s) => s.status === "live").length;
  const completed = surveys.filter((s) => s.status === "completed").length;
  const sorted = useMemo(
    () => [...transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [transactions]
  );
  const totalSpent = sorted.filter((t) => t.type === "escrow" || t.type === "debit").reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex flex-col gap-8 pt-14">
      <PageTitle title="Dashboard" subtitle="Turn your ideas into clear decisions using real user insights." />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Active ideas" value={String(active)} icon={Activity01Icon} highlighted />
        <StatCard label="Completed Ideas" value={String(completed)} icon={CheckmarkCircle02Icon} />
        <StatCard label="Total spent" value={formatNairaFull(totalSpent)} icon={Wallet02Icon} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative h-[250px] overflow-hidden rounded-[24px] bg-[#E0E7FF] p-8">
          <span className="absolute -right-10 -top-16 h-[180px] w-[180px] rounded-full bg-[#C7D2FE]/70" />
          <span className="absolute -bottom-24 -left-10 h-[200px] w-[200px] rounded-full bg-[#C7D2FE]/70" />
          <span className="absolute left-[145px] top-[25px] h-[200px] w-[200px] rounded-full bg-[#C7D2FE]/60" />
          <span className="absolute left-[190px] top-[70px] h-[110px] w-[110px] rounded-full bg-[#A5B4FC]/50" />
          <div className="relative">
            <p className="text-[18px] uppercase tracking-[-0.02em] text-[#111827]">Quick action</p>
            <p className="mt-8 text-[24px] tracking-[-0.03em] text-[#111827]">Submit a new idea</p>
            <p className="mt-1 text-[15px] text-[#111827]">AI will draft validation questions in seconds</p>
          </div>
          <Link
            href="/founder/ideas/new"
            className="absolute bottom-6 right-6 inline-flex h-[54px] items-center gap-2 rounded-xl bg-[#4F46E5] px-4 text-[16px] text-white hover:bg-[#4338CA]"
          >
            <HugeiconsIcon icon={SparklesIcon} size={22} /> Create with AI
          </Link>
        </div>

        <div className="relative h-[250px] rounded-[24px] bg-[#F8F9FC] p-10">
          <p className="text-[18px] uppercase tracking-[-0.02em] text-[#111827]">Manage</p>
          <p className="mt-8 text-[24px] tracking-[-0.03em] text-[#111827]">View all ideas</p>
          <p className="mt-1 text-[16px] text-[#6B7280]">Track active runs, drafts and reports</p>
          <Link href="/founder/ideas" className="absolute bottom-10 right-10 inline-flex items-center gap-2 text-[16px] text-[#4F46E5]">
            Open ideas <HugeiconsIcon icon={ArrowRight02Icon} size={22} />
          </Link>
        </div>
      </div>

      <ListSection title="Transaction History" href="/founder/wallet" items={sorted.slice(0, 5)} />
      <ListSection title="Recent Activity" href="/founder/wallet" items={sorted.slice(0, 3)} />
    </div>
  );
}
