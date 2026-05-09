import { create } from "zustand";
import { databases, DB_ID, COLLECTIONS } from "@/lib/appwrite";
import { Survey, Question, TargetAudience } from "@/lib/types";
import { ID, Query } from "appwrite";

interface NewSurveyDraft {
  step: number;
  title: string;
  problemStatement: string;
  targetAudience: string;
  solution: string;
  questions: Question[];
  respondents: number;
  payoutPerResponse: number;
  targetAudienceConfig: Partial<TargetAudience>;
}

interface SurveyState {
  surveys: Survey[];
  activeSurvey: Survey | null;
  draft: NewSurveyDraft;
  loading: boolean;
  error: string | null;
  // Actions
  setDraftField: <K extends keyof NewSurveyDraft>(key: K, value: NewSurveyDraft[K]) => void;
  setDraftStep: (step: number) => void;
  resetDraft: () => void;
  fetchSurveys: (userId: string) => Promise<void>;
  fetchSurveyById: (id: string) => Promise<void>;
  createSurvey: (data: Partial<Survey>) => Promise<Survey>;
  updateSurvey: (id: string, data: Partial<Survey>) => Promise<void>;
}

const defaultDraft: NewSurveyDraft = {
  step: 1,
  title: "",
  problemStatement: "",
  targetAudience: "",
  solution: "",
  questions: [],
  respondents: 50,
  payoutPerResponse: 300,
  targetAudienceConfig: {},
};

export const useSurveyStore = create<SurveyState>((set, get) => ({
  surveys: [],
  activeSurvey: null,
  draft: { ...defaultDraft },
  loading: false,
  error: null,

  setDraftField: (key, value) =>
    set((state) => ({ draft: { ...state.draft, [key]: value } })),

  setDraftStep: (step) =>
    set((state) => ({ draft: { ...state.draft, step } })),

  resetDraft: () => set({ draft: { ...defaultDraft } }),

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
