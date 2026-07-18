import { create } from "zustand";
import { account, databases, DB_ID, COLLECTIONS } from "@/lib/appwrite";
import { User, UserRole } from "@/lib/types";
import { ID, Query } from "appwrite";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => Promise<void>;
  clearError: () => void;
  switchRole: (role: UserRole) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    isHydrated: false,

    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        await account.createEmailPasswordSession(email, password);
        const session = await account.get();
        const userDocs = await databases.listDocuments(DB_ID, COLLECTIONS.USERS, [
          Query.equal("email", email),
        ]);
        if (userDocs.documents.length > 0) {
          const userDoc = userDocs.documents[0];
          set({
            user: userDoc as unknown as User,
            isAuthenticated: true,
            loading: false,
          });
        }
      } catch (err: unknown) {
        set({
          error: err instanceof Error ? err.message : "Login failed",
          loading: false,
        });
        throw err;
      }
    },

    register: async (name, email, password, role) => {
      set({ loading: true, error: null });
      try {
        const authUser = await account.create(ID.unique(), email, password, name);
        await account.createEmailPasswordSession(email, password);
        const userDoc = await databases.createDocument(
          DB_ID,
          COLLECTIONS.USERS,
          authUser.$id,
          {
            name,
            email,
            role,
            walletBalance: 0,
            reliabilityScore: 100,
            createdAt: new Date().toISOString(),
          }
        );
        // Create wallet
        await databases.createDocument(DB_ID, COLLECTIONS.WALLETS, ID.unique(), {
          userId: authUser.$id,
          balance: 0,
          pendingBalance: 0,
          totalEarned: 0,
          totalSpent: 0,
        });
        set({
          user: userDoc as unknown as User,
          isAuthenticated: true,
          loading: false,
        });
      } catch (err: unknown) {
        set({
          error: err instanceof Error ? err.message : "Registration failed",
          loading: false,
        });
        throw err;
      }
    },

    logout: async () => {
      try {
        await account.deleteSession("current");
      } catch {}
      set({ user: null, isAuthenticated: false });
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    },

    getUser: async () => {
      try {
        const session = await account.get();
        const userDoc = await databases.getDocument(DB_ID, COLLECTIONS.USERS, session.$id);
        set({ user: userDoc as unknown as User, isAuthenticated: true, isHydrated: true });
      } catch {
        set({ user: null, isAuthenticated: false, isHydrated: true });
      }
    },

    clearError: () => set({ error: null }),

    switchRole: async (role: UserRole) => {
      const currentUser = get().user;
      if (!currentUser) return;
      set({ loading: true, error: null });
      try {
        const updatedDoc = await databases.updateDocument(
          DB_ID,
          COLLECTIONS.USERS,
          currentUser.$id,
          { role }
        );
        set({ user: updatedDoc as unknown as User, loading: false });
      } catch (err: unknown) {
        set({
          error: err instanceof Error ? err.message : "Failed to switch role",
          loading: false,
        });
        throw err;
      }
    },
  })
);
