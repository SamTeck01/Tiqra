"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSurveyStore } from "@/store/survey.store";
import StepIndicator from "@/components/survey/StepIndicator";
import TopBar from "@/components/layout/TopBar";
import { ArrowRight, ArrowLeft, Pencil, Check, X, Eye, Shield } from "lucide-react";
import { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

function QuestionCard({
  question,
  index,
  onEdit,
  onSave,
}: {
  question: Question;
  index: number;
  onEdit: (id: string, text: string) => void;
  onSave: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(question.text);

  const typeLabel: Record<string, string> = {
    yes_no: "Yes/No",
    multiple_choice: "Multiple Choice",
    scale: "Scale (1-10)",
    short_text: "Short Text",
  };

  return (
    <div className={cn(
      "flex items-start gap-4 p-5 rounded-2xl border transition-all",
      question.isHoneypot
        ? "border-[#EDE9FE] bg-[#F3EFFE]"
        : "border-[#F3F4F6] bg-white hover:border-[#E5E7EB]"
    )}>
      {/* Index */}
      <div className="w-8 h-8 rounded-full bg-[#F8F9FC] flex items-center justify-center flex-shrink-0 text-body font-medium text-text-secondary">
        {index + 1}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        {editing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="tiqra-textarea text-body"
            rows={2}
            autoFocus
          />
        ) : (
          <p className="text-body text-text-primary">{question.text}</p>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary bg-[#F8F9FC] px-2 py-0.5 rounded-md">
            {typeLabel[question.type]}
          </span>
          {question.isHoneypot && (
            <span className="flex items-center gap-1 text-sm text-brand-primary bg-[#EDE9FE] px-2 py-0.5 rounded-md">
              <Shield size={12} />
              Truth Layer
            </span>
          )}
          {question.required && (
            <span className="text-sm text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-md">
              Required
            </span>
          )}
        </div>
        {question.options && !editing && (
          <div className="flex flex-wrap gap-2 mt-1">
            {question.options.map((opt) => (
              <span key={opt} className="text-sm bg-[#F8F9FC] border border-[#F3F4F6] px-3 py-1 rounded-lg text-text-secondary">
                {opt}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {editing ? (
          <>
            <button
              onClick={() => { onEdit(question.id, text); setEditing(false); }}
              className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center hover:bg-brand-secondary transition-colors"
            >
              <Check size={14} className="text-white" />
            </button>
            <button
              onClick={() => { setText(question.text); setEditing(false); }}
              className="w-8 h-8 rounded-lg bg-[#F8F9FC] border border-[#E5E7EB] flex items-center justify-center"
            >
              <X size={14} className="text-text-secondary" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="btn-ghost py-1.5 px-3 text-sm"
          >
            <Pencil size={14} />
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default function NewIdeaStep3() {
  const router = useRouter();
  const { draft, setDraftField, setDraftStep } = useSurveyStore();

  const handleEditQuestion = (id: string, text: string) => {
    setDraftField(
      "questions",
      draft.questions.map((q) => (q.id === id ? { ...q, text } : q))
    );
  };

  const handleNext = () => {
    setDraftStep(4);
    router.push("/founder/ideas/new/step4");
  };

  if (!draft.questions.length) {
    router.push("/founder/ideas/new/step1");
    return null;
  }

  const visibleQuestions = draft.questions.filter((q) => !q.isHoneypot);
  const honeypotCount = draft.questions.filter((q) => q.isHoneypot).length;

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="New Idea"
        subtitle="Step 3 Out of 4 - Review Questions."
      />

      <div className="px-8 py-8 flex flex-col gap-8 max-w-[860px]">
        <StepIndicator />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h3 font-semibold text-text-primary">
              {draft.questions.length} questions generated
            </h2>
            <p className="text-body text-text-secondary mt-1">
              Review and edit questions before launching. {honeypotCount} Truth Layer validation question{honeypotCount !== 1 ? "s" : ""} included.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#EDE9FE] px-4 py-2 rounded-xl">
            <Eye size={16} className="text-brand-primary" />
            <span className="text-body text-brand-primary font-medium">
              Preview mode
            </span>
          </div>
        </div>

        {/* Questions list */}
        <div className="flex flex-col gap-3">
          {draft.questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i}
              onEdit={handleEditQuestion}
              onSave={() => {}}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setDraftStep(1); router.push("/founder/ideas/new/step1"); }}
            className="btn-secondary"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <button onClick={handleNext} className="btn-primary">
            Setup Validation
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
