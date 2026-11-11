import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/data/site";
import "./globals.css";

const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const heading = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const code = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} — Visas, Flights, Hotels & Car Rental`,
  description: siteConfig.description,
  keywords: ["travel agency", "visa services", "flight booking", "hotel booking", "car rental"],
  openGraph: {
    title: `${siteConfig.name} Travel`,
    description: siteConfig.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#2f4bff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${body.variable} ${heading.variable} ${code.variable}`}>
      <body className="min-h-screen overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
