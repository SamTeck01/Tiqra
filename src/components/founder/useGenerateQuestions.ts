"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSurveyStore } from "@/store/survey.store";
import { api } from "@/lib/api";

/** Runs the AI Survey Architect on the current draft and moves to the question preview. */
export function useGenerateQuestions() {
  const router = useRouter();
  const { draft, setDraftField } = useSurveyStore();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setGenerating(true);
    setError("");
    try {
      const questions = await api("generateQuestions", { intake: draft.intake });
      setDraftField("questions", questions);
      router.push("/founder/ideas/new/questions");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate questions");
    } finally {
      setGenerating(false);
    }
  };

  return { generating, generate, error };
}
