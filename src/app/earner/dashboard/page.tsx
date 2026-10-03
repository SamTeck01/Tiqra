"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, CheckmarkCircle02Icon, ChartIncreaseIcon, Clock01Icon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { useEarnerStore } from "@/store/earner.store";
import { useWalletStore } from "@/store/wallet.store";
import StatCard from "@/components/shared/StatCard";
import TransactionRow from "@/components/shared/TransactionRow";
import SurveyCard from "@/components/earner/SurveyCard";
import Modal from "@/components/ui/Modal";
import { PageTitle, Ring, primaryBtn } from "@/components/ui/Primitives";
import { cn, formatNairaFull } from "@/lib/utils";

function SectionHeader({ title, href, label = "View All" }: { title: string; href: string; label?: string }) {
  return (
    <div className="flex items-center justify-between py-4">
      <h2 className="text-[20px] font-medium tracking-[-0.02em] text-[#111827]">{title}</h2>
      <Link href={href} className="inline-flex items-center gap-2 text-[14px] text-[#4F46E5]">
        {label} <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
      </Link>
    </div>
  );
}

function EmptyActivity() {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-12 text-center">
      <div className="relative h-[90px] w-[160px]" aria-hidden>
        <span className="absolute left-[40px] top-0 h-[90px] w-[80px] rounded-lg bg-[#F8F9FC] shadow-sm" />
        <span className="absolute left-0 top-[30px] h-[34px] w-[160px] rounded-lg bg-white shadow-md" />
        <span className="absolute left-3 top-[40px] h-1 w-[60px] rounded bg-[#E5E7EB]" />
        <span className="absolute left-[88px] top-[40px] h-1 w-[60px] rounded bg-[#E5E7EB]" />
      </div>
      <p className="mt-6 text-[18px] font-semibold text-[#111827]">No Activities yet</p>
      <p className="mt-1 max-w-[260px] text-[13px] text-[#6B7280]">
        You haven&apos;t engaged in any activity, answer some surveys to get started.
      </p>
    </div>
  );
}

export default function EarnerDashboard() {
  const { user } = useAuthStore();
  const { available, completedCount, fetchAvailable, loading } = useEarnerStore();
  const { wallet, transactions, fetchWallet, fetchTransactions } = useWalletStore();
  const [dismissed, setDismissed] = useState(false);
  const needsProfile = !!user && !user.demographics;

  useEffect(() => {
    if (!user?.$id) return;
    fetchAvailable();
    fetchWallet(user.$id);
    fetchTransactions(user.$id);
  }, [user?.$id, fetchAvailable, fetchWallet, fetchTransactions]);

  const recent = useMemo(
    () => [...transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3),
    [transactions]
  );

  return (
    <div className="flex flex-col gap-8 pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageTitle title="Dashboard" subtitle="Answer surveys, share your opinions and earn money." />
        <Link href="/earner/surveys" className={cn(primaryBtn, "h-[52px] px-14")}>Start Survey</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total earnings" value={formatNairaFull(wallet?.totalEarned ?? 0)} icon={ChartIncreaseIcon} highlighted />
        <StatCard label="Pending earnings" value={formatNairaFull(wallet?.pendingBalance ?? 0)} icon={Clock01Icon} />
        <StatCard label="Completed Survey" value={String(completedCount)} icon={CheckmarkCircle02Icon} />
      </div>

      <section className="rounded-[24px] bg-[#F8F9FC] px-3 pb-3">
        <SectionHeader title="Available Surveys" href="/earner/surveys" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {loading && available.length === 0
            ? [0, 1, 2].map((i) => <div key={i} className="skeleton h-[130px]" />)
            : available.slice(0, 9).map((s) => <SurveyCard key={s.$id} survey={s} />)}
        </div>
        {!loading && available.length === 0 && (
          <p className="rounded-2xl bg-white py-10 text-center text-[14px] text-[#6B7280]">
            {needsProfile ? "Complete your profile to see surveys that match you." : "No surveys match your profile right now. Check back soon."}
          </p>
        )}
      </section>

      <section className="rounded-[24px] bg-[#F8F9FC] px-3 pb-3">
        <SectionHeader title="Recent Activity" href="/earner/wallet" />
        {recent.length === 0 ? (
          <EmptyActivity />
        ) : (
          <div className="flex flex-col gap-3">
            {recent.map((tx) => (
              <TransactionRow key={tx.$id} tx={tx} />
            ))}
          </div>
        )}
      </section>

      <Modal open={needsProfile && !dismissed} onClose={() => setDismissed(true)} className="max-w-[460px] px-4 py-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="text-[24px] font-medium tracking-[-0.02em] text-[#111827]">Complete your profile</p>
            <p className="mt-3 text-[15px] text-[#6B7280]">
              Complete your demographic profile to unlock surveys, track your earnings and withdraw your money.
            </p>
          </div>
          <Ring value={33} size={64} stroke={6}>
            <span className="text-[16px] text-[#111827]">1/3</span>
          </Ring>
        </div>
        <Link href="/earner/profile" className={cn(primaryBtn, "mx-auto mt-5 flex h-[46px] w-[188px]")}>
          Let&apos;s get started
        </Link>
      </Modal>
    </div>
  );
}
