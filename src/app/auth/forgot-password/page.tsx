"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft01Icon, ArrowRight01Icon, Loading02Icon, CheckmarkCircle01Icon, Mail01Icon } from "@hugeicons/core-free-icons";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex bg-[#FEFEFE]">
      {/* Left panel */}
      <div
        className="hidden lg:flex w-[594px] flex-shrink-0 rounded-[40px] m-3 flex-col relative overflow-hidden"
        style={{ background: "linear-gradient(136deg, #9F4EF5 0%, #E5CAFC 100%)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-12">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-3xl">T</span>
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
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-body text-text-primary hover:text-text-secondary mb-12 transition-colors font-medium"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={24} className="text-[#9F4EF5]" /> Back to login
        </Link>

        {!sent ? (
          <>
            <div className="mb-8 flex flex-col gap-4">
              <div className="w-20 h-20 bg-[#9F4EF5] rounded-xl flex items-center justify-center">
                <HugeiconsIcon icon={Mail01Icon} size={40} className="text-white" />
              </div>
              <h1 className="text-[40px] font-bold text-text-primary leading-[150%] tracking-[-0.05em]">Forgot your password</h1>
              <p className="text-lg text-text-secondary w-full max-w-[445px]">
                No worries, Enter your email address and we'll send you a reset link right away.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-[445px]">
              <div>
                <label className="tiqra-label">Email address</label>
                <div className="relative mt-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="tiqra-input"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="btn-primary w-full justify-center disabled:opacity-40 !py-4 !rounded-xl"
                >
                  {loading ? (
                    <HugeiconsIcon icon={Loading02Icon} size={20} className="animate-spin"  />
                  ) : (
                    <>Send reset link</>
                  )}
                </button>
                <p className="text-center text-lg text-text-primary mt-2">
                  <span className="text-text-secondary">Remember your password?</span>{" "}
                  <Link href="/auth/login" className="text-[#9F4EF5]">Sign in</Link>
                </p>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="w-24 h-24 rounded-full bg-[#DCFCE7] flex items-center justify-center">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={48} className="text-[#16A34A]"  />
            </div>
            <div className="text-center">
              <h2 className="text-[32px] font-semibold text-text-primary">Check your email</h2>
              <p className="text-lg text-text-secondary mt-2">
                We sent a password reset link to<br />
                <strong className="text-text-primary">{email}</strong>
              </p>
            </div>
            <p className="text-body text-text-secondary text-center">
              Didn't receive it?{" "}
              <button
                onClick={() => setSent(false)}
                className="text-brand-primary hover:underline"
              >
                Resend email
              </button>
            </p>
            <Link href="/auth/login" className="btn-secondary w-full justify-center">
              Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
