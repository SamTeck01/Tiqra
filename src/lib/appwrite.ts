import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
  SURVEYS: process.env.NEXT_PUBLIC_APPWRITE_SURVEYS_COLLECTION_ID!,
  RESPONSES: process.env.NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID!,
  TRANSACTIONS: process.env.NEXT_PUBLIC_APPWRITE_TRANSACTIONS_COLLECTION_ID!,
  WALLETS: process.env.NEXT_PUBLIC_APPWRITE_WALLETS_COLLECTION_ID!,
};

export default client;
