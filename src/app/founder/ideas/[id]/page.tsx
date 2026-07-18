"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { databases } from "@/lib/appwrite";
import { DB_ID, COLLECTIONS } from "@/lib/appwrite.config";
import { Idea } from "@/lib/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Calendar01Icon, UserGroupIcon, ChartBarLineIcon, Settings01Icon, Rocket01Icon, DocumentValidationIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import TopBar from "@/components/layout/TopBar";

export default function IdeaDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchIdea() {
      try {
        const doc = await databases.getDocument(DB_ID, COLLECTIONS.SURVEYS, id);
        setIdea(doc as unknown as Idea);
      } catch (err: any) {
        setError(err.message || "Failed to load idea");
      } finally {
        setLoading(false);
      }
    }
    fetchIdea();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopBar title="Loading Idea..." subtitle="" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopBar title="Error" subtitle="" />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <p className="text-text-secondary mb-4">{error || "Idea not found"}</p>
          <button onClick={() => router.push("/founder/ideas")} className="btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Quick helper to determine what action to show
  const isDraft = idea.status === "draft";
  const isLive = idea.status === "live";
  const isCompleted = idea.status === "completed";

  return (
    <div className="flex flex-col min-h-screen pb-24 lg:pb-8">
      {/* Dynamic TopBar */}
      <div className="flex items-center gap-4 py-4 px-4 lg:px-8 border-b border-[#F3F4F6] bg-white sticky top-0 z-10">
        <button onClick={() => router.push("/founder/ideas")} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F8F9FC] text-text-secondary hover:text-text-primary transition-colors">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
        </button>
        <div>
          <h1 className="text-[20px] font-semibold text-text-primary line-clamp-1">{idea.title}</h1>
          <p className="text-xs text-text-secondary capitalize">{idea.status} Idea</p>
        </div>
        <div className="ml-auto">
          {isDraft && (
            <button className="btn-primary py-2 px-4 text-sm gap-2">
              <HugeiconsIcon icon={Rocket01Icon} size={16} /> Launch Survey
            </button>
          )}
          {isLive && (
            <button onClick={() => router.push(`/founder/ideas/${id}/live`)} className="btn-primary bg-[#10B981] hover:bg-[#059669] py-2 px-4 text-sm gap-2">
              <HugeiconsIcon icon={ChartBarLineIcon} size={16} /> Live Tracking
            </button>
          )}
          {isCompleted && (
            <button onClick={() => router.push(`/founder/ideas/${id}/report`)} className="btn-primary py-2 px-4 text-sm gap-2">
              <HugeiconsIcon icon={DocumentValidationIcon} size={16} /> View Report
            </button>
          )}
        </div>
      </div>

      <div className="page-content mt-6 flex flex-col gap-6 max-w-4xl">
        {/* Main Card */}
        <div className="bg-white border border-[#F3F4F6] rounded-2xl p-6 lg:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-[24px] font-semibold text-text-primary">{idea.title}</h2>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                <HugeiconsIcon icon={Calendar01Icon} size={16} />
                <span>Created {new Date(idea.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                <HugeiconsIcon icon={UserGroupIcon} size={16} />
                <span>Target: {idea.targetAudience.country}</span>
              </div>
              <div className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider",
                isDraft ? "bg-[#F3F4F6] text-text-secondary" :
                isLive ? "bg-[#D1FAE5] text-[#059669]" : "bg-[#EDE9FE] text-brand-primary"
              )}>
                {idea.status}
              </div>
            </div>
          </div>

          <div className="h-px bg-[#F3F4F6]" />

          <div>
            <h3 className="text-body font-semibold text-text-primary mb-2">Description</h3>
            <p className="text-body text-text-secondary leading-relaxed">{idea.description}</p>
          </div>

          {/* Progress (if live or completed) */}
          {(isLive || isCompleted) && (
            <>
              <div className="h-px bg-[#F3F4F6]" />
              <div>
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-body font-semibold text-text-primary">Validation Progress</h3>
                  <span className="text-sm font-medium text-brand-primary">
                    {idea.respondentsCompleted} / {idea.respondentsRequired}
                  </span>
                </div>
                <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-primary transition-all duration-1000"
                    style={{ width: `${Math.min(100, (idea.respondentsCompleted / idea.respondentsRequired) * 100)}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions / Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex flex-col gap-2 p-5 bg-white border border-[#F3F4F6] rounded-2xl hover:border-brand-primary/30 transition-all text-left">
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-brand-primary flex items-center justify-center mb-1">
              <HugeiconsIcon icon={Settings01Icon} size={20} />
            </div>
            <span className="font-medium text-text-primary">Survey Configuration</span>
            <span className="text-sm text-text-secondary">Edit questions, target audience, and rewards.</span>
          </button>
          
          <button
            onClick={() => router.push(isLive ? `/founder/ideas/${id}/live` : `/founder/ideas/${id}/report`)}
            disabled={isDraft}
            className={cn(
              "flex flex-col gap-2 p-5 bg-white border border-[#F3F4F6] rounded-2xl transition-all text-left",
              isDraft ? "opacity-50 cursor-not-allowed" : "hover:border-brand-primary/30"
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-brand-primary flex items-center justify-center mb-1">
              <HugeiconsIcon icon={ChartBarLineIcon} size={20} />
            </div>
            <span className="font-medium text-text-primary">{isCompleted ? "View Full Report" : "Live Analytics"}</span>
            <span className="text-sm text-text-secondary">
              {isDraft ? "Available after launch." : "Track real-time data and insights."}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
