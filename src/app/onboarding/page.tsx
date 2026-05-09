"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    id: 1,
    badge: "Idea Validation",
    heading: "Turn your idea into\nreal market truth",
    subheading:
      "Submit your startup concept and get AI-powered validation backed by real human responses — not guesswork.",
    illustration: "founder",
  },
  {
    id: 2,
    badge: "For Earners",
    heading: "Answer surveys.\nEarn real money.",
    subheading:
      "Complete targeted surveys from vetted startups, share your honest opinion, and get paid directly to your wallet.",
    illustration: "earner",
  },
  {
    id: 3,
    badge: "AI Truth-Layer",
    heading: "Data you can\nactually trust",
    subheading:
      "Our AI detects low-quality responses and gives you a GO, PIVOT, or KILL verdict — so you make decisions with confidence.",
    illustration: "ai",
  },
];

function FounderIllustration() {
  return (
    <svg width="280" height="260" viewBox="0 0 280 260" fill="none" className="mx-auto">
      <circle cx="140" cy="130" r="100" fill="#EDE9FE" />
      <rect x="80" y="80" width="120" height="100" rx="16" fill="white" />
      <rect x="95" y="100" width="80" height="10" rx="4" fill="#EDE9FE" />
      <rect x="95" y="118" width="60" height="8" rx="4" fill="#F3F4F6" />
      <rect x="95" y="134" width="70" height="8" rx="4" fill="#F3F4F6" />
      <rect x="95" y="152" width="50" height="14" rx="6" fill="#9F4EF5" />
      <circle cx="195" cy="85" r="18" fill="#9F4EF5" />
      <path d="M187 85l5 5 9-9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EarnerIllustration() {
  return (
    <svg width="280" height="260" viewBox="0 0 280 260" fill="none" className="mx-auto">
      <circle cx="140" cy="130" r="100" fill="#DCFCE7" />
      <rect x="75" y="75" width="130" height="110" rx="16" fill="white" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="90" y={95 + i * 22} width="12" height="12" rx="3" fill={i < 2 ? "#9F4EF5" : "#E5E7EB"} />
          <rect x="110" y={97 + i * 22} width="70" height="8" rx="3" fill={i < 2 ? "#EDE9FE" : "#F3F4F6"} />
        </g>
      ))}
      <rect x="90" y="163" width="100" height="14" rx="6" fill="#16A34A" />
      <path d="M88 163h4v14h-4z" fill="#16A34A" rx="2" />
      <circle cx="200" cy="80" r="22" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
      <text x="194" y="86" fill="#16A34A" fontSize="14" fontWeight="bold">₦</text>
    </svg>
  );
}

function AIIllustration() {
  return (
    <svg width="280" height="260" viewBox="0 0 280 260" fill="none" className="mx-auto">
      <circle cx="140" cy="130" r="100" fill="#FEF3C7" />
      <rect x="80" y="90" width="120" height="80" rx="16" fill="white" />
      <rect x="95" y="108" width="90" height="10" rx="4" fill="#EDE9FE" />
      <rect x="95" y="125" width="70" height="8" rx="4" fill="#F3F4F6" />
      <rect x="95" y="140" width="80" height="8" rx="4" fill="#F3F4F6" />
      <circle cx="200" cy="90" r="28" fill="#9F4EF5" />
      <path d="M190 90h6M196 90l-4-4M196 90l-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="205" cy="83" r="3" fill="white" />
      <text x="84" y="195" fill="#9F4EF5" fontSize="12" fontWeight="600">GO</text>
      <text x="120" y="195" fill="#D97706" fontSize="12" fontWeight="600">PIVOT</text>
      <text x="170" y="195" fill="#DC2626" fontSize="12" fontWeight="600">KILL</text>
    </svg>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [slide, setSlide] = useState(0);

  const current = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  const next = () => {
    if (isLast) {
      router.push("/auth/register");
    } else {
      setSlide((s) => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col items-center justify-between px-8 py-12 max-w-lg mx-auto">
      {/* Skip */}
      <div className="w-full flex justify-end">
        <button
          onClick={() => router.push("/auth/login")}
          className="text-body text-text-secondary hover:text-text-primary transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="flex flex-col items-center gap-8 w-full">
          {current.id === 1 && <FounderIllustration />}
          {current.id === 2 && <EarnerIllustration />}
          {current.id === 3 && <AIIllustration />}

          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-sm bg-[#EDE9FE] text-brand-primary px-4 py-1.5 rounded-full font-medium">
              {current.badge}
            </span>
            <h1 className="text-[32px] font-bold text-text-primary leading-tight whitespace-pre-line">
              {current.heading}
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed max-w-sm">
              {current.subheading}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="w-full flex flex-col items-center gap-8">
        {/* Dots */}
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === slide ? "w-8 bg-brand-primary" : "w-2 bg-[#E5E7EB]"
              )}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="w-full flex flex-col gap-3">
          <button onClick={next} className="btn-primary w-full justify-center text-lg py-4">
            {isLast ? "Get Started" : "Next"}
            <HugeiconsIcon icon={ArrowRight01Icon} size={22}  />
          </button>
          {isLast && (
            <button
              onClick={() => router.push("/auth/login")}
              className="btn-secondary w-full justify-center text-lg py-4"
            >
              I already have an account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
