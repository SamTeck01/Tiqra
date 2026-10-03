import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { Survey } from "@/lib/types";
import { formatNairaFull } from "@/lib/utils";

export function surveyMinutes(s: Survey): string {
  const mins = Math.max(1, Math.round((s.questions.length * 20) / 60));
  return `${mins} mins`;
}

export default function SurveyCard({ survey }: { survey: Survey }) {
  return (
    <div className="flex flex-col justify-between gap-5 rounded-2xl bg-white p-4">
      <div>
        <p className="text-[18px] tracking-[-0.02em] text-[#111827]">{survey.title}</p>
        <p className="mt-1 flex items-center gap-1 text-[12px] text-[#6B7280]">
          <HugeiconsIcon icon={Clock01Icon} size={14} /> {surveyMinutes(survey)}
        </p>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[22px] font-medium tracking-[-0.02em] text-[#111827]">{formatNairaFull(survey.payoutPerResponse)}</p>
          <p className="text-[12px] text-[#6B7280]">Reward</p>
        </div>
        <Link
          href={`/earner/surveys/${survey.$id}`}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#4F46E5] px-4 text-[14px] text-white hover:bg-[#4338CA]"
        >
          Start <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
        </Link>
      </div>
    </div>
  );
}
