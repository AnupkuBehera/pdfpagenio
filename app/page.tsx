"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Scissors,
  FileMinus,
  FileSearch,
  LayoutGrid,
  FileArchive,
  Wrench,
  ScanText,
  Image,
  FileText,
  Presentation,
  Sheet,
  Globe,
  FileImage,
  FileEdit,
  Table,
  Archive,
  RotateCw,
  ListOrdered,
  Stamp,
  Crop,
  PenTool,
  Unlock,
  Lock,
  FileSignature,
  EyeOff,
  GitCompare,
  Sparkles,
  Languages,
  MessageSquare,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Smartphone,
  Laptop,
} from "lucide-react";
import { TOOLS, CATEGORIES, ToolCategory } from "@/lib/tools";

// Icon mapping helper
const ICON_MAP: Record<string, React.ElementType> = {
  Layers,
  Scissors,
  FileMinus,
  FileSearch,
  LayoutGrid,
  FileArchive,
  Wrench,
  ScanText,
  Image,
  FileText,
  Presentation,
  Sheet,
  Globe,
  FileImage,
  FileEdit,
  Table,
  Archive,
  RotateCw,
  ListOrdered,
  Stamp,
  Crop,
  PenTool,
  Unlock,
  Lock,
  FileSignature,
  EyeOff,
  GitCompare,
  Sparkles,
  Languages,
  MessageSquare,
};

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && (e.target as HTMLElement).tagName !== "INPUT") {
        e.preventDefault();
        document.getElementById("search-tools-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        {/* Floating High-Contrast Benefit Badge */}
        <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-slate-200/80 text-slate-700 text-xs font-bold mb-7 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06)] animate-in fade-in duration-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-slate-800 font-extrabold">100% In-Browser Engine</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-medium">Zero Server Latency</span>
          <span className="text-slate-300">•</span>
          <span className="text-brand-600 font-extrabold">Completely Free</span>
        </div>

        {/* Catchy Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] mb-6">
          Master Every Page.{" "}
          <span className="bg-gradient-to-r from-brand-600 via-rose-500 to-amber-500 bg-clip-text text-transparent block sm:inline">
            Pure Document Ingenuity.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-9 font-normal">
          Merge, split, compress, convert, and sign documents at the speed of thought.
          100% free, blazingly fast, and privately processed on your device.
        </p>

        {/* Command Center Search Bar */}
        <div className="max-w-2xl mx-auto relative mb-4 group">
          <Search className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-brand-600 transition-colors" />
          <input
            id="search-tools-input"
            type="text"
            placeholder="Search all 32 PDF tools or type a command (e.g. merge, compress, ocr, split)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-13 pr-24 py-4.5 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_6px_28px_-6px_rgba(15,23,42,0.06)] focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-400 text-sm sm:text-base font-medium placeholder:text-slate-400 transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl transition-colors"
              >
                Clear
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1">
                <kbd className="px-2 py-1 text-[11px] font-semibold text-slate-400 bg-slate-100 rounded-lg border border-slate-200 shadow-sm">
                  /
                </kbd>
                <kbd className="px-2 py-1 text-[11px] font-semibold text-slate-400 bg-slate-100 rounded-lg border border-slate-200 shadow-sm">
                  ⌘K
                </kbd>
              </div>
            )}
          </div>
        </div>

        {/* Trending Quick Tool Chips */}
        <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-slate-500 font-medium mb-10">
          <span className="font-bold text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Trending:
          </span>
          {[
            { label: "Merge PDF", slug: "merge-pdf" },
            { label: "Compress PDF", slug: "compress-pdf" },
            { label: "Sign PDF", slug: "sign-pdf" },
            { label: "Split PDF", slug: "split-pdf" },
            { label: "PDF to Word", slug: "pdf-to-word" },
          ].map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="px-3 py-1 rounded-xl bg-white/70 hover:bg-white text-slate-600 hover:text-brand-600 border border-slate-200/60 shadow-sm hover:shadow transition-all"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Segmented Category Pill Bar */}
        <div className="inline-flex items-center justify-center p-1.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-sm flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
            }`}
          >
            All Tools ({TOOLS.length})
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat.id
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        {filteredTools.length === 0 ? (
          <div className="text-center py-20 bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            <p className="text-slate-600 text-base font-semibold mb-2">
              No tools matching &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs text-slate-400 mb-6">
              Try searching for &quot;merge&quot;, &quot;split&quot;, &quot;compress&quot;, or &quot;convert&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="btn-primary text-xs px-5 py-2.5 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredTools.map((tool) => {
              const IconComp = ICON_MAP[tool.icon] || FileText;
              return (
                <Link
                  key={tool.id}
                  href={`/${tool.slug}`}
                  className="tool-card group"
                >
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-13 h-13 rounded-2xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 relative"
                      style={{
                        background: `linear-gradient(135deg, ${tool.color}, ${tool.color}e6)`,
                        boxShadow: `0 10px 24px -4px ${tool.color}45`,
                      }}
                    >
                      <IconComp className="w-6 h-6 drop-shadow-sm" />
                    </div>

                    {tool.badge && (
                      <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-brand-50 text-brand-700 border border-brand-200 tracking-wide">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-600 transition-colors mb-2 tracking-tight">
                    {tool.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-3 mb-6">
                    {tool.shortDescription}
                  </p>

                  {/* Micro indicator with Circular Action Arrow */}
                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-slate-700 transition-colors">
                    <span className="capitalize">{tool.category.replace("-", " ")}</span>
                    <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-all duration-200">
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 4-Tile Interactive Security & Performance Bento Grid */}
      <section className="py-24 bg-white/70 backdrop-blur-md border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-brand-600 block mb-2">
              Next-Gen Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Engineered for absolute privacy and speed
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Experience the power of local browser execution combined with server-grade document fidelity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Tile 1: Privacy Sandbox (Large - Span 2) */}
            <div className="md:col-span-2 bento-card flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rose-500/10 via-brand-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-brand-600 flex items-center justify-center mb-6 shadow-sm border border-rose-100">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Zero-Knowledge Sandbox
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                  Your files never leave your device
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-xl mb-8">
                  Unlike traditional cloud converters that upload your contracts and financial statements to remote servers, PDF Pagenio executes standard operations entirely in your browser memory via WebAssembly.
                </p>
              </div>

              {/* Visual Privacy Memory Pipeline */}
              <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 grid grid-cols-3 gap-3 text-center text-xs font-bold">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Source</span>
                  <span className="text-slate-800">Local Device</span>
                </div>
                <div className="p-3 bg-brand-50 text-brand-700 rounded-xl border border-brand-200 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold mb-0.5">Processing</span>
                  <span>WASM Memory</span>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Output</span>
                  <span className="text-slate-800">Instant Save</span>
                </div>
              </div>
            </div>

            {/* Bento Tile 2: Speed Meter */}
            <div className="bento-card flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 shadow-sm border border-teal-100">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
                  Near-Zero Latency
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
                  No queue times, no network round-trips, and zero upload waiting.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="text-4xl font-black text-slate-900 tracking-tight mb-1">
                  0.14<span className="text-brand-600 text-2xl font-bold">s</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">Average client-side execution speed</span>
              </div>
            </div>

            {/* Bento Tile 3: Vector Fidelity */}
            <div className="bento-card flex flex-col justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
                  100% Vector Fidelity
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
                  Text fonts, embedded vector paths, forms, and bookmarks are preserved at original DPI without lossy re-encoding.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Vector Typography</span>
                <span className="text-emerald-600">Preserved</span>
              </div>
            </div>

            {/* Bento Tile 4: AI & Security (Large - Span 2) */}
            <div className="md:col-span-2 bento-card flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-extrabold mb-3">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  AI Document Suite
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                  Chat, translate, and extract insights
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-xl mb-6">
                  Leverage embedded intelligent assistant tools to query complex multi-page contracts, auto-generate executive summaries, and translate documents across 100+ languages.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/chat-pdf"
                  className="px-4.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <span>Try Chat with PDF</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/ai-translate-pdf"
                  className="px-4.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <span>Translate PDF</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Platform Ecosystem Banner */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-brand-400 block mb-2">
              Cross-Platform Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Work seamlessly anywhere, anytime
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-8">
              Take your PDF toolkit on the move. Scan contracts and receipts on mobile devices or edit large documents completely offline on desktop.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/pricing"
                className="btn-primary text-xs sm:text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-brand-500/25 animate-shimmer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Get Mobile App</span>
              </Link>
              <Link
                href="/pricing"
                className="btn-secondary text-xs sm:text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 bg-slate-900 border-slate-800 text-white hover:bg-slate-800"
              >
                <Laptop className="w-4 h-4" />
                <span>Download Desktop</span>
              </Link>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-3xl p-8 border border-slate-800/80 text-center">
            <h3 className="text-xl font-bold mb-2">Need image editing tools?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Discover companion tools for batch image compression, cropping, resizing, and format conversion.
            </p>
            <Link
              href="/jpg-to-pdf"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span>Explore Image Suite</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
