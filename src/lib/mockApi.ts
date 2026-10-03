import { runtimeData } from "./mockData";
import { COLLECTIONS } from "./appwrite.config"; // We'll move collections export to a config file to avoid circular deps

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAccount = {
  create: async (id: string, email: string, password?: string, name?: string) => {
    await delay(500);
    const existing = runtimeData.users.find((u) => u.email === email);
    if (existing) throw new Error("User already exists");
    // Just return a mock account response
    return { $id: id, email, name, registration: new Date().toISOString() };
  },
  // The demo accepts any password.
  createEmailPasswordSession: async (email: string) => {
    await delay(500);
    const user = runtimeData.users.find((u) => u.email === email);
    if (!user) throw new Error("Invalid credentials");
    const sessionId = "sess_" + Date.now();
    runtimeData.sessions.push({ userId: user.$id, sessionId, token: "mock_token" });
    return { $id: sessionId, userId: user.$id };
  },
  get: async () => {
    await delay(200);
    // Since we don't have cookies in this simple mock, we just return the first active session
    // Or we simulate that the last logged in user is the active one
    const activeSession = runtimeData.sessions[runtimeData.sessions.length - 1];
    if (!activeSession) throw new Error("Not logged in");
    const user = runtimeData.users.find((u) => u.$id === activeSession.userId);
    if (!user) throw new Error("Not logged in");
    return { $id: user.$id, email: user.email, name: user.name };
  },
  createEmailToken: async (userId: string, email: string) => {
    await delay(500);
    return { $id: "token_" + Date.now(), userId, secret: "", email };
  },
  createSession: async (userId: string, secret: string) => {
    await delay(500);
    // Any six-digit code is accepted in mock mode.
    if (!/^\d{6}$/.test(secret)) throw new Error("Invalid code. Please check the code and try again.");
    const sessionId = "sess_" + Date.now();
    runtimeData.sessions.push({ userId, sessionId, token: "mock_token" });
    return { $id: sessionId, userId };
  },
  createOAuth2Session: () => {
    throw new Error("Google sign-in isn't available in demo mode.");
  },
  updatePassword: async (password: string, oldPassword?: string) => {
    await delay(500);
    if (!oldPassword) throw new Error("Current password is required");
    if (password.length < 8) throw new Error("Password must be at least 8 characters");
    return {};
  },
  createRecovery: async (email: string, url: string) => {
    await delay(600);
    // Real Appwrite emails the secret; the mock hands it back so the reset screen can be reached.
    return { userId: email, secret: "mock_secret", url };
  },
  updateRecovery: async (userId: string, secret: string, password: string) => {
    await delay(600);
    if (password.length < 8) throw new Error("Password must be at least 8 characters");
    return {};
  },
  deleteSession: async (sessionId: string) => {
    await delay(200);
    if (sessionId === "current") {
      runtimeData.sessions.pop(); // just pop the last one
    } else {
      runtimeData.sessions = runtimeData.sessions.filter((s) => s.sessionId !== sessionId);
    }
    return {};
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function table(collectionId: string): any[] {
  const map: Record<string, keyof typeof runtimeData> = {
    [COLLECTIONS.USERS]: "users",
    [COLLECTIONS.WALLETS]: "wallets",
    [COLLECTIONS.TRANSACTIONS]: "transactions",
    [COLLECTIONS.SURVEYS]: "surveys",
    [COLLECTIONS.RESPONSES]: "responses",
    [COLLECTIONS.IDEAS]: "ideas",
    [COLLECTIONS.PAYMENT_METHODS]: "paymentMethods",
  };
  const key = map[collectionId];
  if (!key) throw new Error(`Unknown collection ${collectionId}`);
  return runtimeData[key] as any[];
}

export const mockDatabases = {
  listDocuments: async (dbId: string, collectionId: string, queries: string[] = []) => {
    await delay(300);
    let data = [...table(collectionId)];
    // Apply the equal() filters. Appwrite v16 serialises queries as JSON.
    for (const q of queries) {
      try {
        const parsed = JSON.parse(q) as { method: string; attribute: string; values: unknown[] };
        if (parsed.method === "equal") {
          data = data.filter((item) => parsed.values.includes(item[parsed.attribute]));
        }
      } catch {
        // Not a JSON query; ignore.
      }
    }
    return { documents: data, total: data.length };
  },

  getDocument: async (dbId: string, collectionId: string, docId: string) => {
    await delay(200);
    const doc = table(collectionId).find((d) => d.$id === docId);
    if (!doc) throw new Error("Document not found");
    return doc;
  },

  createDocument: async (dbId: string, collectionId: string, docId: string, docData: any) => {
    await delay(400);
    const newDoc = { $id: docId, ...docData };
    table(collectionId).push(newDoc);
    return newDoc;
  },

  updateDocument: async (dbId: string, collectionId: string, docId: string, docData: any) => {
    await delay(400);
    const data = table(collectionId);
    const index = data.findIndex((d) => d.$id === docId);
    if (index === -1) throw new Error("Document not found");
    data[index] = { ...data[index], ...docData };
    return data[index];
  },

  deleteDocument: async (dbId: string, collectionId: string, docId: string) => {
    await delay(300);
    const data = table(collectionId);
    const index = data.findIndex((d) => d.$id === docId);
    if (index !== -1) data.splice(index, 1);
    return {};
  },
};
