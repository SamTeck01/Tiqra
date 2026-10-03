"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, Mic01Icon, StopIcon } from "@hugeicons/core-free-icons";
import { useSurveyStore } from "@/store/survey.store";
import Modal, { LoadingModal } from "@/components/ui/Modal";
import { BackLink, ghostBtn, outlineBtn, primaryBtn } from "@/components/ui/Primitives";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

// Minimal typing for the browser Web Speech API (not in lib.dom for all targets).
type Recognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
};

function getRecognition(): Recognition | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

const WAVE = [10, 18, 12, 24, 14, 28, 16, 22, 12, 26, 14, 20, 10, 18, 12];

export default function VoiceIntakePage() {
  const router = useRouter();
  const { setDraftField, resetDraft } = useSurveyStore();
  const [listening, setListening] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [understanding, setUnderstanding] = useState(false);
  const [confirmManual, setConfirmManual] = useState(false);
  const recRef = useRef<Recognition | null>(null);

  useEffect(() => {
    if (!listening) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [listening]);

  useEffect(() => () => recRef.current?.stop(), []);

  const start = () => {
    resetDraft();
    setSeconds(0);
    setListening(true);
    const rec = getRecognition();
    if (!rec) return; // No speech support: the founder types into the box instead.
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-NG";
    rec.onresult = (e) => {
      const text = Array.from(e.results, (r) => r[0].transcript).join(" ");
      setTranscript(text);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
  };

  const stop = async () => {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
    if (!transcript.trim()) return;
    setUnderstanding(true);
    const intake = await api("structureIdea", { transcript });
    setDraftField("source", "voice");
    setDraftField("intake", intake);
    router.push("/founder/ideas/new/review");
  };

  const goManual = () => {
    recRef.current?.stop();
    resetDraft();
    router.push("/founder/ideas/new/manual");
  };

  const timer = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-col pt-8">
      <div className="flex items-center justify-between">
        <BackLink href="/founder/ideas" label="Back" />
        <button
          onClick={() => (transcript.trim() ? setConfirmManual(true) : goManual())}
          className={cn(outlineBtn, "h-12 border-[#E5E7EB] px-12")}
        >
          Create Manually
        </button>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-[680px] flex-col items-center text-center">
        <p className="text-[18px] tracking-[-0.02em] text-[#111827]">{listening ? "Listening..." : "Describe your idea"}</p>

        <div
          className={cn(
            "mt-5 flex items-center justify-center rounded-full transition-all",
            listening ? "h-[140px] w-[140px] bg-[#E0E7FF] p-4" : "h-[90px] w-[90px]"
          )}
        >
          <div className={cn("flex h-full w-full items-center justify-center rounded-full", listening && "bg-[#A5B4FC] p-4")}>
            <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-b from-[#4F46E5] to-[#3B2FB8]">
              <HugeiconsIcon icon={Mic01Icon} size={28} className="text-white" />
            </span>
          </div>
        </div>

        {listening ? (
          <>
            <p className="mt-6 text-[24px] font-medium text-[#111827]">{timer}</p>
            <div className="mt-3 flex h-8 items-center gap-1" aria-hidden>
              {WAVE.map((h, i) => (
                <span key={i} className="w-[3px] animate-pulse rounded-full bg-[#4F46E5]" style={{ height: h, animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-[24px] font-medium tracking-[-0.02em] text-[#111827]">Voice Post</p>
            <p className="mt-1 text-[16px] text-[#6B7280]">Speak naturally — AI extracts every detail for you.</p>
          </>
        )}

        <label className={cn("w-full rounded-2xl bg-[#F8F9FC] p-4 text-left", listening ? "mt-6" : "mt-16")}>
          {!listening && <span className="text-[12px] text-[#111827]">Try saying</span>}
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={listening ? 3 : 1}
            placeholder="I want to validate my idea on food shopping app"
            className="mt-1 w-full resize-none bg-transparent text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
          />
        </label>

        {listening ? (
          <button onClick={stop} className={cn(primaryBtn, "mt-5 h-12 w-full max-w-[400px] bg-[#111827] hover:bg-black")}>
            <HugeiconsIcon icon={StopIcon} size={16} /> Stop Recording
          </button>
        ) : transcript.trim() ? (
          <button onClick={stop} className={cn(primaryBtn, "mt-5 h-12 w-full max-w-[400px]")}>
            Continue
          </button>
        ) : (
          <button onClick={start} className={cn(primaryBtn, "mt-5 h-12 w-full max-w-[400px]")}>
            Start Speaking
          </button>
        )}
      </div>

      <LoadingModal open={understanding} title="Understanding your Idea" subtitle="Turn your thoughts into a clear idea description" />

      <Modal open={confirmManual} onClose={() => setConfirmManual(false)} className="max-w-[590px] px-12 py-12 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#FEF3E2]">
          <HugeiconsIcon icon={Alert02Icon} size={26} color="#F59E0B" />
        </span>
        <p className="mt-5 text-[24px] font-medium tracking-[-0.02em] text-[#111827]">Create manually?</p>
        <p className="mt-2 text-[14px] text-[#6B7280]">
          Your current entries won&apos;t be transferred to the manual flow.
          <br />
          You&apos;ll start the manual creation process from the beginning.
        </p>
        <div className="mt-6 grid grid-cols-[0.5fr_1fr] gap-2">
          <button onClick={() => setConfirmManual(false)} className={cn(ghostBtn, "h-[52px]")}>Cancel</button>
          <button onClick={goManual} className={cn(primaryBtn, "h-[52px]")}>Continue Manually</button>
        </div>
      </Modal>
    </div>
  );
}
