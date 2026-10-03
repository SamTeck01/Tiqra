// Storage used by the business logic in handlers.ts. Two implementations: Appwrite
// with the server key (production) and the in-browser demo data (mock mode).
/* eslint-disable @typescript-eslint/no-explicit-any */
export type Filters = Record<string, string | number | boolean>;

export interface Db {
  list<T = any>(collection: string, filters?: Filters): Promise<T[]>;
  get<T = any>(collection: string, id: string): Promise<T | null>;
  /** owner: the only user who may read the document (Appwrite document permission). */
  create<T = any>(collection: string, data: Record<string, any>, id?: string, owner?: string): Promise<T>;
  update<T = any>(collection: string, id: string, data: Record<string, any>): Promise<T>;
  remove(collection: string, id: string): Promise<void>;
}

export function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}
