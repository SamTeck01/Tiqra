"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { databases } from "@/lib/appwrite";
import { DB_ID, COLLECTIONS } from "@/lib/appwrite.config";
import { Idea } from "@/lib/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Rocket01Icon, Alert01Icon, Cancel01Icon, CheckmarkCircle01Icon, ChartBarLineIcon, DollarCircleIcon, Target01Icon, Briefcase02Icon, DocumentAttachmentIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import TopBar from "@/components/layout/TopBar";

type Verdict = "GO" | "PIVOT" | "KILL";

export default function ReportPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIdea() {
      try {
        const doc = await databases.getDocument(DB_ID, COLLECTIONS.SURVEYS, id);
        setIdea(doc as unknown as Idea);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchIdea();
  }, [id]);

  if (loading || !idea) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopBar title="Loading Report..." subtitle="" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Determine verdict based on idea ID or randomize
  let verdict: Verdict = "GO";
  if (id.includes("001")) verdict = "PIVOT";
  if (id.includes("002")) verdict = "KILL";

  const config = {
    "GO": {
      color: "text-[#10B981]",
      bg: "bg-[#D1FAE5]",
      border: "border-[#10B981]/30",
      icon: <HugeiconsIcon icon={Rocket01Icon} size={32} />,
      title: "Green Light (GO)",
      message: "Strong market validation. Proceed with development.",
      score: "85%",
    },
    "PIVOT": {
      color: "text-[#F59E0B]",
      bg: "bg-[#FEF3C7]",
      border: "border-[#F59E0B]/30",
      icon: <HugeiconsIcon icon={Alert01Icon} size={32} />,
      title: "Pivot Required",
      message: "Core idea is valid, but the target audience or feature set needs adjustment.",
      score: "55%",
    },
    "KILL": {
      color: "text-[#EF4444]",
      bg: "bg-[#FEE2E2]",
      border: "border-[#EF4444]/30",
      icon: <HugeiconsIcon icon={Cancel01Icon} size={32} />,
      title: "Kill Idea",
      message: "Low market interest or high friction. It is recommended to abandon this concept.",
      score: "20%",
    }
  };

  const v = config[verdict];

  return (
    <div className="flex flex-col min-h-screen pb-24 lg:pb-8">
      {/* Dynamic TopBar */}
      <div className="flex items-center gap-4 py-4 px-4 lg:px-8 border-b border-[#F3F4F6] bg-white sticky top-0 z-10">
        <button onClick={() => router.push(`/founder/ideas/${id}`)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F8F9FC] text-text-secondary hover:text-text-primary transition-colors">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
        </button>
        <div>
          <h1 className="text-[20px] font-semibold text-text-primary line-clamp-1">AI Report: {idea.title}</h1>
          <p className="text-xs text-text-secondary">Based on {idea.respondentsCompleted} responses</p>
        </div>
        <div className="ml-auto flex gap-2">
           <button className="btn-secondary py-2 px-4 text-sm gap-2">
            <HugeiconsIcon icon={DocumentAttachmentIcon} size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="page-content mt-6 flex flex-col gap-6 max-w-4xl mx-auto w-full">
        
        {/* Verdict Banner */}
        <div className={cn("p-6 lg:p-8 rounded-2xl border flex flex-col md:flex-row items-center gap-6", v.bg, v.border)}>
           <div className={cn("w-16 h-16 rounded-full flex items-center justify-center bg-white/50", v.color)}>
              {v.icon}
           </div>
           <div className="flex-1 text-center md:text-left">
              <h2 className={cn("text-[28px] font-bold", v.color)}>{v.title}</h2>
              <p className="text-body font-medium mt-1 opacity-80">{v.message}</p>
           </div>
           <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-black/10 pt-4 md:pt-0 md:pl-6">
              <p className="text-sm uppercase tracking-wider font-semibold opacity-70">Confidence Score</p>
              <p className={cn("text-[40px] font-bold leading-none mt-1", v.color)}>{v.score}</p>
           </div>
        </div>

        {/* AI Feasibility Breakdown */}
        <h3 className="text-[20px] font-semibold text-text-primary mt-4">Feasibility Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#F3F4F6] p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
               <div className="w-8 h-8 rounded-lg bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center">
                  <HugeiconsIcon icon={Target01Icon} size={16} />
               </div>
               <span className="font-semibold text-text-primary">Market Demand</span>
            </div>
            <p className="text-sm text-text-secondary mb-4">How badly do users want this solution?</p>
            <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
               <div className="h-full bg-[#4F46E5]" style={{ width: verdict === "GO" ? "88%" : verdict === "PIVOT" ? "60%" : "30%" }} />
            </div>
          </div>

          <div className="bg-white border border-[#F3F4F6] p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
               <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
                  <HugeiconsIcon icon={DollarCircleIcon} size={16} />
               </div>
               <span className="font-semibold text-text-primary">Willingness to Pay</span>
            </div>
            <p className="text-sm text-text-secondary mb-4">Will they actually open their wallets?</p>
            <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
               <div className="h-full bg-[#10B981]" style={{ width: verdict === "GO" ? "75%" : verdict === "PIVOT" ? "45%" : "15%" }} />
            </div>
          </div>

          <div className="bg-white border border-[#F3F4F6] p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
               <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center">
                  <HugeiconsIcon icon={Briefcase02Icon} size={16} />
               </div>
               <span className="font-semibold text-text-primary">Execution Risk</span>
            </div>
            <p className="text-sm text-text-secondary mb-4">Technical or operational hurdles.</p>
            <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
               <div className="h-full bg-[#EF4444]" style={{ width: "40%" }} />
            </div>
          </div>
        </div>

        {/* Detailed Insights */}
        <div className="bg-white border border-[#F3F4F6] rounded-2xl p-6 lg:p-8 mt-2">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Key Insights</h3>
          <ul className="flex flex-col gap-4">
             <li className="flex gap-4 items-start">
               <div className="mt-0.5 text-[#10B981]"><HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} /></div>
               <div>
                  <p className="font-medium text-text-primary">Problem is real</p>
                  <p className="text-sm text-text-secondary mt-1">78% of respondents indicated they actively experience the problem described.</p>
               </div>
             </li>
             <li className="flex gap-4 items-start">
               <div className="mt-0.5 text-[#F59E0B]"><HugeiconsIcon icon={Alert01Icon} size={20} /></div>
               <div>
                  <p className="font-medium text-text-primary">Pricing friction</p>
                  <p className="text-sm text-text-secondary mt-1">Only 30% are willing to pay a monthly subscription, while 65% prefer a one-time fee.</p>
               </div>
             </li>
             <li className="flex gap-4 items-start">
               <div className="mt-0.5 text-brand-primary"><HugeiconsIcon icon={ChartBarLineIcon} size={20} /></div>
               <div>
                  <p className="font-medium text-text-primary">Competitor dissatisfaction</p>
                  <p className="text-sm text-text-secondary mt-1">Many respondents currently use workarounds and are unhappy with existing tools.</p>
               </div>
             </li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}
