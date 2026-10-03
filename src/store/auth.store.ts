import { create } from "zustand";
import { account, databases, DB_ID, COLLECTIONS } from "@/lib/appwrite";
import { User, UserDemographics, UserRole } from "@/lib/types";
import { ID, OAuthProvider } from "appwrite";
import { api, clearApiSession } from "@/lib/api";

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
  startSignup: (data: { name: string; email: string; phone: string; password: string; role: UserRole }) => Promise<void>;
  resendSignupCode: () => Promise<void>;
  confirmSignup: (code: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  getUser: () => Promise<void>;
  clearError: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  updateProfile: (data: { name?: string; notificationPrefs?: Record<string, boolean> }) => Promise<void>;
  /** Saves demographics; the server grades the timed interest check. */
  completeProfile: (data: { name: string; demographics: Omit<UserDemographics, "verifiedTags">; gateAnswers: { id: string; value: string; ms: number }[] }) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
  /** Returns the recovery token when the backend hands it back directly (mock mode). */
  requestPasswordReset: (email: string) => Promise<{ userId: string; secret: string } | null>;
  resetPassword: (userId: string, secret: string, password: string) => Promise<void>;
}

/** The signed-in user's profile; created on first sign-in (e.g. Google) if missing. */
async function loadProfile(): Promise<User> {
  const me = await account.get();
  try {
    return (await databases.getDocument(DB_ID, COLLECTIONS.USERS, me.$id)) as unknown as User;
  } catch {
    return (await api("bootstrapAccount", { role: "founder" })) as User;
  }
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
        set({ user: await loadProfile(), isAuthenticated: true, loading: false });
      } catch (err: unknown) {
        set({
          error: err instanceof Error ? err.message : "Login failed",
          loading: false,
        });
        throw err;
      }
    },

    logout: async () => {
      try {
        await account.deleteSession("current");
      } catch {}
      clearApiSession();
      set({ user: null, isAuthenticated: false });
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    },

    getUser: async () => {
      try {
        await account.get();
        set({ user: await loadProfile(), isAuthenticated: true, isHydrated: true });
      } catch {
        set({ user: null, isAuthenticated: false, isHydrated: true });
      }
    },

    clearError: () => set({ error: null }),

    switchRole: async (role: UserRole) => {
      if (!get().user) return;
      set({ user: (await api("updateProfile", { role })) as User });
    },

    updateProfile: async (data) => {
      set({ user: (await api("updateProfile", data)) as User });
    },

    completeProfile: async (data) => {
      set({ user: (await api("completeProfile", data)) as User });
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
      const user = await api("bootstrapAccount", { role: pending.role, phone: pending.phone, name: pending.name });
      set({ user: user as User, isAuthenticated: true, isHydrated: true, pendingSignup: null });
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
