import type { Metadata } from "next";
import "./globals.css";
import { DemoSwitcher } from "@/components/layout/DemoSwitcher";

export const metadata: Metadata = {
  title: {
    default: "NEXUS — Trusted Resource Sharing Network",
    template: "%s | NEXUS",
  },
  description:
    "A multi-organisation platform connecting underutilised spaces, equipment, and technical resources with eligible users through trusted access, fair allocation, and accountable sharing.",
  keywords: ["resource sharing", "equipment booking", "lab access", "makerspace", "institutional"],
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
        <DemoSwitcher />
      </body>
    </html>
  );
}
