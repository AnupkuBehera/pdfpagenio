"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle2, Sparkles } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-14 shadow-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>We are here to help</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Contact PDF Pagenio
        </h1>
        <p className="text-sm text-slate-500 mb-8 font-medium">
          Have a question, feedback, feature request, or need enterprise business support? Send us a message below or email support@pdfpagenio.com.
        </p>

        {submitted ? (
          <div className="text-center py-12 bg-green-50/80 rounded-3xl border border-green-200 p-8">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-black text-slate-800 mb-1">Message Received!</h3>
            <p className="text-xs text-slate-600 mb-6 font-medium">
              Thank you for contacting PDF Pagenio. Our team will review your inquiry and reply within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName("");
                setEmail("");
                setMessage("");
              }}
              className="btn-secondary text-xs px-5 py-2.5 rounded-xl font-bold"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Full Name
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
                Message or Question
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help with your PDF workflows?"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 mt-2 animate-shimmer"
            >
              <Send className="w-4 h-4" />
              <span>Send Message to Support</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
