export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "mock_db_id";

export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "mock_users",
  IDEAS: process.env.NEXT_PUBLIC_APPWRITE_IDEAS_COLLECTION_ID || "mock_ideas",
  SURVEYS: process.env.NEXT_PUBLIC_APPWRITE_SURVEYS_COLLECTION_ID || "mock_surveys",
  RESPONSES: process.env.NEXT_PUBLIC_APPWRITE_RESPONSES_COLLECTION_ID || "mock_responses",
  TRANSACTIONS: process.env.NEXT_PUBLIC_APPWRITE_TRANSACTIONS_COLLECTION_ID || "mock_transactions",
  WALLETS: process.env.NEXT_PUBLIC_APPWRITE_WALLETS_COLLECTION_ID || "mock_wallets",
};
