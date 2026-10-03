// Client entry to the server logic. In mock mode the same handlers run locally
// against the demo data; otherwise they run in /api routes with the server key.
import type { HANDLERS, HandlerName } from "./server/handlers";
import { account } from "./appwrite";

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

type Input<K extends HandlerName> = Parameters<(typeof HANDLERS)[K]>[1];
type Output<K extends HandlerName> = Awaited<ReturnType<(typeof HANDLERS)[K]>>;

let jwtCache: { token: string; expires: number } | null = null;

async function jwt(): Promise<string> {
  if (jwtCache && jwtCache.expires > Date.now()) return jwtCache.token;
  const { jwt: token } = await account.createJWT();
  jwtCache = { token, expires: Date.now() + 10 * 60 * 1000 };
  return token;
}

export async function api<K extends HandlerName>(name: K, input: Input<K>): Promise<Output<K>> {
  if (useMock) {
    const [{ HANDLERS }, { mockDb }, { stubProvider }, { runtimeData }] = await Promise.all([
      import("./server/handlers"),
      import("./server/mockDb"),
      import("./ai/stub"),
      import("./mockData"),
    ]);
    const session = runtimeData.sessions[runtimeData.sessions.length - 1];
    const handler = HANDLERS[name] as unknown as (ctx: unknown, input: unknown) => Promise<Output<K>>;
    const me = runtimeData.users.find((u) => u.$id === session?.userId);
    return handler({ db: mockDb, ai: stubProvider, userId: session?.userId ?? "", account: me && { name: me.name, email: me.email } }, input);
  }
  const res = await fetch(`/api/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${await jwt()}` },
    body: JSON.stringify(input ?? {}),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? `Request failed (${res.status})`);
  return data as Output<K>;
}

export function clearApiSession() {
  jwtCache = null;
}
