"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase, Clock, Send, CheckCircle2, Mail } from "lucide-react";

const JOBS = [
  {
    id: 1,
    title: "Content Writer - Current Affairs",
    department: "Content",
    location: "Remote",
    type: "Full-time",
    salary: "₹3-5 LPA",
    description: "Create daily current affairs analysis and editorial summaries for UPSC aspirants.",
    requirements: [
      "3+ years of experience in educational content writing",
      "Strong knowledge of current affairs and Indian polity",
      "Excellent writing and research skills",
      "Ability to simplify complex topics"
    ]
  },
  {
    id: 2,
    title: "Subject Matter Expert - Mains",
    department: "Academics",
    location: "Remote",
    type: "Full-time",
    salary: "₹4-7 LPA",
    description: "Develop and evaluate answer writing solutions for UPSC mains examination.",
    requirements: [
      "UPSC qualified preferred or equivalent subject expertise",
      "2+ years of teaching/mentoring experience",
      "Strong command over multiple optional subjects",
      "Ability to provide constructive feedback"
    ]
  },
  {
    id: 3,
    title: "Quiz & Question Designer",
    department: "Content",
    location: "Remote",
    type: "Part-time",
    salary: "₹1-2 LPA",
    description: "Design engaging prelims quizzes and previous year question compilations.",
    requirements: [
      "2+ years of experience in competitive exam preparation",
      "Strong analytical and logical reasoning skills",
      "Familiarity with UPSC exam pattern",
      "Attention to detail and accuracy"
    ]
  },
  {
    id: 4,
    title: "Full Stack Developer",
    department: "Technology",
    location: "Remote",
    type: "Full-time",
    salary: "₹5-8 LPA",
    description: "Build and maintain our learning platform using modern web technologies.",
    requirements: [
      "3+ years of web development experience",
      "Proficiency in React, Node.js, and databases",
      "Experience with Next.js is a plus",
      "Strong problem-solving skills"
    ]
  },
  {
    id: 5,
    title: "Community Manager",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    salary: "₹2-3.5 LPA",
    description: "Manage student community, respond to queries, and gather feedback for improvements.",
    requirements: [
      "2+ years of community management experience",
      "Excellent communication and interpersonal skills",
      "Experience with Discord, Telegram, or similar platforms",
      "Passion for UPSC and student success"
    ]
  },
  {
    id: 6,
    title: "Social Media Manager",
    department: "Marketing",
    location: "Remote",
    type: "Part-time",
    salary: "₹1.5-2.5 LPA",
    description: "Create and manage engaging social media content across platforms.",
    requirements: [
      "2+ years of social media management experience",
      "Strong content creation skills",
      "Knowledge of educational content marketing",
      "Familiarity with analytics tools"
    ]
  }
];

