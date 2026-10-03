"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, ArrowLeft02Icon, ArrowRight02Icon, Cancel01Icon, HelpCircleIcon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { useEarnerStore } from "@/store/earner.store";
import { useSurvey } from "@/components/shared/useSurvey";
import Modal from "@/components/ui/Modal";
import { ghostBtn, primaryBtn } from "@/components/ui/Primitives";
import { AnswerValue, Flag, MAX_STRIKES, checkAnswer, isStrike } from "@/lib/truthLayer";
import { Answer, Question } from "@/lib/types";
import { cn } from "@/lib/utils";

function Choice({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex h-[54px] w-full items-center gap-4 rounded-xl border px-4 text-left text-[16px] text-[#111827] transition-colors",
        selected ? "border-[#4F46E5] bg-[#EEF2FF]" : "border-[#E5E7EB] hover:bg-[#F8F9FC]"
      )}
    >
      <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border", selected ? "border-[#4F46E5]" : "border-[#D1D5DB]")}>
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#4F46E5]" />}
      </span>
      {label}
    </button>
  );
}

function AnswerInput({ q, value, onChange }: { q: Question; value: AnswerValue; onChange: (v: AnswerValue) => void }) {
  if (q.type === "short_text") {
    return (
      <textarea
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        placeholder="Share your thoughts..."
        className="w-full resize-none rounded-xl border border-[#E5E7EB] p-4 text-[16px] text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#4F46E5] focus:outline-none"
      />
    );
  }
  if (q.type === "scale") {
    return (
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              "h-[54px] rounded-xl border text-[16px] text-[#111827]",
              value === n ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]" : "border-[#E5E7EB] hover:bg-[#F8F9FC]"
            )}
          >
            {n}
          </button>
        ))}
      </div>
    );
  }
  const options = q.type === "yes_no" ? ["Yes", "No"] : q.options ?? [];
  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => (
        <Choice key={o} label={o} selected={value === o} onSelect={() => onChange(o)} />
      ))}
    </div>
  );
}

