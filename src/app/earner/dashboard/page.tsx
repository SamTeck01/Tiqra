"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useWalletStore } from "@/store/wallet.store";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Clock01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  ArrowDownLeft01Icon,
} from "@hugeicons/core-free-icons";

// ─── Mock data matching Figma ───────────────────────────────────────────────
const AVAILABLE_SURVEYS = [
  { id: "s1", title: "Al powered Resume builder", reward: "₦500.00", duration: "2 mins" },
  { id: "s2", title: "Freelance invoice tools",    reward: "₦800.00", duration: "5 mins" },
  { id: "s3", title: "Remote work tools",           reward: "₦600.00", duration: "3 mins" },
];

const TRANSACTIONS = [
  {
    id: "t1",
    type: "credit" as const,
    title: "Mobile banking habits",
    sub: "Survey rewards",
    date: "April 8 2026 . 10:30 AM",
    amount: "+₦500.00",
  },
  {
    id: "t2",
    type: "debit" as const,
    title: "Withdrawal to GTBank",
    sub: "Bank withdrawal",
    date: "April 4 2026 . 11:30 AM",
    amount: "-₦3,000.00",
  },
  {
    id: "t3",
    type: "credit" as const,
    title: "Coffee buying behaviour",
    sub: "Survey rewards",
    date: "April 6 2026 . 11:30 AM",
    amount: "+₦500.00",
  },
  {
    id: "t4",
    type: "debit" as const,
    title: "Withdrawal to GTBank",
    sub: "Bank withdrawal",
    date: "April 2 2026 . 10:30 AM",
    amount: "-₦2,000.00",
  },
  {
    id: "t5",
    type: "credit" as const,
    title: "Online grocery preference",
    sub: "Survey rewards",
    date: "April 6 2026 . 11:30 AM",
    amount: "+₦500.00",
  },
];

