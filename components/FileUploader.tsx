"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Shield, CheckCircle2 } from "lucide-react";
import { Tool } from "@/lib/tools";

export interface FileUploaderProps {
  tool: Tool;
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
}

export default function FileUploader({
  tool,
  onFilesSelected,
  multiple = true,
}: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesSelected(multiple ? acceptedFiles : [acceptedFiles[0]]);
      }
    },
    [onFilesSelected, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: multiple && tool.maxFiles > 1,
    accept: tool.acceptedFileTypes.reduce((acc, curr) => {
      if (curr.startsWith(".")) {
        const mime =
          curr === ".docx"
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : curr === ".doc"
            ? "application/msword"
            : curr === ".pdf"
            ? "application/pdf"
            : "application/octet-stream";
        if (!acc[mime]) acc[mime] = [];
        if (!acc[mime].includes(curr)) acc[mime].push(curr);
      } else {
        if (!acc[curr]) acc[curr] = [];
        if (curr === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && !acc[curr].includes(".docx")) {
          acc[curr].push(".docx");
        } else if (curr === "application/msword" && !acc[curr].includes(".doc")) {
          acc[curr].push(".doc");
        } else if (curr === "application/pdf" && !acc[curr].includes(".pdf")) {
          acc[curr].push(".pdf");
        }
      }
      return acc;
    }, {} as Record<string, string[]>),
  });

  const getButtonLabel = () => {
    if (tool.id === "jpg-to-pdf") return "Select JPG images";
    if (tool.id === "word-to-pdf") return "Select WORD files";
    if (tool.id === "powerpoint-to-pdf") return "Select POWERPOINT files";
    if (tool.id === "excel-to-pdf") return "Select EXCEL files";
    if (multiple && tool.maxFiles > 1) return "Select PDF files";
    return "Select PDF file";
  };

  return (
    <div
      {...getRootProps()}
      className={`relative w-full max-w-2xl mx-auto my-8 p-12 sm:p-16 border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer group ${
        isDragActive
          ? "border-brand-500 bg-brand-50/80 scale-[1.01] shadow-2xl shadow-brand-500/10"
          : "border-slate-300/80 bg-white/90 hover:border-brand-400 hover:bg-slate-50/70 shadow-sm hover:shadow-xl hover:shadow-brand-500/5"
      }`}
    >
      <input {...getInputProps()} />

      {/* Cloud & Arrow Animation Icon */}
      <div className="w-20 h-20 mb-6 rounded-3xl bg-gradient-to-tr from-brand-50 to-brand-100 text-brand-600 flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
        <UploadCloud className="w-10 h-10 animate-bounce duration-1000" />
      </div>

      {/* Main Select Button & Cloud Providers */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          className="btn-primary text-base sm:text-lg px-8 py-4 rounded-2xl shadow-xl shadow-brand-500/25 group-hover:from-brand-600 group-hover:to-brand-700 animate-shimmer"
        >
          {getButtonLabel()}
        </button>

        {/* Cloud Pickers: Google Drive & Dropbox */}
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            title="Import from Google Drive"
            onClick={() => alert("Google Drive integration: Connect your account to select files directly.")}
            className="w-13 h-13 p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 87.3 78" fill="none">
              <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z" fill="#0066DA"/>
              <path d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 49.9 0 51.45 0 53h27.5L43.65 25z" fill="#00AC47"/>
              <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.9 10.2 7.85 13.6z" fill="#EA4335"/>
              <path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.4-4.45 1.2L43.65 25z" fill="#00832D"/>
              <path d="M59.8 53H87.3c0-1.55-.4-3.1-1.2-4.5l-25.4-44c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53z" fill="#FFBA00"/>
              <path d="M73.4 26.5l-13.6-23.5c-.8-.5-1.7-.8-2.6-1L43.65 25l16.15 28h27.5c0-.8-.2-1.6-.6-2.3L73.4 26.5z" fill="#FFBA00"/>
              <path d="M27.5 53H0c0 1.55.4 3.1 1.2 4.5l25.4 44c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8L27.5 53z" fill="#2684FC"/>
            </svg>
          </button>

          <button
            type="button"
            title="Import from Dropbox"
            onClick={() => alert("Dropbox integration: Connect your account to select files directly.")}
            className="w-13 h-13 p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 40 40" fill="#0061FF">
              <path d="M10 7.5L0 14l10 6.5 10-6.5L10 7.5zm20 0l-10 6.5 10 6.5 10-6.5-10-6.5zM0 27l10 6.5 10-6.5-10-6.5L0 27zm40 0l-10-6.5-10 6.5 10 6.5L40 27zM20 28.5L10 35l-3-2v2.5l13 7.5 13-7.5V33l-3 2-10-6.5z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Drag helper text */}
      <p className="mt-4 text-sm font-semibold text-slate-500">
        or drop {multiple && tool.maxFiles > 1 ? "files" : "file"} here
      </p>

      {/* Privacy guarantee badge */}
      <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <Shield className="w-3.5 h-3.5 text-green-600" />
        <span>TLS 1.3 Encrypted • 100% Client-Side Processing • Max 100 MB</span>
      </div>
    </div>
  );
}
