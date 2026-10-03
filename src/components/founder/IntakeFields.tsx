"use client";

import { IdeaIntake } from "@/lib/types";
import { cn } from "@/lib/utils";

const FIELDS: { key: keyof IdeaIntake; label: string; placeholder: string }[] = [
  {
    key: "problem",
    label: "What problem are you trying to solve?",
    placeholder: "Describe the pain your idea is solving. Be specific — who faces it, how often and how badly.",
  },
  {
    key: "audience",
    label: "Who is this idea for? (Target Audience)",
    placeholder: "Be specific about who you're building this for (e.g. students, small business owners, job seekers etc.)",
  },
  { key: "solution", label: "What are you building to solve this problem?", placeholder: "Explain your idea in one or two sentences." },
  { key: "alternatives", label: "How are people currently solving this problem?", placeholder: "Mention tools, apps, or manual methods they use." },
  { key: "advantage", label: "Why is your solution better?", placeholder: "What makes your solution stand out?" },
  {
    key: "pricing",
    label: "Do you plan to charge for this? If yes, how much? (Optional)",
    placeholder: "Even a rough estimate helps improve accuracy.",
  },
];

export const REQUIRED_FIELDS: (keyof IdeaIntake)[] = ["problem", "audience", "solution"];

export default function IntakeFields({
  value,
  onChange,
  readOnly,
}: {
  value: IdeaIntake;
  onChange: (next: IdeaIntake) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 px-0 sm:px-4">
      {FIELDS.map((f) => (
        <label key={f.key} className="flex flex-col gap-2">
          <span className="text-[16px] tracking-[-0.02em] text-[#111827]">{f.label}</span>
          <textarea
            value={value[f.key]}
            readOnly={readOnly}
            onChange={(e) => onChange({ ...value, [f.key]: e.target.value })}
            placeholder={f.placeholder}
            rows={readOnly ? Math.max(1, Math.ceil(value[f.key].length / 95)) : 3}
            className={cn(
              "w-full resize-none rounded-2xl border border-[#E5E7EB] bg-white px-4 py-4 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#4F46E5] focus:outline-none",
              readOnly && "cursor-default focus:border-[#E5E7EB]"
            )}
          />
        </label>
      ))}
    </div>
  );
}
