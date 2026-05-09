"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { ViewIcon, ViewOffIcon, ArrowRight01Icon, Loading02Icon, CheckmarkCircle01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type Role = "founder" | "earner";

interface FormData {
  role: Role | null;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  // earner demographics
  age: string;
  gender: string;
  location: string;
  occupation: string;
  industry: string;
}

const STEPS = ["Role", "Details", "Password", "Verify"];

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error, clearError } = useAuthStore();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState<FormData>({
    role: null,
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    location: "",
    occupation: "",
    industry: "",
  });

  const update = (k: keyof FormData, v: string | Role) =>
    setForm((f) => ({ ...f, [k]: v }));

  const next = () => { clearError(); setStep((s) => s + 1); };
  const back = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    clearError();
    try {
      await register(form.email, form.password, form.name, form.role!);
      setStep(4);
    } catch {}
  };

  return (
    <div className="min-h-screen flex bg-[#FEFEFE]">
      {/* Left panel – purple gradient brand */}
      <div
        className="hidden lg:flex w-[594px] flex-shrink-0 rounded-[40px] m-3 flex-col relative overflow-hidden"
        style={{
          background: "linear-gradient(136deg, #9F4EF5 0%, #E5CAFC 100%)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-12">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-3xl">T</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Validate ideas.<br />Make smarter<br />decisions.
            </h1>
            <p className="text-white/70 text-lg">
              Real feedback from real people,<br />powered by AI truth-layer
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-20 py-12 max-w-[700px] mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-text-primary leading-[150%] tracking-[-0.03em]">
            Create your account
          </h1>
          <p className="text-lg text-text-primary mt-1">
            <span className="text-text-secondary">Already have one?</span>{" "}
            <Link href="/auth/login" className="text-brand-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((label, i) => {
            const num = i + 1;
            const isActive = num === step;
            const isDone = num < step;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "w-[60px] h-[60px] rounded-full flex items-center justify-center border-2 transition-all",
                      isDone
                        ? "bg-brand-primary border-brand-primary"
                        : isActive
                        ? "bg-[#F8F9FC] border-brand-primary"
                        : "bg-[#F8F9FC] border-[#F8F9FC]"
                    )}
                  >
                    {isDone ? (
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} size={24} className="text-white"  />
                    ) : (
                      <span
                        className={cn(
                          "text-[24px] font-semibold",
                          isActive ? "text-text-primary" : "text-text-secondary"
                        )}
                      >
                        {num}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-lg text-center",
                      isActive ? "text-brand-primary" : isDone ? "text-text-secondary" : "text-text-primary"
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-px w-20 mb-8 transition-all",
                      isDone ? "bg-brand-primary" : "bg-[#E5E7EB]"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-4 bg-[#FEE2E2] border border-[#DC2626]/20 rounded-xl text-[#DC2626] text-body">
            {error}
          </div>
        )}

        {/* ── Step 1: Role ── */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-[24px] font-semibold text-center text-text-primary">
              I want to......
            </h2>
            <div className="flex gap-4">
              {/* Founder */}
              <button
                onClick={() => update("role", "founder")}
                className={cn(
                  "flex-1 rounded-[30px] border-[1.5px] p-6 flex flex-col items-center gap-3 transition-all cursor-pointer",
                  form.role === "founder"
                    ? "bg-[#F8F9FC] border-brand-primary"
                    : "bg-[#FFFFFF] border-[#E5E7EB]"
                )}
              >
                <div
                  className={cn(
                    "w-[60px] h-[60px] rounded-xl flex items-center justify-center",
                    form.role === "founder" ? "bg-brand-primary" : "bg-[#F8F9FC]"
                  )}
                >
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path
                      d="M5 22.5L12.5 7.5L20 22.5"
                      stroke={form.role === "founder" ? "white" : "#9CA3AF"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.5 17.5H17.5"
                      stroke={form.role === "founder" ? "white" : "#9CA3AF"}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="22.5"
                      cy="20"
                      r="4"
                      stroke={form.role === "founder" ? "white" : "#9CA3AF"}
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <span
                  className={cn(
                    "text-lg font-medium",
                    form.role === "founder" ? "text-brand-primary" : "text-text-primary"
                  )}
                >
                  Validate ideas
                </span>
                <span className="text-body text-text-secondary text-center">I'm a founder</span>
              </button>

              {/* Earner */}
              <button
                onClick={() => update("role", "earner")}
                className={cn(
                  "flex-1 rounded-[30px] border-[1.5px] p-6 flex flex-col items-center gap-3 transition-all cursor-pointer",
                  form.role === "earner"
                    ? "bg-[#F8F9FC] border-brand-primary"
                    : "bg-[#FFFFFF] border-[#E5E7EB]"
                )}
              >
                <div
                  className={cn(
                    "w-[60px] h-[60px] rounded-xl flex items-center justify-center",
                    form.role === "earner" ? "bg-brand-primary" : "bg-[#F8F9FC]"
                  )}
                >
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <rect
                      x="5"
                      y="8"
                      width="20"
                      height="14"
                      rx="2"
                      stroke={form.role === "earner" ? "white" : "#9CA3AF"}
                      strokeWidth="2"
                    />
                    <path
                      d="M5 13H25"
                      stroke={form.role === "earner" ? "white" : "#9CA3AF"}
                      strokeWidth="2"
                    />
                    <path
                      d="M10 18H14"
                      stroke={form.role === "earner" ? "white" : "#9CA3AF"}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span
                  className={cn(
                    "text-lg font-medium",
                    form.role === "earner" ? "text-brand-primary" : "text-text-primary"
                  )}
                >
                  Earn money
                </span>
                <span className="text-body text-text-secondary text-center">I'm a respondent</span>
              </button>
            </div>

            {/* InformationCircleIcon box */}
            {form.role && (
              <div className="flex items-start gap-3 bg-[#F8F9FC] rounded-xl p-4">
                <div className="w-3 h-3 rounded-full bg-brand-primary mt-1 flex-shrink-0" />
                <p className="text-body text-text-primary leading-relaxed">
                  {form.role === "founder"
                    ? "As a founder, you'll submit your idea, get AI generated survey questions, and receive a GO / PIVOT / KILL decision backed by real data"
                    : "As a respondent, you'll complete surveys, share honest feedback, and earn real money directly to your wallet"}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={() => { if (form.role) next(); }}
                disabled={!form.role}
                className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <HugeiconsIcon icon={ArrowRight01Icon} size={20}  />
              </button>
              <button className="btn-secondary w-full justify-center gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path
                    d="M18.77 8.2H10.18v3.46h4.94c-.46 2.11-2.26 3.46-4.94 3.46-3.04 0-5.49-2.46-5.49-5.5s2.45-5.5 5.49-5.5c1.39 0 2.61.47 3.57 1.38l2.54-2.54C14.83 1.96 12.63 1 10.18 1 5.12 1 1 5.12 1 10.18s4.12 9.18 9.18 9.18c5.24 0 8.72-3.68 8.72-8.88 0-.59-.06-1.18-.13-1.28z"
                    fill="#4285F4"
                  />
                </svg>
                Continue with Google
              </button>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#E5E7EB]" />
                <span className="text-body text-text-secondary">Or continue with email</span>
                <div className="h-px flex-1 bg-[#E5E7EB]" />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Details ── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={back} className="p-2 rounded-lg hover:bg-[#F8F9FC] transition-colors">
                <HugeiconsIcon icon={ArrowLeft01Icon} size={24} className="text-text-secondary"  />
              </button>
              <div>
                <h2 className="text-[24px] font-semibold text-text-primary">Your Details</h2>
                <p className="text-lg text-text-secondary">Step 2 of 4 – Account details</p>
              </div>
            </div>

            <div>
              <label className="tiqra-label">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Enter your full name"
                className="tiqra-input"
              />
            </div>
            <div>
              <label className="tiqra-label">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className="tiqra-input"
              />
            </div>

            {form.role === "earner" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="tiqra-label">Age</label>
                    <input
                      type="number"
                      value={form.age}
                      onChange={(e) => update("age", e.target.value)}
                      placeholder="25"
                      className="tiqra-input"
                    />
                  </div>
                  <div>
                    <label className="tiqra-label">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => update("gender", e.target.value)}
                      className="tiqra-input"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="tiqra-label">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder="Lagos, Nigeria"
                    className="tiqra-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="tiqra-label">Occupation</label>
                    <input
                      type="text"
                      value={form.occupation}
                      onChange={(e) => update("occupation", e.target.value)}
                      placeholder="Software Engineer"
                      className="tiqra-input"
                    />
                  </div>
                  <div>
                    <label className="tiqra-label">Industry</label>
                    <input
                      type="text"
                      value={form.industry}
                      onChange={(e) => update("industry", e.target.value)}
                      placeholder="Technology"
                      className="tiqra-input"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => { if (form.name && form.email) next(); }}
              disabled={!form.name || !form.email}
              className="btn-primary w-full justify-center mt-2 disabled:opacity-40"
            >
              Continue <HugeiconsIcon icon={ArrowRight01Icon} size={20}  />
            </button>
          </div>
        )}

        {/* ── Step 3: Password ── */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 mb-2">
              <button onClick={back} className="p-2 rounded-lg hover:bg-[#F8F9FC] transition-colors">
                <HugeiconsIcon icon={ArrowLeft01Icon} size={24} className="text-text-secondary"  />
              </button>
              <div>
                <h2 className="text-[24px] font-semibold text-text-primary">Create Password</h2>
                <p className="text-lg text-text-secondary">Step 3 of 4 – Secure your account</p>
              </div>
            </div>

            <div>
              <label className="tiqra-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  className="tiqra-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
                >
                  {showPassword ? <HugeiconsIcon icon={ViewOffIcon} size={20}  /> : <HugeiconsIcon icon={ViewIcon} size={20}  />}
                </button>
              </div>
            </div>
            <div>
              <label className="tiqra-label">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  placeholder="Repeat your password"
                  className="tiqra-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
                >
                  {showConfirm ? <HugeiconsIcon icon={ViewOffIcon} size={20}  /> : <HugeiconsIcon icon={ViewIcon} size={20}  />}
                </button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-sm text-[#DC2626] mt-1">Passwords don't match</p>
              )}
            </div>

            {/* Password strength indicators */}
            <div className="flex flex-col gap-2">
              {[
                { label: "At least 8 characters", ok: form.password.length >= 8 },
                { label: "Contains a number", ok: /\d/.test(form.password) },
                { label: "Contains a special character", ok: /[^A-Za-z0-9]/.test(form.password) },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full flex items-center justify-center",
                      ok ? "bg-[#16A34A]" : "bg-[#E5E7EB]"
                    )}
                  >
                    {ok && <HugeiconsIcon icon={CheckmarkCircle01Icon} size={10} className="text-white"  />}
                  </div>
                  <span className={ok ? "text-[#16A34A]" : "text-text-secondary"}>{label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                form.password.length < 8 ||
                form.password !== form.confirmPassword
              }
              className="btn-primary w-full justify-center mt-2 disabled:opacity-40"
            >
              {loading ? <HugeiconsIcon icon={Loading02Icon} size={20} className="animate-spin"  /> : <>Create Account <HugeiconsIcon icon={ArrowRight01Icon} size={20}  /></>}
            </button>
          </div>
        )}

        {/* ── Step 4: Verify / Success ── */}
        {step === 4 && (
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="w-24 h-24 rounded-full bg-[#DCFCE7] flex items-center justify-center">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={48} className="text-[#16A34A]"  />
            </div>
            <div className="text-center">
              <h2 className="text-[32px] font-semibold text-text-primary">Account Created!</h2>
              <p className="text-lg text-text-secondary mt-2">
                Welcome to Tiqra. CheckmarkCircle01Icon your email to verify your account.
              </p>
            </div>
            <button
              onClick={() =>
                router.push(form.role === "earner" ? "/earner/dashboard" : "/founder/dashboard")
              }
              className="btn-primary w-full justify-center"
            >
              Go to Dashboard <HugeiconsIcon icon={ArrowRight01Icon} size={20}  />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
