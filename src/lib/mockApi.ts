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
  createEmailPasswordSession: async (email: string, password?: string) => {
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

export const mockDatabases = {
  listDocuments: async (dbId: string, collectionId: string, queries: string[] = []) => {
    await delay(300);
    let data: any[] = [];
    if (collectionId === COLLECTIONS.USERS) data = runtimeData.users;
    else if (collectionId === COLLECTIONS.WALLETS) data = runtimeData.wallets;
    else if (collectionId === COLLECTIONS.TRANSACTIONS) data = runtimeData.transactions;
    else if (collectionId === COLLECTIONS.SURVEYS) data = runtimeData.surveys;
    else if (collectionId === COLLECTIONS.RESPONSES) data = runtimeData.responses;
    else if (collectionId === COLLECTIONS.IDEAS) data = runtimeData.ideas;

    // Apply very basic mock querying
    for (const q of queries) {
      if (typeof q === "string" && q.startsWith("equal(")) {
        // extract key and value: equal("email", ["founder@tiqra.com"]) or equal("email", "founder@tiqra.com")
        const match = q.match(/equal\("([^"]+)", \[?"([^"]+)"\]?\)/);
        if (match) {
          const key = match[1];
          const val = match[2];
          data = data.filter((item) => item[key] === val);
        }
      }
    }

    return { documents: data, total: data.length };
  },

  getDocument: async (dbId: string, collectionId: string, docId: string) => {
    await delay(200);
    let data: any[] = [];
    if (collectionId === COLLECTIONS.USERS) data = runtimeData.users;
    else if (collectionId === COLLECTIONS.WALLETS) data = runtimeData.wallets;
    else if (collectionId === COLLECTIONS.TRANSACTIONS) data = runtimeData.transactions;
    else if (collectionId === COLLECTIONS.SURVEYS) data = runtimeData.surveys;
    else if (collectionId === COLLECTIONS.RESPONSES) data = runtimeData.responses;
    else if (collectionId === COLLECTIONS.IDEAS) data = runtimeData.ideas;

    const doc = data.find((d) => d.$id === docId);
    if (!doc) throw new Error("Document not found");
    return doc;
  },

  createDocument: async (dbId: string, collectionId: string, docId: string, docData: any) => {
    await delay(400);
    const newDoc = { $id: docId, ...docData };
    if (collectionId === COLLECTIONS.USERS) runtimeData.users.push(newDoc);
    else if (collectionId === COLLECTIONS.WALLETS) runtimeData.wallets.push(newDoc);
    else if (collectionId === COLLECTIONS.TRANSACTIONS) runtimeData.transactions.push(newDoc);
    else if (collectionId === COLLECTIONS.SURVEYS) runtimeData.surveys.push(newDoc);
    else if (collectionId === COLLECTIONS.RESPONSES) runtimeData.responses.push(newDoc);
    else if (collectionId === COLLECTIONS.IDEAS) runtimeData.ideas.push(newDoc);
    return newDoc;
  },

  updateDocument: async (dbId: string, collectionId: string, docId: string, docData: any) => {
    await delay(400);
    let data: any[] = [];
    if (collectionId === COLLECTIONS.USERS) data = runtimeData.users;
    else if (collectionId === COLLECTIONS.WALLETS) data = runtimeData.wallets;
    else if (collectionId === COLLECTIONS.TRANSACTIONS) data = runtimeData.transactions;
    else if (collectionId === COLLECTIONS.SURVEYS) data = runtimeData.surveys;
    else if (collectionId === COLLECTIONS.RESPONSES) data = runtimeData.responses;
    else if (collectionId === COLLECTIONS.IDEAS) data = runtimeData.ideas;

    const index = data.findIndex((d) => d.$id === docId);
    if (index === -1) throw new Error("Document not found");
    data[index] = { ...data[index], ...docData };
    return data[index];
  },
};
