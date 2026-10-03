"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { useSurveyStore } from "@/store/survey.store";
import EditQuestionModal from "@/components/founder/EditQuestionModal";
import BuildingSurveyModal from "@/components/founder/BuildingSurveyModal";
import { useGenerateQuestions } from "@/components/founder/useGenerateQuestions";
import { BackLink, FlowProgress, PageTitle, outlineBtn, primaryBtn } from "@/components/ui/Primitives";
import { QUESTION_TYPE_LABEL } from "@/lib/survey";
import { MIN_QUESTIONS } from "@/lib/pricing";
import { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function PreviewQuestionsPage() {
  const router = useRouter();
  const { draft, setDraftField } = useSurveyStore();
  const { generating, generate, error: genError } = useGenerateQuestions();
  const [editing, setEditing] = useState<Question | null>(null);
  const isManual = draft.source === "manual";

  useEffect(() => {
    if (draft.questions.length === 0 && !generating) router.replace("/founder/ideas/new");
  }, [draft.questions.length, generating, router]);

  const save = (q: Question) => {
    setDraftField("questions", draft.questions.map((x) => (x.id === q.id ? q : x)));
    setEditing(null);
  };

  return (
    <div className="flex flex-col pt-8">
      <BackLink
        href={isManual ? "/founder/ideas/new/manual" : "/founder/ideas/new/review"}
        label={isManual ? "Back to ideas" : "Back"}
      />
      {isManual && <FlowProgress step={2} />}
      <div className="mt-8 flex items-start justify-between">
        <PageTitle title="New Idea" subtitle={isManual ? "Idea Details" : "AI question engine"} />
        <button onClick={generate} disabled={generating} className={cn(outlineBtn, "h-12 px-9")}>
          Regenerate
        </button>
      </div>

      <h2 className="mt-10 px-0 text-[20px] tracking-[-0.02em] text-[#111827] sm:px-4">Preview Questions</h2>
      <div className="mt-4 flex flex-col gap-2 px-0 sm:px-4">
        {draft.questions.map((q, i) => (
          <div key={q.id} className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] px-3 py-4">
            <span className="text-[14px] text-[#111827]">{i + 1}</span>
            <div className="flex-1">
              <p className="text-[16px] tracking-[-0.02em] text-[#111827]">{q.text}</p>
              <span className="mt-2 inline-block rounded bg-[#E0E7FF] px-2 py-0.5 text-[11px] text-[#4F46E5]">
                {QUESTION_TYPE_LABEL[q.type]}
              </span>
            </div>
            <button aria-label={`Edit question ${i + 1}`} onClick={() => setEditing(q)} className="p-1 text-[#111827] hover:text-[#4F46E5]">
              <HugeiconsIcon icon={PencilEdit02Icon} size={22} />
            </button>
          </div>
        ))}
      </div>

      <button
        disabled={draft.questions.length < MIN_QUESTIONS}
        onClick={() => router.push("/founder/ideas/new/setup")}
        className={cn(primaryBtn, "mx-auto mt-3 h-[52px] w-full max-w-[400px]")}
      >
        Continue
      </button>

      <EditQuestionModal question={editing} onClose={() => setEditing(null)} onSave={save} />
      {genError && <p className="mt-3 text-center text-[14px] text-[#DC2626]">{genError}</p>}
      <BuildingSurveyModal open={generating} />
    </div>
  );
}
