import { create } from "zustand";
import { databases, DB_ID, COLLECTIONS } from "@/lib/appwrite";
import { PaymentMethod, Transaction, Wallet } from "@/lib/types";
import { ID, Query } from "appwrite";

export const MIN_TOPUP = 5000;
export const MIN_WITHDRAWAL = 100;

interface WalletState {
  wallet: Wallet | null;
  transactions: Transaction[];
  methods: PaymentMethod[];
  loading: boolean;
  error: string | null;
  fetchWallet: (userId: string) => Promise<void>;
  fetchTransactions: (userId: string) => Promise<void>;
  fetchMethods: (userId: string) => Promise<void>;
  addMethod: (method: Omit<PaymentMethod, "$id" | "createdAt" | "isDefault">) => Promise<PaymentMethod>;
  setDefaultMethod: (userId: string, methodId: string) => Promise<void>;
  removeMethod: (userId: string, methodId: string) => Promise<void>;
  /** Top up the wallet with a card. Returns the transaction reference. */
  fundWallet: (userId: string, amount: number, method: PaymentMethod) => Promise<string>;
  /** Send money from the wallet to a bank account. Returns the transaction. */
  withdraw: (userId: string, amount: number, method: PaymentMethod) => Promise<Transaction>;
  /** Move survey funds from the wallet into escrow. */
  payForSurvey: (userId: string, amount: number, surveyTitle: string) => Promise<void>;
}

async function getWallet(userId: string): Promise<Wallet> {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.WALLETS, [Query.equal("userId", userId)]);
  const wallet = res.documents[0] as unknown as Wallet | undefined;
  if (!wallet) throw new Error("Wallet not found");
  return wallet;
}

function reference(prefix: string): string {
  const d = new Date();
  return `${prefix}-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(Date.now()).slice(-5)}`;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallet: null,
  transactions: [],
  methods: [],
  loading: false,
  error: null,

  fetchWallet: async (userId) => {
    set({ loading: true });
    try {
      set({ wallet: await getWallet(userId), loading: false });
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
      const txs = res.documents as unknown as Transaction[];
      set({ transactions: [...txs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchMethods: async (userId) => {
    const res = await databases.listDocuments(DB_ID, COLLECTIONS.PAYMENT_METHODS, [Query.equal("userId", userId)]);
    set({ methods: res.documents as unknown as PaymentMethod[] });
  },

  addMethod: async (method) => {
    const sameKind = get().methods.filter((m) => m.kind === method.kind);
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.PAYMENT_METHODS, ID.unique(), {
      ...method,
      isDefault: sameKind.length === 0,
      createdAt: new Date().toISOString(),
    });
    await get().fetchMethods(method.userId);
    return doc as unknown as PaymentMethod;
  },

  setDefaultMethod: async (userId, methodId) => {
    const target = get().methods.find((m) => m.$id === methodId);
    if (!target) return;
    await Promise.all(
      get()
        .methods.filter((m) => m.kind === target.kind && m.isDefault !== (m.$id === methodId))
        .map((m) => databases.updateDocument(DB_ID, COLLECTIONS.PAYMENT_METHODS, m.$id, { isDefault: m.$id === methodId }))
    );
    await get().fetchMethods(userId);
  },

  removeMethod: async (userId, methodId) => {
    const removed = get().methods.find((m) => m.$id === methodId);
    await databases.deleteDocument(DB_ID, COLLECTIONS.PAYMENT_METHODS, methodId);
    // Keep one default per kind.
    const next = get().methods.find((m) => m.$id !== methodId && m.kind === removed?.kind);
    if (removed?.isDefault && next) {
      await databases.updateDocument(DB_ID, COLLECTIONS.PAYMENT_METHODS, next.$id, { isDefault: true });
    }
    await get().fetchMethods(userId);
  },

  fundWallet: async (userId, amount, method) => {
    if (amount < MIN_TOPUP) throw new Error(`Minimum top-up is ₦${MIN_TOPUP.toLocaleString()}`);
    const wallet = await getWallet(userId);
    const ref = reference("TQR");
    const balance = wallet.balance + amount;
    await databases.createDocument(DB_ID, COLLECTIONS.TRANSACTIONS, ID.unique(), {
      userId,
      type: "credit",
      amount,
      description: `Added funds to wallet via Paystack (${method.provider} •••• ${method.last4})`,
      status: "completed",
      reference: ref,
      balanceAfter: balance,
      createdAt: new Date().toISOString(),
    });
    await databases.updateDocument(DB_ID, COLLECTIONS.WALLETS, wallet.$id, { balance });
    await get().fetchWallet(userId);
    return ref;
  },

  withdraw: async (userId, amount, method) => {
    const wallet = await getWallet(userId);
    if (amount < MIN_WITHDRAWAL) throw new Error(`Minimum withdrawal is ₦${MIN_WITHDRAWAL}`);
    if (amount > wallet.balance) throw new Error("Insufficient balance in your Tiqra wallet");
    const balance = wallet.balance - amount;
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.TRANSACTIONS, ID.unique(), {
      userId,
      type: "withdrawal",
      amount,
      description: `Withdrawal to ${method.provider}`,
      status: "completed",
      reference: reference("WD"),
      balanceAfter: balance,
      createdAt: new Date().toISOString(),
    });
    await databases.updateDocument(DB_ID, COLLECTIONS.WALLETS, wallet.$id, { balance });
    await get().fetchWallet(userId);
    return doc as unknown as Transaction;
  },

  payForSurvey: async (userId, amount, surveyTitle) => {
    const wallet = await getWallet(userId);
    if (wallet.balance < amount) throw new Error("Insufficient wallet balance");
    const balance = wallet.balance - amount;
    await databases.updateDocument(DB_ID, COLLECTIONS.WALLETS, wallet.$id, {
      balance,
      totalSpent: (wallet.totalSpent ?? 0) + amount,
    });
    await databases.createDocument(DB_ID, COLLECTIONS.TRANSACTIONS, ID.unique(), {
      userId,
      type: "escrow",
      amount,
      description: surveyTitle,
      status: "completed",
      balanceAfter: balance,
      createdAt: new Date().toISOString(),
    });
    await get().fetchWallet(userId);
  },
}));
