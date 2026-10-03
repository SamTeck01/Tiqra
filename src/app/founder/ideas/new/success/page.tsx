"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Shield01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useSurveyStore } from "@/store/survey.store";
import { ghostBtn, primaryBtn } from "@/components/ui/Primitives";
import { estimateMinutes } from "@/lib/pricing";
import { cn, formatNairaShort } from "@/lib/utils";

function SuccessContent() {
  const id = useSearchParams().get("id");
  const { activeSurvey, fetchSurveyById, resetDraft } = useSurveyStore();

  useEffect(() => {
    if (id) fetchSurveyById(id);
    resetDraft();
  }, [id, fetchSurveyById, resetDraft]);

  const s = activeSurvey?.$id === id ? activeSurvey : null;
  const rows: [string, string][] = s
    ? [
        ["Survey title", s.title],
        ["Estimated time", estimateMinutes(s.questions.length)],
        ["Response needed", String(s.respondentsRequired)],
        ["Reward for earners", formatNairaShort(s.payoutPerResponse)],
        ["Submitted on", new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })],
      ]
    : [];

  return (
    <div className="mx-auto flex max-w-[473px] flex-col items-center py-16 text-center">
      <span className="flex h-[124px] w-[124px] items-center justify-center rounded-full bg-[#E8F8EE]">
        <span className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-[#16A34A]">
          <HugeiconsIcon icon={Tick02Icon} size={44} className="text-white" />
        </span>
      </span>
      <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.03em] text-[#111827]">Your idea has been submitted!</h1>
      <p className="mt-2 text-[16px] text-[#6B7280]">
        Great job! Your survey is now live and will be shared to Earners and we will notify you as soon as you start getting responses.
      </p>

      <div className="mt-6 w-full rounded-[24px] bg-[#F8F9FC] px-5 py-3">
        {rows.length === 0 ? (
          <div className="skeleton my-2 h-[180px]" />
        ) : (
          rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-3">
              <span className="text-[14px] text-[#6B7280]">{k}</span>
              <span className="text-right text-[16px] text-[#111827]">{v}</span>
            </div>
          ))
        )}
      </div>

      <p className="mt-5 flex w-full items-center gap-3 rounded-xl bg-[#E8F8EE] px-6 py-3 text-[14px] text-[#16A34A]">
        <HugeiconsIcon icon={Shield01Icon} size={20} /> We&apos;ll review responses as they come in.
      </p>

      <Link href="/founder/dashboard" className={cn(primaryBtn, "mt-6 h-[47px] w-full")}>
        Back to dashboard <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
      </Link>
      <Link href="/founder/ideas/new" className={cn(ghostBtn, "mt-2 h-[47px] w-full")}>Create another survey</Link>
    </div>
  );
}

export default function SubmittedPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
