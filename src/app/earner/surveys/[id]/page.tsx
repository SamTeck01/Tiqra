"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Clock01Icon,
  UserGroupIcon,
  Dollar01Icon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

// ─── Survey data ───────────────────────────────────────────────────────────────
const SURVEY_DATA: Record<string, {
  id: string; title: string; description: string; reward: number;
  duration: string; category: string; questions: {
    id: string; text: string; type: string; options?: string[];
  }[];
}> = {
  s1: {
    id: "s1", title: "AI powered Resume builder",
    description: "Help us understand how job seekers currently build and manage their CVs, and what they'd want from an AI-powered resume tool.",
    reward: 500, duration: "2 mins", category: "Tech",
    questions: [
      { id: "q1", text: "How often do you update your resume?", type: "multiple_choice", options: ["Monthly", "Quarterly", "When job hunting", "Rarely"] },
      { id: "q2", text: "How frustrating is building a resume from scratch? (1=Not at all, 10=Very frustrating)", type: "scale" },
      { id: "q3", text: "Would you use an AI tool to auto-generate your resume from your LinkedIn?", type: "yes_no" },
      { id: "q4", text: "What's your biggest pain point with current resume tools?", type: "short_text" },
      { id: "q5", text: "Which format do you most commonly use?", type: "multiple_choice", options: ["PDF", "Word Document", "Google Docs", "Online builder"] },
      { id: "q6", text: "How much would you pay per month for an AI resume assistant?", type: "multiple_choice", options: ["Free only", "₦500–₦1,000", "₦1,000–₦3,000", "₦3,000+"] },
    ],
  },
  s2: {
    id: "s2", title: "Freelancer invoice tools",
    description: "We're building an invoice management tool for Nigerian freelancers. Your feedback helps shape the product.",
    reward: 800, duration: "5 mins", category: "Finance",
    questions: [
      { id: "q1", text: "How do you currently send invoices to clients?", type: "multiple_choice", options: ["WhatsApp/email", "Google Docs", "Dedicated tool", "I don't invoice"] },
      { id: "q2", text: "How often do you experience late payments?", type: "multiple_choice", options: ["Always", "Often", "Sometimes", "Rarely"] },
      { id: "q3", text: "Would you use an automated invoice and payment reminder tool?", type: "yes_no" },
      { id: "q4", text: "What currency do most of your clients pay in?", type: "multiple_choice", options: ["Naira (NGN)", "USD", "GBP", "Multiple currencies"] },
      { id: "q5", text: "Describe your biggest invoicing challenge", type: "short_text" },
    ],
  },
};

type Phase = "preview" | "taking" | "done";