// ─── Survey Card ─────────────────────────────────────────────────────────────
function SurveyCard({
  title,
  reward,
  duration,
  id,
}: {
  title: string;
  reward: string;
  duration: string;
  id: string;
}) {
  const router = useRouter();
  return (
    /* EL-20b4afbc: column, padding 24px, gap 10px, white, border F1F5F9 1px, shadow rgba(237,233,254,0.7), borderRadius 16px */
    <div
      onClick={() => router.push(`/earner/surveys/${id}`)}
      className="cursor-pointer flex flex-col"
      style={{
        padding: 24,
        gap: 10,
        background: "#FFFFFF",
        border: "1px solid #F1F5F9",
        boxShadow: "0px 4px 24px 0px rgba(237, 233, 254, 0.7)",
        borderRadius: 16,
      }}
    >
      {/* EL-fadfe7dc: column, alignItems flex-end, gap 24 */}
      <div className="flex flex-col items-end" style={{ gap: 24 }}>
        {/* EL-467ca15a: column, fill, gap 8 */}
        <div className="flex flex-col w-full" style={{ gap: 8 }}>
          {/* Title: Geist Regular 20px */}
          <p
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
              fontSize: 20,
              lineHeight: "1.2em",
              letterSpacing: "-0.02em",
              color: "#111827",
            }}
          >
            {title}
          </p>
          {/* Duration badge: row, gap 4, icon 16x16 */}
          <div className="flex items-center" style={{ gap: 4 }}>
            <HugeiconsIcon icon={Clock01Icon} size={16} className="text-[#6B7280]" />
            {/* Body/Captions: Geist Medium 12px */}
            <span
              style={{
                fontFamily: "Geist, sans-serif",
                fontWeight: 500,
                fontSize: 12,
                lineHeight: "1.2em",
                letterSpacing: "-0.01em",
                color: "#6B7280",
              }}
            >
              {duration}
            </span>
          </div>
        </div>

        {/* EL-a2f44fe6: row, center, gap 71 */}
        <div className="flex items-center justify-center" style={{ gap: 71 }}>
          {/* EL-1acda7bf: column, gap 4, width 107 */}
          <div className="flex flex-col" style={{ gap: 4, width: 107 }}>
            {/* Reward: H3 Geist SemiBold 24px */}
            <span
              style={{
                fontFamily: "Geist, sans-serif",
                fontWeight: 600,
                fontSize: 24,
                lineHeight: "1.2em",
                letterSpacing: "-0.02em",
                color: "#111827",
              }}
            >
              {reward}
            </span>
            {/* Body/small: Geist Regular 14px secondary */}
            <span
              style={{
                fontFamily: "Geist, sans-serif",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "1.2em",
                letterSpacing: "-0.01em",
                color: "#6B7280",
              }}
            >
              Reward
            </span>
          </div>

          {/* EL-50b30851: Start button — row, padding 12px 16px, purple bg, radius 12 */}
          <div
            className="flex items-center justify-center"
            style={{
              padding: "12px 16px",
              background: "#9F4EF5",
              borderRadius: 12,
              gap: 10,
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              Start
            </span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={24} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Transaction Row ──────────────────────────────────────────────────────────
function TxRow({
  type,
  title,
  sub,
  date,
  amount,
}: {
  type: "credit" | "debit";
  title: string;
  sub: string;
  date: string;
  amount: string;
}) {
  const isCredit = type === "credit";
  return (
    /* EL-de6109c7 or EL-e592c709 row */
    <div
      className="flex items-center"
      style={{
        padding: "16px 0 18px",
        gap: 184,
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      {/* Left: icon + text + date */}
      <div className="flex items-center" style={{ gap: 12 }}>
        {/* Icon: 60x60 rounded-30 */}
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 60,
            height: 60,
            background: isCredit ? "#ECFDF5" : "#EDE9FE",
            borderRadius: 30,
          }}
        >
          {isCredit ? (
            <HugeiconsIcon icon={ArrowDownLeft01Icon} size={24} className="text-[#16A34A]" />
          ) : (
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={24} className="text-[#9F4EF5]" />
          )}
        </div>
        {/* Title + sub + date */}
        <div className="flex flex-col" style={{ gap: 4, width: 221 }}>
          <span
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
              fontSize: 18,
              lineHeight: "1.2em",
              letterSpacing: "-0.02em",
              color: "#111827",
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: "1.2em",
              letterSpacing: "-0.01em",
              color: "#6B7280",
              width: 233,
            }}
          >
            {sub}
          </span>
        </div>
      </div>

      {/* Right: date + amount */}
      <div className="flex items-center" style={{ gap: 12 }}>
        <span
          style={{
            fontFamily: "Geist, sans-serif",
            fontWeight: 400,
            fontSize: 16,
            lineHeight: "1.2em",
            letterSpacing: "-0.02em",
            color: "#6B7280",
            width: 170,
          }}
        >
          {date}
        </span>
        <span
          style={{
            fontFamily: "Geist, sans-serif",
            fontWeight: 400,
            fontSize: 18,
            lineHeight: "1.2em",
            letterSpacing: "-0.02em",
            textAlign: "right",
            color: isCredit ? "#16A34A" : "#DC2626",
            width: 140,
          }}
        >
          {amount}
        </span>
      </div>
    </div>
  );
}