export function CareersContent() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.position) {
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", position: "", message: "" });
        setSubmitted(false);
      }, 3000);
    }
  };

  const selectedJobData = JOBS.find(j => j.id === selectedJob);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <div className="container-page py-6 xs:py-8 sm:py-12">
        <Link href="/" className="link-arrow">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mt-4 xs:mt-6 sm:mt-8 max-w-3xl">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Join Our <span className="text-brand">Mission</span>
          </h1>
          <p className="mt-2 xs:mt-3 sm:mt-4 text-sm xs:text-base sm:text-lg text-gray-600">
            We're building the future of UPSC preparation. If you're passionate about education and want to make an impact on thousands of aspirants, we'd love to hear from you.
          </p>
        </div>

        <div className="mt-8 xs:mt-10 sm:mt-12 grid gap-6 xs:gap-8 lg:grid-cols-3">
          {/* Jobs List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl xs:text-2xl font-bold mb-3 xs:mb-4">Open Positions</h2>
            <div className="space-y-2">
              {JOBS.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job.id)}
                  className={`w-full text-left p-3 xs:p-4 rounded-lg border-2 transition text-sm xs:text-base ${
                    selectedJob === job.id
                      ? "border-brand bg-brand-50"
                      : "border-gray-200 bg-white hover:border-brand-200"
                  }`}
                >
                  <h3 className="font-bold text-gray-900 text-sm xs:text-base">{job.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {job.type}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {job.salary}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Job Details & Application Form */}
          <div className="lg:col-span-2">
            {selectedJobData ? (
              <div className="card p-4 xs:p-6 sm:p-8">
                <h2 className="text-2xl xs:text-3xl font-bold">{selectedJobData.title}</h2>
                <p className="mt-1 xs:mt-2 text-sm xs:text-base text-gray-600">{selectedJobData.department}</p>

                <div className="mt-4 xs:mt-6 flex flex-col xs:flex-row xs:flex-wrap gap-3 xs:gap-4">
                  <div className="flex items-center gap-2 text-xs xs:text-sm">
                    <MapPin className="h-4 xs:h-5 w-4 xs:w-5 text-brand flex-none" />
                    <span>{selectedJobData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs xs:text-sm">
                    <Briefcase className="h-4 xs:h-5 w-4 xs:w-5 text-brand flex-none" />
                    <span>{selectedJobData.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs xs:text-sm">
                    <Clock className="h-4 xs:h-5 w-4 xs:w-5 text-brand flex-none" />
                    <span>{selectedJobData.salary}</span>
                  </div>
                </div>

                <div className="mt-6 xs:mt-8">
                  <h3 className="font-bold text-base xs:text-lg">About the Role</h3>
                  <p className="mt-2 text-sm xs:text-base text-gray-700">{selectedJobData.description}</p>
                </div>

                <div className="mt-4 xs:mt-6">
                  <h3 className="font-bold text-base xs:text-lg">Requirements</h3>
                  <ul className="mt-2 xs:mt-3 space-y-2">
                    {selectedJobData.requirements.map((req, idx) => (
                      <li key={idx} className="flex gap-2 xs:gap-3">
                        <CheckCircle2 className="h-4 xs:h-5 w-4 xs:w-5 text-brand flex-none mt-0.5" />
                        <span className="text-sm xs:text-base text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 xs:mt-8 pt-6 xs:pt-8 border-t">
                  <h3 className="font-bold text-base xs:text-lg mb-3 xs:mb-4">Apply Now</h3>
                  
                  {submitted ? (
                    <div className="p-3 xs:p-4 bg-green-50 border border-green-200 rounded-lg flex gap-2 xs:gap-3">
                      <CheckCircle2 className="h-4 xs:h-5 w-4 xs:w-5 text-green-600 flex-none mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm xs:text-base text-green-900">Application Submitted!</p>
                        <p className="text-xs xs:text-sm text-green-700 mt-1">We'll review your application and get back to you soon.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4">
                      <div>
                        <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Your full name"
                          className="w-full px-3 xs:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your.email@example.com"
                          className="w-full px-3 xs:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-3 xs:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1">Position *</label>
                        <select
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 xs:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                        >
                          <option value="">Select a position</option>
                          {JOBS.map(job => (
                            <option key={job.id} value={job.title}>{job.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1">Cover Letter / Message</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us why you're interested in this role..."
                          rows={4}
                          className="w-full px-3 xs:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full btn-primary flex items-center justify-center gap-2 text-sm xs:text-base"
                      >
                        <Send className="h-4 w-4" /> Submit Application
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="card p-4 xs:p-6 sm:p-8 flex flex-col items-center justify-center min-h-64 xs:min-h-80 sm:min-h-96 text-center">
                <Mail className="h-12 xs:h-16 w-12 xs:w-16 text-gray-300 mb-3 xs:mb-4" />
                <h3 className="text-lg xs:text-xl font-bold text-gray-700">Select a Position</h3>
                <p className="mt-2 text-sm xs:text-base text-gray-600">Choose a job from the list to view details and apply.</p>
              </div>
            )}
          </div>
        </div>

        {/* Why Join Us */}
        <div className="mt-12 xs:mt-14 sm:mt-16 max-w-4xl mx-auto px-4 xs:px-0">
          <h2 className="text-2xl xs:text-3xl font-bold text-center mb-6 xs:mb-8">Why Join DailyTutors?</h2>
          <div className="grid gap-4 xs:gap-6 md:grid-cols-3">
            {[
              {
                title: "Impact Driven",
                description: "Help thousands of UPSC aspirants achieve their dreams"
              },
              {
                title: "Flexible Work",
                description: "Remote positions with flexible working hours"
              },
              {
                title: "Growth Opportunities",
                description: "Learn from experienced educators and tech professionals"
              },
              {
                title: "Competitive Salary",
                description: "Attractive compensation based on experience"
              },
              {
                title: "Passionate Team",
                description: "Work with a team committed to education excellence"
              },
              {
                title: "Continuous Learning",
                description: "Access to courses and educational resources"
              }
            ].map((benefit, idx) => (
              <div key={idx} className="card p-4 xs:p-5 sm:p-6 text-center">
                <h3 className="font-bold text-base xs:text-lg">{benefit.title}</h3>
                <p className="mt-2 text-xs xs:text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
