import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | PDF Pagenio",
  description: "Read the Terms of Service for using PDF Pagenio tools and services.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-14 shadow-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-xs font-medium text-slate-400 mb-8">
          Last Updated: November 2026 • PDF Pagenio (pdfpagenio.com)
        </p>

        <div className="prose prose-slate text-sm leading-relaxed space-y-6 text-slate-600 font-medium">
          <h2 className="text-lg font-bold text-slate-900 pt-2">1. Agreement to Terms</h2>
          <p>
            By accessing or using PDF Pagenio at https://pdfpagenio.com, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please discontinue use immediately.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">2. Acceptable Use</h2>
          <p>
            You may use our PDF tools for personal or commercial purposes. You agree not to upload malicious binaries, harmful scripts, or copyrighted files for which you lack authorization.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">3. User Ownership & Rights</h2>
          <p>
            You retain 100% full legal title, ownership, and copyright over all files, text, images, and documents processed through PDF Pagenio. We claim zero intellectual property rights over user data.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">4. Service Availability</h2>
          <p>
            The services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. While we strive for 100% uptime and high rendering fidelity, we recommend maintaining local backups of your source documents.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">5. Contact Support</h2>
          <p>
            For questions regarding these terms, please contact legal@pdfpagenio.com.
          </p>
        </div>
      </div>
    </div>
  );
}
