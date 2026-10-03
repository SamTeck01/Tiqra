import { Client, Account, Databases, Storage } from "appwrite";
import { DB_ID, COLLECTIONS } from "./appwrite.config";
import { decode, encode } from "./codec";
import { mockAccount, mockDatabases } from "./mockApi";

export { DB_ID, COLLECTIONS };

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

let client: Client | undefined;
let realAccount: Account | undefined;
let realDatabases: Databases | undefined;
let realStorage: Storage | undefined;

if (!useMock) {
  client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
  realAccount = new Account(client);
  realDatabases = new Databases(client);
  realStorage = new Storage(client);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// Real Appwrite stores nested fields as JSON strings; decode them on the way in.
const codecDatabases = realDatabases && {
  listDocuments: async (db: string, col: string, queries?: string[]) => {
    const res = await realDatabases!.listDocuments(db, col, queries);
    return { ...res, documents: res.documents.map((d) => decode(col, d)) };
  },
  getDocument: async (db: string, col: string, id: string) => decode(col, await realDatabases!.getDocument(db, col, id)),
  createDocument: async (db: string, col: string, id: string, data: any) => decode(col, await realDatabases!.createDocument(db, col, id, encode(col, data))),
  updateDocument: async (db: string, col: string, id: string, data: any) => decode(col, await realDatabases!.updateDocument(db, col, id, encode(col, data))),
  deleteDocument: (db: string, col: string, id: string) => realDatabases!.deleteDocument(db, col, id),
};

// Type assertions let the demo implementation stand in for the real SDK.
export const account = useMock ? (mockAccount as unknown as Account) : realAccount!;
export const databases = (useMock ? mockDatabases : codecDatabases) as unknown as Databases;
export const storage = useMock ? ({} as Storage) : realStorage!;

export default client;
