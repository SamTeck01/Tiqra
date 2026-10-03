// Creates (or completes) Tiqra's Appwrite database. Safe to run more than once.
//   node --env-file=.env.local scripts/setup-appwrite.mjs
import { Client, Databases, IndexType, Permission, Role } from "node-appwrite";

const { NEXT_PUBLIC_APPWRITE_ENDPOINT: endpoint, NEXT_PUBLIC_APPWRITE_PROJECT_ID: project, APPWRITE_API_KEY: key } = process.env;
const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "tiqra";
if (!endpoint || !project || !key) {
  console.error("Set NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID and APPWRITE_API_KEY first.");
  process.exit(1);
}

const db = new Databases(new Client().setEndpoint(endpoint).setProject(project).setKey(key));

const str = (key, size = 255, required = false) => ({ kind: "string", key, size, required });
const num = (key, required = false) => ({ kind: "float", key, required });
const int = (key, required = false) => ({ kind: "integer", key, required });
const bool = (key, required = false) => ({ kind: "boolean", key, required });

// Documents are written only by the server. Users read their own documents (set per
// document by the server); surveys are readable by every signed-in user.
const COLLECTIONS = [
  {
    id: "users", name: "Users", docSecurity: true, perms: [],
    attrs: [str("name"), str("email"), str("phone", 32), str("role", 16, true), num("walletBalance"), int("reliabilityScore"), str("demographics", 5000), str("notificationPrefs", 1000), str("createdAt", 40)],
    indexes: [["email", ["email"]]],
  },
  {
    id: "wallets", name: "Wallets", docSecurity: true, perms: [],
    attrs: [str("userId", 64, true), num("balance"), num("pendingBalance"), num("totalEarned"), num("totalSpent")],
    indexes: [["userId", ["userId"], IndexType.Unique]],
  },
  {
    id: "transactions", name: "Transactions", docSecurity: true, perms: [],
    attrs: [str("userId", 64, true), str("type", 16, true), num("amount", true), str("description", 255), str("status", 16), str("reference", 64), num("balanceAfter"), str("createdAt", 40)],
    indexes: [["userId", ["userId"]]],
  },
  {
    id: "surveys", name: "Surveys", docSecurity: false, perms: [Permission.read(Role.users())],
    attrs: [
      str("title", 255, true), str("description", 2000), str("summary", 1000), str("intake", 5000), str("creatorId", 64, true), str("status", 16, true),
      str("questions", 100000), str("targetAudience", 2000), int("respondentsRequired"), int("respondentsCompleted"), num("payoutPerResponse"),
      num("platformFee"), num("totalCost"), num("escrowAmount"), bool("aiReportGenerated"), str("createdAt", 40), str("verdict", 8), int("confidence"),
    ],
    indexes: [["creatorId", ["creatorId"]], ["status", ["status"]]],
  },
  {
    id: "responses", name: "Responses", docSecurity: true, perms: [],
    attrs: [
      str("surveyId", 64, true), str("respondentId", 64, true), str("answers", 100000), bool("validatedByTruthLayer"), bool("flagged"),
      str("flagReason", 500), int("qualityScore"), str("completedAt", 40), int("timeTaken"),
    ],
    indexes: [["surveyId", ["surveyId"]], ["respondentId", ["respondentId"]], ["survey_respondent", ["surveyId", "respondentId"], IndexType.Unique]],
  },
  {
    // Saved cards and bank accounts: users manage their own (payments are wired later).
    id: "payment_methods", name: "Payment methods", docSecurity: true, perms: [Permission.create(Role.users())],
    attrs: [str("userId", 64, true), str("kind", 8, true), str("provider", 64), str("last4", 4), str("holderName", 128), str("expiry", 8), bool("isDefault"), str("createdAt", 40)],
    indexes: [["userId", ["userId"]]],
  },
];

async function ignoreExists(fn) {
  try {
    return await fn();
  } catch (e) {
    if (e?.code === 409) return null;
    throw e;
  }
}

async function waitForAttributes(collectionId) {
  for (let i = 0; i < 60; i++) {
    const { attributes } = await db.listAttributes(DB, collectionId);
    if (attributes.every((a) => a.status === "available")) return;
    if (attributes.some((a) => a.status === "failed")) throw new Error(`An attribute failed in ${collectionId}`);
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Timed out waiting for attributes in ${collectionId}`);
}

await ignoreExists(() => db.create(DB, "Tiqra"));
console.log(`Database: ${DB}`);

for (const c of COLLECTIONS) {
  const created = await ignoreExists(() => db.createCollection(DB, c.id, c.name, c.perms, c.docSecurity));
  if (!created) await db.updateCollection(DB, c.id, c.name, c.perms, c.docSecurity);
  for (const a of c.attrs) {
    await ignoreExists(() => {
      if (a.kind === "string") return db.createStringAttribute(DB, c.id, a.key, a.size, a.required);
      if (a.kind === "float") return db.createFloatAttribute(DB, c.id, a.key, a.required);
      if (a.kind === "integer") return db.createIntegerAttribute(DB, c.id, a.key, a.required);
      return db.createBooleanAttribute(DB, c.id, a.key, a.required);
    });
  }
  await waitForAttributes(c.id);
  for (const [key, attrs, type = IndexType.Key] of c.indexes) {
    await ignoreExists(() => db.createIndex(DB, c.id, key, type, attrs));
  }
  console.log(`  ✓ ${c.id}`);
}
console.log("Done. Set NEXT_PUBLIC_USE_MOCK_API=false to use it.");
