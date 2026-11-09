"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, HelpCircle, Shield, Zap, Sparkles, CheckCircle2, Globe } from "lucide-react";
import { Tool, getToolsByCategory } from "@/lib/tools";
import FileUploader from "./FileUploader";
import Workspace from "./Workspace";
import ResultScreen from "./ResultScreen";

export interface ToolPageLayoutProps {
  tool: Tool;
  locale?: string;
}

const UI_TEXT: Record<string, {
  howTo: (name: string) => string;
  faq: string;
  related: string;
  availableLanguages: string;
  trustBadge: string;
  steps: [string, string, string];
}> = {
  es: {
    howTo: (name) => `Cómo usar ${name} en 3 pasos sencillos`,
    faq: "Preguntas Frecuentes",
    related: "Explorar más herramientas PDF",
    availableLanguages: "Disponible en otros idiomas",
    trustBadge: "100% en el dispositivo • Seguro y privado",
    steps: ["1. Subir", "2. Configurar", "3. Descargar"],
  },
  fr: {
    howTo: (name) => `Comment utiliser ${name} en 3 étapes simples`,
    faq: "Foire Aux Questions",
    related: "Explorer d'autres outils PDF",
    availableLanguages: "Disponible dans d'autres langues",
    trustBadge: "100% sur l'appareil • Sécurisé et privé",
    steps: ["1. Téléverser", "2. Configurer", "3. Télécharger"],
  },
  id: {
    howTo: (name) => `Cara menggunakan ${name} dalam 3 langkah mudah`,
    faq: "Pertanyaan yang Sering Diajukan",
    related: "Jelajahi Alat PDF Lainnya",
    availableLanguages: "Tersedia dalam bahasa lain",
    trustBadge: "100% di perangkat • Aman & Privat",
    steps: ["1. Unggah", "2. Konfigurasi", "3. Unduh"],
  },
  "pt-br": {
    howTo: (name) => `Como usar ${name} em 3 passos simples`,
    faq: "Perguntas Frequentes",
    related: "Explorar mais ferramentas PDF",
    availableLanguages: "Disponível em outros idiomas",
    trustBadge: "100% no dispositivo • Seguro e privado",
    steps: ["1. Enviar", "2. Configurar", "3. Baixar"],
  },
  hi: {
    howTo: (name) => `3 आसान चरणों में ${name} का उपयोग कैसे करें`,
    faq: "अक्सर पूछे जाने वाले प्रश्न",
    related: "अन्य PDF टूल्स देखें",
    availableLanguages: "अन्य भाषाओं में उपलब्ध",
    trustBadge: "100% डिवाइस पर • सुरक्षित और निजी",
    steps: ["1. अपलोड करें", "2. कॉन्फ़िगर करें", "3. डाउनलोड करें"],
  },
};

