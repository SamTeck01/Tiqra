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
      // Correct arg order: name, email, password, role
      await register(form.name, form.email, form.password, form.role!);
      setStep(4);
    } catch {}
  };

  // Dynamic gradient: purple for Founder (Figma #426-1468), blue for Earner (Figma #689-1632)
  const panelGradient = form.role === "earner"
    ? "linear-gradient(136deg, #2563EB 0%, #9FB5E7 100%)"
    : "linear-gradient(136deg, #9F4EF5 0%, #E5CAFC 100%)";

  return (
    <div className="min-h-screen flex bg-[#FEFEFE]">
      {/* Left panel – dynamic brand gradient (purple=Founder, blue=Earner) */}
      <div
        className="hidden lg:flex w-[594px] flex-shrink-0 rounded-[40px] m-3 flex-col relative overflow-hidden transition-all duration-700"
        style={{ background: panelGradient }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-12">
            {/* Tiqra SVG Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <svg width="180" height="54" viewBox="0 0 180 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 42L24 12L42 42H30L24 30L18 42H6Z" fill="white" fillOpacity="0.95" />
                <path d="M18 42L24 30L30 42" fill="white" fillOpacity="0.5" />
                <text x="54" y="39" fontFamily="inherit" fontSize="33" fontWeight="700" fill="white" letterSpacing="-0.8">Tiqra</text>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Validate ideas.<br />Make smarter<br />decision
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
              {/* Founder card — purple accent when selected */}
              <button
                onClick={() => update("role", "founder")}
                className={cn(
                  "flex-1 rounded-[30px] border-[1.5px] p-6 flex flex-col items-center gap-3 transition-all cursor-pointer",
                  form.role === "founder"
                    ? "bg-[#F8F9FC] border-[#9F4EF5]"
                    : "bg-[#FFFFFF] border-[#E5E7EB]"
                )}
              >
                <div
                  className="w-[60px] h-[60px] rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: form.role === "founder" ? "#9F4EF5" : "#F8F9FC" }}
                >
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path
                      d="M5 22.5L12.5 7.5L20 22.5"
                      stroke={form.role === "founder" ? "white" : "#9CA3AF"}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                    <path
                      d="M7.5 17.5H17.5"
                      stroke={form.role === "founder" ? "white" : "#9CA3AF"}
                      strokeWidth="2" strokeLinecap="round"
                    />
                    <circle cx="22.5" cy="20" r="4"
                      stroke={form.role === "founder" ? "white" : "#9CA3AF"}
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <span
                  className="text-lg font-medium"
                  style={{ color: form.role === "founder" ? "#9F4EF5" : "#111827" }}
                >
                  Validate ideas
                </span>
                <span className="text-body text-[#6B7280] text-center">I&apos;m a founder</span>
              </button>

              {/* Earner card — blue accent when selected (Figma #689-1632) */}
              <button
                onClick={() => update("role", "earner")}
                className={cn(
                  "flex-1 rounded-[30px] border-[1.5px] p-6 flex flex-col items-center gap-3 transition-all cursor-pointer",
                  form.role === "earner"
                    ? "bg-[#F8F9FC] border-[#2563EB]"
                    : "bg-[#FFFFFF] border-[#E5E7EB]"
                )}
              >
                <div
                  className="w-[60px] h-[60px] rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: form.role === "earner" ? "#2563EB" : "#F8F9FC" }}
                >
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <rect x="5" y="8" width="20" height="14" rx="2"
                      stroke={form.role === "earner" ? "white" : "#9CA3AF"}
                      strokeWidth="2"
                    />
                    <path d="M5 13H25"
                      stroke={form.role === "earner" ? "white" : "#9CA3AF"}
                      strokeWidth="2"
                    />
                    <path d="M10 18H14"
                      stroke={form.role === "earner" ? "white" : "#9CA3AF"}
                      strokeWidth="2" strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span
                  className="text-lg font-medium"
                  style={{ color: form.role === "earner" ? "#2563EB" : "#111827" }}
                >
                  Earn money
                </span>
                <span className="text-body text-[#6B7280] text-center">I&apos;m a respondent</span>
              </button>
            </div>

            {/* Info box */}
            {form.role && (
              <div className="flex items-start gap-3 bg-[#F8F9FC] rounded-xl p-4">
                <div className="w-3 h-3 rounded-full bg-brand-primary mt-1 flex-shrink-0" />
                <p className="text-body text-text-primary leading-relaxed">
                  {form.role === "founder" ? (
                    <>
                      As a <strong>Founder</strong>, you&apos;ll submit your idea, get AI generated survey questions, and receive a GO / PIVOT / KILL decision backed by real data.
                    </>
                  ) : (
                    <>
                      As a <strong>Earner</strong>, you&apos;ll complete surveys from real founder and earn money per valid survey. Withdraw your earnings directly to your bank account.
                    </>
                  )}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 mt-2">
              <button className="btn-secondary w-full justify-center gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path
                    d="M18.77 8.2H10.18v3.46h4.94c-.46 2.11-2.26 3.46-4.94 3.46-3.04 0-5.49-2.46-5.49-5.5s2.45-5.5 5.49-5.5c1.39 0 2.61.47 3.57 1.38l2.54-2.54C14.83 1.96 12.63 1 10.18 1 5.12 1 1 5.12 1 10.18s4.12 9.18 9.18 9.18c5.24 0 8.72-3.68 8.72-8.88 0-.59-.06-1.18-.13-1.28z"
                    fill="#4285F4"
                  />
                </svg>
                Continue with google
              </button>
              
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#E5E7EB]" />
                <span className="text-body text-text-secondary">Or continue with email</span>
                <div className="h-px flex-1 bg-[#E5E7EB]" />
              </div>

              <button
                onClick={() => { if (form.role) next(); }}
                disabled={!form.role}
                className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <HugeiconsIcon icon={ArrowRight01Icon} size={20}  />
              </button>
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
                <p className="text-sm text-[#DC2626] mt-1">Passwords don&apos;t match</p>
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
          <div className="flex flex-col items-center gap-8 py-8 w-full max-w-[503px] mx-auto">
            <div className="w-[120px] h-[120px] rounded-full bg-[#ECFDF5] border-[1.5px] border-[#16A34A] flex items-center justify-center mb-2">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={48} className="text-[#16A34A]" />
            </div>
            
            <div className="text-center flex flex-col gap-2">
              <h1 className="text-[40px] font-bold text-text-primary leading-[150%] tracking-[-0.05em]">
                You&apos;re in!!!
              </h1>
              <p className="text-lg text-text-secondary leading-[120%]">
                Your account has been verified. Welcome to TIQRA, <span className="font-medium text-text-primary">{form.name || "User"}</span>.{" "}
                {form.role === "founder" 
                  ? "Start validating your ideas with real data."
                  : "Start earning by sharing your opinions."}
              </p>
            </div>

            <div className="w-full flex flex-col gap-6 mt-4">
              <h3 className="text-lg text-brand-primary uppercase tracking-wider text-left w-full">
                WHAT&apos;S NEXT
              </h3>
              
              <div className="flex flex-col gap-4 w-full">
                {[
                  form.role === "founder"
                    ? "Upload your idea and specify your target audience"
                    : "Answer short surveys and get paid for each response",
                  form.role === "founder"
                    ? "Get AI generated survey questions"
                    : "Get matched with surveys that fits you",
                  form.role === "founder"
                    ? "Receive a GO / PIVOT / KILL decision backed by real data"
                    : "Earn rewards instantly after completion"
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-[25px] h-[25px] rounded bg-brand-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-base">{idx + 1}</span>
                    </div>
                    <span className="text-base text-text-secondary">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() =>
                router.push(form.role === "earner" ? "/earner/dashboard" : "/founder/dashboard")
              }
              className="btn-primary w-full justify-center mt-4"
            >
              Go To Dashboard <HugeiconsIcon icon={ArrowRight01Icon} size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