export default function AnswerSurveyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { submitResponse } = useEarnerStore();
  const { survey } = useSurvey(id);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [times, setTimes] = useState<Record<string, number>>({});
  const [flag, setFlag] = useState<Flag | null>(null);
  const [strikes, setStrikes] = useState(0);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const shownAt = useRef(Date.now());
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (user && !user.demographics) router.replace("/earner/profile");
  }, [user, router]);

  useEffect(() => {
    shownAt.current = Date.now();
  }, [index]);

  if (!survey) return <div className="skeleton mx-auto mt-24 h-[400px] max-w-[600px]" />;

  const qs = survey.questions;
  const q = qs[index];
  const isLast = index === qs.length - 1;
  const excluded = strikes >= MAX_STRIKES;

  const next = () => {
    const elapsed = (times[q.id] ?? 0) + (Date.now() - shownAt.current);
    const found = checkAnswer(q, answers[q.id], elapsed);
    setTimes({ ...times, [q.id]: elapsed });
    if (found) {
      setFlag(found);
      if (isStrike(found)) {
        setStrikes((s) => s + 1);
        // The suspected answer has to be redone.
        setAnswers({ ...answers, [q.id]: undefined });
      }
      shownAt.current = Date.now();
      return;
    }
    setFlag(null);
    if (isLast) setConfirmSubmit(true);
    else setIndex(index + 1);
  };

  const submit = async () => {
    if (!user) return;
    setSubmitting(true);
    const list: Answer[] = qs.map((x) => ({ questionId: x.id, value: answers[x.id] as string | number, timeTaken: Math.round((times[x.id] ?? 0) / 1000) }));
    await submitResponse(user.$id, survey, list, Math.round((Date.now() - startedAt.current) / 1000));
    router.replace(`/earner/surveys/${id}/done`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[#E5E7EB] px-4 pb-4 pt-6">
        <div className="mx-auto max-w-[920px]">
          <div className="flex items-center justify-between">
            <h1 className="text-[22px] font-medium tracking-[-0.02em] text-[#111827] sm:text-[28px]">{survey.title}</h1>
            <button
              aria-label="Leave survey"
              onClick={() => setConfirmLeave(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#111827] hover:bg-[#F8F9FC]"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={20} />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EEF2FF]">
              <div className="h-full rounded-full bg-[#4F46E5] transition-all" style={{ width: `${((index + 1) / qs.length) * 100}%` }} />
            </div>
            <span className="text-[12px] text-[#111827]">{index + 1}/{qs.length}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[920px] px-4 pt-12 sm:px-2">
        {excluded ? (
          <div className="mx-auto max-w-[520px] rounded-[24px] bg-[#FEF2F2] p-8 text-center">
            <p className="text-[20px] font-medium text-[#111827]">Response not accepted</p>
            <p className="mt-2 text-[14px] text-[#6B7280]">
              Too many answers were flagged by our quality checks, so this response can&apos;t be paid. Careful, honest answers raise your reliability score and unlock more surveys.
            </p>
            <button onClick={() => router.replace("/earner/surveys")} className={cn(primaryBtn, "mt-6 h-12 w-full")}>
              Browse other surveys
            </button>
          </div>
        ) : (
          <>
            <p className="text-[18px] tracking-[-0.02em] text-[#111827] sm:text-[20px]">{q.text}</p>
            <div className="mt-5">
              <AnswerInput
                q={q}
                value={answers[q.id]}
                onChange={(v) => {
                  setAnswers({ ...answers, [q.id]: v });
                  if (flag?.kind === "missing") setFlag(null);
                }}
              />
            </div>

            {flag && (
              <p className="mt-4 flex items-center gap-3 rounded-xl bg-[#FEF3E2] px-4 py-3 text-[14px] text-[#F59E0B]">
                <HugeiconsIcon icon={Alert02Icon} size={20} /> {flag.message}
              </p>
            )}

            <div className="mt-5 flex gap-4">
              <button
                aria-label="Previous question"
                disabled={index === 0}
                onClick={() => {
                  setFlag(null);
                  setIndex(index - 1);
                }}
                className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-xl bg-[#F8F9FC] text-[#111827] disabled:text-[#C7D2FE]"
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={22} />
              </button>
              <button onClick={next} className={cn(primaryBtn, "h-[52px] flex-1")}>
                {isLast ? "Submit survey" : "Next Question"} <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
              </button>
            </div>
          </>
        )}
      </div>

      <Modal open={confirmLeave} onClose={() => setConfirmLeave(false)} className="max-w-[460px] px-6 py-8 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF3E2]">
          <HugeiconsIcon icon={Alert02Icon} size={22} color="#F59E0B" />
        </span>
        <p className="mt-4 text-[20px] text-[#111827]">Leave this survey?</p>
        <p className="mt-1 text-[13px] text-[#6B7280]">
          Your progress won&apos;t be saved and you won&apos;t earn the reward. Are you sure you want to leave?
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={() => setConfirmLeave(false)} className={cn(ghostBtn, "h-11")}>Stay</button>
          <button onClick={() => router.replace("/earner/surveys")} className={cn(primaryBtn, "h-11 bg-[#DC2626] hover:bg-[#B91C1C]")}>
            Leave anyway
          </button>
        </div>
      </Modal>

      <Modal open={confirmSubmit} onClose={() => !submitting && setConfirmSubmit(false)} className="max-w-[460px] px-6 py-8 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF]">
          <HugeiconsIcon icon={HelpCircleIcon} size={22} className="text-[#4F46E5]" />
        </span>
        <p className="mt-4 text-[20px] text-[#111827]">Submit your survey?</p>
        <p className="mt-1 text-[13px] text-[#6B7280]">
          Once you submit, your answers will be sent and you won&apos;t be able to make any changes.
        </p>
        <div className="mt-5 grid grid-cols-[0.6fr_1fr] gap-2">
          <button disabled={submitting} onClick={() => setConfirmSubmit(false)} className={cn(ghostBtn, "h-11")}>Cancel</button>
          <button disabled={submitting} onClick={submit} className={cn(primaryBtn, "h-11")}>
            {submitting ? "Submitting..." : "Yes, submit"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
