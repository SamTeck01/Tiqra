"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Clock01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

// ─── Data ─────────────────────────────────────────────────────────────────────
const ALL_SURVEYS = [
  { id: "s1", title: "Al powered Resume builder",      reward: "₦500.00", rewardNum: 500, duration: "2 mins" },
  { id: "s2", title: "Freelance invoice tools",         reward: "₦800.00", rewardNum: 800, duration: "5 mins" },
  { id: "s3", title: "Remote work tools",               reward: "₦600.00", rewardNum: 600, duration: "3 mins" },
  { id: "s4", title: "Online grocery preference",       reward: "₦300.00", rewardNum: 300, duration: "2 mins" },
  { id: "s5", title: "Mobile banking habit",            reward: "₦600.00", rewardNum: 600, duration: "3 mins" },
  { id: "s6", title: "Streaming subscription pricing",  reward: "₦600.00", rewardNum: 600, duration: "2 mins" },
  { id: "s7", title: "Travel booking experience",       reward: "₦300.00", rewardNum: 300, duration: "2 mins" },
  { id: "s8", title: "Hostel balloting",                reward: "₦600.00", rewardNum: 600, duration: "3 mins" },
  { id: "s9", title: "Remote standup bot",              reward: "₦600.00", rewardNum: 600, duration: "2 mins" },
];

// ─── Survey Card — EL-20b4afbc ────────────────────────────────────────────────
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
      {/* EL-fadfe7dc: column align-end gap-24 */}
      <div className="flex flex-col items-end" style={{ gap: 24 }}>
        {/* EL-467ca15a: fill, column, gap 8 */}
        <div className="flex flex-col w-full" style={{ gap: 8 }}>
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
          <div className="flex items-center" style={{ gap: 4 }}>
            <HugeiconsIcon icon={Clock01Icon} size={16} className="text-[#6B7280]" />
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

        {/* Row: reward + start button — gap 71 */}
        <div className="flex items-center justify-center" style={{ gap: 71 }}>
          <div className="flex flex-col" style={{ gap: 4, width: 107 }}>
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

          {/* Start button */}
          <div
            className="flex items-center justify-center"
            style={{
              padding: "12px 16px",
              background: "#9F4EF5",
              borderRadius: 12,
              gap: 10,
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

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function EarnerSurveysPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"highest" | "lowest">("highest");

  const filtered = ALL_SURVEYS
    .filter((s) => s.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortBy === "highest" ? b.rewardNum - a.rewardNum : a.rewardNum - b.rewardNum
    );

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#FEFEFE" }}>

      {/* ── Page Header Row — y=60, x=356 ───────────────────────────────── */}
      <div
        className="flex items-center justify-between"
        style={{ paddingTop: 60, width: 1016 }}
      >
        {/* Left: title + subtitle */}
        <div className="flex flex-col" style={{ gap: 4, width: 430 }}>
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
            Survey
          </h1>
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
            Pick survey and start earning
          </p>
        </div>

        {/* Right: notification bell */}
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

      {/* ── Search + Filter Row — y=205 ───────────────────────────────────── */}
      <div
        className="flex items-center justify-between"
        style={{ marginTop: 145, width: 1016 }}
      >
        {/* Search: 373px, white, border E5E7EB, rounded-12, padding 16px 12px */}
        <div
          className="flex items-center"
          style={{
            width: 373,
            padding: "16px 12px",
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            gap: 10,
          }}
        >
          <HugeiconsIcon icon={Search01Icon} size={24} className="text-[#6B7280]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search survey"
            className="flex-1 outline-none bg-transparent"
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
              fontSize: 14,
              color: "#6B7280",
            }}
          />
        </div>

        {/* Sort dropdown: white, border, rounded-12, padding 16px 12px */}
        <div
          className="flex items-center"
          style={{
            padding: "16px 12px",
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            gap: 10,
          }}
        >
          <div className="flex items-center justify-between" style={{ width: 217 }}>
            <div className="flex items-center" style={{ gap: 10 }}>
              {/* Faders icon */}
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <line x1="4" y1="6" x2="20" y2="6" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4" y1="12" x2="20" y2="12" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4" y1="18" x2="20" y2="18" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="9" cy="6" r="2" fill="white" stroke="#111827" strokeWidth="2"/>
                <circle cx="15" cy="12" r="2" fill="white" stroke="#111827" strokeWidth="2"/>
                <circle cx="9" cy="18" r="2" fill="white" stroke="#111827" strokeWidth="2"/>
              </svg>
              <span
                style={{
                  fontFamily: "Geist, sans-serif",
                  fontWeight: 400,
                  fontSize: 16,
                  color: "#111827",
                }}
              >
                Highest reward
              </span>
            </div>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M6 9l6 6 6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Survey Cards Grid — y=323, gap=12, 3 per row ─────────────────── */}
      <div
        className="flex flex-col"
        style={{ gap: 12, marginTop: 118, width: 1014 }}
      >
        {/* Row 1 */}
        <div className="flex items-center" style={{ gap: 12, alignSelf: "stretch" }}>
          {filtered.slice(0, 3).map((s) => (
            <div key={s.id} style={{ flex: 1 }}>
              <SurveyCard {...s} />
            </div>
          ))}
        </div>
        {/* Row 2 */}
        {filtered.length > 3 && (
          <div className="flex items-center" style={{ gap: 12, alignSelf: "stretch" }}>
            {filtered.slice(3, 6).map((s) => (
              <div key={s.id} style={{ flex: 1 }}>
                <SurveyCard {...s} />
              </div>
            ))}
          </div>
        )}
        {/* Row 3 */}
        {filtered.length > 6 && (
          <div className="flex items-center" style={{ gap: 12, alignSelf: "stretch" }}>
            {filtered.slice(6, 9).map((s) => (
              <div key={s.id} style={{ flex: 1 }}>
                <SurveyCard {...s} />
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div
            className="flex flex-col items-center justify-center"
            style={{ height: 200, gap: 8 }}
          >
            <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 18, color: "#111827" }}>
              No surveys found
            </p>
            <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 14, color: "#6B7280" }}>
              Try adjusting your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
