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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 sm:gap-8 mb-16">
          {/* Main Tool Categories */}
          {CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <h3 className="text-white font-bold text-xs tracking-wider uppercase mb-4">
                {cat.name}
              </h3>
              <ul className="space-y-2.5">
                {getToolsByCategory(cat.id).map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={`/${tool.slug}`}
                      className="hover:text-white transition-colors text-xs font-medium block leading-snug"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Middle Section: Company & International Hub */}
        <div className="pt-10 pb-12 border-t border-slate-850 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
          {/* Company Links */}
          <div className="md:col-span-4">
            <h3 className="text-white font-bold tracking-wider uppercase mb-3 text-xs">
              Company & Legal
            </h3>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 font-medium">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About PDF Pagenio
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing Plans
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
            <p className="mt-3 text-slate-500 text-[11px] leading-relaxed">
              100% client-side web application for PDF processing. Zero file uploads to servers. Safe for HIPAA, CCPA, and FERPA workflows.
            </p>
          </div>

          {/* International Tools Links */}
          <div className="md:col-span-8">
            <h3 className="text-white font-bold tracking-wider uppercase mb-3 text-xs">
              International Tool Editions
            </h3>
            <div className="space-y-2 text-[11px]">
              <div>
                <span className="font-semibold text-slate-300 mr-2">Español:</span>
                <span className="space-x-2">
                  <Link href="/es/unir-pdf" className="hover:text-white transition-colors">Unir PDF</Link>
                  <span>•</span>
                  <Link href="/es/comprimir-pdf" className="hover:text-white transition-colors">Comprimir PDF</Link>
                  <span>•</span>
                  <Link href="/es/dividir-pdf" className="hover:text-white transition-colors">Dividir PDF</Link>
                  <span>•</span>
                  <Link href="/es/firmar-pdf" className="hover:text-white transition-colors">Firmar PDF</Link>
                  <span>•</span>
                  <Link href="/es/desbloquear-pdf" className="hover:text-white transition-colors">Desbloquear PDF</Link>
                  <span>•</span>
                  <Link href="/es/numerar-paginas-pdf" className="hover:text-white transition-colors">Numerar Páginas</Link>
                  <span>•</span>
                  <Link href="/es/rotar-pdf" className="hover:text-white transition-colors">Rotar PDF</Link>
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-300 mr-2">Français:</span>
                <span className="space-x-2">
                  <Link href="/fr/fusionner-pdf" className="hover:text-white transition-colors">Fusionner PDF</Link>
                  <span>•</span>
                  <Link href="/fr/compresser-pdf" className="hover:text-white transition-colors">Compresser PDF</Link>
                  <span>•</span>
                  <Link href="/fr/diviser-pdf" className="hover:text-white transition-colors">Diviser PDF</Link>
                  <span>•</span>
                  <Link href="/fr/signer-pdf" className="hover:text-white transition-colors">Signer PDF</Link>
                  <span>•</span>
                  <Link href="/fr/deverrouiller-pdf" className="hover:text-white transition-colors">Déverrouiller PDF</Link>
                  <span>•</span>
                  <Link href="/fr/numeroter-pdf" className="hover:text-white transition-colors">Numéroter PDF</Link>
                  <span>•</span>
                  <Link href="/fr/pivoter-pdf" className="hover:text-white transition-colors">Pivoter PDF</Link>
                  <span>•</span>
                  <Link href="/fr/pdf-en-jpg" className="hover:text-white transition-colors">PDF en JPG</Link>
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-300 mr-2">Bahasa Indonesia:</span>
                <span className="space-x-2">
                  <Link href="/id/gabungkan-pdf" className="hover:text-white transition-colors">Gabungkan PDF</Link>
                  <span>•</span>
                  <Link href="/id/kompres-pdf" className="hover:text-white transition-colors">Kompres PDF</Link>
                  <span>•</span>
                  <Link href="/id/kompres-pdf-ke-100kb" className="hover:text-white transition-colors">Kompres ke 100KB</Link>
                  <span>•</span>
                  <Link href="/id/kompres-pdf-untuk-formulir" className="hover:text-white transition-colors">Kompres untuk Formulir</Link>
                  <span>•</span>
                  <Link href="/id/pisahkan-pdf" className="hover:text-white transition-colors">Pisahkan PDF</Link>
                  <span>•</span>
                  <Link href="/id/tanda-tangani-pdf" className="hover:text-white transition-colors">Tanda Tangani PDF</Link>
                  <span>•</span>
                  <Link href="/id/buka-kunci-pdf" className="hover:text-white transition-colors">Buka Kunci PDF</Link>
                  <span>•</span>
                  <Link href="/id/nomor-halaman-pdf" className="hover:text-white transition-colors">Nomor Halaman</Link>
                  <span>•</span>
                  <Link href="/id/putar-pdf" className="hover:text-white transition-colors">Putar PDF</Link>
                  <span>•</span>
                  <Link href="/id/jpg-ke-pdf" className="hover:text-white transition-colors">JPG ke PDF</Link>
                  <span>•</span>
                  <Link href="/id/pdf-ke-jpg" className="hover:text-white transition-colors">PDF ke JPG</Link>
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-300 mr-2">Português:</span>
                <span className="space-x-2">
                  <Link href="/pt-br/juntar-pdf" className="hover:text-white transition-colors">Juntar PDF</Link>
                  <span>•</span>
                  <Link href="/pt-br/comprimir-pdf" className="hover:text-white transition-colors">Comprimir PDF</Link>
                  <span>•</span>
                  <Link href="/pt-br/comprimir-pdf-para-100kb" className="hover:text-white transition-colors">Comprimir para 100KB</Link>
                  <span>•</span>
                  <Link href="/pt-br/comprimir-pdf-para-formulario" className="hover:text-white transition-colors">Comprimir para Formulário</Link>
                  <span>•</span>
                  <Link href="/pt-br/dividir-pdf" className="hover:text-white transition-colors">Dividir PDF</Link>
                  <span>•</span>
                  <Link href="/pt-br/assinar-pdf" className="hover:text-white transition-colors">Assinar PDF</Link>
                  <span>•</span>
                  <Link href="/pt-br/desbloquear-pdf" className="hover:text-white transition-colors">Desbloquear PDF</Link>
                  <span>•</span>
                  <Link href="/pt-br/proteger-pdf" className="hover:text-white transition-colors">Proteger PDF</Link>
                  <span>•</span>
                  <Link href="/pt-br/numerar-paginas-pdf" className="hover:text-white transition-colors">Numerar Páginas</Link>
                  <span>•</span>
                  <Link href="/pt-br/girar-pdf" className="hover:text-white transition-colors">Girar PDF</Link>
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-300 mr-2">हिन्दी:</span>
                <span className="space-x-2">
                  <Link href="/hi/merge-pdf" className="hover:text-white transition-colors">मर्ज PDF</Link>
                  <span>•</span>
                  <Link href="/hi/compress-pdf-to-200kb" className="hover:text-white transition-colors">200KB तक कंप्रेस</Link>
                  <span>•</span>
                  <Link href="/hi/compress-pdf-for-online-form" className="hover:text-white transition-colors">फॉर्म के लिए कंप्रेस</Link>
                  <span>•</span>
                  <Link href="/hi/split-pdf" className="hover:text-white transition-colors">स्प्लिट PDF</Link>
                  <span>•</span>
                  <Link href="/hi/sign-pdf" className="hover:text-white transition-colors">साइन PDF</Link>
                  <span>•</span>
                  <Link href="/hi/unlock-pdf" className="hover:text-white transition-colors">अनलॉक PDF</Link>
                  <span>•</span>
                  <Link href="/hi/rotate-pdf" className="hover:text-white transition-colors">रोटेट PDF</Link>
                  <span>•</span>
                  <Link href="/hi/add-page-numbers" className="hover:text-white transition-colors">पेज नंबर जोड़ें</Link>
                  <span>•</span>
                  <Link href="/hi/jpg-to-pdf" className="hover:text-white transition-colors">JPG से PDF</Link>
                  <span>•</span>
                  <Link href="/hi/pdf-to-jpg" className="hover:text-white transition-colors">PDF से JPG</Link>
                </span>
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
