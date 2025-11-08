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
  title: "Race Outdoor - Gardens, Lighting, Irrigation",
  description: "Mobile-first landscaping gallery and estimate system for JRL Garden",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logoUrl = process.env.NEXT_PUBLIC_BRAND_LOGO_URL || "/logo.png";
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return (
    <html lang="en">
      <head>
        {googleMapsApiKey && (
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`}
            async
            defer
          />
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-3xl mx-auto px-4`}>
        <header className="sticky top-0 z-20 bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80 border-b border-[rgba(45,80,22,0.15)]">
          <div className="flex items-center justify-between gap-2 py-3">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity min-w-0 flex-1">
              <img src={logoUrl} alt="Logo" className="h-8 w-8 flex-shrink-0 rounded-full object-cover border border-[rgba(45,80,22,0.2)] bg-[var(--foreground)]/5" />
              <div className="leading-tight min-w-0">
                <div className="text-lg font-semibold tracking-tight truncate">Josh Race Landscaping</div>
                <div className="text-xs opacity-80 truncate">904-640-9088</div>
              </div>
            </a>
            <a href="/estimate" className="text-xs font-semibold brand-btn px-2 py-1.5 rounded-md shadow-sm active:opacity-90 text-center leading-tight whitespace-nowrap sm:whitespace-normal sm:px-3 sm:text-sm flex-shrink-0">
              Start<br className="sm:hidden" /> Estimate
            </a>
          </div>
        </header>
        <main className="py-4">{children}</main>
      </body>
    </html>
  );
}
