import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import AuthGuard from "@/components/auth/AuthGuard";

export default function EarnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FEFEFE]">
      <Sidebar />
      {/* Main content: ml-[324px] matches sidebar width, px=32px to give x=356 from left edge */}
      <main className="flex-1 lg:ml-[324px] min-h-screen bg-[#FEFEFE] px-8 pb-16">
        <AuthGuard allowedRole="earner">
          {children}
        </AuthGuard>
      </main>
    </div>
  );
}
