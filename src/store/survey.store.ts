import { create } from "zustand";
import { databases, DB_ID, COLLECTIONS } from "@/lib/appwrite";
import { Survey, Question, IdeaIntake } from "@/lib/types";
import { EMPTY_INTAKE } from "@/lib/ai";
import { MIN_RESPONDENTS } from "@/lib/pricing";
import { ID, Query } from "appwrite";

interface NewSurveyDraft {
  /** "voice" when the idea came from the AI intake, "manual" when typed into the form. */
  source: "voice" | "manual";
  intake: IdeaIntake;
  questions: Question[];
  respondents: number;
}

interface SurveyState {
  surveys: Survey[];
  activeSurvey: Survey | null;
  draft: NewSurveyDraft;
  loading: boolean;
  error: string | null;
  // Actions
  setDraftField: <K extends keyof NewSurveyDraft>(key: K, value: NewSurveyDraft[K]) => void;
  resetDraft: () => void;
  fetchSurveys: (userId: string) => Promise<void>;
  fetchSurveyById: (id: string) => Promise<void>;
  createSurvey: (data: Partial<Survey>) => Promise<Survey>;
  updateSurvey: (id: string, data: Partial<Survey>) => Promise<void>;
}

const defaultDraft: NewSurveyDraft = {
  source: "voice",
  intake: { ...EMPTY_INTAKE },
  questions: [],
  respondents: MIN_RESPONDENTS,
};

export const useSurveyStore = create<SurveyState>((set, get) => ({
  surveys: [],
  activeSurvey: null,
  draft: { ...defaultDraft },
  loading: false,
  error: null,

  setDraftField: (key, value) =>
    set((state) => ({ draft: { ...state.draft, [key]: value } })),

  resetDraft: () => set({ draft: { ...defaultDraft, intake: { ...EMPTY_INTAKE } } }),

  fetchSurveys: async (userId) => {
    set({ loading: true, error: null });
    try {
      const res = await databases.listDocuments(DB_ID, COLLECTIONS.SURVEYS, [
        Query.equal("creatorId", userId),
        Query.orderDesc("$createdAt"),
      ]);
      set({ surveys: res.documents as unknown as Survey[], loading: false });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : "Failed to load", loading: false });
    }
  },

  fetchSurveyById: async (id) => {
    set({ loading: true });
    try {
      const doc = await databases.getDocument(DB_ID, COLLECTIONS.SURVEYS, id);
      set({ activeSurvey: doc as unknown as Survey, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  createSurvey: async (data) => {
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.SURVEYS, ID.unique(), data);
    const survey = doc as unknown as Survey;
    set((state) => ({ surveys: [survey, ...state.surveys] }));
    return survey;
  },

  updateSurvey: async (id, data) => {
    await databases.updateDocument(DB_ID, COLLECTIONS.SURVEYS, id, data);
    set((state) => ({
      surveys: state.surveys.map((s) => (s.$id === id ? { ...s, ...data } : s)),
    }));
  },
}));
