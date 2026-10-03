"use client";

import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartIncreaseIcon, Money03Icon, QuoteDownIcon, Target02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { Bar as RBar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useSurvey } from "@/components/founder/useSurvey";
import ReportHeader from "@/components/founder/ReportHeader";
import { Bar } from "@/components/ui/Primitives";
import { Dimension, TaggedLine, getValidationReport } from "@/lib/reports";
import { STRENGTH_COLOR, VERDICTS, strengthOf } from "@/lib/verdict";
import { getInitials } from "@/lib/utils";

const DIM_ICON: Record<Dimension["key"], typeof Target02Icon> = {
  problem: Target02Icon,
  behaviour: UserGroupIcon,
  willingness: Money03Icon,
  repeat: ChartIncreaseIcon,
};
const SHORT: Record<Dimension["key"], string> = { problem: "Problem", behaviour: "Behaviour", willingness: "Willingness", repeat: "Repeat" };

/** Colour a value by the verdict band it falls in, matching the Figma report variants. */
function bandColor(score: number) {
  return score >= 65 ? "#16A34A" : score >= 45 ? "#F59E0B" : "#DC2626";
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 text-[14px] uppercase tracking-[-0.01em] text-[#111827]">{children}</h2>;
}

function TaggedList({ items }: { items: TaggedLine[] }) {
  return (
    <div className="mt-3 flex flex-col gap-2">
      {items.map((it, i) => (
        <div key={it.text} className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] px-3 py-3">
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-[#4F46E5] text-[11px] text-white">{i + 1}</span>
          <p className="flex-1 text-[14px] text-[#111827]">{it.text}</p>
          <span className="rounded-full bg-[#E0E7FF] px-3 py-1 text-[11px] text-[#4F46E5]">{it.tag}</span>
        </div>
      ))}
    </div>
  );
}

export default function ValidationReportPage() {
  const { id } = useParams<{ id: string }>();
  const { survey } = useSurvey(id);
  if (!survey) return <div className="skeleton mt-14 h-[600px]" />;

  const report = getValidationReport(survey);
  const v = VERDICTS[report.verdict];
  const scoreColor = bandColor(report.validationScore);
  const scoreLabel = report.validationScore >= 65 ? "Strong validation" : report.validationScore >= 45 ? "Moderate validation" : "Weak validation";
  const started = new Date(survey.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <div className="flex flex-col pt-10">
      <ReportHeader switchHref={`/founder/ideas/${id}/feasibility`} switchLabel="View feasibility report" />

      <p className="mt-8 text-[14px] text-[#6B7280]">Validation report</p>
      <h1 className="text-[20px] tracking-[-0.02em] text-[#111827]">{survey.title}</h1>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[14px] text-[#6B7280]">
        <span>Response: <b className="font-semibold text-[#111827]">{survey.respondentsCompleted} verified</b></span>
        <span>Campaign started: <b className="font-semibold text-[#111827]">{started}</b></span>
        <span>Confidence score: <b className="font-semibold text-[#111827]">{report.confidence}%</b></span>
        <span>Status: <b className="font-semibold text-[#111827]">Completed</b></span>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-[510px] items-center gap-6 rounded-[24px] px-6 py-6" style={{ background: v.tint }}>
        <div className="text-center">
          <p className="text-[28px] font-semibold" style={{ color: v.color }}>{report.confidence}%</p>
          <p className="text-[12px]" style={{ color: v.color }}>{v.level}</p>
        </div>
        <div>
          <p className="text-[18px] tracking-[-0.02em] text-[#111827]">{v.headline}</p>
          <p className="mt-1 text-[12px] text-[#6B7280]">{report.summary}</p>
          <p className="mt-3 flex items-center gap-2 text-[13px] text-[#111827]">
            AI verdict:
            <span className="rounded-full px-3 py-0.5 text-[11px] text-white" style={{ background: v.color }}>{v.short}</span>
          </p>
        </div>
      </div>

      <SectionTitle>Validation dimensions</SectionTitle>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {report.dimensions.map((d, i) => {
          const strength = strengthOf(d.score);
          const sc = STRENGTH_COLOR[strength];
          const color = bandColor(d.score);
          return (
            <div key={d.key} className={`rounded-2xl border border-[#E5E7EB] p-4 ${i < 2 ? "md:order-1" : "md:order-3"}`}>
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: sc.soft }}>
                  <HugeiconsIcon icon={DIM_ICON[d.key]} size={18} color={color} />
                </span>
                <span className="rounded-full px-4 py-1 text-[12px]" style={{ color: sc.color, background: sc.soft }}>{strength}</span>
              </div>
              <p className="mt-3 text-[16px] text-[#111827]">{d.score}%</p>
              <p className="text-[12px] text-[#6B7280]">{d.label}</p>
              <Bar value={d.score} color={color} track={`${color}22`} className="mt-1 h-1" />
              <p className="mt-1 text-[12px] text-[#6B7280]">{d.note}</p>
            </div>
          );
        })}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5E7EB] p-4 md:order-2">
          <p className="text-[12px] uppercase text-[#6B7280]">Confidence score</p>
          <p className="mt-3 text-[22px] text-[#111827]">{report.validationScore}%</p>
          <span className="mt-3 rounded-full px-3 py-1 text-[12px] text-white" style={{ background: scoreColor }}>{scoreLabel}</span>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] p-3 md:order-4">
          <p className="text-[12px] uppercase text-[#111827]">Score distribution</p>
          <div className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.dimensions.map((d) => ({ name: SHORT[d.key], score: d.score }))} margin={{ top: 6, right: 0, left: -32, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 8, fill: "#111827" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 8, fill: "#111827" }} axisLine={false} tickLine={false} />
                <RBar dataKey="score" radius={[2, 2, 0, 0]} barSize={18}>
                  {report.dimensions.map((d) => (
                    <Cell key={d.key} fill={bandColor(d.score)} />
                  ))}
                </RBar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <SectionTitle>Key insights</SectionTitle>
      <TaggedList items={report.insights} />

      <SectionTitle>Respondents voice</SectionTitle>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {report.voices.map((q) => (
          <div key={q.quote} className="rounded-2xl border border-[#E5E7EB] p-4">
            <HugeiconsIcon icon={QuoteDownIcon} size={20} className="text-[#111827]" />
            <p className="mt-3 border-b border-[#E5E7EB] pb-4 text-[14px] text-[#111827]">&ldquo;{q.quote}&rdquo;</p>
            <p className="mt-3 flex items-center gap-2 text-[14px] text-[#111827]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4F46E5] text-[10px] text-white">{getInitials(q.name)}</span>
              {q.name}
            </p>
          </div>
        ))}
      </div>

      <SectionTitle>Recommended next steps</SectionTitle>
      <TaggedList items={report.nextSteps} />
    </div>
  );
}
