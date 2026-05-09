"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft01Icon, ArrowRight01Icon, AlertCircleIcon, CheckmarkCircle01Icon, CancelCircleIcon, Building04Icon, Loading02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type Step = "amount" | "bank" | "confirm" | "processing" | "success" | "failed";

const NIGERIAN_BANKS = [
  "Access Bank", "GTBank", "First Bank", "Zenith Bank", "UBA",
  "Fidelity Bank", "Union Bank", "Sterling Bank", "Wema Bank",
  "Keystone Bank", "Polaris Bank", "Stanbic IBTC", "Citibank Nigeria",
  "Heritage Bank", "Jaiz Bank", "Kuda Bank", "OPay", "PalmPay", "Moniepoint",
];

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000];

export default function EarnerWithdrawPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [resolving, setResolving] = useState(false);
  const balance = 12500;

  const resolveAccount = async () => {
    if (accountNumber.length === 10 && bankName) {
      setResolving(true);
      await new Promise((r) => setTimeout(r, 1200));
      setAccountName("AISHA BELLO");
      setResolving(false);
    }
  };

  const handleConfirm = async () => {
    setStep("processing");
    await new Promise((r) => setTimeout(r, 2500));
    // Simulate 90% success
    setStep(Math.random() > 0.1 ? "success" : "failed");
  };

  const amtNum = Number(amount || 0);
  const canContinueAmount = amtNum >= 1000 && amtNum <= balance;
  const canContinueBank = bankName && accountNumber.length === 10 && accountName;

  // ── Processing ──────────────────────────────────────────────────────────────
  if (step === "processing") {
    return (
      <div className="ml-[324px] min-h-screen bg-[#FEFEFE] flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 rounded-full border-4 border-[#EDE9FE] border-t-brand-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <HugeiconsIcon icon={Building04Icon} size={32} className="text-brand-primary"  />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-[32px] font-semibold text-text-primary">Processing Withdrawal</h1>
            <p className="text-lg text-text-secondary mt-2">
              Sending ₦{amtNum.toLocaleString()} to {bankName}
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
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={56} className="text-[#16A34A]"  />
          </div>
          <div>
            <h1 className="text-[32px] font-bold text-text-primary">Withdrawal Initiated!</h1>
            <p className="text-body text-text-secondary mt-2">
              ₦{amtNum.toLocaleString()} is on its way to your {bankName} account.
              It should arrive within 24 hours.
            </p>
          </div>

          {/* Summary card */}
          <div className="w-full bg-[#F8F9FC] rounded-2xl p-5 flex flex-col gap-3 text-left">
            {[
              { label: "Amount", value: `₦${amtNum.toLocaleString()}` },
              { label: "Bank", value: bankName },
              { label: "Account Number", value: accountNumber },
              { label: "Account Name", value: accountName },
              { label: "Expected arrival", value: "Within 24 hours" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-body">
                <span className="text-text-secondary">{label}</span>
                <span className="text-text-primary font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Link href="/earner/wallet" className="btn-primary w-full justify-center">
              Back to Wallet
            </Link>
            <Link href="/earner/surveys" className="btn-secondary w-full justify-center">
              Find More Surveys
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
            <HugeiconsIcon icon={CancelCircleIcon} size={56} className="text-[#DC2626]"  />
          </div>
          <div>
            <h1 className="text-[32px] font-bold text-text-primary">Withdrawal Failed</h1>
            <p className="text-body text-text-secondary mt-2">
              We couldn't process your withdrawal. Your funds are safe and have not been deducted.
            </p>
          </div>

          <div className="w-full flex items-start gap-3 p-4 bg-[#FEE2E2] rounded-xl text-left">
            <HugeiconsIcon icon={AlertCircleIcon} size={16} className="text-[#DC2626] flex-shrink-0 mt-0.5"  />
            <p className="text-sm text-[#DC2626]">
              Common reasons: incorrect account details, bank network issues, or system maintenance.
              Please try again.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button onClick={() => setStep("amount")} className="btn-primary w-full justify-center">
              Try Again
            </button>
            <Link href="/earner/wallet" className="btn-secondary w-full justify-center">
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
          onClick={() => step === "amount" ? router.back() : setStep(step === "confirm" ? "bank" : "amount")}
          className="inline-flex items-center gap-2 text-body text-text-secondary hover:text-text-primary transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20}  /> Back
        </button>
        <div className="flex-1">
          <h1 className="text-[24px] font-semibold text-text-primary">Withdraw Funds</h1>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {(["amount", "bank", "confirm"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                step === s ? "bg-brand-primary text-white" :
                  (["amount", "bank", "confirm"].indexOf(step) > i) ? "bg-[#DCFCE7] text-[#16A34A]" :
                    "bg-[#F3F4F6] text-text-secondary"
              )}>
                {(["amount", "bank", "confirm"].indexOf(step) > i) ? "✓" : i + 1}
              </div>
              {i < 2 && <div className={cn("w-8 h-px", (["amount", "bank", "confirm"].indexOf(step) > i) ? "bg-brand-primary" : "bg-[#E5E7EB]")} />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 px-8 py-8 max-w-lg">

        {/* ── Step 1: Amount ── */}
        {step === "amount" && (
          <div className="flex flex-col gap-6">
            {/* Available balance */}
            <div className="bg-brand-primary rounded-[24px] p-6 flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Available Balance</p>
                <p className="text-[32px] font-bold text-white">₦{balance.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <HugeiconsIcon icon={Building04Icon} size={24} className="text-white"  />
              </div>
            </div>

            <div>
              <h2 className="text-[24px] font-semibold text-text-primary mb-1">How much to withdraw?</h2>
              <p className="text-body text-text-secondary">Minimum withdrawal: ₦1,000</p>
            </div>

            {/* Quick amounts */}
            <div className="grid grid-cols-5 gap-2">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className={cn(
                    "py-3 rounded-xl border text-sm font-medium transition-all",
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
              <label className="tiqra-label">Enter Amount (₦)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Minimum ₦1,000"
                className="tiqra-input text-[20px]"
              />
              {amount && Number(amount) > balance && (
                <p className="text-sm text-[#DC2626] mt-1">Amount exceeds available balance</p>
              )}
            </div>

            <div className="flex items-start gap-2 p-4 bg-[#FEF3C7] rounded-xl">
              <HugeiconsIcon icon={AlertCircleIcon} size={16} className="text-[#D97706] flex-shrink-0 mt-0.5"  />
              <p className="text-sm text-[#D97706]">
                Withdrawals are processed within 24 hours. No fees.
              </p>
            </div>

            <button
              onClick={() => setStep("bank")}
              disabled={!canContinueAmount}
              className="btn-primary w-full justify-center disabled:opacity-40"
            >
              Continue <HugeiconsIcon icon={ArrowRight01Icon} size={20}  />
            </button>
          </div>
        )}

        {/* ── Step 2: Bank Details ── */}
        {step === "bank" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-[24px] font-semibold text-text-primary">Bank Account Details</h2>
              <p className="text-body text-text-secondary mt-1">Where should we send ₦{amtNum.toLocaleString()}?</p>
            </div>

            <div>
              <label className="tiqra-label">Select Bank</label>
              <select
                value={bankName}
                onChange={(e) => { setBankName(e.target.value); setAccountName(""); }}
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
                value={accountNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setAccountNumber(val);
                  setAccountName("");
                }}
                onBlur={resolveAccount}
                placeholder="10-digit account number"
                className="tiqra-input"
                maxLength={10}
              />
            </div>

            {/* Account resolution */}
            {resolving && (
              <div className="flex items-center gap-3 p-4 bg-[#F8F9FC] rounded-xl">
                <HugeiconsIcon icon={Loading02Icon} size={18} className="text-brand-primary animate-spin"  />
                <span className="text-body text-text-secondary">Verifying account...</span>
              </div>
            )}
            {accountName && !resolving && (
              <div className="flex items-center gap-3 p-4 bg-[#DCFCE7] rounded-xl">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} className="text-[#16A34A]"  />
                <div>
                  <p className="text-body font-semibold text-text-primary">{accountName}</p>
                  <p className="text-sm text-text-secondary">{bankName}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep("confirm")}
              disabled={!canContinueBank}
              className="btn-primary w-full justify-center disabled:opacity-40"
            >
              Continue <HugeiconsIcon icon={ArrowRight01Icon} size={20}  />
            </button>
          </div>
        )}

        {/* ── Step 3: Confirm ── */}
        {step === "confirm" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-[24px] font-semibold text-text-primary">Confirm Withdrawal</h2>
              <p className="text-body text-text-secondary mt-1">Review your details before sending</p>
            </div>

            <div className="bg-[#F8F9FC] rounded-2xl p-6 flex flex-col gap-4">
              {[
                { label: "Amount", value: `₦${amtNum.toLocaleString()}`, highlight: true },
                { label: "Bank", value: bankName },
                { label: "Account Number", value: accountNumber },
                { label: "Account Name", value: accountName },
                { label: "Processing Time", value: "Within 24 hours" },
                { label: "Fee", value: "Free" },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="flex justify-between text-body">
                  <span className="text-text-secondary">{label}</span>
                  <span className={cn("font-medium", highlight ? "text-[24px] font-bold text-brand-primary" : "text-text-primary")}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 p-4 bg-[#EDE9FE] rounded-xl">
              <HugeiconsIcon icon={AlertCircleIcon} size={16} className="text-brand-primary flex-shrink-0 mt-0.5"  />
              <p className="text-sm text-brand-primary">
                Please verify the account details above. Withdrawals to wrong accounts cannot be reversed.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("bank")} className="btn-secondary flex-1 justify-center">
                Edit Details
              </button>
              <button onClick={handleConfirm} className="btn-primary flex-1 justify-center">
                Withdraw ₦{amtNum.toLocaleString()}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
