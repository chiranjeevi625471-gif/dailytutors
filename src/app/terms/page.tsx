import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service — DailyTutors",
  description: "Review our terms of service to understand the rules and regulations governing your use of DailyTutors.",
};

export default function TermsPage() {
  return (
    <div className="container-page py-12 max-w-3xl">
      <Link href="/" className="link-arrow">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <h1 className="mt-6 text-4xl font-extrabold">Terms of Service</h1>
      <p className="mt-3 text-sm text-gray-500">Last updated: May 8, 2026</p>

      <div className="prose prose-lg mt-8 max-w-none">
        <h2>Agreement to Terms</h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot;) and DailyTutors (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), concerning your access to and use of the DailyTutors website and all related applications, platforms, technologies, or services accessed through it (the &quot;Site&quot;).
        </p>

        <h2>Intellectual Property Rights</h2>
        <p>
          Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality,
          software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the &quot;Content&quot;) and the trademarks,
          service marks, and logos contained therein (the &quot;Marks&quot;) are owned or controlled by us or licensed to us, and are protected by copyright
          and trademark laws and various other intellectual property rights and unfair competition laws.
        </p>
        <p>
          Except as expressly provided in these Terms, no part of the Site and no Content or Marks may be copied, reproduced, aggregated,
          republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited
          for any commercial purpose whatsoever, without our express prior written permission.
        </p>

        <h2>User Representations</h2>
        <p>
          By using the Site, you represent and warrant that:
        </p>
        <ul>
          <li>All registration information you submit will be true, accurate, current, and complete</li>
          <li>You will maintain the accuracy of such information and promptly update such registration information as necessary</li>
          <li>You have the legal capacity and you agree to comply with these Terms and all applicable laws and regulations</li>
          <li>You are not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use the Site</li>
          <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise</li>
          <li>You will not use the Site for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction</li>
        </ul>

        <h2>User Prohibited Behavior</h2>
        <p>
          You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those specifically endorsed or approved by us.
        </p>

        <h2>Disclaimers</h2>
        <p>
          The Site is provided on an as-is and as-available basis. We make no warranties, expressed or implied, and hereby disclaim and negate
          all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose,
          non-infringement of intellectual property, or other violation of rights.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          In no event shall DailyTutors or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
          or due to business interruption) arising out of or in connection with the use or inability to use the materials on DailyTutors&apos;s Site.
        </p>

        <h2>Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless DailyTutors and its licensee and licensors, and their employees, contractors, agents,
          officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, and expense arising from:
          (a) your use of and access to the Site; (b) your violation of any term or condition of these Terms; or (c) your violation of any third party right, including without limitation any copyright, property, or privacy right.
        </p>

        <h2>Modifications and Interruptions</h2>
        <p>
          We reserve the right to modify or discontinue, temporarily or permanently, the Site (or any part or content thereof) without notice at any time.
          You agree that we will not be liable to you or to any third party for any modification, suspension or discontinuance of the Site.
        </p>

        <h2>Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws of India,
          and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at:
        </p>
        <ul>
          <li>Email: legal@dailytutors.com</li>
          <li>Website: www.dailytutors.com</li>
        </ul>
      </div>
    </div>
  );
}
