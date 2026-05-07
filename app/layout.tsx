import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "WealthLedger - Personal Finance Dashboard",
  description: "A comprehensive personal finance dashboard built with Next.js and Redux Toolkit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#05070d] text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
