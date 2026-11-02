import React from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft, Layers, FileArchive, Scissors } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center bg-slate-50/60">
      <div className="w-20 h-20 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 shadow-md shadow-brand-500/10">
        <FileQuestion className="w-10 h-10" />
      </div>

      <span className="text-xs font-black uppercase tracking-wider text-brand-600 block mb-2">
        Error 404
      </span>

      <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">
        Page Not Found
      </h1>

      <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto mb-8 font-medium">
        The tool or page you are looking for doesn&apos;t exist or has been moved. Explore our popular PDF tools below.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <Link
          href="/"
          className="btn-primary text-xs sm:text-sm px-6 py-3 rounded-2xl flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tools</span>
        </Link>
      </div>

      <div className="pt-8 border-t border-slate-200/80 w-full max-w-md">
        <span className="text-xs font-bold text-slate-400 block mb-3 uppercase tracking-wider">
          Popular Tools
        </span>
        <div className="grid grid-cols-3 gap-2">
          <Link
            href="/merge-pdf"
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-300 text-xs font-bold text-slate-700 hover:text-brand-600 transition-colors shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Merge</span>
          </Link>
          <Link
            href="/split-pdf"
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-300 text-xs font-bold text-slate-700 hover:text-brand-600 transition-colors shadow-sm"
          >
            <Scissors className="w-3.5 h-3.5 text-rose-600" />
            <span>Split</span>
          </Link>
          <Link
            href="/compress-pdf"
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-300 text-xs font-bold text-slate-700 hover:text-brand-600 transition-colors shadow-sm"
          >
            <FileArchive className="w-3.5 h-3.5 text-emerald-600" />
            <span>Compress</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

