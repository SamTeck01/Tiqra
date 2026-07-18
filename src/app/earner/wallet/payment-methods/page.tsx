"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Delete02Icon } from "@hugeicons/core-free-icons";

const INITIAL_ACCOUNTS = [
  { id: "a1", bank: "GTBank",     masked: "*** *** 6789", isDefault: true  },
  { id: "a2", bank: "Opay",       masked: "*** *** 3004", isDefault: false },
];

// ─── Confirmation Modal (Figma 608:1424) ───────────────────────────────────────
function RemoveModal({ bank, masked, onConfirm, onCancel }: {
  bank: string;
  masked: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(17, 24, 39, 0.4)", backdropFilter: "blur(10px)" }}
    >
      {/* Modal card - 662px wide, 60px borderRadius, 82px padding */}
      <div
        className="flex flex-col items-center"
        style={{
          width: 662,
          background: "#FFFFFF",
          borderRadius: 60,
          padding: 82,
          gap: 32,
          boxShadow: "0px 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        {/* Icon container */}
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 60,
            height: 60,
            background: "#FFDFDF",
            borderRadius: 12,
          }}
        >
          <HugeiconsIcon icon={Delete02Icon} size={28} className="text-[#DC2626]" />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center" style={{ gap: 12, textAlign: "center" }}>
          <h3 style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 24, color: "#111827" }}>
            Remove this account?
          </h3>
          <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280", maxWidth: 436, lineHeight: "1.5em" }}>
            {bank} {masked} will be removed from your payment methods.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center" style={{ gap: 12, width: "100%" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "16px 0",
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
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "16px 0",
              background: "#DC2626",
              border: "none",
              borderRadius: 12,
              fontFamily: "Geist, sans-serif",
              fontWeight: 500,
              fontSize: 18,
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Account Card (Figma 608:1172) ─────────────────────────────────────────────
function AccountCard({ bank, masked, isDefault, holderName, onRemove, onSetDefault }: {
  bank: string;
  masked: string;
  isDefault: boolean;
  holderName: string;
  onRemove: () => void;
  onSetDefault: () => void;
}) {
  return (
    <div
      className="flex flex-col"
      style={{
        width: "100%",
        background: "#FFFFFF",
        border: `1px solid ${isDefault ? "#9F4EF5" : "#E5E7EB"}`,
        borderRadius: 30,
        padding: 24,
        gap: 16,
      }}
    >
      {/* Top Part: bank info */}
      <div className="flex items-center" style={{ gap: 24 }}>
        {/* Bank logo circle */}
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 60, height: 60, background: "#EDE9FE", borderRadius: 999 }}
        >
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: 22, color: "#9F4EF5" }}>
            {bank.charAt(0)}
          </span>
        </div>

        {/* Bank Details */}
        <div className="flex flex-col" style={{ gap: 4 }}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 20, color: "#111827" }}>
              {bank}
            </span>
            {isDefault && (
              <span
                style={{
                  padding: "4px 12px",
                  background: "#EDE9FE",
                  borderRadius: 999,
                  fontFamily: "Geist, sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  color: "#9F4EF5",
                }}
              >
                Default
              </span>
            )}
          </div>
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280" }}>
            {masked}
          </span>
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#111827" }}>
            {holderName}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #E5E7EB", width: "100%" }} />

      {/* Bottom Part: Actions */}
      <div className="flex items-center justify-between" style={{ width: "100%" }}>
        {isDefault ? (
          <div
            className="flex items-center justify-center"
            style={{
              padding: "12px 16px",
              background: "#EDE9FE",
              borderRadius: 16,
              gap: 10,
            }}
          >
            {/* Check Circle SVG */}
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-[#9F4EF5]">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2"/>
              <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 16, color: "#9F4EF5" }}>
              Default Account
            </span>
          </div>
        ) : (
          <button
            onClick={onSetDefault}
            className="flex items-center justify-center"
            style={{
              padding: "12px 16px",
              background: "#F8F9FC",
              border: "1px solid #E5E7EB",
              borderRadius: 16,
              gap: 10,
              cursor: "pointer",
            }}
          >
            {/* Outline Check Circle SVG */}
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-[#6B7280]">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 16, color: "#111827" }}>
              Set as default
            </span>
          </button>
        )}

        {/* Trash Delete button */}
        <button
          onClick={onRemove}
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 50,
            height: 50,
            background: "#F8F9FC",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          <HugeiconsIcon icon={Delete02Icon} size={22} className="text-[#DC2626]" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PaymentMethodsPage() {
  const { user } = useAuthStore();
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  const targetAcc = accounts.find((a) => a.id === removeTarget);
  const userHolderName = user?.name || "Haleemah Abdulazeez";

  const handleRemove = () => {
    setAccounts((prev) => prev.filter((a) => a.id !== removeTarget));
    setRemoveTarget(null);
  };

  const handleSetDefault = (id: string) => {
    setAccounts((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <>
      {removeTarget && targetAcc && (
        <RemoveModal
          bank={targetAcc.bank}
          masked={targetAcc.masked}
          onConfirm={handleRemove}
          onCancel={() => setRemoveTarget(null)}
        />
      )}

      <div className="flex flex-col min-h-screen" style={{ background: "#FEFEFE" }}>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div style={{ paddingTop: 60, width: 1016 }}>
          <Link href="/earner/wallet" className="flex items-center" style={{ gap: 8, marginBottom: 32, textDecoration: "none" }}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} className="text-[#6B7280]" />
            <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280" }}>
              Back to wallet
            </span>
          </Link>

          <div className="flex items-center justify-between" style={{ marginBottom: 40 }}>
            <div className="flex flex-col" style={{ gap: 4 }}>
              <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 40, letterSpacing: "-0.03em", color: "#111827" }}>
                Payment methods
              </h1>
              <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280" }}>
                {accounts.length} account{accounts.length !== 1 ? "s" : ""} saved
              </p>
            </div>

            {/* + Add new button: 339x auto, 16px radius */}
            <Link
              href="/earner/wallet/payment-methods/add"
              className="flex items-center justify-center"
              style={{
                width: 339,
                padding: "16px 10px",
                background: "#9F4EF5",
                borderRadius: 16,
                gap: 10,
                textDecoration: "none",
              }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 16, color: "#FFFFFF" }}>
                Add new
              </span>
            </Link>
          </div>
        </div>

        {/* ── Account cards ─────────────────────────────────────────────── */}
        <div className="flex flex-col" style={{ gap: 24, width: 968 }}>
          {accounts.map((acc) => (
            <AccountCard
              key={acc.id}
              {...acc}
              holderName={userHolderName}
              onRemove={() => setRemoveTarget(acc.id)}
              onSetDefault={() => handleSetDefault(acc.id)}
            />
          ))}

          {accounts.length === 0 && (
            <div
              className="flex flex-col items-center justify-center"
              style={{ height: 261, gap: 16, background: "#F8F9FC", border: "1px solid #E5E7EB", borderRadius: 30 }}
            >
              {/* Light purple circular wrapper for SVG placeholder */}
              <div 
                className="flex items-center justify-center"
                style={{ width: 60, height: 60, background: "#EDE9FE", borderRadius: 999 }}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-[#9F4EF5]">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="16" cy="15" r="1.5" fill="currentColor"/>
                </svg>
              </div>
              <div className="flex flex-col items-center text-center" style={{ gap: 4 }}>
                <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 20, color: "#111827" }}>
                  No saved accounts yet
                </p>
                <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280" }}>
                  Link your bank accounts to receive your rewards
                </p>
              </div>
              <Link
                href="/earner/wallet/payment-methods/add"
                className="flex items-center"
                style={{ gap: 6, textDecoration: "none" }}
              >
                <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 18, color: "#9F4EF5" }}>
                  + Add payment method
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
