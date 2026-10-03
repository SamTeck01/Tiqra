"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSurveyStore } from "@/store/survey.store";
import { generateQuestions } from "@/lib/ai";

/** Runs the AI Survey Architect on the current draft and moves to the question preview. */
export function useGenerateQuestions() {
  const router = useRouter();
  const { draft, setDraftField } = useSurveyStore();
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    const questions = await generateQuestions(draft.intake);
    setDraftField("questions", questions);
    router.push("/founder/ideas/new/questions");
  };

  return { generating, generate };
}
