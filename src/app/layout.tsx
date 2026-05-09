import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tiqra – Truth-First Market Intelligence",
  description:
    "Validate your startup idea with real human feedback. Tiqra gives founders signal-based insights to Proceed, Pivot, or Kill – before investing a naira.",
  keywords: ["startup validation", "market research", "Nigeria", "founder tools"],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  openGraph: {
    title: "Tiqra – Truth-First Market Intelligence",
    description: "Validate your startup idea with verified human feedback.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
