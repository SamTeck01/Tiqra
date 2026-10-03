import AuthGuard from "@/components/auth/AuthGuard";
import EarnerShell from "@/components/layout/EarnerShell";

export default function EarnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRole="earner">
      <EarnerShell>{children}</EarnerShell>
    </AuthGuard>
  );
}