export default function ToolPageLayout({ tool, locale }: ToolPageLayoutProps) {
  const isRtl = locale === "ar";
  const locKey = locale?.toLowerCase();
  const locInfo = tool.localized
    ? Object.entries(tool.localized).find(([k]) => k.toLowerCase() === locKey)?.[1]
    : undefined;

  const displayName = locInfo?.name || tool.name;
  const displayDescription = locInfo?.description || tool.longDescription;

  const ui = (locKey && UI_TEXT[locKey]) || {
    howTo: (name: string) => `How to ${name} in 3 Simple Steps`,
    faq: "Frequently Asked Questions",
    related: "Explore More PDF Tools",
    availableLanguages: "Available in other languages",
    trustBadge: "100% On-Device • HIPAA, CCPA & FERPA Safe",
    steps: ["1. Upload", "2. Configure", "3. Download"],
  };

  const [stage, setStage] = useState<"upload" | "workspace" | "result">("upload");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [resultData, setResultData] = useState<{
    fileName: string;
    bytes?: Uint8Array;
    multipleFiles?: { fileName: string; bytes: Uint8Array }[];
    originalSize?: number;
    newSize?: number;
    savingsPercentage?: number;
    targetKb?: number;
    targetMet?: boolean;
  } | null>(null);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setStage("workspace");
  };

  const handleComplete = (data: {
    fileName: string;
    bytes?: Uint8Array;
    multipleFiles?: { fileName: string; bytes: Uint8Array }[];
    originalSize?: number;
    newSize?: number;
    savingsPercentage?: number;
    targetKb?: number;
    targetMet?: boolean;
  }) => {
    setResultData(data);
    setStage("result");
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setResultData(null);
    setStage("upload");
  };

  const relatedTools = getToolsByCategory(tool.category).filter((t) => t.id !== tool.id).slice(0, 4);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`min-h-screen flex flex-col bg-slate-50/60 ${isRtl ? "rtl text-right" : ""}`}
    >
      {/* Tool Hero Header */}
      <section className="pt-10 pb-6 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        {/* Breadcrumb & Step Progress Stepper */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Link href="/" className="hover:text-slate-600">Home</Link>
            <ChevronRight className="w-3 h-3 rtl:rotate-180" />
            <span className="capitalize">{tool.category.replace("-", " ")}</span>
            <ChevronRight className="w-3 h-3 rtl:rotate-180" />
            <span className="text-slate-800 font-bold">{tool.name}</span>
          </nav>

          {/* 3-Step Progress Indicator */}
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-[11px] font-bold">
            <span
              className={`px-3 py-1 rounded-xl transition-all ${
                stage === "upload"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-400"
              }`}
            >
              {ui.steps[0]}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-300 rtl:rotate-180" />
            <span
              className={`px-3 py-1 rounded-xl transition-all ${
                stage === "workspace"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-400"
              }`}
            >
              {ui.steps[1]}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-300 rtl:rotate-180" />
            <span
              className={`px-3 py-1 rounded-xl transition-all ${
                stage === "result"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-slate-400"
              }`}
            >
              {ui.steps[2]}
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
          {displayName}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {displayDescription}
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>{ui.trustBadge}</span>
          </span>
        </div>
      </section>

      {/* Main Interactive Stage Container */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8">
        {stage === "upload" && (
          <FileUploader
            tool={tool}
            onFilesSelected={handleFilesSelected}
            multiple={tool.maxFiles > 1}
          />
        )}

        {stage === "workspace" && (
          <Workspace
            tool={tool}
            initialFiles={selectedFiles}
            onComplete={handleComplete}
            onCancel={handleReset}
          />
        )}

        {stage === "result" && resultData && (
          <ResultScreen
            tool={tool}
            fileName={resultData.fileName}
            fileBytes={resultData.bytes}
            multipleFiles={resultData.multipleFiles}
            originalSize={resultData.originalSize}
            newSize={resultData.newSize}
            savingsPercentage={resultData.savingsPercentage}
            targetKb={resultData.targetKb}
            targetMet={resultData.targetMet}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Trust & Features Strip */}
      <section className="py-14 border-y border-slate-200/80 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm mb-1">Instant Browser Execution</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Runs directly inside your browser with WebAssembly for zero latency and instant processing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm mb-1">100% Privacy Guaranteed</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Your files are not stored, read, or indexed. Protected with TLS 1.3 encryption.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm mb-1">Free Forever</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  No hidden watermarks, no mandatory signups, and no limits on essential everyday PDF workflows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How To Step-by-Step Guide */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-center tracking-tight mb-10">
          {ui.howTo(displayName)}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tool.howTo.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <span className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white font-black text-sm flex items-center justify-center mb-5 shadow-md shadow-brand-500/20">
                  {idx + 1}
                </span>
                <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Accordion */}
      {tool.seo.faq.length > 0 && (
        <section className="py-16 bg-white border-t border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <HelpCircle className="w-8 h-8 text-brand-600 mx-auto mb-2" />
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {ui.faq}
              </h2>
            </div>

            <div className="space-y-4">
              {tool.seo.faq.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-slate-200/80 p-6 bg-slate-50/50"
                >
                  <h3 className="font-extrabold text-slate-800 text-base mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Available in Other Languages */}
      {tool.localized && Object.keys(tool.localized).length > 0 && (
        <section className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-slate-200/80">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900">
              {ui.availableLanguages}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {locale && (
              <Link
                href={`/${tool.slug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-brand-500 hover:text-brand-600 hover:shadow-xs transition-all"
              >
                <span>English</span>
                <span className="text-[10px] text-slate-400">({tool.name})</span>
              </Link>
            )}
            {Object.entries(tool.localized).map(([langKey, langInfo]) => {
              if (locale && langKey.toLowerCase() === locale.toLowerCase()) return null;
              const langLabels: Record<string, string> = {
                es: "Español",
                fr: "Français",
                id: "Bahasa Indonesia",
                "pt-br": "Português",
                hi: "हिन्दी",
              };
              const label = langLabels[langKey.toLowerCase()] || langKey.toUpperCase();
              return (
                <Link
                  key={langKey}
                  href={`/${langKey.toLowerCase()}/${langInfo.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-brand-500 hover:text-brand-600 hover:shadow-xs transition-all"
                >
                  <span>{label}</span>
                  <span className="text-[10px] text-slate-400">({langInfo.name})</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-slate-200/80">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            {ui.related}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedTools.map((rel) => (
              <Link
                key={rel.id}
                href={`/${rel.slug}`}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-brand-300 hover:shadow-lg transition-all group"
              >
                <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-brand-600 transition-colors mb-1.5">
                  {rel.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                  {rel.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
