"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Briefcase01Icon, Calendar03Icon, Tick02Icon, UserIcon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { BackLink, FlowProgress, ghostBtn, primaryBtn } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

const INTERESTS = [
  "Technology", "Health & Fitness", "Fashion & Beauty", "Food & Drink",
  "Travel", "Entertainment", "Finance", "Education",
  "Sport", "Home & Living", "Automotive", "Parenting",
];
const MAX_INTERESTS = 3;

// Two niche questions per interest; only people genuinely in that niche answer them well.
const INTEREST_QUESTIONS: Record<string, string[]> = {
  Technology: ["What type of technology or gadgets are you most interested in right now?", "How do you usually stay updated on tech trends and news?"],
  "Health & Fitness": ["What does your current fitness routine look like?", "Which health or fitness apps do you use, and why?"],
  "Fashion & Beauty": ["What draws you most to fashion?", "Who are some fashion brands or influencers you follow or look up to and why?"],
  "Food & Drink": ["How often do you cook versus order food?", "Which food apps or restaurants do you use most?"],
  Travel: ["Where was your last trip and how did you book it?", "What frustrates you most when planning travel?"],
  Entertainment: ["What kind of movies, shows or celebrities do you enjoy the most and what do you like about them?", "How do you usually discover new entertainment content or stay updated on what's trending?"],
  Finance: ["Which banking or investment apps do you use?", "How do you track your spending each month?"],
  Education: ["What are you currently studying or learning?", "Which learning platforms or resources do you rely on?"],
  Sport: ["Which sports do you follow or play?", "How do you keep up with fixtures and results?"],
  "Home & Living": ["What was the last thing you bought for your home?", "Where do you look for home ideas and inspiration?"],
  Automotive: ["What car do you drive or want to own, and why?", "How do you handle car maintenance and repairs?"],
  Parenting: ["How old are your children?", "Which products or services make parenting easier for you?"],
};

const GENDERS = ["Female", "Male", "Prefer not to say"];
const OCCUPATIONS = ["Student", "Employed", "Self-employed", "Business owner", "Unemployed", "Retired"];

