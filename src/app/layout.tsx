import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google"; // Only Mono needed now
import "./globals.css";
import { TerminalHeader } from "@/components/TerminalHeader";
import { TerminalFooter } from "@/components/TerminalFooter";
import { Toaster } from 'sonner';

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TRADE_OS | TERMINAL",
  description: "Institutional Execution Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistMono.variable} antialiased bg-[var(--terminal-bg)] text-[var(--terminal-fg)] h-screen flex flex-col overflow-hidden`}
      >
        <TerminalHeader />
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
        <TerminalFooter />
        <Toaster theme="dark" position="bottom-right" className="font-mono text-xs uppercase" />
      </body>
    </html>
  );
}
