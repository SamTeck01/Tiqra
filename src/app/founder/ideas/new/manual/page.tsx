"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { useSurveyStore } from "@/store/survey.store";
import IntakeFields, { REQUIRED_FIELDS } from "@/components/founder/IntakeFields";
import BuildingSurveyModal from "@/components/founder/BuildingSurveyModal";
import { useGenerateQuestions } from "@/components/founder/useGenerateQuestions";
import { BackLink, FlowProgress, PageTitle, outlineBtn, primaryBtn } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

export default function ManualIdeaPage() {
  const { draft, setDraftField } = useSurveyStore();
  const { generating, generate, error: genError } = useGenerateQuestions();
  const ready = REQUIRED_FIELDS.every((k) => draft.intake[k].trim());

  return (
    <div className="flex flex-col pt-8">
      <BackLink href="/founder/ideas" />
      <FlowProgress step={1} />
      <div className="mt-8 flex items-start justify-between">
        <PageTitle title="New Idea" subtitle="Idea Details" />
        <Link href="/founder/ideas/new" className={cn(outlineBtn, "h-12 px-9")}>Create with AI</Link>
      </div>

      <div className="mt-10">
        <IntakeFields
          value={draft.intake}
          onChange={(intake) => {
            setDraftField("source", "manual");
            setDraftField("intake", intake);
          }}
        />
      </div>

      <button
        disabled={!ready || generating}
        onClick={generate}
        className={cn(primaryBtn, "mx-auto mt-9 h-[52px] w-full max-w-[400px]")}
      >
        Generate AI Question <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
      </button>

      {genError && <p className="mt-3 text-center text-[14px] text-[#DC2626]">{genError}</p>}
      <BuildingSurveyModal open={generating} />
    </div>
  );
}
