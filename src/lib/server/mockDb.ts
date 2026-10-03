import { Query } from "appwrite";
import { mockDatabases } from "../mockApi";
import { DB_ID } from "../appwrite.config";
import { Db, newId } from "./db";

/** Db over the in-browser demo data. */
export const mockDb: Db = {
  async list(collection, filters = {}) {
    const q = Object.entries(filters).map(([k, v]) => Query.equal(k, v as string));
    return (await mockDatabases.listDocuments(DB_ID, collection, q)).documents;
  },
  async get(collection, id) {
    try {
      return await mockDatabases.getDocument(DB_ID, collection, id);
    } catch {
      return null;
    }
  },
  create: (collection, data, id) => mockDatabases.createDocument(DB_ID, collection, id ?? newId(), data),
  update: (collection, id, data) => mockDatabases.updateDocument(DB_ID, collection, id, data),
  async remove(collection, id) {
    await mockDatabases.deleteDocument(DB_ID, collection, id);
  },
};
