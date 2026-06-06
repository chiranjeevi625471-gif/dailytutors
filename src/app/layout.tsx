import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StructuredData from "@/components/StructuredData";
import Analytics from "@/components/Analytics";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — UPSC, NEET, CET, CA & School-Board Coaching`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Daily Tutors", "daily tutors", "dailytutors",
    "UPSC", "IAS", "Civil Services", "NEET", "CET", "CA",
    "CBSE", "ICSE", "State Board", "Class 10", "Class 12",
    "Current Affairs", "Editorial Analysis", "Mains Answer Writing",
    "Prelims Quiz", "CSAT", "online coaching India",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  category: "education",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Decode the exams, Daily.`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Decode the exams, Daily.`,
    description: siteConfig.shortDescription,
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
  verification: {
    // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Vercel to verify in Search Console.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body className="min-h-screen bg-white text-gray-900 antialiased font-sans">
        <StructuredData />
        <Analytics />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
