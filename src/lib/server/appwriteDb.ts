// Db backed by Appwrite with the server API key. Server only.
import "server-only";
import { Client, Databases, ID, Permission, Query, Role } from "node-appwrite";
import { DB_ID } from "../appwrite.config";
import { decode, encode } from "../codec";
import { Db } from "./db";

export function adminClient(): Client {
  const key = process.env.APPWRITE_API_KEY;
  if (!key) throw new Error("APPWRITE_API_KEY is not set");
  return new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(key);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const strip = (doc: Record<string, any>) => {
  const { $collectionId, $databaseId, $permissions, $updatedAt, ...rest } = doc;
  void $collectionId; void $databaseId; void $permissions; void $updatedAt;
  return rest;
};

export function appwriteDb(): Db {
  const db = new Databases(adminClient());
  return {
    async list(collection, filters = {}) {
      const out: any[] = [];
      let cursor: string | undefined;
      for (;;) {
        const q = [
          ...Object.entries(filters).map(([k, v]) => Query.equal(k, v as any)),
          Query.limit(100),
          ...(cursor ? [Query.cursorAfter(cursor)] : []),
        ];
        const page = await db.listDocuments(DB_ID, collection, q);
        out.push(...page.documents.map((d) => decode(collection, strip(d))));
        if (page.documents.length < 100) return out;
        cursor = page.documents[page.documents.length - 1].$id;
      }
    },
    async get(collection, id) {
      try {
        return decode(collection, strip(await db.getDocument(DB_ID, collection, id)));
      } catch (e: any) {
        if (e?.code === 404) return null;
        throw e;
      }
    },
    async create(collection, data, id, owner) {
      const { $id, ...rest } = data;
      void $id;
      const perms = owner ? [Permission.read(Role.user(owner))] : undefined;
      return decode(collection, strip(await db.createDocument(DB_ID, collection, id ?? ID.unique(), encode(collection, rest), perms)));
    },
    async update(collection, id, data) {
      const { $id, ...rest } = data;
      void $id;
      return decode(collection, strip(await db.updateDocument(DB_ID, collection, id, encode(collection, rest))));
    },
    async remove(collection, id) {
      await db.deleteDocument(DB_ID, collection, id);
    },
  };
}
