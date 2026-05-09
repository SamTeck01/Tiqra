"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon, ArrowRight01Icon, Loading03Icon } from "@hugeicons/core-free-icons";;

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      const user = useAuthStore.getState().user;
      if (user?.role === "earner") router.push("/earner/dashboard");
      else router.push("/founder/dashboard");
    } catch {}
  };

  return (
    <div className="min-h-screen flex bg-[#FEFEFE]">
      {/* Left panel — hidden on mobile */}
      <div
        className="hidden lg:flex w-[594px] flex-shrink-0 rounded-[40px] m-3 flex-col relative overflow-hidden"
        style={{ background: "linear-gradient(136deg, #9F4EF5 0%, #E5CAFC 100%)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-12">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6 border border-white/20">
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

      {/* Right panel — full width on mobile */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-20 py-10 lg:py-12 w-full max-w-[700px] mx-auto">
        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-8 lg:hidden">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #9F4EF5, #7C3ACD)" }}>
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-[22px] font-bold text-text-primary tracking-tight">Tiqra</span>
        </div>

        <div className="mb-8">
          <h1 className="text-[28px] lg:text-[32px] font-semibold text-text-primary leading-[150%] tracking-[-0.03em]">
            Welcome back
          </h1>
          <p className="text-base lg:text-lg text-text-primary mt-1">
            <span className="text-text-secondary">Don't have an account?</span>{" "}
            <Link href="/auth/register" className="text-brand-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {error && (
          <div className="mb-5 p-4 bg-[#FEE2E2] border border-[#DC2626]/20 rounded-xl text-[#DC2626] text-sm lg:text-body">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="tiqra-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="tiqra-input"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="tiqra-label mb-0">Password</label>
              <Link href="/auth/forgot-password" className="text-sm text-brand-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="tiqra-input pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPassword ? <HugeiconsIcon icon={ViewOffIcon} size={20}  /> : <HugeiconsIcon icon={ViewIcon} size={20}  />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <HugeiconsIcon icon={Loading03Icon} size={20} className="animate-spin"  />
            ) : (
              <>Sign in <HugeiconsIcon icon={ArrowRight01Icon} size={20}  /></>
            )}
          </button>
        </form>

        <div className="flex flex-col gap-3 mt-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E5E7EB]" />
            <span className="text-sm lg:text-body text-text-secondary">Or continue with</span>
            <div className="h-px flex-1 bg-[#E5E7EB]" />
          </div>
          <button className="btn-secondary w-full justify-center gap-3">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M18.77 8.2H10.18v3.46h4.94c-.46 2.11-2.26 3.46-4.94 3.46-3.04 0-5.49-2.46-5.49-5.5s2.45-5.5 5.49-5.5c1.39 0 2.61.47 3.57 1.38l2.54-2.54C14.83 1.96 12.63 1 10.18 1 5.12 1 1 5.12 1 10.18s4.12 9.18 9.18 9.18c5.24 0 8.72-3.68 8.72-8.88 0-.59-.06-1.18-.13-1.28z" fill="#4285F4" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
