"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { useSurveyStore } from "@/store/survey.store";
import TopBar from "@/components/layout/TopBar";
import {
  Plus, ArrowRight, Clock, Users, Lightbulb, Search,
  CheckCircle2, RotateCcw, XCircle, Filter
} from "lucide-react";
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

const verdictIcon = {
  Proceed: <CheckCircle2 size={14} className="text-[#16A34A]" />,
  Pivot: <RotateCcw size={14} className="text-[#D97706]" />,
  Kill: <XCircle size={14} className="text-[#DC2626]" />,
};

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
          <Link href="/founder/ideas/new" className="btn-primary">
            <Plus size={20} /> New Idea
          </Link>
        }
      />

      <div className="px-8 py-8 flex flex-col gap-6">
        {/* Search + filter bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 flex-1 max-w-md">
            <Search size={18} className="text-text-secondary flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your ideas..."
              className="flex-1 outline-none text-body text-text-primary placeholder:text-text-secondary bg-transparent"
            />
          </div>
          <button className="flex items-center gap-2 btn-secondary">
            <Filter size={18} /> Filter
          </button>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 border-b border-[#F3F4F6]">
          {STATUS_TABS.map((tab) => {
            const count = tab.key === "all"
              ? surveys.length
              : surveys.filter((s) => s.status === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-body transition-all border-b-2 -mb-px",
                  statusFilter === tab.key
                    ? "border-brand-primary text-brand-primary font-medium"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                )}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
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
          <div className="grid grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="tiqra-card empty-state">
            <div className="w-16 h-16 rounded-2xl bg-[#EDE9FE] flex items-center justify-center">
              <Lightbulb size={32} className="text-brand-primary" />
            </div>
            <div>
              <p className="text-[24px] font-semibold text-text-primary">
                {surveys.length === 0 ? "No ideas yet" : "No results found"}
              </p>
              <p className="text-body text-text-secondary mt-1">
                {surveys.length === 0
                  ? "Start validating your first startup idea today"
                  : "Try adjusting your search or filter"}
              </p>
            </div>
            {surveys.length === 0 && (
              <Link href="/founder/ideas/new" className="btn-primary">
                <Plus size={20} /> Create first idea
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {filtered.map((survey) => (
              <div
                key={survey.$id}
                onClick={() => router.push(`/founder/ideas/${survey.$id}`)}
                className="survey-card group"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <h3 className="text-body font-semibold text-text-primary leading-snug line-clamp-2">
                      {survey.title}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-1">{survey.description}</p>
                  </div>
                  <span
                    className={cn(
                      "flex-shrink-0",
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
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary flex items-center gap-1">
                      <Users size={13} /> Responses
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
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {new Date(survey.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-medium text-text-primary">
                    {formatNairaShort(survey.totalCost || 0)} escrowed
                  </span>
                  <span className="flex items-center gap-1 text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    Open <ArrowRight size={13} />
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
