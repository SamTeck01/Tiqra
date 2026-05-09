import { create } from "zustand";
import { databases, DB_ID, COLLECTIONS } from "@/lib/appwrite";
import { Transaction, Wallet } from "@/lib/types";
import { ID, Query } from "appwrite";

interface WalletState {
  wallet: Wallet | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  // Actions
  fetchWallet: (userId: string) => Promise<void>;
  fetchTransactions: (userId: string) => Promise<void>;
  initiateDeposit: (userId: string, amount: number, email: string) => Promise<string>;
  verifyPaystackPayment: (reference: string, userId: string, amount: number) => Promise<void>;
  requestWithdrawal: (userId: string, amount: number, accountDetails: object) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallet: null,
  transactions: [],
  loading: false,
  error: null,

  fetchWallet: async (userId) => {
    set({ loading: true });
    try {
      const res = await databases.listDocuments(DB_ID, COLLECTIONS.WALLETS, [
        Query.equal("userId", userId),
      ]);
      if (res.documents.length > 0) {
        set({ wallet: res.documents[0] as unknown as Wallet, loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },

  fetchTransactions: async (userId) => {
    set({ loading: true });
    try {
      const res = await databases.listDocuments(DB_ID, COLLECTIONS.TRANSACTIONS, [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
        Query.limit(50),
      ]);
      set({ transactions: res.documents as unknown as Transaction[], loading: false });
    } catch {
      set({ loading: false });
    }
  },

  initiateDeposit: async (userId, amount, email) => {
    const reference = `tiqra_${Date.now()}_${userId.slice(0, 8)}`;
    return reference;
  },

  verifyPaystackPayment: async (reference, userId, amount) => {
    await databases.createDocument(DB_ID, COLLECTIONS.TRANSACTIONS, ID.unique(), {
      userId,
      type: "credit",
      amount,
      description: "Wallet funding via Paystack",
      status: "completed",
      reference,
      createdAt: new Date().toISOString(),
    });
    // Update wallet balance
    const wallets = await databases.listDocuments(DB_ID, COLLECTIONS.WALLETS, [
      Query.equal("userId", userId),
    ]);
    if (wallets.documents.length > 0) {
      const wallet = wallets.documents[0];
      await databases.updateDocument(DB_ID, COLLECTIONS.WALLETS, wallet.$id, {
        balance: (wallet as unknown as Wallet).balance + amount,
      });
      await get().fetchWallet(userId);
    }
  },

  requestWithdrawal: async (userId, amount, accountDetails) => {
    await databases.createDocument(DB_ID, COLLECTIONS.TRANSACTIONS, ID.unique(), {
      userId,
      type: "withdrawal",
      amount,
      description: "Withdrawal request",
      status: "pending",
      createdAt: new Date().toISOString(),
    });
  },
}));
