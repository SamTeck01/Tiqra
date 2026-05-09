"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSurveyStore } from "@/store/survey.store";
import { useAuthStore } from "@/store/auth.store";
import StepIndicator from "@/components/survey/StepIndicator";
import TopBar from "@/components/layout/TopBar";
import { ArrowRight01Icon, ArrowLeft01Icon, InformationCircleIcon, Loading02Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { formatNairaShort, calculateSurveyCost } from "@/lib/utils";
import { cn } from "@/lib/utils";

type ProcessingStep = "idle" | "verifying" | "escrow" | "notifying" | "activating" | "done";

export default function NewIdeaStep4() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { draft, createSurvey, resetDraft } = useSurveyStore();
  const [respondents, setRespondents] = useState(draft.respondents || 50);
  const [payoutPerResponse, setPayoutPerResponse] = useState(draft.payoutPerResponse || 300);
  const [processing, setProcessing] = useState<ProcessingStep>("idle");
  const [processingProgress, setProcessingProgress] = useState(0);

  const { respondentPayout, platformFee, total } = calculateSurveyCost(respondents, payoutPerResponse);

  const handleProceedToPay = async () => {
    if (!user) return;
    setProcessing("verifying");

    // Simulate payment processing
    const steps: ProcessingStep[] = ["verifying", "escrow", "notifying", "activating", "done"];
    let i = 0;

    const advance = () => {
      if (i < steps.length - 1) {
        i++;
        setProcessing(steps[i]);
        setProcessingProgress(Math.round((i / (steps.length - 1)) * 100));
        setTimeout(advance, 1500);
      } else {
        // Create survey
        createSurvey({
          title: draft.title,
          description: draft.problemStatement,
          creatorId: user.$id,
          status: "live",
          questions: draft.questions,
          respondentsRequired: respondents,
          respondentsCompleted: 0,
          payoutPerResponse,
          platformFee,
          totalCost: total,
          escrowAmount: total,
          aiReportGenerated: false,
          targetAudience: { country: "Nigeria", ageRange: { min: 18, max: 65 } },
          createdAt: new Date().toISOString(),
        });
        resetDraft();
        setTimeout(() => router.push("/founder/dashboard"), 1000);
      }
    };
    setTimeout(advance, 1500);
  };

  if (processing !== "idle") {
    const stepLabels: Record<string, string> = {
      verifying: "Verifying payment",
      escrow: "Locking ESCROW",
      notifying: "Notifying earners",
      activating: "Activating Survey",
      done: "Complete!",
    };
    const steps = ["verifying", "escrow", "notifying", "activating"];
    const currentIdx = steps.indexOf(processing);

    return (
      <div className="flex flex-col min-h-screen">
        <TopBar title="New Idea" subtitle="Step 4 Out of 4 - Processing." />
        <div className="px-8 py-8 flex flex-col gap-8 max-w-[860px]">
          <StepIndicator />

          <div className="flex flex-col items-center justify-center py-12 gap-10">
            {/* Spinner */}
            <div className="relative w-[200px] h-[200px]">
              <div className="absolute inset-0 rounded-full border-4 border-[#EDE9FE]" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-primary tiqra-spinner" />
              <div className="absolute inset-0 flex items-center justify-center">
                {processing === "done" ? (
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={48} className="text-brand-primary"  />
                ) : (
                  <HugeiconsIcon icon={Loading02Icon} size={48} className="text-brand-primary animate-spin"  />
                )}
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-h2 font-semibold text-text-primary">Processing your payment</h2>
              <p className="text-lg text-text-secondary mt-2">
                Locking {formatNairaShort(total)} into ESCROW and preparing your validation
              </p>
            </div>

            {/* Progress steps */}
            <div className="flex flex-col gap-6 w-full max-w-[610px]">
              {steps.map((step, i) => {
                const isDone = i < currentIdx || processing === "done";
                const isActive = i === currentIdx && processing !== "done";
                return (
                  <div key={step} className="process-step">
                    <div className="flex items-center gap-4 w-[200px]">
                      {isDone && <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} className="text-brand-primary"  />}
                      {isActive && <HugeiconsIcon icon={Loading02Icon} size={20} className="text-brand-primary animate-spin"  />}
                      {!isDone && !isActive && <div className="w-5 h-5 rounded-full border-2 border-[#E5E7EB]" />}
                      <span className={cn("text-[24px]", isDone || isActive ? "text-text-primary" : "text-text-secondary")}>
                        {stepLabels[step]}
                      </span>
                    </div>
                    <div className="w-[320px] h-3 rounded-full bg-[#EDE9FE] overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full transition-all duration-700"
                        style={{ width: isDone ? "100%" : isActive ? "75%" : "0%" }}
                      />
                    </div>
                    <span className="text-body text-text-secondary w-16 text-right">
                      {isDone ? "Done" : isActive ? "75%" : "------"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 bg-[#EDE9FE] rounded-xl px-5 py-4 w-full max-w-[610px]">
              <HugeiconsIcon icon={InformationCircleIcon} size={20} className="text-brand-primary flex-shrink-0"  />
              <p className="text-lg text-brand-primary font-semibold">Do not close this window</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="New Idea" subtitle="Step 4 Out of 4 - Setup Validations." />

      <div className="px-8 py-8 flex flex-col gap-8 max-w-[860px]">
        <StepIndicator />

        <div className="flex flex-col gap-8">
          {/* Respondents */}
          <div>
            <label className="tiqra-label">Respondents</label>
            <input
              type="number"
              value={respondents}
              onChange={(e) => setRespondents(Math.max(50, parseInt(e.target.value) || 50))}
              min={50}
              className="tiqra-input"
            />
            <p className="text-body text-text-secondary mt-2">
              Minimum 50 respondents. More respondents = higher confidence score
            </p>
          </div>

          {/* Payment per response */}
          <div>
            <label className="tiqra-label">Payment per response (₦)</label>
            <input
              type="number"
              value={payoutPerResponse}
              onChange={(e) => setPayoutPerResponse(Math.max(300, parseInt(e.target.value) || 300))}
              min={300}
              className="tiqra-input"
            />
            <p className="text-body text-text-secondary mt-2">
              Minimum ₦300 per response
            </p>
          </div>

          {/* Summary card */}
          <div className="bg-[#F8F9FC] rounded-[30px] border border-[#F3F4F6]">
            <div className="flex items-center px-6 py-5 border-b border-[#F3F4F6]">
              <h3 className="text-h3 font-semibold text-text-primary">Summary</h3>
            </div>
            <div className="flex flex-col divide-y divide-[#F3F4F6]">
              {[
                { label: "Respondents", value: respondents.toString() },
                { label: "Payout per response", value: formatNairaShort(payoutPerResponse) },
                { label: "Total respondent payout", value: formatNairaShort(respondentPayout) },
                { label: "Platform fee (15%)", value: formatNairaShort(platformFee) },
                { label: "Total", value: formatNairaShort(total) },
                { label: "Estimated completion", value: "1–2 days" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-6 py-4">
                  <span className="text-lg text-text-secondary">{label}</span>
                  <span className="text-h3 font-semibold text-text-primary">{value}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-[#F3F4F6]">
              <p className="text-lg text-text-primary">More responses = better accuracy</p>
            </div>
          </div>

          {/* Escrow notice */}
          <div className="flex items-start gap-3 bg-[#EDE9FE] rounded-xl px-5 py-4">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <HugeiconsIcon icon={InformationCircleIcon} size={16} className="text-white"  />
            </div>
            <p className="text-lg text-text-primary">
              Funds are held in ESCROW until validation completion. Released per verified responses only.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => { router.push("/founder/ideas/new/step3"); }}
            className="btn-secondary"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20}  />
            Back
          </button>
          <button onClick={handleProceedToPay} className="btn-primary">
            Proceed to pay {formatNairaShort(total)}
            <HugeiconsIcon icon={ArrowRight01Icon} size={20}  />
          </button>
        </div>
      </div>
    </div>
  );
}
