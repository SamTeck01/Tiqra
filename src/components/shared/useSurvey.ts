"use client";

import { useEffect } from "react";
import { useSurveyStore } from "@/store/survey.store";

/** Loads one survey by id for the idea detail pages. */
export function useSurvey(id: string) {
  const { activeSurvey, fetchSurveyById, loading } = useSurveyStore();
  useEffect(() => {
    if (id) fetchSurveyById(id);
  }, [id, fetchSurveyById]);
  const survey = activeSurvey?.$id === id ? activeSurvey : null;
  return { survey, loading: loading || !survey };
}
