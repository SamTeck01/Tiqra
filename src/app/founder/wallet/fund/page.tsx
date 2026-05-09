"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, XCircle,
  Plus, Loader2, CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "amount" | "method" | "processing" | "success" | "failed";

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000, 100000, 250000];

export default function FounderFundWalletPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [payMethod, setPayMethod] = useState<"card" | "transfer" | null>(null);

  const amtNum = Number(amount || 0);
  const canContinue = amtNum >= 1000;

  const handlePay = async () => {
    setStep("processing");
    await new Promise((r) => setTimeout(r, 2500));
    setStep(Math.random() > 0.1 ? "success" : "failed");
  };

  // ── Processing ──────────────────────────────────────────────────────────────
  if (step === "processing") {
    return (
      <div className="ml-[324px] min-h-screen bg-[#FEFEFE] flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 rounded-full border-4 border-[#EDE9FE] border-t-brand-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <CreditCard size={32} className="text-brand-primary" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-[28px] font-semibold text-text-primary">Processing Payment</h1>
            <p className="text-body text-text-secondary mt-2">
              Adding ₦{amtNum.toLocaleString()} to your wallet
            </p>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Success ──────────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="ml-[324px] min-h-screen bg-[#FEFEFE] flex flex-col items-center justify-center px-8">
        <div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
          <div className="w-28 h-28 rounded-full bg-[#DCFCE7] flex items-center justify-center">
            <CheckCircle2 size={56} className="text-[#16A34A]" />
          </div>
          <div>
            <h1 className="text-[32px] font-bold text-text-primary">Payment Successful!</h1>
            <p className="text-body text-text-secondary mt-2">
              ₦{amtNum.toLocaleString()} has been added to your wallet. You can now fund your next survey.
            </p>
          </div>

          <div className="w-full bg-[#F8F9FC] rounded-2xl p-5 flex flex-col gap-3 text-left">
            {[
              { label: "Amount Added", value: `₦${amtNum.toLocaleString()}` },
              { label: "Payment Method", value: payMethod === "card" ? "Debit Card" : "Bank Transfer" },
              { label: "Status", value: "✓ Successful" },
              { label: "Date", value: new Date().toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-body">
                <span className="text-text-secondary">{label}</span>
                <span className="text-text-primary font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Link href="/founder/wallet" className="btn-primary w-full justify-center">
              Back to Wallet
            </Link>
            <Link href="/founder/ideas/new" className="btn-secondary w-full justify-center">
              Launch a New Survey
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Failed ──────────────────────────────────────────────────────────────────
  if (step === "failed") {
    return (
      <div className="ml-[324px] min-h-screen bg-[#FEFEFE] flex flex-col items-center justify-center px-8">
        <div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
          <div className="w-28 h-28 rounded-full bg-[#FEE2E2] flex items-center justify-center">
            <XCircle size={56} className="text-[#DC2626]" />
          </div>
          <div>
            <h1 className="text-[32px] font-bold text-text-primary">Payment Failed</h1>
            <p className="text-body text-text-secondary mt-2">
              We couldn't process your payment. Your account has not been charged.
            </p>
          </div>

          <div className="w-full flex items-start gap-3 p-4 bg-[#FEE2E2] rounded-xl text-left">
            <AlertCircle size={16} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#DC2626]">
              This may be due to insufficient funds, incorrect card details, or a network issue. Please check and try again.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button onClick={() => setStep("amount")} className="btn-primary w-full justify-center">
              Try Again
            </button>
            <Link href="/founder/wallet" className="btn-secondary w-full justify-center">
              Back to Wallet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-[324px] flex flex-col min-h-screen bg-[#FEFEFE]">
      {/* Header */}
      <div className="flex items-center gap-4 px-8 py-5 border-b border-[#F3F4F6]">
        <button
          onClick={() => step === "amount" ? router.back() : setStep("amount")}
          className="inline-flex items-center gap-2 text-body text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-[24px] font-semibold text-text-primary">Fund Wallet</h1>
      </div>

      <div className="flex-1 px-8 py-8 max-w-lg">

        {/* ── Step 1: Amount ── */}
        {step === "amount" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-[24px] font-semibold text-text-primary">Choose Amount</h2>
              <p className="text-body text-text-secondary mt-1">Minimum funding: ₦1,000</p>
            </div>

            {/* Quick amounts */}
            <div className="grid grid-cols-3 gap-3">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className={cn(
                    "py-4 rounded-xl border text-body font-medium transition-all",
                    amount === amt.toString()
                      ? "bg-brand-primary border-brand-primary text-white"
                      : "bg-white border-[#E5E7EB] text-text-primary hover:border-brand-primary"
                  )}
                >
                  ₦{amt >= 1000 ? `${amt / 1000}k` : amt}
                </button>
              ))}
            </div>

            <div>
              <label className="tiqra-label">Custom Amount (₦)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter custom amount..."
                className="tiqra-input text-[20px]"
              />
            </div>

            <button
              onClick={() => setStep("method")}
              disabled={!canContinue}
              className="btn-primary w-full justify-center disabled:opacity-40"
            >
              Continue <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* ── Step 2: Payment Method ── */}
        {step === "method" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-[24px] font-semibold text-text-primary">Payment Method</h2>
              <p className="text-body text-text-secondary mt-1">How would you like to pay ₦{amtNum.toLocaleString()}?</p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { key: "card" as const, label: "Debit / Credit Card", sub: "Instant – Visa, Mastercard, Verve", icon: CreditCard, color: "#EDE9FE", iconColor: "text-brand-primary" },
                { key: "transfer" as const, label: "Bank Transfer", sub: "Pay via USSD or internet banking", icon: Plus, color: "#DCFCE7", iconColor: "text-[#16A34A]" },
              ].map(({ key, label, sub, icon: Icon, color, iconColor }) => (
                <button
                  key={key}
                  onClick={() => setPayMethod(key)}
                  className={cn(
                    "flex items-center gap-5 p-5 rounded-2xl border-2 text-left transition-all",
                    payMethod === key ? "border-brand-primary bg-[#FDFAFF]" : "border-[#E5E7EB] bg-white hover:border-brand-primary"
                  )}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color }}>
                    <Icon size={24} className={iconColor} />
                  </div>
                  <div className="flex-1">
                    <p className="text-body font-semibold text-text-primary">{label}</p>
                    <p className="text-sm text-text-secondary">{sub}</p>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    payMethod === key ? "border-brand-primary bg-brand-primary" : "border-[#E5E7EB]"
                  )}>
                    {payMethod === key && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-[#F8F9FC] rounded-2xl p-5 flex flex-col gap-2">
              <div className="flex justify-between text-body">
                <span className="text-text-secondary">Amount</span>
                <span className="text-text-primary font-semibold">₦{amtNum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-body">
                <span className="text-text-secondary">Processing Fee</span>
                <span className="text-[#16A34A] font-semibold">Free</span>
              </div>
              <div className="h-px bg-[#E5E7EB] my-1" />
              <div className="flex justify-between text-body">
                <span className="text-text-primary font-semibold">Total</span>
                <span className="text-[24px] font-bold text-text-primary">₦{amtNum.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={!payMethod}
              className="btn-primary w-full justify-center disabled:opacity-40 text-lg"
            >
              Pay ₦{amtNum.toLocaleString()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
