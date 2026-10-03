"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { useSurveyStore } from "@/store/survey.store";
import { useWalletStore } from "@/store/wallet.store";
import { LoadingModal } from "@/components/ui/Modal";
import { BackLink, FlowProgress, PageTitle, primaryBtn } from "@/components/ui/Primitives";
import { surveyTitleFrom } from "@/lib/ai";
import { MIN_RESPONDENTS, PAY_PER_QUESTION, calculateSurveyCost, estimateCompletion } from "@/lib/pricing";
import { cn, formatNairaShort } from "@/lib/utils";

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[16px] text-[#6B7280]">{label}</span>
      <span className={cn("text-[20px] tracking-[-0.02em] text-[#111827]", strong && "font-semibold")}>{value}</span>
    </div>
  );
}

export default function SetupValidationPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { draft, setDraftField, createSurvey } = useSurveyStore();
  const { wallet, fetchWallet, payForSurvey } = useWalletStore();
  const [respondentsInput, setRespondentsInput] = useState(String(draft.respondents));
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (draft.questions.length === 0) router.replace("/founder/ideas/new");
  }, [draft.questions.length, router]);

  useEffect(() => {
    if (user?.$id) fetchWallet(user.$id);
  }, [user?.$id, fetchWallet]);

  const respondents = Number(respondentsInput) || 0;
  const valid = respondents >= MIN_RESPONDENTS;
  const questionCount = draft.questions.length;
  const cost = calculateSurveyCost(questionCount, Math.max(respondents, 0));
  const balance = wallet?.balance ?? 0;
  const enoughFunds = balance >= cost.total;

  const pay = async () => {
    if (!user || !valid) return;
    setError("");
    setProcessing(true);
    const title = surveyTitleFrom(draft.intake);
    try {
      await payForSurvey(user.$id, cost.total, title);
      const survey = await createSurvey({
        title,
        description: draft.intake.problem,
        summary: draft.intake.solution || draft.intake.problem,
        intake: draft.intake,
        creatorId: user.$id,
        status: "live",
        questions: draft.questions,
        targetAudience: { country: "Nigeria", ageRange: { min: 18, max: 65 } },
        respondentsRequired: respondents,
        respondentsCompleted: 0,
        payoutPerResponse: cost.payoutPerResponse,
        platformFee: cost.platformFee,
        totalCost: cost.total,
        escrowAmount: cost.total,
        aiReportGenerated: false,
        createdAt: new Date().toISOString(),
      });
      setDraftField("respondents", respondents);
      router.push(`/founder/ideas/new/success?id=${survey.$id}`);
    } catch (e) {
      setProcessing(false);
      setError(e instanceof Error ? e.message : "Payment failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col pt-8">
      <BackLink href="/founder/ideas/new/questions" />
      <FlowProgress step={3} />
      <PageTitle className="mt-8" title="New Idea" subtitle="Setup Validations" />

      <div className="mt-10 flex flex-col gap-4 px-0 sm:px-4">
        <label className="flex flex-col gap-2">
          <span className="text-[16px] text-[#111827]">Respondents</span>
          <input
            type="number"
            min={MIN_RESPONDENTS}
            inputMode="numeric"
            value={respondentsInput}
            onChange={(e) => setRespondentsInput(e.target.value)}
            placeholder={`${MIN_RESPONDENTS} minimum`}
            className="h-12 rounded-xl border border-[#E5E7EB] px-3 text-[14px] text-[#111827] focus:border-[#4F46E5] focus:outline-none"
          />
          {!valid && <span className="text-[13px] text-[#DC2626]">Minimum of {MIN_RESPONDENTS} respondents.</span>}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[16px] text-[#111827]">Payment per response (₦)</span>
          <input
            readOnly
            value={`${formatNairaShort(cost.payoutPerResponse)}  ·  ${questionCount} questions × ${formatNairaShort(PAY_PER_QUESTION)}`}
            className="h-12 cursor-default rounded-xl border border-[#E5E7EB] bg-[#F8F9FC] px-3 text-[14px] text-[#6B7280] focus:outline-none"
          />
        </label>

        <div className="rounded-[24px] bg-[#F8F9FC]">
          <p className="border-b border-[#E5E7EB] px-4 py-4 text-[20px] font-medium tracking-[-0.02em] text-[#111827]">Summary</p>
          <Row label="Respondents" value={String(respondents)} />
          <Row label="Payout per response" value={formatNairaShort(cost.payoutPerResponse)} />
          <Row label="Respondent payouts" value={formatNairaShort(cost.respondentPayout)} />
          <Row label={`Platform fee (${Math.round(cost.feeRate * 100)}%)`} value={formatNairaShort(cost.platformFee)} />
          <Row label="Total" value={formatNairaShort(cost.total)} strong />
          <Row label="Estimated completion" value={estimateCompletion(respondents)} />
          <p className="border-t border-[#E5E7EB] px-4 py-4 text-[14px] text-[#6B7280]">More responses = better accuracy</p>
        </div>

        <p className="flex items-center gap-2 self-start rounded-lg bg-[#E0E7FF] px-3 py-2 text-[13px] text-[#111827]">
          <HugeiconsIcon icon={InformationCircleIcon} size={18} className="text-[#4F46E5]" />
          Funds are held in ESCROW until validation completion. Released per verified responses only.
        </p>

        {!enoughFunds && valid && (
          <p className="text-[14px] text-[#DC2626]">
            Your wallet balance is {formatNairaShort(balance)}.{" "}
            <Link href="/founder/wallet/fund" className="text-[#4F46E5] underline">Fund your wallet</Link> to continue.
          </p>
        )}
        {error && <p className="text-[14px] text-[#DC2626]">{error}</p>}
      </div>

      <button
        disabled={!valid || !enoughFunds || processing}
        onClick={pay}
        className={cn(primaryBtn, "mx-auto mt-6 h-[52px] w-full max-w-[400px]")}
      >
        Proceed to pay {formatNairaShort(cost.total)}
      </button>

      <LoadingModal
        open={processing}
        title="Processing your payment"
        subtitle={`Locking ${formatNairaShort(cost.total)} into ESCROW and preparing your validation`}
      />
    </div>
  );
}
