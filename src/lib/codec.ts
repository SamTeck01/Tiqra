// Appwrite stores flat attributes, so nested fields are saved as JSON strings.
import { COLLECTIONS } from "./appwrite.config";

export const JSON_FIELDS: Record<string, string[]> = {
  [COLLECTIONS.USERS]: ["demographics", "notificationPrefs"],
  [COLLECTIONS.SURVEYS]: ["questions", "targetAudience", "intake"],
  [COLLECTIONS.RESPONSES]: ["answers"],
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export function encode(collection: string, data: Record<string, any>): Record<string, any> {
  const out = { ...data };
  for (const f of JSON_FIELDS[collection] ?? []) if (out[f] !== undefined && typeof out[f] !== "string") out[f] = JSON.stringify(out[f]);
  return out;
}

export function decode<T = any>(collection: string, doc: Record<string, any>): T {
  const out = { ...doc };
  for (const f of JSON_FIELDS[collection] ?? []) {
    if (typeof out[f] === "string" && out[f]) {
      try {
        out[f] = JSON.parse(out[f]);
      } catch {
        // leave as-is
      }
    }
  }
  return out as T;
}
