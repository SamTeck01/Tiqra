import { HugeiconsIcon } from "@hugeicons/react";
import { Activity01Icon } from "@hugeicons/core-free-icons";

/** Dashboard metric tile; the highlighted one is the solid indigo card. */
export default function StatCard({
  label,
  value,
  icon,
  highlighted,
}: {
  label: string;
  value: string;
  icon: typeof Activity01Icon;
  highlighted?: boolean;
}) {
  return (
    <div
      className="relative flex h-[150px] flex-col justify-between overflow-hidden rounded-[24px] p-6"
      style={{ background: highlighted ? "#4F46E5" : "#F8F9FC" }}
    >
      {highlighted && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-10" viewBox="0 0 320 150" preserveAspectRatio="none">
          <path d="M0 110 C80 60 160 150 320 70" stroke="white" strokeWidth="18" fill="none" />
          <path d="M0 140 C90 90 170 170 320 110" stroke="white" strokeWidth="10" fill="none" />
        </svg>
      )}
      <div className="relative flex items-center justify-between">
        <p className="text-[16px] tracking-[-0.02em]" style={{ color: highlighted ? "#E0E7FF" : "#111827" }}>
          {label}
        </p>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: highlighted ? "white" : "#4F46E5" }}
        >
          <HugeiconsIcon icon={icon} size={22} color={highlighted ? "#111827" : "white"} />
        </span>
      </div>
      <p className="relative text-[36px] font-semibold tracking-[-0.03em]" style={{ color: highlighted ? "white" : "#111827" }}>
        {value}
      </p>
    </div>
  );
}
