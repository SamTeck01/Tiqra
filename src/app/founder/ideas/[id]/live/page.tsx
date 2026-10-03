"use client";

import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Activity01Icon, Comment01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useSurveyData } from "@/components/founder/useSurveyData";
import { BackLink, Bar, Ring } from "@/components/ui/Primitives";

const tone = (score: number) => (score >= 70 ? "#16A34A" : score >= 50 ? "#F59E0B" : "#DC2626");
const barTone = (score: number) => (score >= 70 ? "#4F46E5" : score >= 50 ? "#F59E0B" : "#DC2626");

function ago(iso: string) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;
  return `${Math.round(hrs / 24)} days ago`;
}

function fmtSeconds(s: number) {
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}

export default function LiveTrackPage() {
  const { id } = useParams<{ id: string }>();
  const { data, error } = useSurveyData("surveyAnalytics", id);

  if (error) return <p className="mt-14 rounded-2xl bg-[#FEF2F2] p-6 text-[#DC2626]">{error}</p>;
  if (!data) return <div className="skeleton mt-14 h-[600px]" />;
  const { survey, analytics: a } = data;

  const started = new Date(survey.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const level = a.confidence >= 65 ? "High" : a.confidence >= 45 ? "Medium" : "Low";
  const sentiments = a.questions.filter((q) => q.sentiment !== null);
  const insight = a.validResponses ? a.insights[0] ?? "Collecting responses…" : "Insights appear once responses come in.";

  return (
    <div className="flex flex-col pt-10">
      <BackLink href="/founder/ideas" />

      <div className="mt-10 flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4F46E5] px-4 py-1 text-[12px] text-[#4F46E5]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" /> {survey.status === "live" ? "Live" : "Completed"}
        </span>
        <span className="text-[14px] text-[#6B7280]">Updates as responses come in</span>
      </div>
      <h1 className="mt-3 text-[20px] tracking-[-0.02em] text-[#111827]">{survey.title}</h1>
      <p className="text-[14px] text-[#6B7280]">Real-time validation in progress . Started {started}</p>

      <div className="mt-6 flex items-center justify-between text-[14px]">
        <span className="text-[#6B7280]">
          Validation in progress · {survey.respondentsCompleted}/{survey.respondentsRequired} verified
        </span>
        <span className="text-[#4F46E5]">{a.progress}% complete</span>
      </div>
      <Bar value={a.progress} className="mt-2 h-3" />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col items-center rounded-[24px] border border-[#E5E7EB] p-6">
          <p className="text-[14px] uppercase text-[#6B7280]">Confidence score</p>
          <Ring value={a.confidence} size={170} stroke={14} color="#4F46E5" track="#EEF2FF">
            <p className="text-[28px] font-semibold text-[#111827]">{a.confidence}%</p>
            <p className="text-[14px]" style={{ color: tone(a.confidence) }}>{level}</p>
          </Ring>
          <p className="mt-3 text-[12px] text-[#6B7280]">Score updates as more responses are collected</p>
        </div>
        <div className="h-[260px] rounded-[24px] border border-[#E5E7EB] p-4">
          <p className="mb-1 text-[12px] text-[#6B7280]">Verified responses over time (hours since launch)</p>
          <ResponsiveContainer width="100%" height="92%">
            <LineChart data={a.timeline} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid stroke="#F3F4F6" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis domain={[0, survey.respondentsRequired]} tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Line dataKey="responses" stroke="#4F46E5" strokeWidth={1.5} dot={{ r: 3, fill: "white" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-2xl bg-[#E0E7FF] p-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#4F46E5]">
              <HugeiconsIcon icon={SparklesIcon} size={20} className="text-white" />
            </span>
            <div>
              <p className="text-[18px] tracking-[-0.02em] text-[#111827]">Insights</p>
              <p className="text-[14px] text-[#111827]">{insight}</p>
            </div>
          </div>
          <div className="rounded-2xl p-6 shadow-[0_4px_24px_rgba(17,24,39,0.06)]">
            <p className="text-[16px] text-[#111827]">Session Stats</p>
            {[
              ["Avg completion time", fmtSeconds(a.session.avgSeconds)],
              ["Questions answered (Avg)", `${a.session.answeredAvg}/${a.session.questionCount}`],
              ["Flagged by Truth Layer", `${a.session.dropOff}%`],
              ["Response quality", `${a.session.quality}/100`],
            ].map(([k, v]) => (
              <div key={k} className="mt-5 flex items-center justify-between">
                <span className="max-w-[140px] text-[13px] text-[#6B7280]">{k}</span>
                <span className="text-[16px] text-[#111827]">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-4 shadow-[0_4px_24px_rgba(17,24,39,0.06)]">
          <p className="flex items-center gap-2 text-[16px] text-[#111827]">
            <HugeiconsIcon icon={Comment01Icon} size={20} className="text-[#4F46E5]" /> Question sentiments
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {sentiments.length === 0 && <p className="text-[13px] text-[#6B7280]">No responses yet.</p>}
            {sentiments.map((q, i) => (
              <div key={q.question.id} className="flex gap-2">
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-[#E0E7FF] text-[10px] text-[#4F46E5]">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between gap-2 text-[13px]">
                    <span className="text-[#111827]">{q.question.text}</span>
                    <span style={{ color: tone(q.sentiment!) }}>{q.sentiment}%</span>
                  </div>
                  <Bar value={q.sentiment!} color={barTone(q.sentiment!)} track="#EEF2FF" className="mt-1 h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[24px] border border-[#E5E7EB] p-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <p className="flex items-center gap-2 text-[20px] tracking-[-0.02em] text-[#111827]">
            <HugeiconsIcon icon={Activity01Icon} size={22} className="text-[#4F46E5]" /> Recent Activity
          </p>
          {survey.status === "live" && (
            <span className="flex items-center gap-2 text-[14px] text-[#4F46E5]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" /> Waiting for responses
            </span>
          )}
        </div>
        {a.recent.length === 0 && <p className="py-6 text-center text-[14px] text-[#6B7280]">No verified responses yet.</p>}
        {a.recent.map((r, i) => (
          <div key={r.id} className="flex items-center gap-3 border-b border-[#F3F4F6] py-4 last:border-0">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#4F46E5] text-[16px] text-white">R{a.validResponses - i}</span>
            <div className="flex-1">
              <p className="text-[16px] text-[#111827]">Verified respondent</p>
              <p className="text-[12px] text-[#6B7280]">Answered {r.answered} questions</p>
            </div>
            <div className="text-right">
              <span className="rounded-full px-3 py-1 text-[14px]" style={{ color: tone(r.score), background: r.score >= 70 ? "#DCFCE7" : "#FEF3C7" }}>{r.score}%</span>
              <p className="mt-1 text-[12px] text-[#6B7280]">{ago(r.completedAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
