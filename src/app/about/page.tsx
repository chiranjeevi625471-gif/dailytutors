import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "About DailyTutors — Our Mission & Vision",
  description: "Learn about DailyTutors mission to revolutionize UPSC preparation through daily current affairs, quality content, and personalized mentorship.",
};

export default function AboutPage() {
  return (
    <div className="container-page py-12 max-w-3xl">
      <Link href="/" className="link-arrow">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <h1 className="mt-6 text-4xl font-extrabold">About DailyTutors</h1>
      
      <div className="prose prose-lg mt-8 max-w-none">
        <h2>Our Mission</h2>
        <p>
          At DailyTutors, we believe that quality UPSC preparation should be accessible, affordable, and
          personalized. Our mission is to empower Indian aspirants with daily current affairs, structured
          answer writing practice, and comprehensive study materials needed to crack the UPSC Civil Services examination.
        </p>

        <h2>Why We Started</h2>
        <p>
          Traditional coaching centers often miss the nuance of daily current affairs and real-time issue analysis
          required for mains writing. We identified this gap and built a platform where:
        </p>
        <ul>
          <li>Current affairs are curated daily from The Hindu, PIB, and Indian Express</li>
          <li>Answer writing is evaluated by experienced toppers and mentors</li>
          <li>Prelims preparation combines daily quizzes with comprehensive static knowledge</li>
          <li>Optional subjects are covered through structured courses and mind maps</li>
        </ul>

        <h2>What We Offer</h2>
        <p>
          Our platform combines daily news analysis, answer writing practice, quiz-based learning, and structured
          courses — all designed to mirror the actual UPSC examination requirements. Every resource is created with
          one goal: helping you secure your rank.
        </p>

        <h2>Our Commitment</h2>
        <p>
          We are committed to:
        </p>
        <ul>
          <li>Publishing verified, factually accurate content daily</li>
          <li>Providing quality evaluation feedback on answer writing</li>
          <li>Maintaining affordable pricing without compromising quality</li>
          <li>Building a supportive community of motivated aspirants</li>
        </ul>
      </div>
    </div>
  );
}
