import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Daily Tutors — UPSC / IAS Exam Preparation",
  description:
    "Daily Current Affairs, Editorial Analysis, Answer Writing, Quizzes, PDFs, Mind Maps and Courses for UPSC Civil Services aspirants.",
  keywords: [
    "UPSC", "IAS", "Civil Services", "Current Affairs", "Editorial Analysis",
    "Mains Answer Writing", "Prelims Quiz", "CSAT", "PIB", "The Hindu", "Daily Tutors"
  ],
  openGraph: {
    title: "Daily Tutors — UPSC / IAS Exam Preparation",
    description: "One stop for daily current affairs, mains answer writing, quizzes and courses.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
