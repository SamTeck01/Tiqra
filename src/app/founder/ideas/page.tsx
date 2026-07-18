"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useSurveyStore } from "@/store/survey.store";
import TopBar from "@/components/layout/TopBar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, ArrowRight01Icon, Clock01Icon, UserGroupIcon, Idea01Icon, Search01Icon, CheckmarkCircle01Icon, RepeatIcon, Cancel01Icon, FilterIcon } from "@hugeicons/core-free-icons";
import { formatNairaShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "live" | "completed" | "draft" | "paused";

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "completed", label: "Completed" },
  { key: "draft", label: "Drafts" },
  { key: "paused", label: "Paused" },
];

export default function FounderIdeasPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { surveys, fetchSurveys, loading } = useSurveyStore();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user?.$id) fetchSurveys(user.$id);
  }, [user?.$id]);

  const filtered = surveys.filter((s) => {
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="My Ideas"
        subtitle="All your startup validation campaigns."
        action={
          <Link href="/founder/ideas/new" className="btn-primary text-sm lg:text-base px-3 lg:px-6 py-2 lg:py-3">
            <HugeiconsIcon icon={Add01Icon} size={18}  /> <span className="hidden sm:inline">New Idea</span>
          </Link>
        }
      />

      <div className="page-content flex flex-col gap-5 lg:gap-6">
        {/* Search + filter bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 lg:px-4 lg:py-3 flex-1">
            <HugeiconsIcon icon={Search01Icon} size={17} className="text-text-secondary flex-shrink-0"  />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your ideas..."
              className="flex-1 outline-none text-sm lg:text-body text-text-primary placeholder:text-text-secondary bg-transparent"
            />
          </div>
          <button className="flex items-center gap-2 btn-secondary text-sm py-2.5 px-3 lg:px-4">
            <HugeiconsIcon icon={FilterIcon} size={16}  /> <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {/* Status tabs — scrollable on mobile */}
        <div className="flex gap-1 border-b border-[#F3F4F6] overflow-x-auto no-scrollbar">
          {STATUS_TABS.map((tab) => {
            const count = tab.key === "all"
              ? surveys.length
              : surveys.filter((s) => s.status === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 lg:px-5 py-2.5 lg:py-3 text-sm lg:text-body transition-all border-b-2 -mb-px whitespace-nowrap flex-shrink-0",
                  statusFilter === tab.key
                    ? "border-brand-primary text-brand-primary font-medium"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                )}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full font-medium",
                      statusFilter === tab.key
                        ? "bg-brand-primary text-white"
                        : "bg-[#F3F4F6] text-text-secondary"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 lg:h-48 skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="tiqra-card empty-state py-16 lg:py-20">
            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-[#EDE9FE] flex items-center justify-center">
              <HugeiconsIcon icon={Idea01Icon} size={28} className="text-brand-primary"  />
            </div>
            <div>
              <p className="text-[18px] lg:text-[24px] font-semibold text-text-primary text-center">
                {surveys.length === 0 ? "No ideas yet" : "No results found"}
              </p>
              <p className="text-sm lg:text-body text-text-secondary mt-1 text-center">
                {surveys.length === 0
                  ? "Start validating your first startup idea today"
                  : "Try adjusting your search or filter"}
              </p>
            </div>
            {surveys.length === 0 && (
              <Link href="/founder/ideas/new" className="btn-primary">
                <HugeiconsIcon icon={Add01Icon} size={18}  /> Create first idea
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {filtered.map((survey) => (
              <div
                key={survey.$id}
                onClick={() => router.push(`/founder/ideas/${survey.$id}`)}
                className="survey-card group"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <h3 className="text-[14px] lg:text-body font-semibold text-text-primary leading-snug line-clamp-2">
                      {survey.title}
                    </h3>
                    <p className="text-xs lg:text-sm text-text-secondary line-clamp-1">{survey.description}</p>
                  </div>
                  <span
                    className={cn(
                      "flex-shrink-0 text-xs",
                      survey.status === "live"
                        ? "badge-live"
                        : survey.status === "completed"
                        ? "badge-completed"
                        : "badge-draft"
                    )}
                  >
                    {survey.status === "live"
                      ? "● Live"
                      : survey.status === "completed"
                      ? "✓ Done"
                      : survey.status === "paused"
                      ? "⏸ Paused"
                      : "Draft"}
                  </span>
                </div>

                {/* Progress */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs lg:text-sm">
                    <span className="text-text-secondary flex items-center gap-1">
                      <HugeiconsIcon icon={UserGroupIcon} size={12}  /> Responses
                    </span>
                    <span className="text-text-primary font-medium">
                      {survey.respondentsCompleted}/{survey.respondentsRequired}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(100, (survey.respondentsCompleted / survey.respondentsRequired) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between text-xs lg:text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={Clock01Icon} size={11}  />
                    {new Date(survey.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="font-medium text-text-primary">
                    {formatNairaShort(survey.totalCost || 0)} escrowed
                  </span>
                  <span className="flex items-center gap-1 text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    Open <HugeiconsIcon icon={ArrowRight01Icon} size={11}  />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
