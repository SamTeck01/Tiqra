"use client";

import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Activity01Icon, Comment01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useSurvey } from "@/components/shared/useSurvey";
import { BackLink, Bar, Ring } from "@/components/ui/Primitives";
import { getLiveStats, levelOf } from "@/lib/reports";

const sentimentColor = (score: number) => (score >= 70 ? "#4F46E5" : score >= 50 ? "#F59E0B" : "#DC2626");
const scorePill = (score: number) =>
  score >= 85 ? { color: "#16A34A", bg: "#DCFCE7" } : { color: "#F59E0B", bg: "#FEF3C7" };

export default function LiveTrackPage() {
  const { id } = useParams<{ id: string }>();
  const { survey } = useSurvey(id);
  const stats = getLiveStats();

  if (!survey) return <div className="skeleton mt-14 h-[600px]" />;

  const pct = survey.respondentsRequired ? Math.round((survey.respondentsCompleted / survey.respondentsRequired) * 100) : 0;
  const started = new Date(survey.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const level = levelOf(stats.confidence);

  return (
    <div className="flex flex-col pt-10">
      <BackLink href="/founder/ideas" />

      <div className="mt-10 flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4F46E5] px-4 py-1 text-[12px] text-[#4F46E5]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" /> Live
        </span>
        <span className="text-[14px] text-[#6B7280]">Updates every few minutes</span>
      </div>
      <h1 className="mt-3 text-[20px] tracking-[-0.02em] text-[#111827]">{survey.title}</h1>
      <p className="text-[14px] text-[#6B7280]">Real-time validation in progress . Started {started}</p>

      <div className="mt-6 flex items-center justify-between text-[14px]">
        <span className="text-[#6B7280]">Validation in progress</span>
        <span className="text-[#4F46E5]">{pct}% complete</span>
      </div>
      <Bar value={pct} className="mt-2 h-3" />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col items-center rounded-[24px] border border-[#E5E7EB] p-6">
          <p className="text-[14px] uppercase text-[#6B7280]">Confidence score</p>
          <Ring value={stats.confidence} size={170} stroke={14} color="#4F46E5" track="#EEF2FF">
            <p className="text-[28px] font-semibold text-[#111827]">{stats.confidence}%</p>
            <p className="text-[14px]" style={{ color: level === "High" ? "#16A34A" : "#F59E0B" }}>{level}</p>
          </Ring>
          <p className="mt-3 text-[12px] text-[#6B7280]">Score updates as more responses are collected</p>
        </div>
        <div className="h-[260px] rounded-[24px] border border-[#E5E7EB] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.timeline} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid stroke="#F3F4F6" />
              <XAxis dataKey="hour" type="number" domain={[0, 72]} ticks={[0, 12, 24, 36, 48, 60, 72]} tick={{ fontSize: 10, fill: "#6B7280" }} />
              <YAxis domain={[0, Math.max(50, survey.respondentsRequired)]} tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Line dataKey="responses" stroke="#4F46E5" strokeWidth={1.5} dot={{ r: 3, fill: "white" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-2xl bg-[#E0E7FF] p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4F46E5]">
              <HugeiconsIcon icon={SparklesIcon} size={20} className="text-white" />
            </span>
            <div>
              <p className="text-[18px] tracking-[-0.02em] text-[#111827]">AI insights</p>
              <p className="text-[14px] text-[#111827]">{stats.insight}</p>
            </div>
          </div>
          <div className="rounded-2xl p-6 shadow-[0_4px_24px_rgba(17,24,39,0.06)]">
            <p className="text-[16px] text-[#111827]">Session Stats</p>
            {stats.session.map((row) => (
              <div key={row.label} className="mt-5 flex items-center justify-between">
                <span className="max-w-[120px] text-[13px] text-[#6B7280]">{row.label}</span>
                <span className="text-[16px] text-[#111827]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-4 shadow-[0_4px_24px_rgba(17,24,39,0.06)]">
          <p className="flex items-center gap-2 text-[16px] text-[#111827]">
            <HugeiconsIcon icon={Comment01Icon} size={20} className="text-[#4F46E5]" /> Question sentiments
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {stats.sentiments.map((q, i) => (
              <div key={q.question} className="flex gap-2">
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded bg-[#E0E7FF] text-[10px] text-[#4F46E5]">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between gap-2 text-[13px]">
                    <span className="text-[#111827]">{q.question}</span>
                    <span style={{ color: q.score >= 70 ? "#16A34A" : q.score >= 50 ? "#F59E0B" : "#DC2626" }}>{q.score}%</span>
                  </div>
                  <Bar value={q.score} color={sentimentColor(q.score)} track="#EEF2FF" className="mt-1 h-1.5" />
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
          <span className="flex items-center gap-2 text-[14px] text-[#4F46E5]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" /> Waiting for responses
          </span>
        </div>
        {stats.activity.map((a) => {
          const pill = scorePill(a.score);
          return (
            <div key={a.initials} className="flex items-center gap-3 border-b border-[#F3F4F6] py-4 last:border-0">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#4F46E5] text-[18px] text-white">{a.initials}</span>
              <div className="flex-1">
                <p className="text-[16px] text-[#111827]">Verified respondent</p>
                <p className="text-[12px] text-[#6B7280]">Completed all {survey.questions.length || 11} questions</p>
              </div>
              <div className="text-right">
                <span className="rounded-full px-3 py-1 text-[14px]" style={{ color: pill.color, background: pill.bg }}>{a.score}%</span>
                <p className="mt-1 text-[12px] text-[#6B7280]">{a.ago}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
