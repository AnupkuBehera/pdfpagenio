import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Heart, Users, Globe2, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | PDF Pagenio",
  description: "Learn about PDF Pagenio, our mission for private, high-speed, and accessible in-browser PDF utilities.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
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

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Our Vision</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          About PDF Pagenio
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-10 font-medium">
          We believe working with documents should be instant, delightful, and accessible to everyone around the world without subscription walls or security compromises.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-10">
          <div className="p-7 rounded-3xl bg-brand-50/50 border border-brand-100 text-center">
            <Heart className="w-8 h-8 text-brand-600 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-800 text-base mb-1">Built with Passion</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Designed with obsessive care for speed, minimal clicks, and zero learning curve.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 text-center">
            <Globe2 className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-800 text-base mb-1">Global Community</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Available across 25+ localized languages to empower students and professionals everywhere.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200/80 text-center">
            <ShieldCheck className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-800 text-base mb-1">Zero-Trust Privacy</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Client-side WebAssembly computation keeps sensitive documents safe on your personal device.
            </p>
          </div>
        </div>

        <div className="prose prose-slate text-sm text-slate-600 space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Why We Built PDF Pagenio</h2>
          <p>
            Traditional desktop software is bloated and expensive. Web utilities are often riddled with intrusive ads, slow queue times, and uncertain privacy practices. PDF Pagenio solves this by bringing native-speed document manipulation directly into modern web browsers.
          </p>
          <p>
            From merging university study guides to signing real estate leases and extracting financial tables, PDF Pagenio is your reliable, daily document workspace.
          </p>
        </div>
      </div>
    </div>
  );
}
