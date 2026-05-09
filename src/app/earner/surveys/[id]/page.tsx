"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Clock, Users, DollarSign,
  ChevronRight, CheckCircle2, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const SURVEY_DATA: Record<string, {
  id: string; title: string; description: string; reward: number;
  duration: string; category: string; questions: {
    id: string; text: string; type: string; options?: string[];
  }[];
}> = {
  s1: {
    id: "s1", title: "AI powered Resume builder", description: "Help us understand how job seekers currently build and manage their CVs, and what they'd want from an AI-powered resume tool.",
    reward: 500, duration: "2 mins", category: "Tech",
    questions: [
      { id: "q1", text: "How often do you update your resume?", type: "multiple_choice", options: ["Monthly", "Quarterly", "When job hunting", "Rarely"] },
      { id: "q2", text: "How frustrating is building a resume from scratch? (1=Not at all, 10=Very frustrating)", type: "scale" },
      { id: "q3", text: "Would you use an AI tool to auto-generate your resume from your LinkedIn?", type: "yes_no" },
      { id: "q4", text: "What's your biggest pain point with current resume tools?", type: "short_text" },
      { id: "q5", text: "Which format do you most commonly use?", type: "multiple_choice", options: ["PDF", "Word Document", "Google Docs", "Online builder"] },
      { id: "q6", text: "How much would you pay per month for an AI resume assistant?", type: "multiple_choice", options: ["Free only", "₦500–₦1,000", "₦1,000–₦3,000", "₦3,000+"] },
      { id: "q7", text: "What features matter most?", type: "short_text" },
      { id: "q8", text: "Would you recommend this to a friend?", type: "yes_no" },
    ],
  },
  s2: {
    id: "s2", title: "Freelancer invoice tools", description: "We're building an invoice management tool for Nigerian freelancers. Your feedback helps shape the product.",
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
  const router = useRouter();
  const survey = SURVEY_DATA[id] || SURVEY_DATA["s1"];

  const [phase, setPhase] = useState<Phase>("preview");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = survey.questions[currentQ];
  const totalQ = survey.questions.length;
  const progress = ((currentQ) / totalQ) * 100;
  const isLast = currentQ === totalQ - 1;

  const handleAnswer = (val: string) => {
    setAnswers((a) => ({ ...a, [question.id]: val }));
  };

  const handleNext = () => {
    if (isLast) {
      setPhase("done");
    } else {
      setCurrentQ((q) => q + 1);
    }
  };

  // ── Preview ─────────────────────────────────────────────────────────────────
  if (phase === "preview") {
    return (
      <div className="ml-[324px] min-h-screen bg-[#FEFEFE]">
        {/* Back bar */}
        <div className="px-8 py-5 border-b border-[#F3F4F6] flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-body text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={20} /> Back to surveys
          </button>
        </div>

        <div className="px-8 py-8 max-w-3xl">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <span className="text-sm bg-[#EDE9FE] text-brand-primary px-3 py-1 rounded-full font-medium">
                {survey.category}
              </span>
              <h1 className="text-[32px] font-semibold text-text-primary mt-3 leading-tight">
                {survey.title}
              </h1>
            </div>
            <div className="bg-brand-primary rounded-2xl px-6 py-4 text-center flex-shrink-0">
              <p className="text-white/70 text-sm">Reward</p>
              <p className="text-[28px] font-bold text-white">₦{survey.reward.toLocaleString()}</p>
            </div>
          </div>

          {/* Survey info cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: Clock, label: "Duration", value: survey.duration },
              { icon: Users, label: "Questions", value: `${totalQ} questions` },
              { icon: DollarSign, label: "Pay type", value: "Instant payout" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-[#F8F9FC] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">{label}</p>
                  <p className="text-body font-medium text-text-primary">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="bg-white border border-[#F3F4F6] rounded-2xl p-6 mb-6">
            <h2 className="text-[24px] font-semibold text-text-primary mb-3">About this survey</h2>
            <p className="text-body text-text-secondary leading-relaxed">{survey.description}</p>
          </div>

          {/* Questions preview */}
          <div className="bg-white border border-[#F3F4F6] rounded-2xl p-6 mb-8">
            <h2 className="text-[24px] font-semibold text-text-primary mb-4">Questions Preview</h2>
            <div className="flex flex-col gap-3">
              {survey.questions.slice(0, 3).map((q, i) => (
                <div key={q.id} className="flex items-center gap-3 text-body text-text-secondary">
                  <span className="w-6 h-6 rounded-full bg-[#EDE9FE] flex items-center justify-center text-xs font-semibold text-brand-primary flex-shrink-0">
                    {i + 1}
                  </span>
                  {q.text}
                </div>
              ))}
              {totalQ > 3 && (
                <p className="text-sm text-text-muted pl-9">+{totalQ - 3} more questions</p>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-4">
            <button onClick={() => router.back()} className="btn-secondary flex-shrink-0">
              Maybe Later
            </button>
            <button
              onClick={() => setPhase("taking")}
              className="btn-primary flex-1 justify-center text-lg"
            >
              Start Survey <ArrowRight size={20} />
            </button>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 mt-4 p-4 bg-[#FEF3C7] rounded-xl">
            <AlertCircle size={16} className="text-[#D97706] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#D97706]">
              Answer honestly. Our AI truth-layer detects low-quality responses. Flagged submissions will not be paid.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Taking survey ────────────────────────────────────────────────────────────
  if (phase === "taking") {
    return (
      <div className="ml-[324px] min-h-screen bg-[#FEFEFE] flex flex-col">
        {/* Progress header */}
        <div className="px-8 py-5 border-b border-[#F3F4F6] bg-[#FEFEFE] sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => currentQ === 0 ? setPhase("preview") : setCurrentQ((q) => q - 1)}
              className="inline-flex items-center gap-2 text-body text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={18} />
              {currentQ === 0 ? "Back" : "Previous"}
            </button>
            <span className="text-sm text-text-secondary font-medium">
              Question {currentQ + 1} of {totalQ}
            </span>
            <span className="text-sm font-semibold text-brand-primary">
              ₦{survey.reward.toLocaleString()}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#EDE9FE] overflow-hidden">
            <div
              className="h-full bg-brand-primary rounded-full transition-all duration-500"
              style={{ width: `${((currentQ + 1) / totalQ) * 100}%` }}
            />
          </div>
        </div>

        {/* Question area */}
        <div className="flex-1 px-8 py-10 max-w-2xl">
          <div className="mb-8">
            <span className="text-sm text-brand-primary font-medium bg-[#EDE9FE] px-3 py-1 rounded-full">
              Question {currentQ + 1}
            </span>
            <h2 className="text-[28px] font-semibold text-text-primary mt-4 leading-tight">
              {question.text}
            </h2>
          </div>

          {/* Multiple choice */}
          {question.type === "multiple_choice" && question.options && (
            <div className="flex flex-col gap-3">
              {question.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                    answers[question.id] === opt
                      ? "border-brand-primary bg-[#EDE9FE]"
                      : "border-[#E5E7EB] bg-white hover:border-brand-primary hover:bg-[#F8F9FC]"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      answers[question.id] === opt
                        ? "border-brand-primary bg-brand-primary"
                        : "border-[#E5E7EB]"
                    )}
                  >
                    {answers[question.id] === opt && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-body",
                      answers[question.id] === opt
                        ? "text-brand-primary font-medium"
                        : "text-text-primary"
                    )}
                  >
                    {opt}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Yes/No */}
          {question.type === "yes_no" && (
            <div className="flex gap-4">
              {["Yes", "No"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className={cn(
                    "flex-1 py-5 rounded-2xl border-2 text-[24px] font-semibold transition-all",
                    answers[question.id] === opt
                      ? opt === "Yes"
                        ? "border-[#16A34A] bg-[#DCFCE7] text-[#16A34A]"
                        : "border-[#DC2626] bg-[#FEE2E2] text-[#DC2626]"
                      : "border-[#E5E7EB] bg-white hover:border-brand-primary text-text-primary"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Scale */}
          {question.type === "scale" && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleAnswer(n.toString())}
                    className={cn(
                      "flex-1 h-12 rounded-xl border-2 font-semibold text-body transition-all",
                      answers[question.id] === n.toString()
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-[#E5E7EB] bg-white hover:border-brand-primary text-text-primary"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Not at all</span>
                <span>Extremely</span>
              </div>
            </div>
          )}

          {/* Short text */}
          {question.type === "short_text" && (
            <textarea
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="tiqra-textarea min-h-[160px]"
            />
          )}
        </div>

        {/* Bottom nav */}
        <div className="px-8 py-6 border-t border-[#F3F4F6] bg-[#FEFEFE] sticky bottom-0">
          <button
            onClick={handleNext}
            disabled={!answers[question.id]}
            className="btn-primary w-full justify-center text-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLast ? "Submit Survey" : "Next Question"}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // ── Done ─────────────────────────────────────────────────────────────────────
  return (
    <div className="ml-[324px] min-h-screen bg-[#FEFEFE] flex flex-col items-center justify-center px-8 py-16">
      <div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
        <div className="w-28 h-28 rounded-full bg-[#DCFCE7] flex items-center justify-center">
          <CheckCircle2 size={56} className="text-[#16A34A]" />
        </div>
        <div>
          <h1 className="text-[32px] font-bold text-text-primary">Survey Submitted!</h1>
          <p className="text-body text-text-secondary mt-2">
            Thank you for your honest feedback. Your reward has been added to your wallet.
          </p>
        </div>

        {/* Reward received */}
        <div className="w-full bg-[#EDE9FE] rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-body text-brand-primary font-medium">Reward Earned</p>
            <p className="text-sm text-text-secondary mt-0.5">Added to your wallet</p>
          </div>
          <span className="text-[32px] font-bold text-brand-primary">₦{survey.reward.toLocaleString()}</span>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => router.push("/earner/surveys")}
            className="btn-primary w-full justify-center"
          >
            Find More Surveys <ArrowRight size={20} />
          </button>
          <button
            onClick={() => router.push("/earner/wallet")}
            className="btn-secondary w-full justify-center"
          >
            View Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
