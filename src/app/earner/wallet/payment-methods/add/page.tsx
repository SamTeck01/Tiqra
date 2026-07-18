"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Search01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

// ─── Nigerian banks ───────────────────────────────────────────────────────────
const BANKS = [
  { id: "gtb",   name: "GTBank",       initial: "G", color: "#E8400C" },
  { id: "first", name: "First Bank",   initial: "F", color: "#003366" },
  { id: "zenith",name: "Zenith Bank",  initial: "Z", color: "#C8102E" },
  { id: "uba",   name: "UBA",          initial: "U", color: "#E40D0E" },
  { id: "access",name: "Access Bank",  initial: "A", color: "#D63326" },
  { id: "fidelity",name:"Fidelity",    initial: "F", color: "#009944" },
  { id: "sterling",name:"Sterling",    initial: "S", color: "#B01116" },
  { id: "kuda",  name: "Kuda",         initial: "K", color: "#500878" },
  { id: "opay",  name: "OPay",         initial: "O", color: "#007B5F" },
  { id: "mono",  name: "Moniepoint",   initial: "M", color: "#0030A0" },
  { id: "wema",  name: "Wema Bank",    initial: "W", color: "#640059" },
  { id: "union", name: "Union Bank",   initial: "U", color: "#2F4F4F" },
];

