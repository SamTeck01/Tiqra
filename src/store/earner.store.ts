import { create } from "zustand";
import { api } from "@/lib/api";
import { Survey } from "@/lib/types";
import type { SubmittedAnswer } from "@/lib/engine/truthLayer";

interface SubmitResult {
  accepted: boolean;
  flags: string[];
  reward: number;
}

interface EarnerState {
  available: Survey[];
  completedCount: number;
  lastResult: SubmitResult | null;
  loading: boolean;
  error: string | null;
  /** Surveys this earner matches (Demographic Engine), best fits first. */
  fetchAvailable: () => Promise<void>;
  /** Sends answers to the server, which runs the Truth Layer and handles the reward. */
  submitResponse: (surveyId: string, answers: SubmittedAnswer[]) => Promise<SubmitResult>;
}

export const useEarnerStore = create<EarnerState>((set, get) => ({
  available: [],
  completedCount: 0,
  lastResult: null,
  loading: false,
  error: null,

  fetchAvailable: async () => {
    set({ loading: true, error: null });
    try {
      const { surveys, completed } = await api("availableSurveys", {} as never);
      set({ available: surveys, completedCount: completed, loading: false });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : "Could not load surveys" });
    }
  },

  submitResponse: async (surveyId, answers) => {
    const result = await api("submitResponse", { surveyId, answers });
    set({ lastResult: result, available: get().available.filter((s) => s.$id !== surveyId) });
    return result;
  },
}));
