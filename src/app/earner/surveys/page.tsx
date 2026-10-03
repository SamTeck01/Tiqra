"use client";

import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, FilterHorizontalIcon, RefreshIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "@/store/auth.store";
import { useEarnerStore } from "@/store/earner.store";
import SurveyCard from "@/components/earner/SurveyCard";
import { PageTitle } from "@/components/ui/Primitives";
import { Survey } from "@/lib/types";
import { cn } from "@/lib/utils";

type Sort = "reward" | "shortest" | "newest";

const SORTS: Record<Sort, { label: string; fn: (a: Survey, b: Survey) => number }> = {
  reward: { label: "Highest reward", fn: (a, b) => b.payoutPerResponse - a.payoutPerResponse },
  shortest: { label: "Shortest", fn: (a, b) => a.questions.length - b.questions.length },
  newest: { label: "Newest", fn: (a, b) => b.createdAt.localeCompare(a.createdAt) },
};

export default function EarnerSurveysPage() {
  const { user } = useAuthStore();
  const { available, fetchAvailable, loading } = useEarnerStore();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("reward");

  useEffect(() => {
    if (user?.$id) fetchAvailable(user.$id);
  }, [user?.$id, fetchAvailable]);

  const visible = useMemo(
    () =>
      available
        .filter((s) => s.title.toLowerCase().includes(query.trim().toLowerCase()))
        .sort(SORTS[sort].fn),
    [available, query, sort]
  );

  return (
    <div className="flex flex-col pt-8">
      <PageTitle title="Survey" subtitle="Pick survey and start earning" />

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex h-[52px] w-full max-w-[600px] items-center gap-3 rounded-xl bg-[#F8F9FC] px-4">
          <HugeiconsIcon icon={Search01Icon} size={20} className="text-[#111827]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search survey"
            className="w-full bg-transparent text-[14px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
          />
        </label>
        <div className="relative">
          <HugeiconsIcon icon={FilterHorizontalIcon} size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#111827]" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort surveys"
            className="h-[52px] w-full appearance-none rounded-xl border border-[#E5E7EB] bg-white pl-12 pr-12 text-[14px] text-[#111827] focus:outline-none sm:w-[200px]"
          >
            {(Object.keys(SORTS) as Sort[]).map((k) => (
              <option key={k} value={k}>{SORTS[k].label}</option>
            ))}
          </select>
          <HugeiconsIcon icon={ArrowDown01Icon} size={20} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#111827]" />
        </div>
      </div>

      <section className="mt-6 rounded-[24px] bg-[#F8F9FC] px-3 pb-3">
        <div className="flex items-center justify-between py-4">
          <h2 className="text-[20px] font-medium tracking-[-0.02em] text-[#111827]">Available Surveys</h2>
          <button
            onClick={() => user && fetchAvailable(user.$id)}
            className="inline-flex items-center gap-2 text-[14px] text-[#4F46E5]"
          >
            Refresh <HugeiconsIcon icon={RefreshIcon} size={20} className={cn(loading && "animate-spin")} />
          </button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {loading && available.length === 0
            ? [0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton h-[130px]" />)
            : visible.map((s) => <SurveyCard key={s.$id} survey={s} />)}
        </div>
        {!loading && visible.length === 0 && (
          <p className="rounded-2xl bg-white py-10 text-center text-[14px] text-[#6B7280]">
            {query ? "No surveys match your search." : "No surveys available right now. Check back soon."}
          </p>
        )}
      </section>
    </div>
  );
}
