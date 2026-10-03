"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSurvey } from "@/components/shared/useSurvey";

/** Sends the founder to the right view for the idea's state. */
export default function IdeaRedirect() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { survey } = useSurvey(id);

  useEffect(() => {
    if (!survey) return;
    if (survey.status === "completed") router.replace(`/founder/ideas/${id}/report`);
    else if (survey.status === "draft") router.replace("/founder/ideas/new/manual");
    else router.replace(`/founder/ideas/${id}/live`);
  }, [survey, id, router]);

  return <div className="skeleton mt-14 h-[400px]" />;
}