function SelectField({ label, icon, value, onChange, options, placeholder, type = "select" }: {
  label: string;
  icon: typeof UserIcon;
  value: string;
  onChange: (v: string) => void;
  options?: string[];
  placeholder: string;
  type?: "select" | "text" | "month";
}) {
  const base = "h-12 w-full appearance-none rounded-xl bg-[#F8F9FC] pl-12 pr-10 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30";
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[14px] text-[#111827]">{label}</span>
      <span className="relative">
        <HugeiconsIcon icon={icon} size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
        {type === "select" ? (
          <>
            <select value={value} onChange={(e) => onChange(e.target.value)} className={cn(base, !value && "text-[#9CA3AF]")}>
              <option value="" disabled>{placeholder}</option>
              {options?.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <HugeiconsIcon icon={ArrowDown01Icon} size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          </>
        ) : (
          <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={base} />
        )}
      </span>
    </label>
  );
}

export default function EarnerProfileSetup() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name ?? "");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const questions = interests.flatMap((i) => INTEREST_QUESTIONS[i]);
  const toggle = (i: string) =>
    setInterests((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : cur.length < MAX_INTERESTS ? [...cur, i] : cur));

  const finish = async () => {
    setSaving(true);
    await updateProfile({
      name: name.trim(),
      demographics: { gender, occupation, birthMonth, interests, interestAnswers: answers, verifiedTags: [] },
    });
    setStep(4);
  };

  if (step === 4) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[473px] flex-col items-center justify-center px-4 text-center">
        <span className="flex h-[124px] w-[124px] items-center justify-center rounded-full bg-[#E8F8EE]">
          <span className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-[#16A34A]">
            <HugeiconsIcon icon={Tick02Icon} size={44} className="text-white" />
          </span>
        </span>
        <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.03em] text-[#111827]">Profile complete!</h1>
        <p className="mt-2 text-[16px] text-[#6B7280]">Thank you!! Your profile has been set up successfully.</p>
        <div className="mt-6 w-full rounded-[24px] bg-[#E0E7FF] px-5 py-5 text-left">
          <p className="text-[20px] text-[#4F46E5]">What next?</p>
          <p className="mt-2 text-[14px] text-[#111827]">
            You&apos;ll see more relevant surveys, earn rewards for your opinions and get notified when new surveys are available.
          </p>
        </div>
        <Link href="/earner/dashboard" className={cn(primaryBtn, "mt-6 h-[47px] w-full")}>Back to dashboard</Link>
        <Link href="/earner/surveys" className={cn(ghostBtn, "mt-2 h-[47px] w-full")}>Browse surveys now</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[600px] px-4 pb-16 pt-16 sm:pt-28">
      <BackLink label="Back" onClick={() => (step === 1 ? router.push("/earner/dashboard") : setStep(step - 1))} />
      <FlowProgress step={step} />

      {step === 1 && (
        <>
          <h1 className="mt-6 text-center text-[28px] font-semibold tracking-[-0.03em] text-[#111827]">Basic Information</h1>
          <p className="mt-1 text-center text-[14px] text-[#6B7280]">Tell us a little about yourself</p>
          <div className="mt-6 flex flex-col gap-4">
            <SelectField label="Full Name" icon={UserIcon} type="text" value={name} onChange={setName} placeholder="e.g John Doe" />
            <SelectField label="Gender" icon={UserIcon} value={gender} onChange={setGender} options={GENDERS} placeholder="Select your gender" />
            <SelectField label="Occupation" icon={Briefcase01Icon} value={occupation} onChange={setOccupation} options={OCCUPATIONS} placeholder="Select your occupation" />
            <SelectField label="Date of Birth" icon={Calendar03Icon} type="month" value={birthMonth} onChange={setBirthMonth} placeholder="Select your birth month" />
          </div>
          <button
            disabled={!name.trim() || !gender || !occupation || !birthMonth}
            onClick={() => setStep(2)}
            className={cn(primaryBtn, "mt-6 h-[52px] w-full")}
          >
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="mt-6 text-center text-[28px] font-semibold tracking-[-0.03em] text-[#111827]">What are you interested in</h1>
          <p className="mx-auto mt-1 max-w-[340px] text-center text-[14px] text-[#6B7280]">
            Select topics you are very conversant with and care about. Maximum of three topics
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {INTERESTS.map((i) => {
              const on = interests.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  className={cn(
                    "h-10 rounded-xl px-2 text-[14px] transition-colors",
                    on ? "bg-[#4F46E5] text-white" : "bg-[#F8F9FC] text-[#9CA3AF] hover:text-[#6B7280]",
                    !on && interests.length >= MAX_INTERESTS && "cursor-not-allowed opacity-60"
                  )}
                >
                  {i}
                </button>
              );
            })}
          </div>
          <button disabled={interests.length === 0} onClick={() => setStep(3)} className={cn(primaryBtn, "mt-6 h-[52px] w-full")}>
            Continue
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="mt-6 text-center text-[28px] font-semibold tracking-[-0.03em] text-[#111827]">Complete your profile</h1>
          <p className="mt-1 text-center text-[14px] text-[#6B7280]">This helps us match you with the right surveys.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {interests.map((i) => (
              <span key={i} className="rounded-xl bg-[#4F46E5] px-6 py-2 text-[14px] text-white">{i}</span>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-5">
            {questions.map((q) => (
              <label key={q} className="flex flex-col gap-2">
                <span className="text-[14px] text-[#111827]">{q}</span>
                <textarea
                  rows={3}
                  value={answers[q] ?? ""}
                  onChange={(e) => setAnswers({ ...answers, [q]: e.target.value })}
                  placeholder="Type your answer"
                  className="resize-none rounded-xl border border-[#E5E7EB] p-4 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#4F46E5] focus:outline-none"
                />
              </label>
            ))}
          </div>
          <button
            disabled={saving || questions.some((q) => !(answers[q] ?? "").trim())}
            onClick={finish}
            className={cn(primaryBtn, "mt-6 h-[52px] w-full")}
          >
            {saving ? "Saving..." : "Submit"}
          </button>
        </>
      )}
    </div>
  );
}
