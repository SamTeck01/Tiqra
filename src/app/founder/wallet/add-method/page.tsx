"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, XCircle,
  CreditCard, Loader2, Building2, Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "method" | "card-details" | "bank-details" | "otp" | "success" | "processing";
type Method = "card" | "bank";

const NIGERIAN_BANKS = [
  "Access Bank", "GTBank", "First Bank", "Zenith Bank", "UBA",
  "Fidelity Bank", "Union Bank", "Sterling Bank", "Wema Bank",
  "Keystone Bank", "Polaris Bank", "Stanbic IBTC", "Kuda Bank", "OPay", "PalmPay",
];

export default function AddPaymentMethodPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<Method | null>(null);
  const [showCvv, setShowCvv] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cardForm, setCardForm] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [bankForm, setBankForm] = useState({ bank: "", accountNumber: "", accountName: "", bvn: "" });
  const [resolving, setResolving] = useState(false);

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };
  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const resolveAccount = async () => {
    if (bankForm.accountNumber.length === 10 && bankForm.bank) {
      setResolving(true);
      await new Promise((r) => setTimeout(r, 1200));
      setBankForm((f) => ({ ...f, accountName: "AISHA BELLO" }));
      setResolving(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    if (val && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleSubmitDetails = async () => {
    setStep("otp");
  };

  const handleVerifyOtp = async () => {
    setStep("processing");
    await new Promise((r) => setTimeout(r, 2000));
    setStep("success");
  };

  // ── Processing ──────────────────────────────────────────────────────────────
  if (step === "processing") {
    return (
      <div className="ml-[324px] min-h-screen bg-[#FEFEFE] flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 rounded-full border-4 border-[#EDE9FE] border-t-brand-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              {method === "card" ? <CreditCard size={32} className="text-brand-primary" /> : <Building2 size={32} className="text-brand-primary" />}
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-[28px] font-semibold text-text-primary">Adding Payment Method</h1>
            <p className="text-body text-text-secondary mt-2">Please wait while we verify your details</p>
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
            <h1 className="text-[32px] font-bold text-text-primary">Payment Method Added!</h1>
            <p className="text-body text-text-secondary mt-2">
              Your {method === "card" ? "debit card" : "bank account"} has been successfully added and is ready to use.
            </p>
          </div>
          <div className="w-full bg-[#EDE9FE] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center">
              {method === "card" ? <CreditCard size={24} className="text-white" /> : <Building2 size={24} className="text-white" />}
            </div>
            <div className="text-left">
              <p className="text-body font-semibold text-text-primary">
                {method === "card"
                  ? `•••• •••• •••• ${cardForm.number.replace(/\s/g, "").slice(-4)}`
                  : bankForm.accountName}
              </p>
              <p className="text-sm text-text-secondary">
                {method === "card" ? "Debit Card" : bankForm.bank}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Link href="/founder/wallet" className="btn-primary w-full justify-center">
              Done
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
          onClick={() => {
            if (step === "method") router.back();
            else if (step === "card-details" || step === "bank-details") setStep("method");
            else if (step === "otp") setStep(method === "card" ? "card-details" : "bank-details");
          }}
          className="inline-flex items-center gap-2 text-body text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-[24px] font-semibold text-text-primary">Add Payment Method</h1>
      </div>

      <div className="flex-1 px-8 py-8 max-w-lg">

        {/* ── Step 1: Choose Method ── */}
        {step === "method" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-[24px] font-semibold text-text-primary">Choose Payment Type</h2>
              <p className="text-body text-text-secondary mt-1">How would you like to add funds to your wallet?</p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => { setMethod("card"); setStep("card-details"); }}
                className="flex items-center gap-5 p-6 bg-white border-2 border-[#E5E7EB] rounded-2xl hover:border-brand-primary transition-all text-left group"
              >
                <div className="w-14 h-14 rounded-xl bg-[#EDE9FE] flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary transition-colors">
                  <CreditCard size={28} className="text-brand-primary group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-body font-semibold text-text-primary">Debit / Credit Card</p>
                  <p className="text-sm text-text-secondary mt-0.5">Visa, Mastercard, Verve – instant funding</p>
                </div>
                <ArrowRight size={20} className="text-text-secondary" />
              </button>

              <button
                onClick={() => { setMethod("bank"); setStep("bank-details"); }}
                className="flex items-center gap-5 p-6 bg-white border-2 border-[#E5E7EB] rounded-2xl hover:border-brand-primary transition-all text-left group"
              >
                <div className="w-14 h-14 rounded-xl bg-[#DCFCE7] flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary transition-colors">
                  <Building2 size={28} className="text-[#16A34A] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-body font-semibold text-text-primary">Bank Transfer</p>
                  <p className="text-sm text-text-secondary mt-0.5">Link your Nigerian bank account</p>
                </div>
                <ArrowRight size={20} className="text-text-secondary" />
              </button>
            </div>

            <div className="flex items-start gap-3 p-4 bg-[#F8F9FC] rounded-xl">
              <AlertCircle size={16} className="text-text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-text-secondary">
                All payment data is encrypted and secured. Tiqra never stores your full card details.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 2a: Card Details ── */}
        {step === "card-details" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-[24px] font-semibold text-text-primary">Card Details</h2>
              <p className="text-body text-text-secondary mt-1">Enter your debit or credit card information</p>
            </div>

            {/* Card preview */}
            <div className="bg-brand-primary rounded-[20px] p-6 text-white aspect-[1.6/1] flex flex-col justify-between"
              style={{ background: "linear-gradient(135deg, #9F4EF5 0%, #7C3AED 100%)" }}>
              <div className="flex justify-between items-start">
                <span className="text-white/70 text-sm font-medium">TIQRA WALLET</span>
                <CreditCard size={24} className="text-white/70" />
              </div>
              <div>
                <p className="text-[22px] font-mono tracking-widest">
                  {cardForm.number || "•••• •••• •••• ••••"}
                </p>
                <div className="flex justify-between mt-3">
                  <div>
                    <p className="text-white/60 text-xs">CARD HOLDER</p>
                    <p className="text-sm font-medium">{cardForm.name || "YOUR NAME"}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">EXPIRES</p>
                    <p className="text-sm font-medium">{cardForm.expiry || "MM/YY"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="tiqra-label">Card Number</label>
                <input
                  type="text"
                  value={cardForm.number}
                  onChange={(e) => setCardForm((f) => ({ ...f, number: formatCardNumber(e.target.value) }))}
                  placeholder="1234 5678 9012 3456"
                  className="tiqra-input font-mono tracking-wider"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="tiqra-label">Expiry Date</label>
                  <input
                    type="text"
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm((f) => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                    placeholder="MM/YY"
                    className="tiqra-input"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="tiqra-label">CVV</label>
                  <div className="relative">
                    <input
                      type={showCvv ? "text" : "password"}
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) }))}
                      placeholder="•••"
                      className="tiqra-input pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCvv(!showCvv)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
                    >
                      {showCvv ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="tiqra-label">Cardholder Name</label>
                <input
                  type="text"
                  value={cardForm.name}
                  onChange={(e) => setCardForm((f) => ({ ...f, name: e.target.value.toUpperCase() }))}
                  placeholder="AS ON CARD"
                  className="tiqra-input uppercase"
                />
              </div>
            </div>

            <button
              onClick={handleSubmitDetails}
              disabled={!cardForm.number || !cardForm.expiry || !cardForm.cvv || !cardForm.name}
              className="btn-primary w-full justify-center disabled:opacity-40"
            >
              Continue <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* ── Step 2b: Bank Details ── */}
        {step === "bank-details" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-[24px] font-semibold text-text-primary">Bank Account</h2>
              <p className="text-body text-text-secondary mt-1">Link your Nigerian bank account for transfers</p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="tiqra-label">Select Bank</label>
                <select
                  value={bankForm.bank}
                  onChange={(e) => { setBankForm((f) => ({ ...f, bank: e.target.value, accountName: "" })); }}
                  className="tiqra-input"
                >
                  <option value="">Choose your bank...</option>
                  {NIGERIAN_BANKS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="tiqra-label">Account Number (NUBAN)</label>
                <input
                  type="text"
                  value={bankForm.accountNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setBankForm((f) => ({ ...f, accountNumber: val, accountName: "" }));
                  }}
                  onBlur={resolveAccount}
                  placeholder="10-digit account number"
                  className="tiqra-input"
                  maxLength={10}
                />
              </div>

              {resolving && (
                <div className="flex items-center gap-3 p-4 bg-[#F8F9FC] rounded-xl">
                  <Loader2 size={18} className="text-brand-primary animate-spin" />
                  <span className="text-body text-text-secondary">Verifying account...</span>
                </div>
              )}
              {bankForm.accountName && !resolving && (
                <div className="flex items-center gap-3 p-4 bg-[#DCFCE7] rounded-xl">
                  <CheckCircle2 size={18} className="text-[#16A34A]" />
                  <div>
                    <p className="text-body font-semibold text-text-primary">{bankForm.accountName}</p>
                    <p className="text-sm text-text-secondary">{bankForm.bank}</p>
                  </div>
                </div>
              )}
              <div>
                <label className="tiqra-label">BVN (for identity verification)</label>
                <input
                  type="text"
                  value={bankForm.bvn}
                  onChange={(e) => setBankForm((f) => ({ ...f, bvn: e.target.value.replace(/\D/g, "").slice(0, 11) }))}
                  placeholder="11-digit BVN"
                  className="tiqra-input"
                  maxLength={11}
                />
                <p className="text-xs text-text-secondary mt-1">Your BVN is encrypted and never shared.</p>
              </div>
            </div>

            <button
              onClick={handleSubmitDetails}
              disabled={!bankForm.bank || !bankForm.accountName || bankForm.bvn.length !== 11}
              className="btn-primary w-full justify-center disabled:opacity-40"
            >
              Continue <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* ── Step 3: OTP Verification ── */}
        {step === "otp" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-[24px] font-semibold text-text-primary">Verify OTP</h2>
              <p className="text-body text-text-secondary mt-1">
                Enter the 6-digit code sent to your registered phone number
              </p>
            </div>

            {/* OTP input boxes */}
            <div className="flex gap-3 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !digit && i > 0) {
                      document.getElementById(`otp-${i - 1}`)?.focus();
                    }
                  }}
                  className={cn(
                    "w-14 h-14 text-center text-[24px] font-semibold rounded-xl border-2 outline-none transition-all",
                    digit ? "border-brand-primary bg-[#EDE9FE] text-brand-primary" : "border-[#E5E7EB] bg-white text-text-primary focus:border-brand-primary"
                  )}
                  maxLength={1}
                />
              ))}
            </div>

            <p className="text-center text-body text-text-secondary">
              Didn't receive it?{" "}
              <button className="text-brand-primary hover:underline font-medium">Resend OTP</button>
            </p>

            <button
              onClick={handleVerifyOtp}
              disabled={otp.some((d) => !d)}
              className="btn-primary w-full justify-center disabled:opacity-40"
            >
              Verify & Add Method
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
