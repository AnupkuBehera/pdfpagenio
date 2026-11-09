"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Layers,
  FileText,
  FileImage,
  Globe,
  X,
  Menu,
  Sparkles,
} from "lucide-react";
import Logo from "@/components/Logo";
import { CATEGORIES, TOOLS, getToolsByCategory, getToolBySlug } from "@/lib/tools";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [convertMenuOpen, setConvertMenuOpen] = useState(false);

  // Derive active tool and active locale from pathname
  const segments = pathname ? pathname.split("/").filter(Boolean) : [];
  let currentLocale = "en";
  let activeTool = null;

  if (segments.length === 1) {
    activeTool = getToolBySlug(segments[0]);
  } else if (segments.length >= 2) {
    const loc = segments[0].toLowerCase();
    const slug = segments[1].toLowerCase();
    currentLocale = loc;
    for (const tool of TOOLS) {
      if (tool.localized) {
        for (const [l, info] of Object.entries(tool.localized)) {
          if (l.toLowerCase() === loc && info.slug === slug) {
            activeTool = tool;
            break;
          }
        }
      }
      if (activeTool) break;
    }
  }

  const localeBadge = currentLocale === "pt-br" ? "PT" : currentLocale.toUpperCase();

  const langLinks = [
    {
      code: "en",
      label: "English",
      href: activeTool ? `/${activeTool.slug}` : "/",
    },
    {
      code: "es",
      label: "Español",
      href: activeTool?.localized?.es?.slug ? `/es/${activeTool.localized.es.slug}` : "/es/unir-pdf",
    },
    {
      code: "fr",
      label: "Français",
      href: activeTool?.localized?.fr?.slug ? `/fr/${activeTool.localized.fr.slug}` : "/fr/fusionner-pdf",
    },
    {
      code: "id",
      label: "Bahasa Indonesia",
      href: activeTool?.localized?.id?.slug ? `/id/${activeTool.localized.id.slug}` : "/id/gabungkan-pdf",
    },
    {
      code: "pt-br",
      label: "Português (BR)",
      href: activeTool?.localized?.["pt-br"]?.slug ? `/pt-br/${activeTool.localized["pt-br"].slug}` : "/pt-br/juntar-pdf",
    },
    {
      code: "hi",
      label: "हिन्दी",
      href: activeTool?.localized?.hi?.slug ? `/hi/${activeTool.localized.hi.slug}` : "/hi/merge-pdf",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Logo size="md" href="/" />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <Link
                href="/merge-pdf"
                className="px-3.5 py-2 rounded-xl hover:text-brand-600 hover:bg-slate-100/70 transition-colors"
              >
                Merge PDF
              </Link>
              <Link
                href="/split-pdf"
                className="px-3.5 py-2 rounded-xl hover:text-brand-600 hover:bg-slate-100/70 transition-colors"
              >
                Split PDF
              </Link>
              <Link
                href="/compress-pdf"
                className="px-3.5 py-2 rounded-xl hover:text-brand-600 hover:bg-slate-100/70 transition-colors"
              >
                Compress PDF
              </Link>

              {/* Convert PDF Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setConvertMenuOpen(true)}
                onMouseLeave={() => setConvertMenuOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:text-brand-600 hover:bg-slate-100/70 transition-colors"
                >
                  <span>Convert PDF</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {convertMenuOpen && (
                  <div className="absolute top-full left-0 w-84 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/80 p-5 grid gap-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">
                      Convert to PDF
                    </div>
                    {getToolsByCategory("convert-to").map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/${tool.slug}`}
                        className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-slate-50 text-slate-700 hover:text-brand-600 transition-colors text-sm font-medium"
                      >
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
                          style={{ backgroundColor: tool.color }}
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">{tool.name}</span>
                      </Link>
                    ))}

                    <div className="border-t border-slate-100 my-1" />

                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">
                      Convert from PDF
                    </div>
                    {getToolsByCategory("convert-from").map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/${tool.slug}`}
                        className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-slate-50 text-slate-700 hover:text-brand-600 transition-colors text-sm font-medium"
                      >
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
                          style={{ backgroundColor: tool.color }}
                        >
                          <FileImage className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">{tool.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* All PDF Tools Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100/80 hover:bg-brand-50 hover:text-brand-600 transition-all text-slate-800 font-semibold"
                >
                  <Layers className="w-4 h-4 text-brand-600" />
                  <span>All Tools</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {megaMenuOpen && (
                  <div className="absolute top-full -left-24 w-[1000px] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/80 p-8 grid grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-3 duration-200 z-50">
                    {CATEGORIES.map((cat) => {
                      const tools = getToolsByCategory(cat.id);
                      return (
                        <div key={cat.id} className="space-y-3">
                          <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex items-center justify-between">
                            <span>{cat.name}</span>
                            <span className="text-[10px] font-normal text-slate-400">({tools.length})</span>
                          </h4>
                          <div className="space-y-0.5">
                            {tools.map((tool) => (
                              <Link
                                key={tool.id}
                                href={`/${tool.slug}`}
                                className="block text-xs font-semibold text-slate-700 hover:text-brand-600 py-1.5 px-2.5 rounded-xl hover:bg-slate-50 transition-colors truncate"
                              >
                                {tool.name}
                                {tool.badge && (
                                  <span className="ms-1.5 px-1.5 py-0.5 text-[9px] font-black rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                                    {tool.badge}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Actions: Pricing, Languages & Auth */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/pricing"
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 px-3.5 py-2 rounded-xl hover:bg-slate-100/60 transition-colors"
            >
              Pricing
            </Link>

            {/* Language Switcher */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-brand-600 rounded-xl hover:bg-slate-100/60 transition-colors border border-slate-200/80"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{localeBadge}</span>
              </button>
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/80 p-2 hidden group-hover:block animate-in fade-in duration-100 z-50">
                {langLinks.map((item) => {
                  const isActive = item.code === currentLocale;
                  return (
                    <Link
                      key={item.code}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors ${
                        isActive
                          ? "font-bold text-brand-600 bg-brand-50"
                          : "font-medium text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="text-[10px] font-normal uppercase opacity-75">Active</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <Link
              href="/pricing"
              className="btn-primary text-xs sm:text-sm px-5 py-2.5 rounded-2xl animate-shimmer"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span>Go Premium</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200/60"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-2xl px-5 pt-4 pb-8 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-4 border-b border-slate-100">
            <Link
              href="/merge-pdf"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 font-semibold text-sm text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-100"
            >
              Merge PDF
            </Link>
            <Link
              href="/split-pdf"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 font-semibold text-sm text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-100"
            >
              Split PDF
            </Link>
            <Link
              href="/compress-pdf"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 font-semibold text-sm text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-100"
            >
              Compress PDF
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 font-semibold text-sm text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-100"
            >
              Pricing
            </Link>
          </div>

          {/* Mobile Language Bar */}
          <div className="pt-2 pb-3 border-b border-slate-100">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Language / Idioma</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {langLinks.map((item) => {
                const isActive = item.code === currentLocale;
                return (
                  <Link
                    key={item.code}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 pt-1">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-1.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  {cat.name}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {getToolsByCategory(cat.id).map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/${tool.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs py-2 px-2.5 text-slate-700 hover:text-brand-600 truncate rounded-xl hover:bg-slate-50 border border-slate-100/60"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
