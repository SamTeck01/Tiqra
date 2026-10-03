# Tiqra setup

The app runs in two modes, picked by `NEXT_PUBLIC_USE_MOCK_API`:

- `true`: demo data in the browser, no backend. Good for design work and CI.
- `false`: real Appwrite. All money, response and trust logic runs on the server (`src/app/api/[action]`).

Keys never go in GitHub. Put them in `.env.local` on your machine (git ignores it) and in Vercel → Project → Settings → Environment Variables.

## 1. Appwrite

1. Copy `.env.example` to `.env.local`.
2. Fill `NEXT_PUBLIC_APPWRITE_ENDPOINT` and `NEXT_PUBLIC_APPWRITE_PROJECT_ID`.
3. In Appwrite → Overview → API keys, create a key with scopes `databases.*`, `collections.*`, `attributes.*`, `indexes.*`, `documents.*`, `users.read`. Put it in `APPWRITE_API_KEY`.
4. Run `npm run setup:appwrite` (creates the database, collections, fields, indexes and permissions; safe to re-run).
5. In Appwrite → Auth: enable Email/Password and Email OTP. Optional: enable Google under OAuth providers.
6. In Appwrite → Overview → Platforms: add a Web platform for `localhost` and your Vercel domain.
7. Set `NEXT_PUBLIC_USE_MOCK_API=false` and run `npm run dev`.

## 2. AI (optional, later)

Set `AI_PROVIDER` (openai, openrouter, groq, deepseek or gemini), `AI_API_KEY` and `AI_MODEL`. Any other OpenAI-compatible service works with `AI_BASE_URL`. Without a key, a placeholder generates questions from a template and report text from the computed numbers. The provider lives in `src/lib/ai/`.

## Checks

`npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`. GitHub Actions runs all four on every push.

## Not wired yet

Payments (wallet top-up, withdrawals, bank verification) still run in the browser in demo form and are blocked by the database permissions in real mode. They move to the server with Paystack.
