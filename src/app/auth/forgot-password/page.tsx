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
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-body text-text-secondary hover:text-text-primary mb-8 transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18}  /> Back to login
        </Link>

        {!sent ? (
          <>
            <div className="mb-8">
              <h1 className="text-[32px] font-semibold text-text-primary">Reset Password</h1>
              <p className="text-lg text-text-secondary mt-2">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="tiqra-label">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="tiqra-input pl-11"
                    required
                  />
                  <HugeiconsIcon icon={Mail01Icon} size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="btn-primary w-full justify-center disabled:opacity-40"
              >
                {loading ? (
                  <HugeiconsIcon icon={Loading02Icon} size={20} className="animate-spin"  />
                ) : (
                  <>Send Reset Link <HugeiconsIcon icon={ArrowRight01Icon} size={20}  /></>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="w-24 h-24 rounded-full bg-[#DCFCE7] flex items-center justify-center">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={48} className="text-[#16A34A]"  />
            </div>
            <div className="text-center">
              <h2 className="text-[32px] font-semibold text-text-primary">CheckmarkCircle01Icon your email</h2>
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
