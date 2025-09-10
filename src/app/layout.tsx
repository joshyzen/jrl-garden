import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Josh Race Landscape – jrl.garden",
  description: "Mobile-first landscaping gallery and estimate system for JRL Garden",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logoUrl = process.env.NEXT_PUBLIC_BRAND_LOGO_URL || "/logo.png";
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-3xl mx-auto px-4`}>
        <header className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80 border-b border-[rgba(45,80,22,0.15)]">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded-full object-cover border border-[rgba(45,80,22,0.2)] bg-[var(--foreground)]/5" />
              <div className="leading-tight">
                <div className="text-lg font-semibold tracking-tight">Josh Race Landscape</div>
                <div className="text-xs opacity-80">https://jrl.garden | 904-640-9088</div>
              </div>
            </div>
            <a href="/estimate" className="text-sm font-semibold brand-btn px-3 py-1.5 rounded-md shadow-sm active:opacity-90">
              Start estimate
            </a>
          </div>
        </header>
        <main className="py-4">{children}</main>
      </body>
    </html>
  );
}
