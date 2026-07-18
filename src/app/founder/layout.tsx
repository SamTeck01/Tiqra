import Sidebar from "@/components/layout/Sidebar";
import AuthGuard from "@/components/auth/AuthGuard";

export default function FounderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FEFEFE]">
      <Sidebar />
      <main className="tiqra-main flex-1">
        <AuthGuard allowedRole="founder">
          {children}
        </AuthGuard>
      </main>
    </div>
  );
}
