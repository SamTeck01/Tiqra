"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/onboarding");
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(136deg, #9F4EF5 0%, #C084FC 50%, #E5CAFC 100%)",
      }}
    >
      {/* Logo mark */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-[32px] bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <span className="text-white font-bold text-[56px] leading-none">T</span>
          </div>
          {/* Animated pulse rings */}
          <div className="absolute inset-0 rounded-[32px] border-2 border-white/30 animate-ping" />
        </div>

        <div className="text-center">
          <h1 className="text-[40px] font-bold text-white tracking-tight">Tiqra</h1>
          <p className="text-white/70 text-lg mt-1">Market Intelligence Platform</p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-white/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
