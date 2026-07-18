"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useWalletStore } from "@/store/wallet.store";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDownLeft01Icon,
  ArrowUpRight01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

// ─── Mock transactions ─────────────────────────────────────────────────────────
const TRANSACTIONS = [
  { id: "t1", type: "credit" as const, title: "Mobile banking habits",       sub: "Survey rewards",   date: "April 8 2026 . 10:30 AM",  amount: "+₦500.00" },
  { id: "t2", type: "debit"  as const, title: "Withdrawal to GTBank",        sub: "Bank withdrawal",  date: "April 4 2026 . 11:30 AM",  amount: "-₦3,000.00" },
  { id: "t3", type: "credit" as const, title: "Coffee buying behaviour",     sub: "Survey rewards",   date: "April 6 2026 . 11:30 AM",  amount: "+₦500.00" },
  { id: "t4", type: "debit"  as const, title: "Withdrawal to GTBank",        sub: "Bank withdrawal",  date: "April 2 2026 . 10:30 AM",  amount: "-₦2,000.00" },
  { id: "t5", type: "credit" as const, title: "Online grocery preference",   sub: "Survey rewards",   date: "April 6 2026 . 11:30 AM",  amount: "+₦500.00" },
  { id: "t6", type: "credit" as const, title: "Remote work productivity",    sub: "Survey rewards",   date: "March 30 2026 . 9:00 AM",  amount: "+₦600.00" },
];

