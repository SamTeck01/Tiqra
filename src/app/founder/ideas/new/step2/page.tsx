"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSurveyStore } from "@/store/survey.store";
import StepIndicator from "@/components/survey/StepIndicator";
import TopBar from "@/components/layout/TopBar";
import { Loading02Icon, CheckmarkCircle01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { Question } from "@/lib/types";
import { ID } from "appwrite";

const AI_STEPS = [
  { label: "Analyzing your idea", delay: 800 },
  { label: "Generating validation questions", delay: 2000 },
  { label: "Applying Truth Layer filters", delay: 3200 },
  { label: "Optimizing for accuracy", delay: 4000 },
];

// Mock AI question generation
function generateMockQuestions(title: string, problem: string): Question[] {
  return [
    {
      id: ID.unique(),
      text: `Have you ever personally experienced the problem that ${title} aims to solve?`,
      type: "yes_no",
      required: true,
      order: 1,
    },
    {
      id: ID.unique(),
      text: "How often do you encounter this problem?",
      type: "multiple_choice",
      options: ["Daily", "Weekly", "Monthly", "Rarely", "Never"],
      required: true,
      order: 2,
    },
    {
      id: ID.unique(),
      text: "How would you rate the severity of this problem on a scale of 1-10?",
      type: "scale",
      required: true,
      order: 3,
    },
    {
      id: ID.unique(),
      text: "What solutions have you tried so far?",
      type: "short_text",
      required: false,
      order: 4,
    },
    {
      id: ID.unique(),
      text: "Would you pay for a solution to this problem?",
      type: "yes_no",
      required: true,
      order: 5,
    },
    {
      id: ID.unique(),
      text: "How much would you be willing to pay per month for this solution?",
      type: "multiple_choice",
      options: ["Less than ₦1,000", "₦1,000 - ₦5,000", "₦5,000 - ₦15,000", "₦15,000+", "Not willing to pay"],
      required: true,
      order: 6,
    },
    {
      id: ID.unique(),
      text: "Which feature would you find most valuable?",
      type: "short_text",
      required: false,
      order: 7,
    },
    {
      id: ID.unique(),
      text: "What is the capital city of Nigeria?", // honeypot
      type: "multiple_choice",
      options: ["Lagos", "Abuja", "Kano", "Ibadan"],
      isHoneypot: true,
      required: true,
      order: 8,
    },
  ];
}

export default function NewIdeaStep2() {
  const router = useRouter();
  const { draft, setDraftField, setDraftStep } = useSurveyStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!draft.title) {
      router.push("/founder/ideas/new/step1");
      return;
    }

    let stepIndex = 0;
    const advance = () => {
      if (stepIndex < AI_STEPS.length - 1) {
        stepIndex++;
        setCurrentStep(stepIndex);
        setTimeout(advance, AI_STEPS[stepIndex].delay);
      } else {
        setTimeout(() => {
          const questions = generateMockQuestions(draft.title, draft.problemStatement);
          setDraftField("questions", questions);
          setDone(true);
        }, 1200);
      }
    };

    setTimeout(advance, AI_STEPS[0].delay);
  }, []);

  useEffect(() => {
    if (done) {
      setDraftStep(3);
      router.push("/founder/ideas/new/step3");
    }
  }, [done]);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="New Idea"
        subtitle="Step 2 Out of 4 - Generating Questions."
      />

      <div className="px-8 py-8 flex flex-col gap-8 max-w-[860px]">
        <StepIndicator />

        <div className="flex flex-col items-center justify-center py-16 gap-10">
          {/* Spinner */}
          <div className="relative w-[200px] h-[200px]">
            <div className="absolute inset-0 rounded-full border-4 border-[#EDE9FE]" />
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-primary tiqra-spinner"
              style={{ borderTopColor: "#9F4EF5" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <HugeiconsIcon icon={SparklesIcon} size={48} className="text-brand-primary"  />
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <h2 className="text-h2 font-semibold text-text-primary">Generating your questions</h2>
            <p className="text-lg text-text-secondary mt-2">
              Our AI is crafting validation questions tailored to your idea
            </p>
          </div>

          {/* Steps progress */}
          <div className="flex flex-col gap-6 w-full max-w-[610px]">
            {AI_STEPS.map((step, i) => {
              const isDone = i < currentStep;
              const isActive = i === currentStep && !done;
              const isPending = i > currentStep;

              return (
                <div key={i} className="process-step">
                  <div className="flex items-center gap-6 flex-1">
                    <span
                      className={`text-[24px] font-normal ${
                        isDone || isActive ? "text-text-primary" : "text-text-secondary"
                      }`}
                    >
                      {step.label}
                    </span>
                    {isDone && <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} className="text-brand-primary flex-shrink-0"  />}
                    {isActive && <HugeiconsIcon icon={Loading02Icon} size={20} className="text-brand-primary animate-spin flex-shrink-0"  />}
                  </div>
                  <div className="w-[320px] h-3 rounded-full overflow-hidden bg-[#EDE9FE]">
                    <div
                      className="h-full bg-brand-primary rounded-full transition-all duration-700"
                      style={{ width: isDone ? "100%" : isActive ? "75%" : "0%" }}
                    />
                  </div>
                  <span className="text-body text-text-secondary w-12 text-right">
                    {isDone ? "Done" : isActive ? "75%" : "------"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Warning */}
          <div className="flex items-center gap-3 bg-[#EDE9FE] rounded-xl px-5 py-4 w-full max-w-[610px]">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center flex-shrink-0">
              <HugeiconsIcon icon={SparklesIcon} size={16} className="text-white"  />
            </div>
            <p className="text-lg text-text-primary">
              Do not close this window while we generate your questions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
