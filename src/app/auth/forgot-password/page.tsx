"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Key01Icon, SquareLock02Icon, Tick02Icon, ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { BackLink, primaryBtn } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

const field = "h-12 w-full rounded-xl border border-[#E5E7EB] px-3 pr-11 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#4F46E5] focus:outline-none";

function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative block">
      <input {...props} type={show ? "text" : "password"} className={field} />
      <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#111827]">
        <HugeiconsIcon icon={show ? ViewIcon : ViewOffSlashIcon} size={20} />
      </button>
    </span>
  );
}

function ResetFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const { requestPasswordReset, resetPassword } = useAuthStore();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [token, setToken] = useState<{ userId: string; secret: string } | null>(() => {
    const userId = params.get("userId");
    const secret = params.get("secret");
    return userId && secret ? { userId, secret } : null;
  });
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const t = await requestPasswordReset(email.trim());
      setSent(true);
      if (t) setToken(t);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the reset link");
    } finally {
      setBusy(false);
    }
  };

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    setBusy(true);
    setError("");
    try {
      await resetPassword(token.userId, token.secret, password);
      setUpdated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FC] px-4">
      <div className="w-full max-w-[484px] rounded-[24px] bg-white px-6 py-8 sm:px-8">
        {token ? (
          <form onSubmit={reset}>
            {sent && (
              <p className="inline-flex items-center gap-3 rounded-lg bg-[#111827] px-4 py-2 text-[13px] text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" /> Reset link sent to your email
              </p>
            )}
            <span className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4F46E5]">
              <HugeiconsIcon icon={SquareLock02Icon} size={24} className="text-white" />
            </span>
            <h1 className="mt-4 text-center text-[20px] text-[#111827]">Set new password</h1>
            <p className="mx-auto mt-1 max-w-[290px] text-center text-[14px] text-[#6B7280]">
              Your new password must be different from your previous one. Make it strong.
            </p>
            <label className="mt-6 flex flex-col gap-2 text-[14px] text-[#111827]">
              Password
              <PasswordInput autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a strong password" />
            </label>
            <label className="mt-4 flex flex-col gap-2 text-[14px] text-[#111827]">
              Confirm password
              <PasswordInput autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat your password" />
            </label>
            {error && <p className="mt-3 text-[13px] text-[#DC2626]">{error}</p>}
            {updated ? (
              <div className="mx-auto mt-5 flex max-w-[290px] items-center justify-between rounded-lg border border-[#BBF7D0] bg-[#E8F8EE] px-3 py-2 text-[14px]">
                <span className="flex items-center gap-2 text-[#16A34A]"><HugeiconsIcon icon={Tick02Icon} size={18} /> Password updated!</span>
                <button type="button" onClick={() => router.push("/auth/login")} className="flex items-center gap-1 text-[#4F46E5]">
                  Sign in now <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
                </button>
              </div>
            ) : (
              <button disabled={busy} className={cn(primaryBtn, "mx-auto mt-5 flex h-[42px] w-full max-w-[390px]")}>
                {busy ? "Saving..." : "Reset password"}
              </button>
            )}
          </form>
        ) : sent ? (
          <div className="text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#4F46E5]">
              <HugeiconsIcon icon={Key01Icon} size={24} className="text-white" />
            </span>
            <h1 className="mt-4 text-[20px] text-[#111827]">Check your email</h1>
            <p className="mt-1 text-[14px] text-[#6B7280]">We sent a reset link to {email}. Open it to set a new password.</p>
            <Link href="/auth/login" className="mt-6 inline-block text-[14px] text-[#4F46E5]">Back to login</Link>
          </div>
        ) : (
          <form onSubmit={send}>
            <BackLink href="/auth/login" label="Back to login" />
            <span className="mx-auto mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4F46E5]">
              <HugeiconsIcon icon={Key01Icon} size={24} className="text-white" />
            </span>
            <h1 className="mt-4 text-center text-[20px] text-[#111827]">Forgot your password</h1>
            <p className="mx-auto mt-1 max-w-[290px] text-center text-[14px] text-[#6B7280]">
              No worries. Enter your email address and we&apos;ll send you a reset link right away.
            </p>
            <label className="mt-8 flex flex-col gap-2 text-[14px] text-[#111827]">
              Email address
              <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" className={field} />
            </label>
            {error && <p className="mt-3 text-[13px] text-[#DC2626]">{error}</p>}
            <button disabled={busy} className={cn(primaryBtn, "mx-auto mt-5 flex h-[42px] w-full max-w-[390px]")}>
              {busy ? "Sending..." : "Send reset link"}
            </button>
            <p className="mt-3 text-center text-[14px] text-[#6B7280]">
              Remember your password? <Link href="/auth/login" className="text-[#4F46E5]">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ResetFlow />
    </Suspense>
  );
}
