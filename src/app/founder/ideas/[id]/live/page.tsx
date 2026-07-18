"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { databases } from "@/lib/appwrite";
import { DB_ID, COLLECTIONS } from "@/lib/appwrite.config";
import { Idea } from "@/lib/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ChartBarLineIcon, Location01Icon, UserGroupIcon, Time01Icon, FlashIcon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import TopBar from "@/components/layout/TopBar";

export default function LiveTrackPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock real-time progression
  const [responses, setResponses] = useState(0);

  useEffect(() => {
    async function fetchIdea() {
      try {
        const doc = await databases.getDocument(DB_ID, COLLECTIONS.SURVEYS, id);
        const fetchedIdea = doc as unknown as Idea;
        setIdea(fetchedIdea);
        setResponses(fetchedIdea.respondentsCompleted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchIdea();
  }, [id]);

  useEffect(() => {
    // Simulate real-time responses coming in if the idea is live
    if (idea && idea.status === "live") {
      const interval = setInterval(() => {
        setResponses((prev) => {
          if (prev >= idea.respondentsRequired) {
            clearInterval(interval);
            return idea.respondentsRequired;
          }
          // Randomly add 1 or 2 responses every few seconds
          return prev + Math.floor(Math.random() * 3);
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [idea]);

  if (loading || !idea) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopBar title="Live Tracking..." subtitle="" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const progressPct = Math.min(100, (responses / idea.respondentsRequired) * 100);

  return (
    <div className="flex flex-col min-h-screen pb-24 lg:pb-8">
      {/* Dynamic TopBar */}
      <div className="flex items-center gap-4 py-4 px-4 lg:px-8 border-b border-[#F3F4F6] bg-white sticky top-0 z-10">
        <button onClick={() => router.push(`/founder/ideas/${id}`)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F8F9FC] text-text-secondary hover:text-text-primary transition-colors">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
        </button>
        <div>
          <h1 className="text-[20px] font-semibold text-text-primary">Live Track: {idea.title}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center justify-center w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <p className="text-xs text-[#10B981] font-medium uppercase tracking-wider">Collecting Responses</p>
          </div>
        </div>
        <div className="ml-auto">
          <button className="btn-secondary py-2 px-4 text-sm text-[#DC2626] border-[#FEE2E2] hover:bg-[#FEE2E2] hover:text-[#DC2626]">
            Pause Survey
          </button>
        </div>
      </div>

      <div className="page-content mt-6 flex flex-col gap-6 max-w-5xl">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#F3F4F6] p-5 rounded-2xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-text-secondary mb-2">
              <HugeiconsIcon icon={UserGroupIcon} size={18} />
              <span className="text-sm font-medium">Responses</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">{responses}</p>
            <p className="text-xs text-text-muted mt-1">Target: {idea.respondentsRequired}</p>
          </div>
          
          <div className="bg-white border border-[#F3F4F6] p-5 rounded-2xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-text-secondary mb-2">
              <HugeiconsIcon icon={Time01Icon} size={18} />
              <span className="text-sm font-medium">Avg. Time</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">2m 14s</p>
            <p className="text-xs text-[#10B981] mt-1 font-medium">-12s vs average</p>
          </div>

          <div className="bg-white border border-[#F3F4F6] p-5 rounded-2xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-text-secondary mb-2">
              <HugeiconsIcon icon={Location01Icon} size={18} />
              <span className="text-sm font-medium">Top Location</span>
            </div>
            <p className="text-3xl font-bold text-text-primary truncate">Lagos</p>
            <p className="text-xs text-text-muted mt-1">45% of total responses</p>
          </div>

          <div className="bg-white border border-[#F3F4F6] p-5 rounded-2xl flex flex-col gap-1">
            <div className="flex items-center gap-2 text-text-secondary mb-2">
              <HugeiconsIcon icon={Wallet01Icon} size={18} />
              <span className="text-sm font-medium">Est. Cost</span>
            </div>
            <p className="text-3xl font-bold text-text-primary">₦{responses * 100}</p>
            <p className="text-xs text-text-muted mt-1">At ₦100 per response</p>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="bg-white border border-[#F3F4F6] p-6 lg:p-8 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Overall Progress</h3>
              <p className="text-sm text-text-secondary">Watch your audience validate your idea in real-time.</p>
            </div>
            <span className="text-xl font-bold text-[#10B981]">{Math.floor(progressPct)}%</span>
          </div>
          <div className="h-4 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#10B981] transition-all duration-1000 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Mock Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#F3F4F6] p-6 rounded-2xl h-[300px] flex flex-col">
            <h3 className="text-body font-semibold text-text-primary mb-4">Responses Over Time</h3>
            <div className="flex-1 border-b border-l border-[#E5E7EB] relative mt-4 ml-4 mb-6">
              {/* Fake Line Chart */}
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,100 L20,80 L40,85 L60,40 L80,20 L100,5" fill="none" stroke="#10B981" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>

          <div className="bg-white border border-[#F3F4F6] p-6 rounded-2xl h-[300px] flex flex-col">
            <h3 className="text-body font-semibold text-text-primary mb-4">Sentiment Analysis</h3>
            <div className="flex-1 flex items-center justify-center">
              {/* Fake Doughnut Chart */}
              <div className="relative w-40 h-40 rounded-full border-[16px] border-[#10B981] border-r-[#F59E0B] border-b-[#EF4444] transform rotate-45 flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 bg-white rounded-full m-4 flex flex-col items-center justify-center -rotate-45">
                   <HugeiconsIcon icon={FlashIcon} size={24} className="text-[#10B981] mb-1" />
                   <span className="text-sm font-bold">Positive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
