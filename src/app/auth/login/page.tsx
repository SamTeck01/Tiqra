"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { AuthField, AuthSplit, AuthSuccess, AuthTitle, GoogleButton, OrDivider } from "@/components/auth/AuthUI";
import { BackLink, primaryBtn } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, user, loading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email.trim(), password);
      if (!useAuthStore.getState().user) throw new Error("We couldn't find an account with that email.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  if (done && user) {
    const verb = user.role === "earner" ? "Earning" : "Validating";
    return (
      <AuthSuccess
        title="Login successful!!"
        message={<>Welcome back to TIQRA, <b className="font-semibold text-[#111827]">{user.name.split(" ")[0]}</b>. Proceed to the dashboard and start {verb}.</>}
        href={`/${user.role}/dashboard`}
      />
    );
  }

  return (
    <AuthSplit audience="founder">
      <BackLink label="Back" onClick={() => router.back()} />
      <div className="mt-12">
        <AuthTitle title="Welcome Back" subtitle="Fill in your details to get started" />
      </div>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        <AuthField label="Email" icon={<HugeiconsIcon icon={Mail01Icon} size={20} />} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g you@gmail.com" />
        <AuthField label="Password" icon={<HugeiconsIcon icon={LockIcon} size={20} />} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
        {error && <p className="text-[13px] text-[#DC2626]">{error}</p>}
        <button type="submit" disabled={loading} className={cn(primaryBtn, "mt-1 h-12 w-full")}>{loading ? "Logging in..." : "Login"}</button>
        <Link href="/auth/forgot-password" className="self-end text-[13px] text-[#4F46E5]">Forgot password?</Link>
      </form>
      <OrDivider />
      <GoogleButton
        onClick={() => {
          try {
            loginWithGoogle();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Google sign-in failed");
          }
        }}
      />
      <p className="mt-3 text-center text-[14px] text-[#111827]">
        Don&apos;t have an account yet? <Link href="/auth/register" className="text-[#4F46E5]">Sign up</Link>
      </p>
    </AuthSplit>
  );
}
