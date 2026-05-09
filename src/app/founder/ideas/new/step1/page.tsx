"use client";

import { useRouter } from "next/navigation";
import { useSurveyStore } from "@/store/survey.store";
import StepIndicator from "@/components/survey/StepIndicator";
import TopBar from "@/components/layout/TopBar";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function NewIdeaStep1() {
  const router = useRouter();
  const { draft, setDraftField, setDraftStep } = useSurveyStore();

  const handleNext = () => {
    setDraftStep(2);
    router.push("/founder/ideas/new/step2");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="New Idea"
        subtitle="Step 1 Out of 4 - Define your idea."
      />

      <div className="px-8 py-8 flex flex-col gap-8 max-w-[860px]">
        {/* Step indicator */}
        <StepIndicator />

        {/* Form */}
        <div className="flex flex-col gap-8">
          <div>
            <label className="tiqra-label">
              What is the name of your idea / startup?
            </label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraftField("title", e.target.value)}
              placeholder="e.g. PayRoll AI – Automated payroll for SMEs"
              className="tiqra-input"
            />
          </div>

          <div>
            <label className="tiqra-label">
              What problem does your idea solve?
            </label>
            <textarea
              value={draft.problemStatement}
              onChange={(e) => setDraftField("problemStatement", e.target.value)}
              placeholder="Describe the problem your startup addresses. Be specific about who faces this problem and how often."
              className="tiqra-textarea"
              rows={5}
            />
          </div>

          <div>
            <label className="tiqra-label">
              Who is your target audience?
            </label>
            <textarea
              value={draft.targetAudience}
              onChange={(e) => setDraftField("targetAudience", e.target.value)}
              placeholder="Describe your ideal customer. Age range, profession, location, pain points, etc."
              className="tiqra-textarea"
              rows={4}
            />
          </div>

          <div>
            <label className="tiqra-label">
              What is your proposed solution?
            </label>
            <textarea
              value={draft.solution}
              onChange={(e) => setDraftField("solution", e.target.value)}
              placeholder="Describe how your startup solves the problem. What makes it unique?"
              className="tiqra-textarea"
              rows={4}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/founder/ideas")}
            className="btn-secondary"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!draft.title || !draft.problemStatement}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Questions with AI
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
