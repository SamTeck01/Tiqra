"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ArrowRight, Search, Filter, CheckCircle2, Star } from "lucide-react";
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

      <div className="px-8 py-8 flex flex-col gap-6">
        {/* Search + filter bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 flex-1">
            <Search size={20} className="text-text-secondary flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search surveys..."
              className="flex-1 outline-none text-body text-text-primary placeholder:text-text-secondary bg-transparent"
            />
          </div>
          <div className="flex gap-2">
            {(["available", "completed", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={cn(
                  "px-4 py-3 rounded-xl text-body capitalize transition-all border",
                  filterStatus === f
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-white text-text-secondary border-[#E5E7EB] hover:border-brand-primary"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
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
        <p className="text-sm text-text-secondary">
          {filtered.length} survey{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Survey cards */}
        <div className="flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="tiqra-card flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EDE9FE] flex items-center justify-center">
                <Search size={32} className="text-brand-primary" />
              </div>
              <p className="text-[24px] font-semibold text-text-primary">No surveys found</p>
              <p className="text-body text-text-secondary">Try adjusting your search or filters</p>
            </div>
          ) : (
            filtered.map((survey) => (
              <div
                key={survey.id}
                onClick={() => survey.status === "available" && router.push(`/earner/surveys/${survey.id}`)}
                className={cn(
                  "flex items-center justify-between p-5 bg-white border border-[#F3F4F6] rounded-2xl transition-all",
                  survey.status === "available"
                    ? "hover:shadow-card-hover cursor-pointer"
                    : "opacity-70 cursor-default"
                )}
              >
                <div className="flex items-center gap-5">
                  {/* Left: category + info */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-[#EDE9FE] text-brand-primary px-2.5 py-0.5 rounded-full font-medium">
                        {survey.category}
                      </span>
                      {survey.status === "completed" && (
                        <span className="flex items-center gap-1 text-xs bg-[#DCFCE7] text-[#16A34A] px-2.5 py-0.5 rounded-full font-medium">
                          <CheckCircle2 size={12} /> Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-body font-semibold text-text-primary">{survey.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <span className="flex items-center gap-1"><Clock size={13} /> {survey.duration}</span>
                      <span>{survey.questions} questions</span>
                      <span>{survey.responses}/{survey.total} responses</span>
                    </div>
                    {/* mini progress */}
                    <div className="w-48 h-1.5 rounded-full bg-[#EDE9FE] overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full"
                        style={{ width: `${(survey.responses / survey.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-[24px] font-bold text-text-primary">
                      ₦{survey.reward.toLocaleString()}
                    </p>
                    <p className="text-sm text-text-secondary">Reward</p>
                  </div>
                  {survey.status === "available" ? (
                    <button className="flex items-center gap-2 bg-[#EDE9FE] text-brand-primary px-5 py-3 rounded-xl text-body font-medium hover:bg-brand-primary hover:text-white transition-all">
                      Start <ArrowRight size={18} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-[#F3F4F6] text-text-secondary px-5 py-3 rounded-xl text-body">
                      <CheckCircle2 size={18} /> Done
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
