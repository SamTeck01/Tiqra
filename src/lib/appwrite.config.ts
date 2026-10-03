// Fixed collection ids; scripts/setup-appwrite.mjs creates them with these ids.
export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "tiqra";

export const COLLECTIONS = {
  USERS: "users",
  IDEAS: "ideas",
  SURVEYS: "surveys",
  RESPONSES: "responses",
  TRANSACTIONS: "transactions",
  WALLETS: "wallets",
  PAYMENT_METHODS: "payment_methods",
};