export default function SurveyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const survey  = SURVEY_DATA[id] || SURVEY_DATA["s1"];

  const [phase, setPhase]     = useState<Phase>("preview");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExitModal, setShowExitModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const question = survey.questions[currentQ];
  const totalQ   = survey.questions.length;
  const isLast   = currentQ === totalQ - 1;
  const progress = ((currentQ + 1) / totalQ) * 100;

  const handleAnswer = (val: string) => {
    setAnswers((a) => ({ ...a, [question.id]: val }));
    setShowWarning(false);
  };

  const handleNext = () => {
    if (!answers[question.id]) {
      setShowWarning(true);
      return;
    }
    if (isLast) { setPhase("done"); }
    else { setCurrentQ((q) => q + 1); }
  };

  // ── Preview ──────────────────────────────────────────────────────────────────
  if (phase === "preview") {
    return (
      <div style={{ minHeight: "100vh", background: "#FEFEFE" }}>
        {/* Back bar */}
        <div style={{ padding: "24px 0 0", marginBottom: 32 }}>
          <button
            onClick={() => router.back()}
            className="flex items-center"
            style={{ gap: 8, background: "none", border: "none", cursor: "pointer" }}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} className="text-[#6B7280]" />
            <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280" }}>
              Back to surveys
            </span>
          </button>
        </div>

        <div style={{ maxWidth: 700 }}>
          {/* Header */}
          <div className="flex items-start justify-between" style={{ marginBottom: 32 }}>
            <div className="flex flex-col" style={{ gap: 12 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 14px",
                  background: "#EDE9FE",
                  borderRadius: 999,
                  fontFamily: "Geist, sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  color: "#9F4EF5",
                }}
              >
                {survey.category}
              </span>
              <h1
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: 36,
                  lineHeight: "1.2em",
                  letterSpacing: "-0.03em",
                  color: "#111827",
                }}
              >
                {survey.title}
              </h1>
            </div>
            {/* Reward card */}
            <div
              className="flex flex-col items-center"
              style={{
                flexShrink: 0,
                padding: "16px 24px",
                background: "#9F4EF5",
                borderRadius: 16,
                gap: 4,
              }}
            >
              <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                Reward
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 28, color: "#FFFFFF" }}>
                ₦{survey.reward.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-3" style={{ gap: 12, marginBottom: 24 }}>
            {[
              { icon: Clock01Icon, label: "Duration", value: survey.duration },
              { icon: UserGroupIcon, label: "Questions", value: `${totalQ} questions` },
              { icon: Dollar01Icon, label: "Pay type", value: "Instant payout" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center"
                style={{ background: "#F8F9FC", borderRadius: 16, padding: 16, gap: 12 }}
              >
                <div style={{ width: 40, height: 40, background: "#EDE9FE", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <HugeiconsIcon icon={Icon} size={20} className="text-[#9F4EF5]" />
                </div>
                <div className="flex flex-col" style={{ gap: 2 }}>
                  <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 13, color: "#6B7280" }}>{label}</span>
                  <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 16, color: "#111827" }}>{value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <h2 style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 18, color: "#111827", marginBottom: 12 }}>About this survey</h2>
            <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280", lineHeight: "1.6em" }}>{survey.description}</p>
          </div>

          {/* Questions preview */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 16, padding: 24, marginBottom: 28 }}>
            <h2 style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 18, color: "#111827", marginBottom: 16 }}>Questions Preview</h2>
            <div className="flex flex-col" style={{ gap: 12 }}>
              {survey.questions.slice(0, 3).map((q, i) => (
                <div key={q.id} className="flex items-center" style={{ gap: 12 }}>
                  <span style={{ width: 24, height: 24, borderRadius: 12, background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 11, color: "#9F4EF5", flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 15, color: "#6B7280" }}>{q.text}</span>
                </div>
              ))}
              {totalQ > 3 && (
                <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 13, color: "#94A3B8", paddingLeft: 36 }}>
                  +{totalQ - 3} more questions
                </p>
              )}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex" style={{ gap: 12 }}>
            <button
              onClick={() => router.back()}
              style={{ padding: "16px 24px", background: "#F8F9FC", border: "1px solid #E5E7EB", borderRadius: 12, fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#111827", cursor: "pointer", flexShrink: 0 }}
            >
              Maybe Later
            </button>
            <button
              onClick={() => setPhase("taking")}
              className="flex items-center justify-center"
              style={{ flex: 1, padding: "16px 0", background: "#9F4EF5", borderRadius: 12, gap: 8, border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 16, color: "#FFFFFF" }}
            >
              Start Survey <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
            </button>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start" style={{ gap: 10, marginTop: 16, padding: 16, background: "#FEF3C7", borderRadius: 12 }}>
            <HugeiconsIcon icon={AlertCircleIcon} size={16} className="text-[#D97706] flex-shrink-0" style={{ marginTop: 2 }} />
            <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 13, color: "#D97706" }}>
              Answer honestly. Our AI truth-layer detects low-quality responses. Flagged submissions will not be paid.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Taking — Figma: #582:463 ──────────────────────────────────────────────────
  if (phase === "taking") {
    return (
      /* Full-height column; use negative margins to break out of layout padding for full-width header */
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FEFEFE", margin: "0 -32px" }}>

        {/* ── Sticky progress header — Figma: 150px tall, purple tint ──── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: "#FEFEFE",
            borderBottom: "1px solid #E5E7EB",
            padding: "20px 32px",
          }}
        >
          {/* Row: back button + title + reward */}
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            <button
              onClick={() => currentQ === 0 ? setShowExitModal(true) : setCurrentQ((q) => q - 1)}
              className="flex items-center"
              style={{ gap: 8, background: "none", border: "none", cursor: "pointer" }}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} className="text-[#6B7280]" />
              <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280" }}>
                {currentQ === 0 ? "Back" : "Previous"}
              </span>
            </button>

            {/* Centre: survey title chip */}
            <div
              className="flex items-center"
              style={{ gap: 8, padding: "8px 16px", background: "#EDE9FE", borderRadius: 999 }}
            >
              <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 14, color: "#9F4EF5" }}>
                {survey.title}
              </span>
            </div>

            {/* Reward + Close button */}
            <div className="flex items-center" style={{ gap: 16 }}>
              <span
                style={{
                  fontFamily: "Geist, sans-serif",
                  fontWeight: 600,
                  fontSize: 18,
                  color: "#9F4EF5",
                }}
              >
                ₦{survey.reward.toLocaleString()}
              </span>
              <button
                onClick={() => setShowExitModal(true)}
                className="flex items-center justify-center hover:bg-gray-100 transition-colors"
                style={{ 
                  width: 32, 
                  height: 32, 
                  background: "none", 
                  border: "none", 
                  borderRadius: 999, 
                  cursor: "pointer" 
                }}
              >
                {/* Cancel/Close icon */}
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-[#6B7280]">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Progress bar row */}
          <div className="flex items-center" style={{ gap: 12 }}>
            {/* Bar */}
            <div style={{ flex: 1, height: 8, background: "#EDE9FE", borderRadius: 4, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "#9F4EF5",
                  borderRadius: 4,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            {/* Counter */}
            <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 14, color: "#6B7280", flexShrink: 0 }}>
              {currentQ + 1}/{totalQ}
            </span>
          </div>
        </div>

        {/* ── Question area — Figma: padding 60px 32px ──────────────────── */}
        <div style={{ flex: 1, padding: "60px 32px 40px", maxWidth: 760 }}>
          {/* Quality Warning banner if user tries to click next without answering */}
          {showWarning && (
            <div
              className="flex items-center animate-none"
              style={{
                padding: "16px 20px",
                background: "#FFFBEB",
                border: "1px solid #FCD34D",
                borderRadius: 12,
                gap: 12,
                marginBottom: 24,
              }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-[#D97706] flex-shrink-0">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 16, color: "#B45309" }}>
                Please select or type an answer to continue.
              </span>
            </div>
          )}

          {/* Question text — Figma: Geist Medium 40px -0.05em */}
          <h2
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 500,
              fontSize: 40,
              lineHeight: "1.3em",
              letterSpacing: "-0.05em",
              color: "#111827",
              marginBottom: 32,
            }}
          >
            {question.text}
          </h2>

          {/* ── Multiple choice ───────────────────────────────────────── */}
          {question.type === "multiple_choice" && question.options && (
            <div className="flex flex-col" style={{ gap: 12 }}>
              {question.options.map((opt) => {
                const selected = answers[question.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className="flex items-center"
                    style={{
                      gap: 16,
                      padding: "20px 24px",
                      background: selected ? "#EDE9FE" : "#FFFFFF",
                      border: `2px solid ${selected ? "#9F4EF5" : "#E5E7EB"}`,
                      borderRadius: 16,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                    }}
                  >
                    {/* Radio */}
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        border: `2px solid ${selected ? "#9F4EF5" : "#D1D5DB"}`,
                        background: selected ? "#9F4EF5" : "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {selected && <div style={{ width: 8, height: 8, background: "#FFFFFF", borderRadius: 4 }} />}
                    </div>
                    <span
                      style={{
                        fontFamily: "Geist, sans-serif",
                        fontWeight: selected ? 500 : 400,
                        fontSize: 18,
                        letterSpacing: "-0.02em",
                        color: selected ? "#9F4EF5" : "#111827",
                      }}
                    >
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Yes / No ──────────────────────────────────────────────── */}
          {question.type === "yes_no" && (
            <div className="flex" style={{ gap: 16 }}>
              {["Yes", "No"].map((opt) => {
                const selected = answers[question.id] === opt;
                const isYes    = opt === "Yes";
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    style={{
                      flex: 1,
                      padding: "24px 0",
                      borderRadius: 16,
                      border: `2px solid ${selected ? (isYes ? "#16A34A" : "#DC2626") : "#E5E7EB"}`,
                      background: selected ? (isYes ? "#DCFCE7" : "#FEE2E2") : "#FFFFFF",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: 24,
                      color: selected ? (isYes ? "#16A34A" : "#DC2626") : "#111827",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Scale ─────────────────────────────────────────────────── */}
          {question.type === "scale" && (
            <div className="flex flex-col" style={{ gap: 16 }}>
              <div className="flex" style={{ gap: 8 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
                  const selected = answers[question.id] === n.toString();
                  return (
                    <button
                      key={n}
                      onClick={() => handleAnswer(n.toString())}
                      style={{
                        flex: 1,
                        height: 52,
                        borderRadius: 12,
                        border: `2px solid ${selected ? "#9F4EF5" : "#E5E7EB"}`,
                        background: selected ? "#9F4EF5" : "#FFFFFF",
                        fontFamily: "Geist, sans-serif",
                        fontWeight: 600,
                        fontSize: 16,
                        color: selected ? "#FFFFFF" : "#111827",
                        cursor: "pointer",
                      }}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between">
                <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 13, color: "#6B7280" }}>Not at all</span>
                <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 13, color: "#6B7280" }}>Extremely</span>
              </div>
            </div>
          )}

          {/* ── Short text ────────────────────────────────────────────── */}
          {question.type === "short_text" && (
            <textarea
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here..."
              style={{
                width: "100%",
                border: "2px solid #E5E7EB",
                borderRadius: 16,
                padding: 20,
                fontFamily: "Geist, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                color: "#111827",
                outline: "none",
                resize: "none",
                minHeight: 160,
                background: "#FFFFFF",
                lineHeight: "1.6em",
              }}
            />
          )}
        </div>

        {/* ── Bottom nav — Figma: full width, purple "Next Question" btn ─ */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "#FEFEFE",
            borderTop: "1px solid #E5E7EB",
            padding: "20px 32px",
          }}
        >
          <div className="flex items-center justify-between" style={{ gap: 16 }}>
            {/* Previous button: 60x60 rounded-12 secondary */}
            <button
              onClick={() => currentQ === 0 ? setShowExitModal(true) : setCurrentQ((q) => q - 1)}
              className="flex items-center justify-center"
              style={{
                width: 60,
                height: 60,
                background: "#F8F9FC",
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={22} className="text-[#111827]" />
            </button>

            {/* Next / Submit button — Clickable to trigger warning banner */}
            <button
              onClick={handleNext}
              className="flex items-center justify-center"
              style={{
                flex: 1,
                height: 60,
                background: "#9F4EF5",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                gap: 10,
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: 18,
                color: "#FFFFFF",
              }}
            >
              {isLast ? "Submit Survey" : "Next Question"}
              <HugeiconsIcon icon={ArrowRight01Icon} size={22} />
            </button>
          </div>
        </div>

        {/* ── Exit Confirmation Modal (Figma 587:1126) ─────────────────── */}
        {showExitModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center animate-none"
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
              {/* Warning/exit logo circle */}
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 60,
                  height: 60,
                  background: "#FFDFDF",
                  borderRadius: 12,
                }}
              >
                {/* Exit Warning SVG */}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-[#DC2626]">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Text */}
              <div className="flex flex-col items-center" style={{ gap: 12, textAlign: "center" }}>
                <h3 style={{ fontFamily: "Geist, sans-serif", fontWeight: 600, fontSize: 24, color: "#111827" }}>
                  Leave this survey?
                </h3>
                <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 16, color: "#6B7280", maxWidth: 436, lineHeight: "1.5em" }}>
                  Your progress won't be saved and you won't earn the reward. Are you sure you want to leave?
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-center" style={{ gap: 12, width: "100%" }}>
                <button
                  onClick={() => setShowExitModal(false)}
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
                  Stay
                </button>
                <button
                  onClick={() => router.push("/earner/surveys")}
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
                  Leave anyway
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Done ─────────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: "100vh", background: "#FEFEFE", padding: "0 32px" }}
    >
      <div className="flex flex-col items-center" style={{ maxWidth: 480, gap: 24, textAlign: "center" }}>
        {/* Success icon */}
        <div
          className="flex items-center justify-center"
          style={{ width: 112, height: 112, background: "#DCFCE7", borderRadius: 56, border: "1.5px solid #16A34A" }}
        >
          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={56} className="text-[#16A34A]" />
        </div>

        <div className="flex flex-col" style={{ gap: 8 }}>
          <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 32, letterSpacing: "-0.03em", color: "#111827" }}>
            Survey Submitted!
          </h1>
          <p style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 18, color: "#6B7280" }}>
            Thank you for your honest feedback. Your reward has been added to your wallet.
          </p>
        </div>

        {/* Reward card */}
        <div
          className="flex items-center justify-between"
          style={{ width: "100%", background: "#EDE9FE", borderRadius: 16, padding: 24 }}
        >
          <div className="flex flex-col" style={{ gap: 4 }}>
            <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 500, fontSize: 18, color: "#9F4EF5" }}>Reward Earned</span>
            <span style={{ fontFamily: "Geist, sans-serif", fontWeight: 400, fontSize: 14, color: "#6B7280" }}>Added to your wallet</span>
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 32, letterSpacing: "-0.03em", color: "#9F4EF5" }}>
            ₦{survey.reward.toLocaleString()}
          </span>
        </div>

        <div className="flex flex-col" style={{ gap: 12, width: "100%" }}>
          <button
            onClick={() => router.push("/earner/surveys")}
            className="flex items-center justify-center"
            style={{ width: "100%", height: 56, background: "#9F4EF5", borderRadius: 12, border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 18, color: "#FFFFFF", gap: 8 }}
          >
            Find More Surveys <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
          </button>
          <button
            onClick={() => router.push("/earner/wallet")}
            style={{ width: "100%", height: 56, background: "#F8F9FC", border: "1px solid #E5E7EB", borderRadius: 12, cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 18, color: "#111827" }}
          >
            View Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
