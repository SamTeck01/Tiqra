"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Kind = "surveyAnalytics" | "surveyReport" | "feasibilityReport";

/** Loads computed analytics (and AI text where requested) for one of the founder's surveys. */
export function useSurveyData<K extends Kind>(kind: K, surveyId: string) {
  const [data, setData] = useState<Awaited<ReturnType<typeof api<K>>> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    setData(null);
    api(kind, { surveyId } as never)
      .then((d) => live && setData(d as never))
      .catch((e) => live && setError(e instanceof Error ? e.message : "Could not load this survey"));
    return () => {
      live = false;
    };
  }, [kind, surveyId]);

  return { data, error };
}
