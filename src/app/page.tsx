"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function RootPage() {
  const router = useRouter();
  const { user, isAuthenticated, getUser } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated) {
        try {
          await getUser();
          const u = useAuthStore.getState().user;
          if (u?.role === "earner") router.replace("/earner/dashboard");
          else router.replace("/founder/dashboard");
        } catch {
          router.replace("/auth/login");
        }
      } else {
        if (user?.role === "earner") router.replace("/earner/dashboard");
        else router.replace("/founder/dashboard");
      }
    };
    init();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEFEFE]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-primary flex items-center justify-center">
          <span className="text-white font-bold text-2xl">T</span>
        </div>
        <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
