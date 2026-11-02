"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Send, CheckCircle2, Sparkles, Loader2, AlertCircle, Clock, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "e34ba1df-8ee5-4b07-9e7f-648c66e287a9", // Web3Forms public contact relay key
          from_name: "PDF Pagenio Contact Form",
          subject: subject.trim() ? `[Contact] ${subject}` : `[Contact] New inquiry from ${name}`,
          name,
          email,
          message,
          replyto: email,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        // If API key is rejected or rate limited, gracefully offer direct mailto link
        setError(data.message || "Failed to submit through form. Please email us directly.");
      }
    } catch {
      setError("Network error while sending. Please click below to send via your email app.");
    } finally {
      setLoading(false);
    }
  };

  const mailtoLink = `mailto:support@pdfpagenio.com?subject=${encodeURIComponent(
    subject || `Support request from ${name || "PDF Pagenio User"}`
  )}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  )}`;

  return (
    <div className="min-h-screen bg-slate-50/60 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Contact Form Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Direct Support</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              Send us a Message
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 font-medium">
              Have a question, feedback, or need enterprise business support? We are here to help.
            </p>

            {submitted ? (
              <div className="text-center py-10 bg-green-50/80 rounded-2xl border border-green-200 p-6">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-black text-slate-800 mb-1">Message Sent!</h3>
                <p className="text-xs text-slate-600 mb-6 font-medium">
                  Thank you for reaching out to PDF Pagenio. We have received your inquiry and will reply to{" "}
                  <strong className="text-slate-900">{email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setSubject("");
                    setMessage("");
                  }}
                  className="btn-secondary text-xs px-5 py-2.5 rounded-xl font-bold"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Delivery Notice</span>
                    </div>
                    <p className="mb-3">{error}</p>
                    <a
                      href={mailtoLink}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors shadow-sm"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send directly to support@pdfpagenio.com</span>
                    </a>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Subject (Optional)
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Question about Compress PDF tool"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how we can help you..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message to Support</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Quick Contact & Info Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm mb-1">Direct Support Email</h3>
              <p className="text-xs text-slate-500 mb-3 font-medium">
                You can write to our official support desk anytime:
              </p>
              <a
                href="mailto:support@pdfpagenio.com"
                className="inline-block text-xs font-black text-brand-600 hover:text-brand-700 bg-brand-50/60 px-3 py-1.5 rounded-xl border border-brand-200/60 hover:bg-brand-100/50 transition-colors"
              >
                support@pdfpagenio.com
              </a>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm mb-1">Fast Response Time</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Our support team typically responds to all inquiries within 2 to 12 business hours.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm mb-1">Privacy Guaranteed</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Your email and message details are kept strictly confidential and never shared or sold.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