// ─── Stat Card (glass / white) ────────────────────────────────────────────────
function StatCard({
  label,
  value,
  purple,
}: {
  label: string;
  value: string;
  purple?: boolean;
}) {
  return (
    <div
      className="relative flex-shrink-0"
      style={{
        width: 320,
        height: 150,
        background: purple ? "#9F4EF5" : "rgba(255, 255, 255, 0.2)",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Label — y=29 x=29 */}
      <span
        style={{
          position: "absolute",
          left: 29,
          top: 29,
          width: 192,
          height: 22,
          fontFamily: "Geist, sans-serif",
          fontWeight: 400,
          fontSize: 18,
          lineHeight: "1.2em",
          letterSpacing: "-0.02em",
          color: purple ? "#FEFEFE" : "#6B7280",
        }}
      >
        {label}
      </span>
      {/* Value — y=75 x=29 */}
      <span
        style={{
          position: "absolute",
          left: 29,
          top: 75,
          fontFamily: "Geist, sans-serif",
          fontWeight: 600,
          fontSize: 32,
          lineHeight: "1.5em",
          letterSpacing: "-0.03em",
          color: purple ? "#FEFEFE" : "#111827",
        }}
      >
        {value}
      </span>
      {/* Icon circle — x=231 y=45 — 60x60 */}
      <div
        style={{
          position: "absolute",
          right: 29,
          top: 45,
          width: 60,
          height: 60,
          background: purple ? "transparent" : "#9F4EF5",
          border: purple ? "1px solid #E5E7EB" : "none",
          borderRadius: 999,
        }}
      />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EarnerDashboardPage() {
  const { user } = useAuthStore();
  const { wallet, fetchWallet, transactions, fetchTransactions } = useWalletStore();

  useEffect(() => {
    if (user?.$id) {
      fetchWallet(user.$id);
      fetchTransactions(user.$id);
    }
  }, [user?.$id]);

  const balance = wallet?.balance ?? 9000;
  const pendingEarning = wallet?.pendingBalance ?? 1000;
  const completedSurveys = 12;

  const isEmpty = transactions.length === 0;

  const mappedTransactions = transactions.map((t) => ({
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
  }));

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "#FEFEFE" }}
    >
      {/* ── Page Header Row — Figma: y=60, x=356 ───────────────────────────── */}
      <div
        className="flex items-center"
        style={{ gap: 213, padding: "60px 0 0 0", marginLeft: 0, marginBottom: 0 }}
      >
        <div
          className="flex flex-col"
          style={{ gap: 4, width: 430, paddingLeft: 0 }}
        >
          {/* Title: Inter Bold 40px */}
          <h1
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: 40,
              lineHeight: "1.5em",
              letterSpacing: "-0.03em",
              color: "#111827",
            }}
          >
            Dashboard
          </h1>
          {/* Subtitle: Body/body */}
          <p
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
              fontSize: 16,
              lineHeight: "1.2em",
              letterSpacing: "-0.02em",
              color: "#6B7280",
            }}
          >
            Turn your ideas into clear decisions using real user insights.
          </p>
        </div>

        {/* Right: search + notification */}
        <div className="flex items-center" style={{ gap: 14 }}>
          {/* Search bar: 300px wide, white, border E5E7EB, rounded-12, padding 16px 12px */}
          <div
            className="flex items-center"
            style={{
              width: 300,
              padding: "16px 12px",
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              gap: 10,
            }}
          >
            <HugeiconsIcon icon={Search01Icon} size={24} className="text-[#111827]" />
            <span
              style={{
                fontFamily: "Geist, sans-serif",
                fontWeight: 400,
                fontSize: 14,
                color: "#111827",
              }}
            >
              Search
            </span>
          </div>
          {/* Notification bell: 60x60 brand-primary rounded-999 */}
          <div
            className="flex items-center justify-center cursor-pointer"
            style={{
              width: 60,
              height: 60,
              background: "#9F4EF5",
              borderRadius: 999,
            }}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Main content — starting x=356, y=205 (stat cards) ───────────── */}
      <div style={{ paddingLeft: 0, paddingRight: 0 }}>

        {/* Stat cards row — y=205, gap=24, x=356 */}
        <div
          className="flex items-center"
          style={{ gap: 24, marginTop: 145, paddingLeft: 0 }}
        >
          <StatCard label="Total earnings" value={`₦${balance.toLocaleString()}`} purple />
          <StatCard label="Pending earning" value={`₦${pendingEarning.toLocaleString()}`} />
          <StatCard label="Completed survey" value={`${completedSurveys}`} />
        </div>

        {/* Main content block — y=387, gap=24 */}
        <div
          className="flex flex-col"
          style={{ gap: 24, marginTop: 24, width: 1017 }}
        >
          {/* ── Available Surveys ─────────────────────────────────────── */}
          <div className="flex flex-col" style={{ gap: 12 }}>
            {/* Section header: space-between */}
            <div className="flex items-center justify-between" style={{ width: "100%" }}>
              {/* "Available Surveys" H3 */}
              <span
                style={{
                  fontFamily: "Geist, sans-serif",
                  fontWeight: 600,
                  fontSize: 24,
                  lineHeight: "1.2em",
                  letterSpacing: "-0.02em",
                  color: "#111827",
                }}
              >
                Available Surveys
              </span>
              {/* View All button: row, padding 16px 12px, rounded-16 */}
              <Link
                href="/earner/surveys"
                className="flex items-center"
                style={{ padding: "16px 12px", borderRadius: 16, gap: 10 }}
              >
                <span
                  style={{
                    fontFamily: "Geist, sans-serif",
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: "1.2em",
                    letterSpacing: "-0.02em",
                    color: "#9F4EF5",
                  }}
                >
                  View All
                </span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={24} className="text-[#9F4EF5]" />
              </Link>
            </div>

            {/* Survey cards row: gap=14, fill */}
            <div
              className="flex items-center"
              style={{ gap: 14, alignSelf: "stretch" }}
            >
              {AVAILABLE_SURVEYS.map((s) => (
                <div key={s.id} style={{ flex: 1 }}>
                  <SurveyCard {...s} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent Transactions ───────────────────────────────────── */}
          <div className="flex flex-col" style={{ gap: 12 }}>
            {/* Section header */}
            <div className="flex items-center justify-between" style={{ width: "100%" }}>
              <span
                style={{
                  fontFamily: "Geist, sans-serif",
                  fontWeight: 600,
                  fontSize: 24,
                  lineHeight: "1.2em",
                  letterSpacing: "-0.02em",
                  color: "#111827",
                }}
              >
                Recent Transactions
              </span>
              <Link
                href="/earner/wallet"
                className="flex items-center"
                style={{ padding: "16px 12px", borderRadius: 16, gap: 10 }}
              >
                <span
                  style={{
                    fontFamily: "Geist, sans-serif",
                    fontWeight: 400,
                    fontSize: 16,
                    color: "#9F4EF5",
                  }}
                >
                  View All
                </span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={24} className="text-[#9F4EF5]" />
              </Link>
            </div>

            {/* Transactions table card — white, border E5E7EB, rounded-30, padding 0px 20px 16px */}
            {isEmpty ? (
              /* Empty state */
              <div
                className="flex items-center justify-center"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: 30,
                  height: 318,
                  width: "100%",
                }}
              >
                <div
                  className="flex flex-col items-center"
                  style={{ gap: 8, textAlign: "center" }}
                >
                  <p
                    style={{
                      fontFamily: "Geist, sans-serif",
                      fontWeight: 600,
                      fontSize: 17,
                      color: "#111827",
                    }}
                  >
                    No transactions yet
                  </p>
                  <p
                    style={{
                      fontFamily: "Geist, sans-serif",
                      fontWeight: 400,
                      fontSize: 11,
                      color: "#6B7280",
                      maxWidth: 280,
                    }}
                  >
                    You haven't made any transactions, add funds to your wallet to get started.
                  </p>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: 30,
                  padding: "0 20px 16px",
                  width: "100%",
                }}
              >
                {/* Table header row */}
                <div
                  className="flex items-center justify-between"
                  style={{
                    padding: "16px 0 18px",
                    borderBottom: "1px solid #E5E7EB",
                    marginBottom: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Geist, sans-serif",
                      fontWeight: 600,
                      fontSize: 24,
                      lineHeight: "1.2em",
                      letterSpacing: "-0.02em",
                      color: "#111827",
                    }}
                  >
                    Transaction History
                  </span>
                  <div
                    className="flex items-center"
                    style={{
                      padding: 12,
                      border: "1px solid #E5E7EB",
                      borderRadius: 12,
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Geist, sans-serif",
                        fontWeight: 400,
                        fontSize: 16,
                        color: "#111827",
                      }}
                    >
                      All Transactions
                    </span>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* Transaction rows */}
                {mappedTransactions.map((tx) => (
                  <TxRow key={tx.id} {...tx} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
