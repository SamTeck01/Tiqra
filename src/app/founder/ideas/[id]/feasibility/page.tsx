"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Clock01Icon, Dollar02Icon } from "@hugeicons/core-free-icons";
import { useSurvey } from "@/components/founder/useSurvey";
import ReportHeader from "@/components/founder/ReportHeader";
import { Ring } from "@/components/ui/Primitives";
import { getFeasibilityReport, levelOf } from "@/lib/reports";
import { formatNairaShort } from "@/lib/utils";

const LEVEL_STYLE = {
  High: { color: "#16A34A", bg: "#DCFCE7" },
  Medium: { color: "white", bg: "#F59E0B" },
  Low: { color: "#DC2626", bg: "#FEE2E2" },
};

function Card({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[24px] p-4 shadow-[0_4px_24px_rgba(17,24,39,0.06)] ${className}`}>
      {title && <p className="mb-3 text-[16px] tracking-[-0.02em] text-[#111827]">{title}</p>}
      {children}
    </div>
  );
}

export default function FeasibilityReportPage() {
  const { id } = useParams<{ id: string }>();
  const { survey } = useSurvey(id);
  if (!survey) return <div className="skeleton mt-14 h-[600px]" />;

  const r = getFeasibilityReport(survey);
  const scoreLevel = levelOf(r.score);
  const scoreColor = LEVEL_STYLE[scoreLevel].color === "white" ? "#F59E0B" : LEVEL_STYLE[scoreLevel].color;

  return (
    <div className="flex flex-col pt-10">
      <ReportHeader switchHref={`/founder/ideas/${id}/report`} switchLabel="View survey report" />

      <p className="mt-8 text-[14px] text-[#6B7280]">Feasibility report</p>
      <h1 className="text-[20px] tracking-[-0.02em] text-[#111827]">{survey.title}</h1>
      <p className="mt-1 text-[16px] text-[#6B7280]">{r.description}</p>
      <p className="mt-2 text-[12px] text-[#9CA3AF]">
        Cost, time and technical estimates are AI projections based on your idea and survey results.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Card className="border border-[#E5E7EB] shadow-none">
          <p className="text-[16px]" style={{ color: scoreColor }}>Overall feasibility score</p>
          <div className="mt-2 flex items-center gap-4">
            <Ring value={r.score} size={124} stroke={8} color={scoreColor} track={`${scoreColor}22`}>
              <p className="text-[20px] font-medium" style={{ color: scoreColor }}>{r.score}%</p>
              <p className="text-[11px]" style={{ color: scoreColor }}>{scoreLevel} feasibility</p>
            </Ring>
            <p className="text-[12px] text-[#6B7280]">{r.scoreNote}</p>
          </div>
        </Card>
        <Card title="Survey summary" className="border border-[#E5E7EB] shadow-none">
          <div className="grid grid-cols-4 gap-2">
            {[
              [String(r.survey.responses), "Total responses"],
              [`${r.survey.problem}%`, "Problem experienced"],
              [`${r.survey.willing}%`, "Willing to pay"],
              [r.survey.interest, "Market interest"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-[18px] text-[#111827]">{value}</p>
                <p className="text-[11px] text-[#6B7280]">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <Link
              href={`/founder/ideas/${id}/report`}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#4F46E5] px-4 text-[14px] text-white hover:bg-[#4338CA]"
            >
              View survey report <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <Card title="Project feasibility overview">
          {r.overview.map((o) => {
            const lvl = levelOf(o.score);
            return (
              <div key={o.label} className="flex items-center justify-between py-2">
                <span className="text-[13px] text-[#6B7280]">{o.label}</span>
                <span className="flex items-center gap-2 text-[13px] text-[#111827]">
                  {o.score}%
                  <span className="w-16 rounded px-2 py-0.5 text-center text-[11px]" style={{ color: LEVEL_STYLE[lvl].color, background: LEVEL_STYLE[lvl].bg }}>{lvl}</span>
                </span>
              </div>
            );
          })}
        </Card>
        <Card title="Expected Benefits">
          {r.benefits.map((b) => (
            <p key={b} className="py-2 text-[13px] text-[#6B7280]">{b}</p>
          ))}
        </Card>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Card title="Cost and time estimate" className="border border-[#E5E7EB] shadow-none">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E0E7FF]">
                <HugeiconsIcon icon={Dollar02Icon} size={22} className="text-[#4F46E5]" />
              </span>
              <div>
                <p className="text-[12px] text-[#6B7280]">Total estimated cost</p>
                <p className="text-[16px] font-medium text-[#111827]">
                  {formatNairaShort(r.cost.min)} - {formatNairaShort(r.cost.max)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E0E7FF]">
                <HugeiconsIcon icon={Clock01Icon} size={22} className="text-[#4F46E5]" />
              </span>
              <div>
                <p className="text-[12px] text-[#6B7280]">Estimated time to launch</p>
                <p className="text-[16px] font-medium text-[#111827]">{r.months.min} - {r.months.max} Months</p>
              </div>
            </div>
          </Card>
          <Card title="Key resources needed" className="border border-[#E5E7EB] shadow-none">
            {r.resources.map((x) => (
              <p key={x} className="py-1 text-[13px] text-[#6B7280]">{x}</p>
            ))}
          </Card>
        </div>
        <div className="flex flex-col gap-3">
          <Card title="Technical possibility" className="border border-[#E5E7EB] shadow-none">
            {r.technical.map((t) => (
              <div key={t.label} className="grid grid-cols-[1fr_1.4fr] gap-2 py-1.5 text-[13px]">
                <span className="text-[#6B7280]">{t.label}:</span>
                <span style={{ color: t.highlight ? "#16A34A" : "#111827" }}>{t.value}</span>
              </div>
            ))}
          </Card>
          <div className="rounded-[24px] border border-[#F59E0B] bg-[#FDF0DC] p-4">
            <p className="mb-3 text-[16px] text-[#111827]">Key Risks</p>
            {r.risks.map((k) => (
              <div key={k.text} className="flex items-center justify-between gap-2 py-2">
                <span className="text-[13px] text-[#6B7280]">{k.text}</span>
                <span className="rounded px-2 py-0.5 text-[11px]" style={{ color: LEVEL_STYLE[k.level === "Medium" ? "Medium" : k.level].color, background: LEVEL_STYLE[k.level].bg }}>{k.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
