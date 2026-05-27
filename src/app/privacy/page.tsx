import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — DailyTutors",
  description: "Read our privacy policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container-page py-12 max-w-3xl">
      <Link href="/" className="link-arrow">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <h1 className="mt-6 text-4xl font-extrabold">Privacy Policy</h1>
      <p className="mt-3 text-sm text-gray-500">Last updated: May 8, 2026</p>

      <div className="prose prose-lg mt-8 max-w-none">
        <h2>Introduction</h2>
        <p>
          At DailyTutors (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we are committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We may collect information about you in a variety of ways. The information we may collect on the Site includes:
        </p>
        <ul>
          <li><strong>Personal Data:</strong> Name, email address, phone number, and other information you voluntarily provide when registering or contacting us.</li>
          <li><strong>Usage Data:</strong> Information about how you interact with our Site, including pages visited, time spent, and clickthrough rates.</li>
          <li><strong>Device Data:</strong> Information about your device, browser type, IP address, and operating system.</li>
          <li><strong>Cookies:</strong> We use cookies to enhance your experience on our Site.</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>
          DailyTutors uses the information we collect or receive:
        </p>
        <ul>
          <li>To personalize your experience and to deliver content and product offerings relevant to your interests</li>
          <li>To improve our website and services</li>
          <li>To send periodic emails regarding your order or other products and services</li>
          <li>To follow up with you after correspondence (live chat, email, or phone inquiries)</li>
          <li>To generate a personal profile about you</li>
          <li>To increase our website and services&apos; functionality</li>
        </ul>

        <h2>Disclosure of Your Information</h2>
        <p>
          We may share your information in the following situations:
        </p>
        <ul>
          <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information is necessary to comply with the law.</li>
          <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us, including payment processors and analytics providers.</li>
          <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with a merger, sale, bankruptcy, dissolution, reorganization, or similar transaction.</li>
        </ul>

        <h2>Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical security measures to protect your personal information.
          However, no method of transmission over the internet or method of electronic storage is 100% secure.
          While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions or comments about this Privacy Policy, please contact us at:
        </p>
        <ul>
          <li>Email: privacy@dailytutors.com</li>
          <li>Website: www.dailytutors.com</li>
        </ul>
      </div>
    </div>
  );
}
