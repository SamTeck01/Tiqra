"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useWalletStore } from "@/store/wallet.store";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  Loading02Icon,
} from "@hugeicons/core-free-icons";

type Step = "amount" | "review" | "processing" | "success" | "failed";

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000];

// ─── Saved bank accounts (mock) ───────────────────────────────────────────────
const SAVED_ACCOUNTS = [
  { id: "a1", bank: "GTBank",    masked: "**** **** 4521", isDefault: true  },
  { id: "a2", bank: "First Bank", masked: "**** **** 8843", isDefault: false },
];

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(22, 163, 74, 0.1)"/>
      <path d="m9 11 2 2 4-4"/>
    </svg>
  );
}

function WarningCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" fill="rgba(220, 38, 38, 0.1)"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

// ─── Bank row ─────────────────────────────────────────────────────────────────
function AccountCard({
  bank,
  masked,
  isDefault,
  selected,
  onSelect,
}: {
  bank: string;
  masked: string;
  isDefault: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className="flex items-center justify-between cursor-pointer"
      style={{
        padding: "16px 24px",
        background: "#FFFFFF",
        border: `1px solid ${selected ? "#9F4EF5" : "#E5E7EB"}`,
        borderRadius: 24,
        gap: 12,
      }}
    >
      {/* Bank logo placeholder + name + masked */}
      <div className="flex items-center" style={{ gap: 12 }}>
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 48, height: 48, background: "#EDE9FE", borderRadius: 24 }}
        >
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: 16, color: "#9F4EF5" }}>
            {bank.charAt(0)}
          </span>
        </div>
        <div className="flex flex-col" style={{ gap: 2 }}>
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 16, color: "#111827" }}>
            {bank}
          </span>
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 14, color: "#6B7280" }}>
            {masked}
          </span>
        </div>
      </div>

      {/* Right: default pill + radio */}
      <div className="flex items-center" style={{ gap: 12 }}>
        {isDefault && (
          <span
            style={{
              padding: "4px 12px",
              background: "#EDE9FE",
              borderRadius: 999,
              fontFamily: "Geist, sans-serif",
              fontWeight: 500,
              fontSize: 12,
              color: "#9F4EF5",
            }}
          >
            Default
          </span>
        )}
        {/* Custom Figma Radio: 40x40 outer circle, 30x30 inner circle */}
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            border: `2px solid ${selected ? "#9F4EF5" : "#E5E7EB"}`,
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selected && (
            <div 
              style={{ 
                width: 30, 
                height: 30, 
                background: "#9F4EF5", 
                borderRadius: 999 
              }} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EarnerWithdrawPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { wallet, fetchWallet, requestWithdrawal } = useWalletStore();

  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(SAVED_ACCOUNTS[0].id);
  const [referenceId, setReferenceId] = useState("");

  useEffect(() => {
    if (user?.$id) {
      fetchWallet(user.$id);
    }
    // Generate a reference ID once
    setReferenceId(`WD-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}-${Math.floor(100000 + Math.random() * 900000)}`);
  }, [user?.$id]);

  const balance = wallet?.balance ?? 7000;
  const amtNum  = Number(amount.replace(/[^0-9]/g, "") || 0);

  const handleContinue = async () => {
    if (step === "amount") { 
      setStep("review"); 
      return; 
    }
    if (step === "review") {
      setStep("processing");
      await new Promise((r) => setTimeout(r, 2000));
      if (amtNum > balance) {
        setStep("failed");
      } else {
        try {
          const account = SAVED_ACCOUNTS.find((a) => a.id === selectedAccount);
          await requestWithdrawal(user?.$id || "", amtNum, { 
            bank: account?.bank, 
            masked: account?.masked 
          });
        } catch (e) {
          console.error(e);
        }
        setStep("success");
      }
      return;
    }
  };

  const account = SAVED_ACCOUNTS.find((a) => a.id === selectedAccount);
  const formattedDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }) + ", " + new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  /* ── Success Screen (Figma 608:815) ────────────────────────────────────── */
  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-12" style={{ gap: 32 }}>
        <div className="flex flex-col items-center text-center" style={{ gap: 24, maxWidth: 584 }}>
          {/* Green checkmark outer bg 150x150 */}
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: 150, height: 150, background: "rgba(22, 163, 74, 0.1)", borderRadius: 999 }}
          >
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={72} className="text-[#16A34A]" />
          </div>
          <div className="flex flex-col items-center" style={{ gap: 8 }}>
            <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 32, color: "#111827" }}>
              Withdrawal Successful!
            </h2>
            <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 18, color: "#6B7280" }}>
              Your money has been sent successfully.
            </p>
          </div>
        </div>

        {/* Info card (background color secondary #F8F9FC, borderRadius 30px) */}
        <div
          className="flex flex-col"
          style={{
            width: 536,
            padding: 24,
            background: "#F8F9FC",
            border: "1px solid #E5E7EB",
            borderRadius: 30,
            gap: 16,
          }}
        >
          {[
            { label: "Amount", value: `₦${amtNum.toLocaleString()}.00` },
            { label: "Bank", value: `${account?.bank} ${account?.masked}` },
            { label: "Reference ID", value: referenceId },
            { label: "Date & Time", value: formattedDate },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between" style={{ padding: "12px 0", borderBottom: label === "Date & Time" ? "none" : "1px solid #E5E7EB" }}>
              <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280" }}>{label}</span>
              <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 18, color: "#111827", textAlign: "right" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Green warning/status banner */}
        <div
          className="flex items-center"
          style={{
            width: 568,
            padding: "16px 32px",
            background: "#ECFDF5",
            borderRadius: 15,
            gap: 16,
          }}
        >
          <ShieldCheckIcon className="text-[#16A34A] flex-shrink-0" />
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#16A34A" }}>
            The amount should reflect in your account within 5-10 minutes
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center" style={{ gap: 16 }}>
          <button
            onClick={() => router.push("/earner/wallet")}
            style={{
              padding: "16px 32px",
              background: "#9F4EF5",
              borderRadius: 12,
              fontFamily: "Geist, sans-serif",
              fontWeight: 500,
              fontSize: 18,
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
          >
            Back to Wallet
          </button>
          <button
            onClick={() => router.push("/earner/wallet")}
            style={{
              padding: "16px 32px",
              background: "#F8F9FC",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              fontFamily: "Geist, sans-serif",
              fontWeight: 500,
              fontSize: 18,
              color: "#111827",
              cursor: "pointer",
            }}
          >
            View Transaction
          </button>
        </div>
      </div>
    );
  }

  /* ── Failure Screen (Figma 608:971) ────────────────────────────────────── */
  if (step === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-12" style={{ gap: 32 }}>
        <div className="flex flex-col items-center text-center" style={{ gap: 24, maxWidth: 584 }}>
          {/* Red warning outer bg 150x150 */}
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: 150, height: 150, background: "rgba(255, 223, 223, 0.4)", borderRadius: 999 }}
          >
            <HugeiconsIcon icon={CancelCircleIcon} size={72} className="text-[#DC2626]" />
          </div>
          <div className="flex flex-col items-center" style={{ gap: 8 }}>
            <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 32, color: "#111827" }}>
              Withdrawal Failed
            </h2>
            <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 18, color: "#6B7280" }}>
              We couldn’t process your withdrawal.
            </p>
          </div>
        </div>

        {/* Info card (background color secondary #FFDFDF with opacity, borderRadius 30px) */}
        <div
          className="flex flex-col"
          style={{
            width: 536,
            padding: 24,
            background: "rgba(255, 223, 223, 0.3)",
            border: "1px solid #FFC5C5",
            borderRadius: 30,
            gap: 16,
          }}
        >
          {[
            { label: "Amount", value: `₦${amtNum.toLocaleString()}.00` },
            { label: "Bank", value: `${account?.bank} ${account?.masked}` },
            { label: "Reference ID", value: referenceId },
            { label: "Date & Time", value: formattedDate },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between" style={{ padding: "12px 0", borderBottom: label === "Date & Time" ? "none" : "1px solid #FFC5C5" }}>
              <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280" }}>{label}</span>
              <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 18, color: "#111827", textAlign: "right" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Red warning alert box */}
        <div
          className="flex items-center"
          style={{
            width: 568,
            padding: "16px 32px",
            background: "rgba(255, 223, 223, 0.5)",
            borderRadius: 15,
            gap: 16,
          }}
        >
          <WarningCircleIcon className="text-[#DC2626] flex-shrink-0" />
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#DC2626" }}>
            Reason: Insufficient balance in tiqra wallet or invalid bank details
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center" style={{ gap: 16 }}>
          <button
            onClick={() => setStep("amount")}
            style={{
              padding: "16px 32px",
              background: "#9F4EF5",
              borderRadius: 12,
              fontFamily: "Geist, sans-serif",
              fontWeight: 500,
              fontSize: 18,
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/earner/wallet")}
            style={{
              padding: "16px 32px",
              background: "#F8F9FC",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              fontFamily: "Geist, sans-serif",
              fontWeight: 500,
              fontSize: 18,
              color: "#111827",
              cursor: "pointer",
            }}
          >
            Back to Wallet
          </button>
        </div>
      </div>
    );
  }

  /* ── Processing ─────────────────────────────────────────────────────────── */
  if (step === "processing") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]" style={{ gap: 24 }}>
        <HugeiconsIcon icon={Loading02Icon} size={60} className="text-[#9F4EF5] animate-spin" />
        <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 18, color: "#6B7280" }}>
          Processing your withdrawal…
        </p>
      </div>
    );
  }

  /* ── Amount + Bank selection / Review ────────────────────────────────────── */
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#FEFEFE" }}>

      {/* ── Header Row ─────────────────────────────────────────────────── */}
      <div style={{ paddingTop: 60, width: 1016 }}>
        {/* Back link */}
        <Link
          href="/earner/wallet"
          className="flex items-center"
          style={{ gap: 8, marginBottom: 32, textDecoration: "none" }}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} className="text-[#6B7280]" />
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280" }}>
            Back to wallet
          </span>
        </Link>

        {/* Title */}
        <div className="flex flex-col" style={{ gap: 4, marginBottom: 48 }}>
          <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 40, letterSpacing: "-0.03em", color: "#111827" }}>
            Withdraw Funds
          </h1>
          <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280" }}>
            Available balance:{" "}
            <strong style={{ color: "#9F4EF5" }}>₦{balance.toLocaleString()}.00</strong>
          </p>
        </div>
      </div>

      {/* ── Form area ──────────────────────────────────────────────────── */}
      <div className="flex flex-col" style={{ gap: 32, width: 600 }}>

        {step === "amount" && (
          <>
            {/* Amount input */}
            <div className="flex flex-col" style={{ gap: 8 }}>
              <label
                style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 16, color: "#111827" }}
              >
                Amount
              </label>
              <div
                className="flex items-center"
                style={{
                  padding: "16px 20px",
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  gap: 8,
                }}
              >
                <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280" }}>₦</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="0"
                  className="flex-1 outline-none bg-transparent"
                  style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 24, color: "#111827" }}
                />
              </div>
              <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 12, color: "#6B7280" }}>
                Minimum withdraw is ₦300
              </span>
            </div>

            {/* Quick amount chips: 230x60, 16px borderRadius */}
            <div className="flex flex-col" style={{ gap: 12 }}>
              <label style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 16, color: "#111827" }}>
                Quick amounts
              </label>
              <div className="flex items-center flex-wrap" style={{ gap: 12 }}>
                {QUICK_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(String(a))}
                    style={{
                      width: 230,
                      height: 60,
                      background: amtNum === a ? "#9F4EF5" : "#F8F9FC",
                      border: `1px solid ${amtNum === a ? "#9F4EF5" : "#E5E7EB"}`,
                      borderRadius: 16,
                      fontFamily: "Geist, sans-serif",
                      fontWeight: 500,
                      fontSize: 18,
                      color: amtNum === a ? "#FFFFFF" : "#111827",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ₦{a.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Send to section */}
            <div className="flex flex-col" style={{ gap: 12 }}>
              <div className="flex items-center justify-between">
                <label style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 16, color: "#111827" }}>
                  Send to
                </label>
                <Link
                  href="/earner/wallet/payment-methods"
                  className="flex items-center"
                  style={{ gap: 6, textDecoration: "none" }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="#9F4EF5" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#9F4EF5" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 14, color: "#9F4EF5" }}>
                    Add account
                  </span>
                </Link>
              </div>
              <div className="flex flex-col" style={{ gap: 12 }}>
                {SAVED_ACCOUNTS.map((acc) => (
                  <AccountCard
                    key={acc.id}
                    {...acc}
                    selected={selectedAccount === acc.id}
                    onSelect={() => setSelectedAccount(acc.id)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {step === "review" && account && (
          <div
            className="flex flex-col"
            style={{
              padding: 24,
              background: "#F8F9FC",
              border: "none",
              borderRadius: 30,
              gap: 20,
            }}
          >
            <h3 style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 24, color: "#111827" }}>
              Review Payment
            </h3>
            {[
              { label: "Amount", value: `₦${amtNum.toLocaleString()}.00` },
              { label: "Bank", value: account.bank },
              { label: "Account", value: account.masked },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between" style={{ padding: "12px 0", borderBottom: label === "Account" ? "none" : "1px solid #E5E7EB" }}>
                <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280" }}>{label}</span>
                <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 24, color: "#111827" }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA button */}
        <div className="flex justify-end" style={{ marginTop: 8 }}>
          <button
            onClick={handleContinue}
            disabled={step === "amount" && amtNum < 300}
            className="flex items-center animate-none"
            style={{
              padding: "18px 32px",
              background: step === "amount" && amtNum < 300 ? "#E5E7EB" : "#9F4EF5",
              borderRadius: 12,
              gap: 10,
              border: "none",
              cursor: step === "amount" && amtNum < 300 ? "default" : "pointer",
            }}
          >
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 16, color: "#FFFFFF" }}>
              {step === "review" ? "Confirm & Withdraw" : "Review payment"}
            </span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
