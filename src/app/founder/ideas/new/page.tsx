"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useSurveyStore } from "@/store/survey.store";
import { ArrowLeft01Icon, ArrowRight01Icon, Add01Icon, Delete02Icon, Loading02Icon, SparklesIcon, CheckmarkCircle01Icon, UserGroupIcon, Clock01Icon, Dollar01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────
interface IdeaForm {
  // Step 1
  problemStatement: string;
  targetAudience: string;
  solution: string;
  currentAlternatives: string;
  uniqueAdvantage: string;
  pricingPlan: string;
  // Step 2
  questions: { id: string; text: string; type: string }[];
  // Step 3
  audienceCountry: string;
  audienceAgeMin: string;
  audienceAgeMax: string;
  audienceInterests: string[];
  respondentsRequired: number;
  // Step 4
  payoutPerResponse: number;
}

const STEPS = ["Idea Details", "AI Questions", "Audience", "Budget & Launch"];

const DEFAULT_QUESTIONS = [
  { id: "q1", text: "How often do you face this problem?", type: "multiple_choice" },
  { id: "q2", text: "How painful is this problem for you on a scale of 1–10?", type: "scale" },
  { id: "q3", text: "Would you pay for a solution?", type: "yes_no" },
  { id: "q4", text: "What do you currently use to solve this?", type: "short_text" },
  { id: "q5", text: "What would make you switch to a new solution?", type: "short_text" },
];

const INTEREST_OPTIONS = [
  "Technology", "Finance", "Health", "Education", "Food & Beverage",
  "Travel", "E-commerce", "Productivity", "Gaming", "Social Media",
  "Fashion", "Real Estate", "Sports", "Entertainment",
];

// ─── Step indicator ──────────────────────────────────────────────────────────
function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {Array.from({ length: total }, (_, i) => {
        const num = i + 1;
        const isDone = num < step;
        const isActive = num === step;
        return (
          <div key={i} className="flex items-center">
            <div
              className={cn(
                "w-[48px] h-[48px] rounded-full border-2 flex items-center justify-center transition-all text-[20px] font-semibold",
                isDone ? "bg-brand-primary border-brand-primary text-white" :
                isActive ? "bg-[#F8F9FC] border-brand-primary text-text-primary" :
                "bg-[#F8F9FC] border-[#F8F9FC] text-text-secondary"
              )}
            >
              {isDone ? <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20}  /> : num}
            </div>
            {i < total - 1 && (
              <div className={cn("h-px w-16 transition-all", isDone ? "bg-brand-primary" : "bg-[#E5E7EB]")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── TextArea field ──────────────────────────────────────────────────────────
function TextAreaField({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[24px] font-semibold text-text-primary leading-[120%] tracking-[-0.02em]">
        {label}
      </label>
      <div className="bg-white border border-[#E5E7EB] rounded-[20px] p-4 min-h-[120px]">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full min-h-[100px] outline-none resize-none text-body text-text-primary placeholder:text-text-muted bg-transparent"
        />
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function NewIdeaPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { createSurvey, loading } = useSurveyStore();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingDone, setProcessingDone] = useState(false);
  const [form, setForm] = useState<IdeaForm>({
    problemStatement: "",
    targetAudience: "",
    solution: "",
    currentAlternatives: "",
    uniqueAdvantage: "",
    pricingPlan: "",
    questions: DEFAULT_QUESTIONS,
    audienceCountry: "Nigeria",
    audienceAgeMin: "18",
    audienceAgeMax: "45",
    audienceInterests: [],
    respondentsRequired: 50,
    payoutPerResponse: 500,
  });

  const up = <K extends keyof IdeaForm>(k: K, v: IdeaForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleInterest = (i: string) => {
    setForm((f) => ({
      ...f,
      audienceInterests: f.audienceInterests.includes(i)
        ? f.audienceInterests.filter((x) => x !== i)
        : [...f.audienceInterests, i],
    }));
  };

  const addQuestion = () => {
    setForm((f) => ({
      ...f,
      questions: [
        ...f.questions,
        { id: `q${Date.now()}`, text: "", type: "short_text" },
      ],
    }));
  };

  const updateQuestion = (id: string, text: string) => {
    setForm((f) => ({
      ...f,
      questions: f.questions.map((q) => (q.id === id ? { ...q, text } : q)),
    }));
  };

  const removeQuestion = (id: string) => {
    setForm((f) => ({
      ...f,
      questions: f.questions.filter((q) => q.id !== id),
    }));
  };

  const platformFee = form.respondentsRequired * form.payoutPerResponse * 0.15;
  const totalCost = form.respondentsRequired * form.payoutPerResponse + platformFee;

  const handleLaunch = async () => {
    setStep(5);
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 3000));
    setIsProcessing(false);
    setProcessingDone(true);
  };

  const goToDashboard = () => router.push("/founder/ideas");

  // ── Step 5: Processing screen ─────────────────────────────────────────────
  if (step === 5) {
    const stages = [
      "Generating AI survey questions",
      "Matching target audience",
      "Setting up escrow payment",
      "Publishing survey",
    ];
    const doneCount = processingDone ? 4 : 2;

    return (
      <div className="min-h-screen bg-[#FEFEFE] flex flex-col">
        <div className="px-8 py-5 border-b border-[#F3F4F6] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-lg font-semibold text-text-primary">Tiqra</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 max-w-2xl mx-auto w-full">
          {!processingDone ? (
            <>
              <div className="w-24 h-24 rounded-full bg-[#EDE9FE] flex items-center justify-center mb-8">
                <HugeiconsIcon icon={Loading02Icon} size={48} className="text-brand-primary animate-spin"  />
              </div>
              <h1 className="text-[32px] font-semibold text-text-primary text-center mb-2">
                Processing your idea...
              </h1>
              <p className="text-lg text-text-secondary text-center mb-12">
                Our AI is setting everything up for you
              </p>
            </>
          ) : (
            <>
              <div className="w-24 h-24 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-8">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={48} className="text-[#16A34A]"  />
              </div>
              <h1 className="text-[32px] font-semibold text-text-primary text-center mb-2">
                Survey is Live!
              </h1>
              <p className="text-lg text-text-secondary text-center mb-12">
                Your idea is now being validated by real respondents
              </p>
            </>
          )}

          <div className="w-full flex flex-col gap-4 mb-10">
            {stages.map((stage, i) => {
              const done = i < doneCount;
              const active = i === doneCount && !processingDone;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className={cn(
                      "h-3 rounded-full flex-1 transition-all duration-700",
                      done ? "bg-brand-primary" : active ? "bg-[#EDE9FE] relative overflow-hidden" : "bg-[#EDE9FE]"
                    )}
                  >
                    {active && (
                      <div
                        className="absolute inset-y-0 left-0 bg-brand-primary rounded-full animate-pulse"
                        style={{ width: "60%" }}
                      />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-body w-56",
                      done ? "text-text-primary font-medium" : "text-text-secondary"
                    )}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>

          {processingDone && (
            <button onClick={goToDashboard} className="btn-primary px-12">
              View My Ideas <HugeiconsIcon icon={ArrowRight01Icon} size={20}  />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col">
      {/* Top bar with sidebar */}
      <div className="flex flex-col flex-1">
        {/* Back nav */}
        <div className="px-8 pt-8 pb-0">
          <Link href="/founder/ideas" className="inline-flex items-center gap-2 text-body text-text-secondary hover:text-text-primary transition-colors">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20}  />
            Back to ideas
          </Link>
        </div>

        <div className="px-8 py-8 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[32px] font-semibold text-text-primary">New Idea</h1>
            <p className="text-lg text-text-secondary">
              Step {step} Out of {STEPS.length} – {STEPS[step - 1]}
            </p>
          </div>

          <StepIndicator step={step} total={STEPS.length} />

          {/* ── Step 1: Idea Details ── */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <TextAreaField
                label="What problem are you trying to solve?"
                value={form.problemStatement}
                onChange={(v) => up("problemStatement", v)}
                placeholder={"Describe the pain your idea is solving, Be specific - People facing it in simple terms\nHow often and how badly"}
              />
              <TextAreaField
                label="Who is this idea for? (Target01Icon Audience)"
                value={form.targetAudience}
                onChange={(v) => up("targetAudience", v)}
                placeholder="Be specific about who you're building this for (e.g students, small business owners, job seekers etc.)"
              />
              <TextAreaField
                label="What are you building to solve this problem?"
                value={form.solution}
                onChange={(v) => up("solution", v)}
                placeholder="Explain your idea in one or two sentences."
              />
              <TextAreaField
                label="How are people currently solving this problem?"
                value={form.currentAlternatives}
                onChange={(v) => up("currentAlternatives", v)}
                placeholder="Mention tools, apps, or manual methods they use."
              />
              <TextAreaField
                label="Why is your solution better?"
                value={form.uniqueAdvantage}
                onChange={(v) => up("uniqueAdvantage", v)}
                placeholder="What makes your solution stand out?"
              />
              <TextAreaField
                label="Do you plan to charge for this? if yes, How much? (Optional)"
                value={form.pricingPlan}
                onChange={(v) => up("pricingPlan", v)}
                placeholder="Even a rough estimate helps improve accuracy."
              />

              <button
                onClick={() => setStep(2)}
                disabled={!form.problemStatement || !form.solution}
                className="btn-primary w-full justify-center mt-4 disabled:opacity-40"
              >
                Generate AI Questions <HugeiconsIcon icon={SparklesIcon} size={20}  />
              </button>
            </div>
          )}

          {/* ── Step 2: AI Questions ── */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <p className="text-body text-text-secondary">
                  AI generated {form.questions.length} questions. You can edit or add more.
                </p>
                <button className="btn-secondary gap-2">
                  <HugeiconsIcon icon={SparklesIcon} size={18}  /> Regenerate
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {form.questions.map((q, i) => (
                  <div key={q.id} className="flex gap-3 bg-white border border-[#F3F4F6] rounded-2xl p-4">
                    <span className="w-7 h-7 rounded-full bg-[#EDE9FE] flex items-center justify-center text-sm font-semibold text-brand-primary flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <input
                        value={q.text}
                        onChange={(e) => updateQuestion(q.id, e.target.value)}
                        className="w-full text-body text-text-primary outline-none bg-transparent border-b border-transparent focus:border-[#E5E7EB] transition-colors"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <select
                          value={q.type}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              questions: f.questions.map((qq) =>
                                qq.id === q.id ? { ...qq, type: e.target.value } : qq
                              ),
                            }))
                          }
                          className="text-sm text-text-secondary bg-[#F8F9FC] border-none rounded-lg px-2 py-1 outline-none"
                        >
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="scale">Scale (1–10)</option>
                          <option value="yes_no">Yes / No</option>
                          <option value="short_text">Short Text</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => removeQuestion(q.id)}
                      className="text-text-muted hover:text-[#DC2626] transition-colors mt-0.5 flex-shrink-0"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={18}  />
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={addQuestion} className="btn-secondary gap-2">
                <HugeiconsIcon icon={Add01Icon} size={18}  /> Add Question
              </button>

              <div className="flex gap-4 mt-4">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={18}  /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={form.questions.length === 0}
                  className="btn-primary flex-1 justify-center disabled:opacity-40"
                >
                  Next <HugeiconsIcon icon={ArrowRight01Icon} size={20}  />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Audience ── */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="tiqra-label">Country</label>
                <div className="relative">
                  <select
                    value={form.audienceCountry}
                    onChange={(e) => up("audienceCountry", e.target.value)}
                    className="tiqra-input appearance-none pr-10"
                  >
                    <option>Nigeria</option>
                    <option>Ghana</option>
                    <option>Kenya</option>
                    <option>South Africa</option>
                    <option>Egypt</option>
                  </select>
                  <HugeiconsIcon icon={ArrowDown01Icon} size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="tiqra-label">Age Range</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={form.audienceAgeMin}
                    onChange={(e) => up("audienceAgeMin", e.target.value)}
                    className="tiqra-input"
                    placeholder="18"
                  />
                  <span className="text-text-secondary font-medium">to</span>
                  <input
                    type="number"
                    value={form.audienceAgeMax}
                    onChange={(e) => up("audienceAgeMax", e.target.value)}
                    className="tiqra-input"
                    placeholder="45"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="tiqra-label">Interests (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "px-4 py-2 rounded-full border text-body transition-all",
                        form.audienceInterests.includes(interest)
                          ? "bg-brand-primary border-brand-primary text-white"
                          : "bg-white border-[#E5E7EB] text-text-secondary hover:border-brand-primary"
                      )}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="tiqra-label">Number of Respondents</label>
                <div className="flex items-center gap-4">
                  {[25, 50, 100, 200].map((n) => (
                    <button
                      key={n}
                      onClick={() => up("respondentsRequired", n)}
                      className={cn(
                        "flex-1 py-3 rounded-xl border text-lg font-medium transition-all",
                        form.respondentsRequired === n
                          ? "bg-brand-primary border-brand-primary text-white"
                          : "bg-white border-[#E5E7EB] text-text-primary hover:border-brand-primary"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1 justify-center">
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={18}  /> Back
                </button>
                <button onClick={() => setStep(4)} className="btn-primary flex-1 justify-center">
                  Next <HugeiconsIcon icon={ArrowRight01Icon} size={20}  />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Budget & Launch ── */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="tiqra-label">Payout per Response (₦)</label>
                <div className="flex items-center gap-4">
                  {[300, 500, 800, 1000].map((n) => (
                    <button
                      key={n}
                      onClick={() => up("payoutPerResponse", n)}
                      className={cn(
                        "flex-1 py-3 rounded-xl border text-lg font-medium transition-all",
                        form.payoutPerResponse === n
                          ? "bg-brand-primary border-brand-primary text-white"
                          : "bg-white border-[#E5E7EB] text-text-primary hover:border-brand-primary"
                      )}
                    >
                      ₦{n.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="bg-[#F8F9FC] rounded-2xl p-6 flex flex-col gap-4">
                <h3 className="text-[24px] font-semibold text-text-primary">Cost Breakdown</h3>
                {[
                  { label: "Respondents", val: `${form.respondentsRequired}` },
                  { label: "Payout per response", val: `₦${form.payoutPerResponse.toLocaleString()}` },
                  { label: "Respondent pool", val: `₦${(form.respondentsRequired * form.payoutPerResponse).toLocaleString()}` },
                  { label: "Platform fee (15%)", val: `₦${platformFee.toLocaleString()}` },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between text-body">
                    <span className="text-text-secondary">{label}</span>
                    <span className="text-text-primary font-medium">{val}</span>
                  </div>
                ))}
                <div className="h-px bg-[#E5E7EB]" />
                <div className="flex justify-between">
                  <span className="text-[24px] font-semibold text-text-primary">Total</span>
                  <span className="text-[24px] font-semibold text-brand-primary">
                    ₦{totalCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white border border-[#F3F4F6] rounded-2xl p-5 flex flex-col gap-3">
                <h3 className="text-body font-semibold text-text-primary">Survey Summary</h3>
                <div className="flex gap-6 text-sm text-text-secondary">
                  <span className="flex items-center gap-1"><HugeiconsIcon icon={UserGroupIcon} size={14}  /> {form.respondentsRequired} respondents</span>
                  <span className="flex items-center gap-1"><HugeiconsIcon icon={Clock01Icon} size={14}  /> ~{form.questions.length * 1} mins est.</span>
                  <span className="flex items-center gap-1"><HugeiconsIcon icon={Dollar01Icon} size={14}  /> ₦{form.payoutPerResponse.toLocaleString()} each</span>
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <button onClick={() => setStep(3)} className="btn-secondary flex-1 justify-center">
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={18}  /> Back
                </button>
                <button
                  onClick={handleLaunch}
                  disabled={loading}
                  className="btn-primary flex-1 justify-center disabled:opacity-40"
                >
                  {loading ? <HugeiconsIcon icon={Loading02Icon} size={20} className="animate-spin"  /> : <>Launch Survey <HugeiconsIcon icon={ArrowRight01Icon} size={20}  /></>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