export default function AddPaymentMethodPage() {
  const router = useRouter();
  const [bankSearch, setBankSearch]   = useState("");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [verifying, setVerifying]     = useState(false);
  const [accountName, setAccountName] = useState("");

  const filteredBanks = BANKS.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const handleVerify = async () => {
    if (accountNumber.length < 10 || !selectedBank) return;
    setVerifying(true);
    // Simulate API lookup
    await new Promise((r) => setTimeout(r, 2000));
    setAccountName("HALEEMAH ABDULAZEEZ");
    setVerifying(false);
  };

  const handleAddAccount = () => {
    if (!accountName) return;
    // Add logic here if saving, but it is client-side state in the parent page.
    // In real app it would hit database.
    router.push("/earner/wallet/payment-methods");
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#FEFEFE" }}>

      {/* ── Verification Modal (Figma 610:1613) ─────────────────────────────────── */}
      {verifying && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(17, 24, 39, 0.4)", backdropFilter: "blur(10px)" }}
        >
          {/* Modal spinner card */}
          <div
            className="flex flex-col items-center justify-center"
            style={{
              width: 340,
              height: 340,
              background: "#FFFFFF",
              borderRadius: 40,
              boxShadow: "0px 20px 60px rgba(0, 0, 0, 0.15)",
              gap: 24,
            }}
          >
            {/* 150x150 Spinner Illustration */}
            <div className="relative" style={{ width: 150, height: 150 }}>
              <svg width="150" height="150" viewBox="0 0 100 100" className="animate-spin text-[#9F4EF5]">
                <circle cx="50" cy="50" r="40" stroke="rgba(159, 78, 245, 0.1)" strokeWidth="6" fill="none" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="currentColor" 
                  strokeWidth="6" 
                  strokeDasharray="160 160" 
                  strokeLinecap="round" 
                  fill="none" 
                />
              </svg>
              {/* Central Bank Icon SVG inside the spinner */}
              <div 
                className="absolute inset-0 flex items-center justify-center" 
                style={{ width: 150, height: 150 }}
              >
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="text-[#9F4EF5]">
                  <path d="M3 21h18M3 10h18M3 10l9-7 9 7M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 18, color: "#111827" }}>
              Verifying Account...
            </span>
          </div>
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div style={{ paddingTop: 60, width: 1016, marginBottom: 48 }}>
        <Link href="/earner/wallet/payment-methods" className="flex items-center" style={{ gap: 8, marginBottom: 32, textDecoration: "none" }}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} className="text-[#6B7280]" />
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280" }}>
            Back
          </span>
        </Link>

        <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 40, letterSpacing: "-0.03em", color: "#111827", marginBottom: 4 }}>
          Add payment method
        </h1>
        <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280" }}>
          Select your bank and enter your account details.
        </p>
      </div>

      {/* ── Form ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col" style={{ gap: 32, width: 968 }}>

        {/* Bank selection */}
        <div className="flex flex-col" style={{ gap: 16 }}>
          <label style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 18, color: "#111827" }}>
            Select bank
          </label>

          {/* Search input: fills background secondary #F8F9FC, 12px borderRadius */}
          <div
            className="flex items-center"
            style={{
              padding: "16px 20px",
              background: "#F8F9FC",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              gap: 12,
            }}
          >
            <HugeiconsIcon icon={Search01Icon} size={20} className="text-[#6B7280]" />
            <input
              type="text"
              value={bankSearch}
              onChange={(e) => setBankSearch(e.target.value)}
              placeholder="Search bank"
              className="flex-1 outline-none bg-transparent"
              style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#111827" }}
            />
          </div>

          {/* Bank grid — 3 per row */}
          <div
            className="grid"
            style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          >
            {filteredBanks.map((bank) => (
              <button
                key={bank.id}
                onClick={() => {
                  setSelectedBank(bank.id);
                  setAccountName("");
                }}
                className="flex flex-col items-center justify-center transition-all duration-200"
                style={{
                  padding: "24px 16px",
                  background: selectedBank === bank.id ? "rgba(159, 78, 245, 0.05)" : "#FFFFFF",
                  border: `1px solid ${selectedBank === bank.id ? "#9F4EF5" : "#E5E7EB"}`,
                  borderRadius: 20,
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                {/* Bank logo brand color initials badge */}
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 50,
                    height: 50,
                    background: bank.color + "15",
                    borderRadius: 999,
                  }}
                >
                  <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 700, fontSize: 20, color: bank.color }}>
                    {bank.initial}
                  </span>
                </div>
                <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 16, color: "#111827", textAlign: "center" }}>
                  {bank.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Account number input */}
        {selectedBank && (
          <div className="flex flex-col animate-none" style={{ gap: 12, marginTop: 12 }}>
            <div className="flex items-center justify-between">
              <label style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 18, color: "#111827" }}>
                Account number
              </label>
              <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 14, color: "#6B7280" }}>
                ({accountNumber.length}/10)
              </span>
            </div>
            <div
              className="flex items-center"
              style={{
                padding: "16px 20px",
                background: "#FFFFFF",
                border: `2px solid ${accountNumber.length === 10 ? "#9F4EF5" : "#E5E7EB"}`,
                borderRadius: 12,
              }}
            >
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setAccountNumber(v);
                  setAccountName("");
                }}
                placeholder="0000000000"
                className="flex-1 outline-none bg-transparent"
                style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 20, color: "#111827", letterSpacing: "0.08em" }}
              />
            </div>

            {/* Resolved name banner (Figma check badge) */}
            {accountName && (
              <div 
                className="flex items-center"
                style={{ 
                  padding: "12px 16px", 
                  background: "#ECFDF5", 
                  borderRadius: 8, 
                  gap: 10,
                  marginTop: 8,
                  width: "fit-content"
                }}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-[#16A34A]">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2"/>
                  <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 16, color: "#16A34A" }}>
                  {accountName}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Verify + Add button */}
        {selectedBank && (
          <div className="flex justify-end" style={{ marginTop: 12 }}>
            <button
              onClick={accountName ? handleAddAccount : handleVerify}
              disabled={accountNumber.length < 10 || verifying}
              className="flex items-center"
              style={{
                padding: "18px 32px",
                background: accountNumber.length < 10 ? "#E5E7EB" : "#9F4EF5",
                borderRadius: 12,
                gap: 10,
                border: "none",
                cursor: accountNumber.length < 10 ? "default" : "pointer",
              }}
            >
              <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 18, color: "#FFFFFF" }}>
                {verifying ? "Verifying…" : accountName ? "Add Account" : "Verify Account"}
              </span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
