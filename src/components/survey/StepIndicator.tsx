"use client";

import { useSurveyStore } from "@/store/survey.store";
import { cn } from "@/lib/utils";

const STEPS = ["Define Idea", "Generate Questions", "Review Questions", "Setup Validation"];

export default function StepIndicator() {
  const { draft } = useSurveyStore();
  const currentStep = draft.step;

  return (
    <div className="flex items-center gap-0 w-full max-w-[600px]">
      {STEPS.map((label, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const isInactive = stepNum > currentStep;

        return (
          <div key={stepNum} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "step-dot",
                  isCompleted && "completed",
                  isActive && "active",
                  isInactive && "inactive"
                )}
              >
                {stepNum}
              </div>
              <span
                className={cn(
                  "text-sm whitespace-nowrap",
                  isActive ? "text-text-primary font-medium" : "text-text-secondary"
                )}
              >
                {label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={cn("step-line mb-5", isCompleted && "completed")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
