// Single entry point for Tiqra's server logic: POST /api/<handlerName>.
// The caller proves who they are with an Appwrite JWT (Authorization: Bearer ...).
import { NextResponse } from "next/server";
import { Account, Client } from "node-appwrite";
import { HANDLERS, HandlerName, HttpError } from "@/lib/server/handlers";
import { appwriteDb } from "@/lib/server/appwriteDb";
import { getAIProvider } from "@/lib/ai";

export const dynamic = "force-dynamic";

async function whoIs(req: Request) {
  const jwt = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!jwt) throw new HttpError(401, "Not signed in");
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setJWT(jwt);
  try {
    const me = await new Account(client).get();
    return { id: me.$id, name: me.name, email: me.email };
  } catch {
    throw new HttpError(401, "Session expired. Please sign in again.");
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  const handler = HANDLERS[action as HandlerName] as ((ctx: unknown, input: unknown) => Promise<unknown>) | undefined;
  if (!handler) return NextResponse.json({ error: "Unknown action" }, { status: 404 });
  try {
    const me = await whoIs(req);
    const input = await req.json().catch(() => ({}));
    const result = await handler({ db: appwriteDb(), ai: getAIProvider(), userId: me.id, account: me }, input);
    return NextResponse.json(result ?? null);
  } catch (e) {
    const status = e instanceof HttpError ? e.status : 500;
    if (status === 500) console.error(`[api/${action}]`, e);
    return NextResponse.json({ error: status === 500 ? "Something went wrong" : (e as Error).message }, { status });
  }
}
