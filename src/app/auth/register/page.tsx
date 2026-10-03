"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Briefcase01Icon, Call02Icon, LockIcon, Mail01Icon, Rocket01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { AuthField, AuthSplit, AuthSuccess, AuthTitle, GoogleButton, OrDivider } from "@/components/auth/AuthUI";
import { BackLink, primaryBtn } from "@/components/ui/Primitives";
import { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROLES: { role: UserRole; title: string; body: string; icon: typeof Rocket01Icon }[] = [
  { role: "founder", title: "Founder", body: "Validate your ideas and build your startup.", icon: Rocket01Icon },
  { role: "earner", title: "Earner", body: "Answer surveys and share your opinions to earn money.", icon: Briefcase01Icon },
];

const RESEND_SECONDS = 90;

function CodeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const set = (i: number, d: string) => {
    const chars = value.padEnd(6, " ").split("");
    chars[i] = d || " ";
    onChange(chars.join("").trimEnd());
    if (d && i < 5) refs.current[i + 1]?.focus();
  };
  return (
    <div className="flex items-center justify-center gap-2" onPaste={(e) => {
      const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (digits) { e.preventDefault(); onChange(digits); refs.current[Math.min(digits.length, 5)]?.focus(); }
    }}>
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} className="flex items-center gap-2">
          {i === 3 && <span className="h-px w-4 bg-[#E5E7EB]" />}
          <input
            ref={(el) => { refs.current[i] = el; }}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            value={value[i]?.trim() ?? ""}
            onChange={(e) => set(i, e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => { if (e.key === "Backspace" && !value[i]?.trim() && i > 0) refs.current[i - 1]?.focus(); }}
            className={cn(
              "h-[52px] w-[46px] rounded-lg border text-center text-[20px] text-[#111827] focus:border-[#4F46E5] focus:outline-none",
              value[i]?.trim() ? "border-[#4F46E5]" : "border-[#E5E7EB]"
            )}
          />
        </span>
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const { startSignup, confirmSignup, resendSignupCode, loginWithGoogle, pendingSignup } = useAuthStore();
  const [step, setStep] = useState<"role" | "details" | "code" | "done">("role");
  const [role, setRole] = useState<UserRole>("founder");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (step !== "code" || countdown <= 0) return;
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [step, countdown]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirm) return setError("Passwords don't match.");
    setError("");
    setBusy(true);
    try {
      await startSignup({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password, role });
      setCountdown(RESEND_SECONDS);
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    setError("");
    setBusy(true);
    try {
      await confirmSignup(code);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setBusy(false);
    }
  };

  if (step === "done") {
    const first = form.name.trim().split(" ")[0];
    return (
      <AuthSuccess
        title="Account created successfully!!"
        message={
          role === "earner" ? (
            <>Welcome to TIQRA, <b className="font-semibold text-[#111827]">{first}</b>. Proceed to the dashboard to complete your verification and start earning.</>
          ) : (
            <>Welcome to TIQRA, <b className="font-semibold text-[#111827]">{first}</b>. Proceed to the dashboard and start validating.</>
          )
        }
        href={`/${role}/dashboard`}
      />
    );
  }

  const google = () => {
    try {
      loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    }
  };

  return (
    <AuthSplit audience={role}>
      {step === "role" && (
        <>
          <Image src="/logo.png" alt="Tiqra" width={160} height={70} className="mx-auto h-auto w-[160px]" priority />
          <div className="mt-8">
            <AuthTitle title="Join us Today!" subtitle="Be part of a platform where ideas get validated, opinions matter and everyone earns." />
          </div>
          <p className="mt-6 text-[18px] text-[#111827]">Sign up as:</p>
          <div className="mt-3 flex flex-col gap-3">
            {ROLES.map((r) => (
              <label
                key={r.role}
                className={cn(
                  "flex cursor-pointer items-center gap-4 rounded-xl border px-3 py-3",
                  role === r.role ? "border-[#4F46E5] bg-[#E0E7FF]" : "border-transparent bg-[#F8F9FC]"
                )}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#6B7280]">
                  <HugeiconsIcon icon={r.icon} size={18} />
                </span>
                <span className="flex-1">
                  <span className="block text-[16px] text-[#111827]">{r.title}</span>
                  <span className="block text-[12px] text-[#6B7280]">{r.body}</span>
                </span>
                <input type="radio" name="role" checked={role === r.role} onChange={() => setRole(r.role)} className="h-5 w-5 accent-[#4F46E5]" />
              </label>
            ))}
          </div>
          <button onClick={() => setStep("details")} className={cn(primaryBtn, "mt-5 h-12 w-full")}>Proceed</button>
          <OrDivider />
          <GoogleButton onClick={google} />
          {error && <p className="mt-3 text-center text-[13px] text-[#DC2626]">{error}</p>}
          <p className="mt-3 text-center text-[14px] text-[#111827]">
            Already have an account? <Link href="/auth/login" className="text-[#4F46E5]">Login</Link>
          </p>
        </>
      )}

      {step === "details" && (
        <>
          <BackLink label="Back" onClick={() => { setError(""); setStep("role"); }} />
          <div className="mt-8">
            <AuthTitle title={role === "earner" ? "Create Earner Account" : "Create Founder Account"} subtitle="Fill in your details to get started" />
          </div>
          <form onSubmit={register} className="mt-6 flex flex-col gap-3">
            <AuthField label="Full Name" icon={<HugeiconsIcon icon={UserIcon} size={20} />} required autoComplete="name" value={form.name} onChange={set("name")} placeholder="e.g John Doe" />
            <AuthField label="Email" icon={<HugeiconsIcon icon={Mail01Icon} size={20} />} type="email" required autoComplete="email" value={form.email} onChange={set("email")} placeholder="e.g you@gmail.com" />
            <AuthField label="Phone Number" icon={<HugeiconsIcon icon={Call02Icon} size={20} />} type="tel" required autoComplete="tel" value={form.phone} onChange={set("phone")} placeholder="+234 901 234 5678" />
            <AuthField label="Password" icon={<HugeiconsIcon icon={LockIcon} size={20} />} type="password" required autoComplete="new-password" value={form.password} onChange={set("password")} placeholder="Enter your password" />
            <AuthField label="Confirm password" icon={<HugeiconsIcon icon={LockIcon} size={20} />} type="password" required autoComplete="new-password" value={form.confirm} onChange={set("confirm")} placeholder="Confirm your password" />
            {error && <p className="text-[13px] text-[#DC2626]">{error}</p>}
            <button disabled={busy} className={cn(primaryBtn, "mt-2 h-12 w-full")}>{busy ? "Creating account..." : "Register"}</button>
          </form>
          <OrDivider />
          <GoogleButton onClick={google} />
          <p className="mt-3 text-center text-[14px] text-[#111827]">
            Already have an account? <Link href="/auth/login" className="text-[#4F46E5]">Login</Link>
          </p>
        </>
      )}

      {step === "code" && (
        <div className="pt-6">
          <AuthTitle title="Confirm your email" subtitle={`We sent a code to ${pendingSignup?.email ?? form.email}`} />
          <div className="mt-6">
            <CodeInput value={code} onChange={setCode} />
          </div>
          {error && <p className="mt-3 text-center text-[13px] text-[#DC2626]">{error}</p>}
          <button disabled={code.replace(/\s/g, "").length !== 6 || busy} onClick={confirm} className={cn(primaryBtn, "mx-auto mt-5 flex h-[35px] w-full max-w-[250px] text-[13px]")}>
            {busy ? "Confirming..." : "Confirm"}
          </button>
          <p className="mt-3 text-center text-[14px] text-[#111827]">
            Didn&apos;t get it?{" "}
            {countdown > 0 ? (
              <span className="text-[#A5B4FC]">Resend code {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}</span>
            ) : (
              <button onClick={() => resendSignupCode().then(() => setCountdown(RESEND_SECONDS))} className="text-[#4F46E5]">Resend code</button>
            )}
          </p>
        </div>
      )}
    </AuthSplit>
  );
}
