import { Client, Account, Databases, Storage } from "appwrite";
import { DB_ID, COLLECTIONS } from "./appwrite.config";
import { mockAccount, mockDatabases } from "./mockApi";

export { DB_ID, COLLECTIONS };

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

let client: Client;
let realAccount: Account;
let realDatabases: Databases;
let realStorage: Storage;

if (!useMock) {
  client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  realAccount = new Account(client);
  realDatabases = new Databases(client);
  realStorage = new Storage(client);
}

// We use type assertion to allow swapping the real Appwrite client with our mock
export const account = useMock ? (mockAccount as unknown as Account) : realAccount!;
export const databases = useMock ? (mockDatabases as unknown as Databases) : realDatabases!;
export const storage = useMock ? ({} as Storage) : realStorage!; // Mock storage later if needed

export default client!;
