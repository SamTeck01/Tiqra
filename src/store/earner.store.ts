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

async function walletOf(userId: string): Promise<Wallet | undefined> {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.WALLETS, [Query.equal("userId", userId)]);
  return res.documents[0] as unknown as Wallet | undefined;
}

/** When a survey fills, every validated response is approved: pending rewards move to each respondent's balance. */
async function releasePayouts(survey: Survey) {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.RESPONSES, [Query.equal("surveyId", survey.$id)]);
  for (const r of res.documents as unknown as Response[]) {
    if (!r.validatedByTruthLayer) continue;
    const wallet = await walletOf(r.respondentId);
    if (!wallet) continue;
    const amount = survey.payoutPerResponse;
    const balance = wallet.balance + amount;
    await databases.updateDocument(DB_ID, COLLECTIONS.WALLETS, wallet.$id, {
      balance,
      pendingBalance: Math.max(0, wallet.pendingBalance - amount),
      totalEarned: wallet.totalEarned + amount,
    });
    await databases.createDocument(DB_ID, COLLECTIONS.TRANSACTIONS, ID.unique(), {
      userId: r.respondentId,
      type: "credit",
      amount,
      description: `Reward: ${survey.title}`,
      status: "completed",
      balanceAfter: balance,
      createdAt: new Date().toISOString(),
    });
  }
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
    const completed = survey.respondentsCompleted + 1;
    const finished = completed >= survey.respondentsRequired;
    await databases.updateDocument(DB_ID, COLLECTIONS.SURVEYS, survey.$id, {
      respondentsCompleted: completed,
      ...(finished ? { status: "completed", aiReportGenerated: true } : {}),
    });
    const wallet = await walletOf(userId);
    if (wallet) {
      await databases.updateDocument(DB_ID, COLLECTIONS.WALLETS, wallet.$id, {
        pendingBalance: wallet.pendingBalance + survey.payoutPerResponse,
      });
    }
    if (finished) await releasePayouts(survey);
    set({ available: get().available.filter((s) => s.$id !== survey.$id) });
    await get().fetchResponses(userId);
  },
}));
