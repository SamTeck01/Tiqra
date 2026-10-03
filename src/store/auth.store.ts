import { create } from "zustand";
import { account, databases, DB_ID, COLLECTIONS } from "@/lib/appwrite";
import { User, UserDemographics, UserRole } from "@/lib/types";
import { ID, OAuthProvider, Query } from "appwrite";

interface PendingSignup {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  /** Account created and waiting for the emailed six-digit code. */
  pendingSignup: PendingSignup | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  startSignup: (data: { name: string; email: string; phone: string; password: string; role: UserRole }) => Promise<void>;
  resendSignupCode: () => Promise<void>;
  confirmSignup: (code: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  getUser: () => Promise<void>;
  clearError: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  updateProfile: (data: { name?: string; demographics?: UserDemographics; notificationPrefs?: Record<string, boolean> }) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
  /** Returns the recovery token when the backend hands it back directly (mock mode). */
  requestPasswordReset: (email: string) => Promise<{ userId: string; secret: string } | null>;
  resetPassword: (userId: string, secret: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  (set, get) => ({
    user: null,
    pendingSignup: null,
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

    updateProfile: async (data) => {
      const currentUser = get().user;
      if (!currentUser) return;
      const updatedDoc = await databases.updateDocument(DB_ID, COLLECTIONS.USERS, currentUser.$id, data);
      set({ user: updatedDoc as unknown as User });
    },

    changePassword: async (current, next) => {
      await account.updatePassword(next, current);
    },

    requestPasswordReset: async (email) => {
      const url = typeof window !== "undefined" ? `${window.location.origin}/auth/forgot-password` : "";
      const token = await account.createRecovery(email, url);
      return token.secret ? { userId: token.userId, secret: token.secret } : null;
    },

    startSignup: async ({ name, email, phone, password, role }) => {
      const authUser = await account.create(ID.unique(), email, password, name);
      await account.createEmailToken(authUser.$id, email);
      set({ pendingSignup: { userId: authUser.$id, name, email, phone, role } });
    },

    resendSignupCode: async () => {
      const pending = get().pendingSignup;
      if (pending) await account.createEmailToken(pending.userId, pending.email);
    },

    confirmSignup: async (code) => {
      const pending = get().pendingSignup;
      if (!pending) throw new Error("Your sign-up session expired. Please register again.");
      await account.createSession(pending.userId, code);
      const userDoc = await databases.createDocument(DB_ID, COLLECTIONS.USERS, pending.userId, {
        name: pending.name,
        email: pending.email,
        phone: pending.phone,
        role: pending.role,
        walletBalance: 0,
        reliabilityScore: 100,
        createdAt: new Date().toISOString(),
      });
      await databases.createDocument(DB_ID, COLLECTIONS.WALLETS, ID.unique(), {
        userId: pending.userId,
        balance: 0,
        pendingBalance: 0,
        totalEarned: 0,
        totalSpent: 0,
      });
      set({ user: userDoc as unknown as User, isAuthenticated: true, isHydrated: true, pendingSignup: null });
    },

    loginWithGoogle: () => {
      const origin = window.location.origin;
      account.createOAuth2Session(OAuthProvider.Google, `${origin}/`, `${origin}/auth/login`);
    },

    resetPassword: async (userId, secret, password) => {
      await account.updateRecovery(userId, secret, password);
    },
  })
);
