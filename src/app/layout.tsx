import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import AuthProvider from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Tiqra – Truth-First Market Intelligence",
  description:
    "Validate your startup idea with real human feedback. Tiqra gives founders signal-based insights to Proceed, Pivot, or Kill – before investing a naira.",
  keywords: ["startup validation", "market research", "Nigeria", "founder tools"],
  openGraph: {
    title: "Tiqra – Truth-First Market Intelligence",
    description: "Validate your startup idea with verified human feedback.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className={`antialiased ${GeistSans.className}`}>
        <AuthProvider>
          {children}
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
