import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Trash2, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-xs font-medium text-slate-400 mb-8">
          Effective: November 2026 • PDF Pagenio (pdfpagenio.com)
        </p>

        <div className="prose prose-slate text-sm leading-relaxed space-y-6 text-slate-600 font-medium">
          <section className="p-6 rounded-3xl bg-brand-50/50 border border-brand-100 flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm mb-1">
                Zero File Retention on Client-Side Tasks
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Standard tools (Merge, Split, Rotate, Remove Pages, Page Numbers, Watermark, Sign) execute entirely within your web browser using WebAssembly. Your files are never uploaded, stored, or indexed on any external server.
              </p>
            </div>
          </section>

          <h2 className="text-lg font-bold text-slate-900 pt-2">1. Data Controller</h2>
          <p>
            PDF Pagenio (&quot;we&quot;, &quot;our&quot;, or &quot;the Service&quot;) operates the website https://pdfpagenio.com. We are committed to protecting the privacy, security, and confidentiality of all user documents.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">2. Ephemeral Server Processing</h2>
          <p>
            For tools that require dedicated computing power (such as OCR, Office-to-PDF conversion, and Ghostscript compression), documents are transmitted over encrypted TLS 1.3 channels to temporary processing sandboxes. All source files and converted outputs are automatically and irreversibly deleted within sixty (60) minutes of processing.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">3. No Inspection or Model Training</h2>
          <p>
            We strictly do not inspect, read, copy, or use your document contents for machine learning, advertising, or third-party purposes. Your intellectual property remains exclusively yours.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">4. Cookies and Advertising (Google AdSense)</h2>
          <p>
            We use essential technical cookies to maintain application stability, user preferences, and anonymous performance analytics. In addition, third-party vendors, including Google, use cookies to serve advertisements based on a user&apos;s prior visits to our website or other websites on the Internet:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visits to our site and/or other sites across the web.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 underline hover:text-brand-700"
              >
                Google Ads Settings
              </a>{" "}
              or by visiting{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 underline hover:text-brand-700"
              >
                aboutads.info
              </a>.
            </li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 pt-2">5. Privacy Contact</h2>
          <p>
            To exercise your data rights under GDPR, CCPA, or applicable global privacy laws, please contact our Data Protection Officer at privacy@pdfpagenio.com.
          </p>
        </div>
      </div>
    </div>
  );
}
