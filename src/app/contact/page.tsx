import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us — DailyTutors Support",
  description: "Get in touch with DailyTutors. Reach out with your questions, feedback, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div className="container-page py-12 max-w-3xl">
      <Link href="/" className="link-arrow">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <h1 className="mt-6 text-4xl font-extrabold">Contact Us</h1>
      <p className="mt-3 text-lg text-gray-600">
        Have questions? We&rsquo;d love to hear from you. Get in touch with our team.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <div className="flex flex-col items-start">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-bold text-gray-900">Email</h3>
          <p className="mt-2 text-sm text-gray-600">
            <a href="mailto:support@dailytutors.com" className="hover:text-brand">
              support@dailytutors.com
            </a>
          </p>
        </div>

        <div className="flex flex-col items-start">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand">
            <Phone className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-bold text-gray-900">Phone</h3>
          <p className="mt-2 text-sm text-gray-600">
            <a href="tel:+919876543210" className="hover:text-brand">
              +91 9876 543 210
            </a>
          </p>
        </div>

        <div className="flex flex-col items-start">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-bold text-gray-900">Office</h3>
          <p className="mt-2 text-sm text-gray-600">
            New Delhi, India
          </p>
        </div>
      </div>

      <div className="prose prose-lg mt-16 max-w-none">
        <h2>Get in Touch</h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-900">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
              placeholder="How can we help?"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-900">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              rows={5}
              className="mt-2 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
              placeholder="Tell us more..."
            ></textarea>
          </div>

          <button type="submit" className="btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
