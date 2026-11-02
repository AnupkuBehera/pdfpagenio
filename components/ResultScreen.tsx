"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Download,
  CheckCircle2,
  RefreshCw,
  QrCode,
  Share2,
  Layers,
  FileArchive,
  ArrowRight,
  ShieldCheck,
  X,
  Sparkles,
} from "lucide-react";
import { Tool } from "@/lib/tools";

export interface ResultScreenProps {
  tool: Tool;
  fileName: string;
  fileBytes?: Uint8Array;
  multipleFiles?: { fileName: string; bytes: Uint8Array }[];
  originalSize?: number;
  newSize?: number;
  savingsPercentage?: number;
  targetKb?: number;
  targetMet?: boolean;
  onReset: () => void;
}

export default function ResultScreen({
  tool,
  fileName,
  fileBytes,
  multipleFiles,
  originalSize,
  newSize,
  savingsPercentage,
  targetKb,
  targetMet,
  onReset,
}: ResultScreenProps) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    // Fire festive celebration
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#E5322D", "#F87171", "#3B82F6", "#10B981"],
    });

    if (fileBytes) {
      const blob = new Blob([fileBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Trigger automatic initial download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [fileBytes, fileName]);

  const handleDownloadZipOrSingle = () => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      link.click();
    } else if (multipleFiles && multipleFiles.length > 0) {
      multipleFiles.forEach((file) => {
        const blob = new Blob([file.bytes.buffer as ArrayBuffer], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.fileName;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      });
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-8 sm:p-14 text-center animate-in zoom-in-95 duration-200">
      {/* Success Badge */}
      <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-green-50 to-green-100 text-green-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/10">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-2">
        PDF Successfully Processed!
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Your document is ready. The download started automatically in your browser.
      </p>

      {/* Savings Metric for Compress */}
      {savingsPercentage !== undefined && savingsPercentage > 0 && (
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-50/80 border border-green-200 text-green-700 text-sm font-bold mb-4 shadow-sm">
          <span>{formatFileSize(originalSize)}</span>
          <ArrowRight className="w-4 h-4 text-green-500" />
          <span>{formatFileSize(newSize)}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-green-600 text-white text-xs font-black">
            -{savingsPercentage}% Smaller
          </span>
        </div>
      )}

      {/* Target Met Compliance Badges for Govt Exam & Form Uploads */}
      {(tool.id.includes("200kb") || targetKb === 200 || (newSize && newSize <= 204800 && (targetKb || tool.id.includes("form")))) && (
        <div className="block mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>✓ Strictly Under 200 KB — Ready for UPSC, SSC & Govt Job Form Uploads</span>
          </div>
        </div>
      )}

      {(tool.id.includes("100kb") || targetKb === 100) && (
        <div className="block mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>✓ Strictly Under 100 KB — Verified for Passport, Visa & Photo ID Uploads</span>
          </div>
        </div>
      )}

      {/* Main Download Action */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
        <button
          onClick={handleDownloadZipOrSingle}
          className="btn-primary w-full sm:w-auto text-base sm:text-lg px-8 py-4 rounded-2xl shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 group animate-shimmer"
        >
          <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          <span>Download {tool.name}</span>
        </button>

        <button
          onClick={() => setShowQrModal(true)}
          title="Scan QR Code to download on mobile"
          className="btn-secondary w-full sm:w-auto px-5 py-4 rounded-2xl flex items-center justify-center gap-2 text-slate-700"
        >
          <QrCode className="w-5 h-5" />
          <span className="sm:hidden font-bold">QR for Mobile</span>
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600 border-t border-slate-100 pt-6">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Document page link copied to clipboard!");
          }}
          className="inline-flex items-center gap-1.5 hover:text-brand-600 transition-colors"
        >
          <Share2 className="w-4 h-4 text-slate-400" />
          <span>Copy link</span>
        </button>

        <span>•</span>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 hover:text-brand-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-slate-400" />
          <span>Process another file</span>
        </button>
      </div>

      {/* Tool Chaining Recommendations */}
      <div className="mt-10 p-6 rounded-3xl bg-slate-50 border border-slate-200/80 text-start">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            Recommended Next Steps
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <Link
            href="/compress-pdf"
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-sm transition-all text-xs font-bold text-slate-700 hover:text-brand-600"
          >
            <FileArchive className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Compress file</span>
          </Link>
          <Link
            href="/protect-pdf"
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-sm transition-all text-xs font-bold text-slate-700 hover:text-brand-600"
          >
            <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Protect with password</span>
          </Link>
          <Link
            href="/merge-pdf"
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-sm transition-all text-xs font-bold text-slate-700 hover:text-brand-600"
          >
            <Layers className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Merge with others</span>
          </Link>
        </div>
      </div>

      {/* Micro-monetization Callout for High-Volume Users */}
      <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-black text-slate-800 block">
            Processing batches of documents frequently?
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Get PDF Pagenio Pro from ₹49/mo (UPI) with unlimited batch processing & zero ads.
          </span>
        </div>
        <Link
          href="/pricing"
          className="shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm shadow-brand-500/20"
        >
          View Pro Plans
        </Link>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl relative text-center">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800">
              <QrCode className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">Scan to Download</h3>
            <p className="text-xs text-slate-500 mb-6">
              Point your smartphone camera to download your document directly to mobile.
            </p>
            <div className="w-48 h-48 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300">
              <span className="text-xs font-bold text-slate-400">QR Code Active</span>
            </div>
            <button
              onClick={() => setShowQrModal(false)}
              className="mt-6 w-full btn-secondary py-3 rounded-2xl text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
