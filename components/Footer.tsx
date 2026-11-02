import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { CATEGORIES, getToolsByCategory } from "@/lib/tools";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm mt-auto border-t border-slate-800/80 relative overflow-hidden">
      {/* Subtle Top Gradient Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-12 mb-16">
          {/* Main Tool Categories */}
          {CATEGORIES.slice(0, 4).map((cat) => (
            <div key={cat.id}>
              <h3 className="text-white font-bold text-xs tracking-wider uppercase mb-5">
                {cat.name}
              </h3>
              <ul className="space-y-3">
                {getToolsByCategory(cat.id).map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={`/${tool.slug}`}
                      className="hover:text-white transition-colors text-xs sm:text-sm font-medium"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Company & Legal */}
          <div>
            <h3 className="text-white font-bold text-xs tracking-wider uppercase mb-5">
              Company & Legal
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm font-medium">
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About PDF Pagenio
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-slate-850">
              <h3 className="text-white font-bold text-xs tracking-wider uppercase mb-3">
                International
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-white font-bold">English</span>
                <span className="text-slate-700">•</span>
                <Link href="/es/unir-pdf" className="hover:text-white transition-colors">Español</Link>
                <span className="text-slate-700">•</span>
                <Link href="/fr/fusionner-pdf" className="hover:text-white transition-colors">Français</Link>
                <span className="text-slate-700">•</span>
                <Link href="/id/gabungkan-pdf" className="hover:text-white transition-colors">Bahasa</Link>
                <span className="text-slate-700">•</span>
                <Link href="/pt-br/juntar-pdf" className="hover:text-white transition-colors">Português</Link>
                <span className="text-slate-700">•</span>
                <Link href="/hi/merge-pdf" className="hover:text-white transition-colors">हिन्दी</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <Logo size="sm" theme="dark" href="/" />
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span>© 2026 pdfpagenio.com. All rights reserved.</span>
          </div>

          {/* System Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems Operational</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link href="/pricing" className="hover:text-slate-300 transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
