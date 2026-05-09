"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, ArrowRight01Icon, Search01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";;
import { cn } from "@/lib/utils";
import TopBar from "@/components/layout/TopBar";

const ALL_SURVEYS = [
  { id: "s1", title: "AI powered Resume builder", reward: 500, duration: "2 mins", questions: 8, category: "Tech", status: "available", responses: 32, total: 50 },
  { id: "s2", title: "Freelancer invoice tools", reward: 800, duration: "5 mins", questions: 12, category: "Finance", status: "available", responses: 20, total: 50 },
  { id: "s3", title: "Student Meal Planner App", reward: 600, duration: "3 mins", questions: 9, category: "Education", status: "completed", responses: 47, total: 50 },
  { id: "s4", title: "Remote Team Standup Bot", reward: 700, duration: "4 mins", questions: 10, category: "Productivity", status: "available", responses: 18, total: 50 },
  { id: "s5", title: "Health tracking app Nigeria", reward: 1000, duration: "7 mins", questions: 15, category: "Health", status: "available", responses: 5, total: 50 },
  { id: "s6", title: "Online learning platform", reward: 750, duration: "4 mins", questions: 10, category: "Education", status: "available", responses: 40, total: 50 },
  { id: "s7", title: "Neobank for youth savings", reward: 1200, duration: "8 mins", questions: 16, category: "Finance", status: "available", responses: 12, total: 50 },
  { id: "s8", title: "Ride-share for women", reward: 900, duration: "6 mins", questions: 13, category: "Transport", status: "available", responses: 28, total: 50 },
];

const CATEGORIES = ["All", "Tech", "Finance", "Health", "Education", "Productivity", "Transport"];

export default function EarnerSurveysPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState<"all" | "available" | "completed">("available");

  const filtered = ALL_SURVEYS.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Available Surveys" subtitle="Complete surveys and earn real money." />

      <div className="page-content flex flex-col gap-5 lg:gap-6">
        {/* Search bar */}
        <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 lg:px-4 lg:py-3">
          <HugeiconsIcon icon={Search01Icon} size={17} className="text-text-secondary flex-shrink-0"  />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search surveys..."
            className="flex-1 outline-none text-sm lg:text-body text-text-primary placeholder:text-text-secondary bg-transparent"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {(["available", "completed", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={cn(
                "px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl text-sm capitalize transition-all border whitespace-nowrap flex-shrink-0",
                filterStatus === f
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-text-secondary border-[#E5E7EB] hover:border-brand-primary"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Category chips — scrollable */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all border whitespace-nowrap flex-shrink-0",
                activeCategory === cat
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-text-secondary border-[#E5E7EB] hover:border-brand-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs lg:text-sm text-text-secondary">
          {filtered.length} survey{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Survey cards */}
        <div className="flex flex-col gap-3 lg:gap-4">
          {filtered.length === 0 ? (
            <div className="tiqra-card flex flex-col items-center justify-center py-16 lg:py-20 gap-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-[#EDE9FE] flex items-center justify-center">
                <HugeiconsIcon icon={Search01Icon} size={28} className="text-brand-primary"  />
              </div>
              <p className="text-[18px] lg:text-[24px] font-semibold text-text-primary">No surveys found</p>
              <p className="text-sm lg:text-body text-text-secondary">Try adjusting your search or filters</p>
            </div>
          ) : (
            filtered.map((survey) => (
              <div
                key={survey.id}
                onClick={() => survey.status === "available" && router.push(`/earner/surveys/${survey.id}`)}
                className={cn(
                  "p-4 lg:p-5 bg-white border border-[#F3F4F6] rounded-2xl transition-all",
                  survey.status === "available"
                    ? "hover:shadow-card-hover cursor-pointer"
                    : "opacity-70 cursor-default"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: category + info */}
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs bg-[#EDE9FE] text-brand-primary px-2.5 py-0.5 rounded-full font-medium">
                        {survey.category}
                      </span>
                      {survey.status === "completed" && (
                        <span className="flex items-center gap-1 text-xs bg-[#DCFCE7] text-[#16A34A] px-2.5 py-0.5 rounded-full font-medium">
                          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={11}  /> Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-[14px] lg:text-body font-semibold text-text-primary line-clamp-2">{survey.title}</h3>
                    <div className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm text-text-secondary flex-wrap">
                      <span className="flex items-center gap-1"><HugeiconsIcon icon={Clock01Icon} size={11}  /> {survey.duration}</span>
                      <span>{survey.questions} questions</span>
                      <span className="hidden sm:inline">{survey.responses}/{survey.total} responses</span>
                    </div>
                    {/* mini progress */}
                    <div className="w-full max-w-[200px] h-1.5 rounded-full bg-[#EDE9FE] overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full"
                        style={{ width: `${(survey.responses / survey.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Right: reward + CTA */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-[18px] lg:text-[24px] font-bold text-text-primary">
                        ₦{survey.reward.toLocaleString()}
                      </p>
                      <p className="text-xs lg:text-sm text-text-secondary">Reward</p>
                    </div>
                    {survey.status === "available" ? (
                      <button className="flex items-center gap-1.5 bg-[#EDE9FE] text-brand-primary px-3 py-2 lg:px-5 lg:py-3 rounded-xl text-sm lg:text-body font-medium hover:bg-brand-primary hover:text-white transition-all">
                        Start <HugeiconsIcon icon={ArrowRight01Icon} size={15}  />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-[#F3F4F6] text-text-secondary px-3 py-2 lg:px-5 rounded-xl text-sm">
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} size={15}  /> Done
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