// ─── Transaction Row ──────────────────────────────────────────────────────────
function TxRow({ type, title, sub, date, amount }: {
  type: "credit" | "debit";
  title: string;
  sub: string;
  date: string;
  amount: string;
}) {
  const isCredit = type === "credit";
  return (
    <div
      className="flex items-center justify-between"
      style={{ padding: "16px 0 18px", borderBottom: "1px solid #E5E7EB" }}
    >
      {/* Left: icon + text */}
      <div className="flex items-center" style={{ gap: 12 }}>
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 60,
            height: 60,
            background: isCredit ? "#ECFDF5" : "#EDE9FE",
            borderRadius: 30,
          }}
        >
          {isCredit
            ? <HugeiconsIcon icon={ArrowDownLeft01Icon} size={24} className="text-[#16A34A]" />
            : <HugeiconsIcon icon={ArrowUpRight01Icon}  size={24} className="text-[#9F4EF5]" />
          }
        </div>
        <div className="flex flex-col" style={{ gap: 4 }}>
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 18, letterSpacing: "-0.02em", color: "#111827" }}>
            {title}
          </span>
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 14, letterSpacing: "-0.01em", color: "#6B7280" }}>
            {sub}
          </span>
        </div>
      </div>

      {/* Right: date + amount */}
      <div className="flex items-center" style={{ gap: 12 }}>
        <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280" }}>
          {date}
        </span>
        <span style={{
          fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 18,
          textAlign: "right", color: isCredit ? "#16A34A" : "#DC2626", minWidth: 100,
        }}>
          {amount}
        </span>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function EarnerWalletPage() {
  const { user } = useAuthStore();
  const { wallet, fetchWallet, transactions, fetchTransactions } = useWalletStore();
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    if (user?.$id) {
      fetchWallet(user.$id);
      fetchTransactions(user.$id);
    }
  }, [user?.$id]);

  const balance     = wallet?.balance      ?? 7000;
  const totalEarned = wallet?.totalEarned  ?? 21000;
  
  // Calculate total withdrawn dynamically from transactions or default to 14000
  const withdrawalTransactions = transactions.filter(t => t.type === "withdrawal" || t.type === "debit");
  const totalWithdrawn = withdrawalTransactions.reduce((acc, t) => acc + t.amount, 0) || 14000;

  const mappedTransactions = transactions.length > 0 ? transactions.map((t) => ({
    id: t.$id,
    type: t.type === "credit" ? ("credit" as const) : ("debit" as const),
    title: t.description || (t.type === "credit" ? "Survey rewards" : "Bank withdrawal"),
    sub: t.type === "credit" ? "Survey rewards" : "Bank withdrawal",
    date: t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) + " . " + new Date(t.createdAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }) : "Recent",
    amount: (t.type === "credit" ? "+" : "-") + `₦${t.amount.toLocaleString()}.00`,
  })) : TRANSACTIONS;

  const fmt = (n: number) =>
    "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2 });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#FEFEFE" }}>

      {/* ── Page Header Row ───────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between"
        style={{ paddingTop: 60, width: 1016 }}
      >
        <div className="flex flex-col" style={{ gap: 4 }}>
          <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 40, letterSpacing: "-0.03em", color: "#111827" }}>
            Wallet
          </h1>
          <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, letterSpacing: "-0.02em", color: "#6B7280" }}>
            Track your earnings and withdraw funds.
          </p>
        </div>

        <div className="flex items-center" style={{ gap: 14 }}>
          {/* Search bar */}
          <div
            className="flex items-center"
            style={{ width: 300, padding: "16px 12px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 12, gap: 10 }}
          >
            <HugeiconsIcon icon={Search01Icon} size={24} className="text-[#111827]" />
            <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 14, color: "#111827" }}>Search</span>
          </div>
          {/* Notification bell */}
          <div
            className="flex items-center justify-center cursor-pointer"
            style={{ width: 60, height: 60, background: "#9F4EF5", borderRadius: 999 }}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Balance Display — centered, y=205 ─────────────────────────── */}
      <div
        className="flex flex-col items-center justify-center text-center mx-auto"
        style={{ gap: 14, marginTop: 145, width: 1016 }}
      >
        {/* Available Balance label with Wallet icon */}
        <div className="flex items-center" style={{ gap: 8 }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-[#6B7280]">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
            <circle cx="16" cy="15" r="1.5" fill="currentColor"/>
          </svg>
          <span
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
              fontSize: 18,
              lineHeight: "1.2em",
              letterSpacing: "-0.02em",
              color: "#6B7280",
            }}
          >
            Available Balance
          </span>
        </div>

        {/* Balance amount — H1 Inter Bold 60px */}
        <div className="flex items-center justify-center" style={{ gap: 10 }}>
          <span
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 700,
              fontSize: 60,
              lineHeight: "1.2em",
              letterSpacing: "-0.05em",
              color: "#111827",
            }}
          >
            {balanceVisible ? fmt(balance) : "₦••••••"}
          </span>
          {/* Eye toggle */}
          <button
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="flex items-center justify-center"
            style={{ width: 40, height: 40, borderRadius: 999, border: "none", background: "none", cursor: "pointer" }}
          >
            {balanceVisible ? (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="#6B7280" strokeWidth="2"/>
              </svg>
            ) : (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Action Buttons — y=approx 440, gap=24 ─────────────────────── */}
      <div
        className="flex items-center"
        style={{ gap: 24, marginTop: 40, width: 1016 }}
      >
        {/* Withdraw: 500x60 purple */}
        <Link
          href="/earner/wallet/withdraw"
          className="flex items-center justify-center"
          style={{
            width: 500,
            height: 60,
            background: "#9F4EF5",
            borderRadius: 12,
            gap: 10,
            textDecoration: "none",
          }}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M7 7l10 10M17 17H7M17 17V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 500,
              fontSize: 18,
              color: "#FFFFFF",
            }}
          >
            Withdraw
          </span>
        </Link>

        {/* Manage account: 500x60 secondary bg, border E5E7EB, purple text */}
        <Link
          href="/earner/wallet/payment-methods"
          className="flex items-center justify-center"
          style={{
            width: 500,
            height: 60,
            background: "#F8F9FC",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            gap: 10,
            textDecoration: "none",
          }}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-[#9F4EF5]">
            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
            <circle cx="16" cy="15" r="1.5" fill="currentColor"/>
          </svg>
          <span
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 500,
              fontSize: 18,
              color: "#9F4EF5",
            }}
          >
            Manage account
          </span>
        </Link>
      </div>

      {/* ── Mini stat cards — 500x120 each, gap=24, border-radius 20px ── */}
      <div
        className="flex items-center"
        style={{ gap: 24, marginTop: 24, width: 1016 }}
      >
        {/* Total earned: white, border E5E7EB, rounded-20, padding 24px */}
        <div
          className="flex flex-col justify-center"
          style={{
            flex: 1,
            height: 120,
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 20,
            padding: 24,
            gap: 8,
          }}
        >
          <div className="flex items-center" style={{ gap: 10 }}>
            <HugeiconsIcon icon={ArrowDownLeft01Icon} size={20} className="text-[#16A34A]" />
            <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#16A34A" }}>
              Total earned
            </span>
          </div>
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 24, letterSpacing: "-0.02em", color: "#111827" }}>
            {fmt(totalEarned)}
          </span>
        </div>

        {/* Total withdrawn */}
        <div
          className="flex flex-col justify-center"
          style={{
            flex: 1,
            height: 120,
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 20,
            padding: 24,
            gap: 8,
          }}
        >
          <div className="flex items-center" style={{ gap: 10 }}>
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={20} className="text-[#9F4EF5]" />
            <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#9F4EF5" }}>
              Total withdrawn
            </span>
          </div>
          <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 24, letterSpacing: "-0.02em", color: "#111827" }}>
            {fmt(totalWithdrawn)}
          </span>
        </div>
      </div>

      {/* ── Transaction History Table ──────────────────────────────────── */}
      <div
        className="flex flex-col"
        style={{ marginTop: 24, width: 1016, marginBottom: 40 }}
      >
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 30,
            padding: "0 20px 16px",
          }}
        >
          {/* Table header */}
          <div
            className="flex items-center justify-between"
            style={{ padding: "16px 0 18px", borderBottom: "1px solid #E5E7EB" }}
          >
            <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 24, letterSpacing: "-0.02em", color: "#111827" }}>
              Transaction History
            </span>
            <div
              className="flex items-center"
              style={{ padding: 12, border: "1px solid #E5E7EB", borderRadius: 12, gap: 10 }}
            >
              <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#111827" }}>
                All Transactions
              </span>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {mappedTransactions.slice(0, 6).map((tx) => (
            <TxRow key={tx.id} {...tx} />
          ))}

          {/* View all transaction button */}
          <div style={{ marginTop: 20 }}>
            <button
              className="flex items-center justify-center w-full"
              style={{
                height: 60,
                background: "#F8F9FC",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontFamily: "Geist, sans-serif",
                  fontWeight: 500,
                  fontSize: 18,
                  color: "#9F4EF5",
                }}
              >
                View all transaction
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
