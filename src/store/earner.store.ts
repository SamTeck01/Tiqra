import { create } from "zustand";
import { ID, Query } from "appwrite";
import { databases, DB_ID, COLLECTIONS } from "@/lib/appwrite";
import { Answer, Response, Survey, Wallet } from "@/lib/types";

interface EarnerState {
  available: Survey[];
  responses: Response[];
  loading: boolean;
  fetchAvailable: (userId: string) => Promise<void>;
  fetchResponses: (userId: string) => Promise<void>;
  /** Records a completed response and adds the reward to pending earnings until it is approved. */
  submitResponse: (userId: string, survey: Survey, answers: Answer[], timeTaken: number) => Promise<void>;
}

export const useEarnerStore = create<EarnerState>((set, get) => ({
  available: [],
  responses: [],
  loading: false,

  fetchAvailable: async (userId) => {
    set({ loading: true });
    try {
      const [surveys, mine] = await Promise.all([
        databases.listDocuments(DB_ID, COLLECTIONS.SURVEYS, [Query.equal("status", "live")]),
        databases.listDocuments(DB_ID, COLLECTIONS.RESPONSES, [Query.equal("respondentId", userId)]),
      ]);
      const answered = new Set((mine.documents as unknown as Response[]).map((r) => r.surveyId));
      const available = (surveys.documents as unknown as Survey[]).filter(
        // A user can never answer their own survey, and only answers each survey once.
        (s) => s.creatorId !== userId && !answered.has(s.$id) && s.respondentsCompleted < s.respondentsRequired
      );
      set({ available, responses: mine.documents as unknown as Response[], loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchResponses: async (userId) => {
    const res = await databases.listDocuments(DB_ID, COLLECTIONS.RESPONSES, [Query.equal("respondentId", userId)]);
    set({ responses: res.documents as unknown as Response[] });
  },

  submitResponse: async (userId, survey, answers, timeTaken) => {
    await databases.createDocument(DB_ID, COLLECTIONS.RESPONSES, ID.unique(), {
      surveyId: survey.$id,
      respondentId: userId,
      answers,
      validatedByTruthLayer: true,
      flagged: false,
      completedAt: new Date().toISOString(),
      timeTaken,
    });
    await databases.updateDocument(DB_ID, COLLECTIONS.SURVEYS, survey.$id, {
      respondentsCompleted: survey.respondentsCompleted + 1,
    });
    const wallets = await databases.listDocuments(DB_ID, COLLECTIONS.WALLETS, [Query.equal("userId", userId)]);
    const wallet = wallets.documents[0] as unknown as Wallet | undefined;
    if (wallet) {
      await databases.updateDocument(DB_ID, COLLECTIONS.WALLETS, wallet.$id, {
        pendingBalance: wallet.pendingBalance + survey.payoutPerResponse,
      });
    }
    set({ available: get().available.filter((s) => s.$id !== survey.$id) });
    await get().fetchResponses(userId);
  },
}));
