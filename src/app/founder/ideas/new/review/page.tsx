"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { useSurveyStore } from "@/store/survey.store";
import IntakeFields, { REQUIRED_FIELDS } from "@/components/founder/IntakeFields";
import BuildingSurveyModal from "@/components/founder/BuildingSurveyModal";
import { useGenerateQuestions } from "@/components/founder/useGenerateQuestions";
import { BackLink, PageTitle, primaryBtn } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

/** "Review your description" — what the AI understood from the voice intake. */
export default function ReviewDescriptionPage() {
  const { draft, setDraftField } = useSurveyStore();
  const { generating, generate } = useGenerateQuestions();
  const [editing, setEditing] = useState(false);
  const ready = REQUIRED_FIELDS.every((k) => draft.intake[k].trim());

  return (
    <div className="flex flex-col pt-8">
      <BackLink href="/founder/ideas/new" />
      <div className="mt-8 flex items-start justify-between">
        <PageTitle title="Review your description" subtitle="Idea Details" />
        <button
          onClick={() => setEditing((e) => !e)}
          className="inline-flex items-center gap-2 px-4 py-2 text-[16px] text-[#4F46E5]"
        >
          <HugeiconsIcon icon={PencilEdit02Icon} size={20} /> {editing ? "Done" : "Edit"}
        </button>
      </div>

      <div className="mt-8">
        <IntakeFields value={draft.intake} onChange={(v) => setDraftField("intake", v)} readOnly={!editing} />
      </div>
      {!ready && (
        <p className="mt-4 px-4 text-[14px] text-[#DC2626]">
          Add the problem, audience and solution before generating questions.
        </p>
      )}

      <button
        disabled={!ready || generating}
        onClick={generate}
        className={cn(primaryBtn, "mx-auto mt-9 h-[52px] w-full max-w-[400px]")}
      >
        Generate AI Question <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
      </button>

      <BuildingSurveyModal open={generating} />
    </div>
  );
}
