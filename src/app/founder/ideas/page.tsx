"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { useSurveyStore } from "@/store/survey.store";
import { PageTitle, Bar } from "@/components/ui/Primitives";
import { VERDICTS } from "@/lib/verdict";
import { Survey } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "live" | "completed" | "draft";

const TABS: { key: Tab; label: string }[] = [
  { key: "live", label: "Active ideas" },
  { key: "completed", label: "Completed ideas" },
  { key: "draft", label: "Draft" },
];

function percent(s: Survey) {
  return s.respondentsRequired ? Math.round((s.respondentsCompleted / s.respondentsRequired) * 100) : 0;
}

function ActiveCard({ s }: { s: Survey }) {
  return (
    <div className="rounded-[20px] bg-[#F8F9FC] p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[18px] tracking-[-0.02em] text-[#111827]">{s.title}</p>
        <span className="rounded-full bg-[#E0E7FF] px-3 py-1 text-[12px] text-[#4F46E5]">Live</span>
      </div>
      <p className="mt-2 text-[13px] text-[#6B7280]">
        {s.respondentsCompleted}/{s.respondentsRequired} responses . {percent(s)}% complete
      </p>
      <Bar value={percent(s)} className="mt-1" />
      <Link href={`/founder/ideas/${s.$id}/live`} className="mt-5 inline-flex items-center gap-2 px-2 text-[16px] text-[#4F46E5]">
        Live track <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
      </Link>
    </div>
  );
}

function ResultCard({ s }: { s: Survey }) {
  const isDraft = s.status === "draft";
  const v = s.verdict ? VERDICTS[s.verdict] : null;
  const color = isDraft || !v ? "#9CA3AF" : v.color;
  return (
    <div className="rounded-[20px] bg-[#F8F9FC] p-4">
      <p className="text-[16px] tracking-[-0.02em]" style={{ color }}>
        {isDraft ? "Draft" : v?.short} . {s.confidence ?? 0}% Confidence
      </p>
      <p className="mt-3 text-[18px] tracking-[-0.02em] text-[#111827]">{s.title}</p>
      <p className="text-[13px] text-[#6B7280]">{s.summary ?? s.description}</p>
      <div className="mt-2 flex items-center gap-2">
        <Bar value={isDraft ? 100 : s.confidence ?? 0} color={color} track="transparent" />
        <span className="whitespace-nowrap text-[12px] text-[#6B7280]">{s.respondentsCompleted} responses</span>
      </div>
      <Link
        href={isDraft ? "/founder/ideas/new/manual" : `/founder/ideas/${s.$id}/report`}
        className="mt-5 inline-flex items-center gap-2 px-2 text-[16px] text-[#4F46E5]"
      >
        {isDraft ? "Continue" : "View full report"} <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
      </Link>
    </div>
  );
}

export default function FounderIdeasPage() {
  const { user } = useAuthStore();
  const { surveys, fetchSurveys, loading } = useSurveyStore();
  const [tab, setTab] = useState<Tab>("live");

  useEffect(() => {
    if (user?.$id) fetchSurveys(user.$id);
  }, [user?.$id, fetchSurveys]);

  const count = (t: Tab) => surveys.filter((s) => s.status === t).length;
  const visible = surveys.filter((s) => s.status === tab);

  return (
    <div className="flex flex-col pt-14">
      <div className="flex flex-col gap-6">
        <PageTitle title="Ideas" subtitle="Manage everything you are validating." />
        <Link
          href="/founder/ideas/new"
          className="inline-flex h-14 items-center justify-center gap-3 self-end rounded-xl bg-[#4F46E5] px-12 text-[16px] text-white hover:bg-[#4338CA]"
        >
          <HugeiconsIcon icon={Add01Icon} size={22} /> Create an idea
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 rounded-[20px] bg-[#F8F9FC] p-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex h-14 items-center justify-center gap-2 rounded-2xl text-[14px] tracking-[-0.02em] sm:text-[18px]",
              tab === t.key ? "bg-[#E0E7FF] text-[#4F46E5]" : "text-[#9CA3AF]"
            )}
          >
            {t.label}
            <span
              className={cn(
                "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] text-white",
                tab === t.key ? "bg-[#4F46E5]" : "bg-[#9CA3AF]"
              )}
            >
              {count(t.key)}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {loading && surveys.length === 0 ? (
          [0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-[160px]" />)
        ) : visible.length === 0 ? (
          <p className="col-span-full rounded-[20px] bg-[#F8F9FC] py-16 text-center text-[16px] text-[#6B7280]">
            Nothing here yet.
          </p>
        ) : (
          visible.map((s) => (tab === "live" ? <ActiveCard key={s.$id} s={s} /> : <ResultCard key={s.$id} s={s} />))
        )}
      </div>
    </div>
  );
}
