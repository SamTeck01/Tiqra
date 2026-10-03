"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { useEarnerStore } from "@/store/earner.store";
import { ghostBtn, primaryBtn } from "@/components/ui/Primitives";
import { cn, formatNairaFull } from "@/lib/utils";

export default function SurveySubmittedPage() {
  useParams();
  const result = useEarnerStore((s) => s.lastResult);

  if (result && !result.accepted) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[473px] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#111827]">Response not accepted</h1>
        <p className="mt-2 text-[16px] text-[#6B7280]">
          Our quality checks flagged this response ({result.flags.join(", ").toLowerCase()}), so it can&apos;t be paid. Careful, honest answers raise your reliability score and unlock more surveys.
        </p>
        <Link href="/earner/surveys" className={cn(primaryBtn, "mt-6 h-[47px] w-full")}>Browse more survey</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[473px] flex-col items-center justify-center px-4 text-center">
      <span className="flex h-[124px] w-[124px] items-center justify-center rounded-full bg-[#E8F8EE]">
        <span className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-[#16A34A]">
          <HugeiconsIcon icon={Tick02Icon} size={44} className="text-white" />
        </span>
      </span>
      <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.03em] text-[#111827]">Survey submitted!!</h1>
      <p className="mt-2 text-[16px] text-[#6B7280]">Thank you!! Your response has been received successfully.</p>

      <div className="mt-6 w-full rounded-[24px] bg-[#E8F8EE] px-5 py-5 text-left">
        <p className="flex items-center gap-3 text-[14px] text-[#111827]">
          You earned
          <span className="text-[22px] text-[#16A34A]">{result ? formatNairaFull(result.reward) : "—"}</span>
        </p>
        <p className="mt-2 text-[14px] text-[#111827]">The reward will be added to your wallet once the survey is approved.</p>
      </div>

      <Link href="/earner/dashboard" className={cn(primaryBtn, "mt-6 h-[47px] w-full")}>Back to dashboard</Link>
      <Link href="/earner/surveys" className={cn(ghostBtn, "mt-2 h-[47px] w-full")}>Browse more survey</Link>
    </div>
  );
}
