"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  RotateCw,
  RotateCcw,
  Trash2,
  Plus,
  ArrowRight,
  Loader2,
  FileText,
  Check,
  CheckCheck,
  Sparkles,
  X,
  AlertCircle,
} from "lucide-react";
import { Tool } from "@/lib/tools";
import { mergePDFs } from "@/lib/pdf/client-merge";
import { splitPDFByRanges, extractAllPages } from "@/lib/pdf/client-split";
import { removePages, extractPages } from "@/lib/pdf/client-remove-pages";
import { rotatePDF } from "@/lib/pdf/client-rotate";
import { addPageNumbers, PageNumberPosition, PageNumberFormat } from "@/lib/pdf/client-pagenumbers";
import { addWatermark } from "@/lib/pdf/client-watermark";
import { imagesToPDF } from "@/lib/pdf/client-images";
import { compressPDFClient, CompressionLevel } from "@/lib/pdf/client-compress";
import { signPDF } from "@/lib/pdf/client-sign";
import { convertPdfToDocx } from "@/lib/pdf/client-pdf-to-docx";
import { convertDocxToPdf } from "@/lib/pdf/client-docx-to-pdf";
import { convertPdfToJpg } from "@/lib/pdf/client-pdf-to-jpg";
import { cropPDF } from "@/lib/pdf/client-crop";
import { repairPDFClient } from "@/lib/pdf/client-repair";
import { organizePDF } from "@/lib/pdf/client-organize";
import { unlockPDFClient } from "@/lib/pdf/client-protect";
import { convertHtmlToPdf } from "@/lib/pdf/client-html-to-pdf";
import { addBatesStamping, BatesPosition } from "@/lib/pdf/client-bates";
import { flattenPDFClient } from "@/lib/pdf/client-flatten";

export interface WorkspaceFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  rotation: number;
  selected?: boolean;
}

export interface WorkspaceProps {
  tool: Tool;
  initialFiles: File[];
  onComplete: (data: {
    fileName: string;
    bytes?: Uint8Array;
    multipleFiles?: { fileName: string; bytes: Uint8Array }[];
    originalSize?: number;
    newSize?: number;
    savingsPercentage?: number;
    targetKb?: number;
    targetMet?: boolean;
  }) => void;
  onCancel: () => void;
}

// Sortable Thumbnail Card
function SortableCard({
  item,
  index,
  onRotate,
  onRemove,
  onToggleSelect,
  selectable,
}: {
  item: WorkspaceFileItem;
  index: number;
  onRotate: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onToggleSelect?: (id: string) => void;
  selectable?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white rounded-3xl border transition-all duration-200 shadow-sm flex flex-col items-center p-3.5 select-none ${
        selectable && item.selected
          ? "border-brand-500 ring-2 ring-brand-500/20 shadow-md"
          : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
      }`}
    >
      {/* Page number badge */}
      <span className="absolute top-2.5 left-2.5 z-10 w-6 h-6 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black flex items-center justify-center shadow">
        {index + 1}
      </span>

      {/* Select indicator */}
      {selectable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect?.(item.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
            item.selected
              ? "bg-brand-600 text-white shadow-md"
              : "bg-white/90 border border-slate-300 text-transparent"
          }`}
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Document Icon / Thumbnail Visual */}
      <div
        {...attributes}
        {...listeners}
        className="w-full aspect-[3/4] bg-slate-50/70 rounded-2xl border border-slate-100 flex flex-col items-center justify-center p-4 cursor-grab active:cursor-grabbing overflow-hidden transition-transform duration-200"
        style={{ transform: `rotate(${item.rotation}deg)` }}
      >
        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-2">
          <FileText className="w-6 h-6 text-brand-600" />
        </div>
        <span className="text-[11px] font-bold text-slate-600 text-center line-clamp-2 px-1">
          {item.name}
        </span>
      </div>

      {/* Filename & size */}
      <div className="w-full mt-2.5 px-1 flex items-center justify-between text-[11px] text-slate-500">
        <span className="truncate max-w-[105px] font-semibold text-slate-700">{item.name}</span>
        <span className="font-medium text-slate-400">{(item.size / 1024).toFixed(0)} KB</span>
      </div>

      {/* Action Bar on Hover */}
      <div className="absolute bottom-11 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 bg-slate-900/90 backdrop-blur-md text-white px-2.5 py-1.5 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-150 z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRotate(item.id, 90);
          }}
          title="Rotate clockwise 90°"
          className="p-1 hover:text-brand-400 transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRotate(item.id, -90);
          }}
          title="Rotate counter-clockwise 90°"
          className="p-1 hover:text-brand-400 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
          title="Remove file"
          className="p-1 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function Workspace({
  tool,
  initialFiles,
  onComplete,
  onCancel,
}: WorkspaceProps) {
  const [items, setItems] = useState<WorkspaceFileItem[]>(() =>
    initialFiles.map((f, i) => ({
      id: `${f.name}-${i}-${Date.now()}`,
      file: f,
      name: f.name,
      size: f.size,
      rotation: 0,
      selected: true,
    }))
  );

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tool-specific options state
  const defaultTargetKb =
    tool.id === "compress-pdf-to-200kb"
      ? 200
      : tool.id === "compress-pdf-to-100kb"
      ? 100
      : tool.id === "compress-pdf-for-online-form"
      ? 200
      : undefined;

  const [formTargetKb, setFormTargetKb] = useState<number | undefined>(defaultTargetKb);
  const [splitRange, setSplitRange] = useState("1-2");
  const [splitMode, setSplitMode] = useState<"range" | "all">("range");
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("recommended");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.4);
  const [watermarkRotation, setWatermarkRotation] = useState(45);
  const [pageNumberPos, setPageNumberPos] = useState<PageNumberPosition>("bottom-center");
  const [pageNumberFormat, setPageNumberFormat] = useState<PageNumberFormat>("page_n_of_total");
  const [imageOrientation, setImageOrientation] = useState<"portrait" | "landscape">("portrait");
  const [pageSizeChoice, setPageSizeChoice] = useState<"a4" | "letter" | "legal">("letter");
  const [cropMarginPercent, setCropMarginPercent] = useState<number>(10);
  const [jpgQuality, setJpgQuality] = useState<number>(0.92);
  const [showCloudModal, setShowCloudModal] = useState<boolean>(false);
  const [batesPrefix, setBatesPrefix] = useState<string>("PLAINTIFF_");
  const [batesStartNumber, setBatesStartNumber] = useState<number>(1);
  const [batesDigits, setBatesDigits] = useState<number>(6);
  const [batesPosition, setBatesPosition] = useState<BatesPosition>("bottom-right");

  // Signature canvas ref
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleRotate = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rotation: (item.rotation + delta + 360) % 360 } : item
      )
    );
  };

  const handleRotateAll = (delta: number) => {
    setItems((prev) =>
      prev.map((item) => ({ ...item, rotation: (item.rotation + delta + 360) % 360 }))
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      if (filtered.length === 0) {
        onCancel();
      }
      return filtered;
    });
  };

  const handleToggleSelect = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleSelectAll = (select: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: select })));
  };

  const handleInvertSelect = () => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: !item.selected })));
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newItems: WorkspaceFileItem[] = newFiles.map((f, i) => ({
        id: `${f.name}-${Date.now()}-${i}`,
        file: f,
        name: f.name,
        size: f.size,
        rotation: 0,
        selected: true,
      }));
      setItems((prev) => [...prev, ...newItems]);
    }
  };

  // Canvas drawing handlers for signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Main Execution Trigger
  const handleExecuteTool = async () => {
    if (items.length === 0) return;
    setProcessing(true);
    setError(null);

    try {
      if (tool.id === "merge-pdf") {
        const fileBuffers = await Promise.all(
          items.map(async (item) => ({
            name: item.name,
            buffer: await item.file.arrayBuffer(),
          }))
        );
        const mergedBytes = await mergePDFs(fileBuffers);
        onComplete({
          fileName: "merged_document.pdf",
          bytes: mergedBytes,
        });
      } else if (tool.id === "split-pdf") {
        const buffer = await items[0].file.arrayBuffer();
        if (splitMode === "all") {
          const splitResults = await extractAllPages(buffer, items[0].name);
          onComplete({
            fileName: "split_pages.zip",
            multipleFiles: splitResults,
          });
        } else {
          const splitResults = await splitPDFByRanges(buffer, splitRange, items[0].name);
          if (splitResults.length === 1) {
            onComplete({
              fileName: splitResults[0].fileName,
              bytes: splitResults[0].bytes,
            });
          } else {
            onComplete({
              fileName: "split_documents.zip",
              multipleFiles: splitResults,
            });
          }
        }
      } else if (tool.id === "remove-pages") {
        const buffer = await items[0].file.arrayBuffer();
        const unselectedIndices = items
          .map((item, idx) => (!item.selected ? idx + 1 : null))
          .filter((v): v is number => v !== null);

        const cleanedBytes = await removePages(
          buffer,
          unselectedIndices.length > 0 ? unselectedIndices : [1]
        );
        onComplete({
          fileName: `cleaned_${items[0].name}`,
          bytes: cleanedBytes,
        });
      } else if (tool.id === "extract-pages") {
        const buffer = await items[0].file.arrayBuffer();
        const selectedIndices = items
          .map((item, idx) => (item.selected ? idx + 1 : null))
          .filter((v): v is number => v !== null);

        const extractedBytes = await extractPages(
          buffer,
          selectedIndices.length > 0 ? selectedIndices : [1]
        );
        onComplete({
          fileName: `extracted_${items[0].name}`,
          bytes: extractedBytes,
        });
      } else if (tool.id === "rotate-pdf") {
        const buffer = await items[0].file.arrayBuffer();
        const rotatedBytes = await rotatePDF(buffer, items[0].rotation);
        onComplete({
          fileName: `rotated_${items[0].name}`,
          bytes: rotatedBytes,
        });
      } else if (tool.id === "compress-pdf" || tool.id.startsWith("compress-pdf")) {
        const buffer = await items[0].file.arrayBuffer();
        const targetKb =
          tool.id === "compress-pdf-to-200kb"
            ? 200
            : tool.id === "compress-pdf-to-100kb"
            ? 100
            : formTargetKb || undefined;

        const result = await compressPDFClient(buffer, {
          level: compressionLevel,
          targetMaxKb: targetKb,
        });
        onComplete({
          fileName: `compressed_${items[0].name}`,
          bytes: result.bytes,
          originalSize: result.originalSize,
          newSize: result.newSize,
          savingsPercentage: result.savingsPercentage,
          targetKb,
          targetMet: result.targetMet,
        });
      } else if (tool.id === "add-page-numbers") {
        const buffer = await items[0].file.arrayBuffer();
        const numberedBytes = await addPageNumbers(buffer, {
          position: pageNumberPos,
          format: pageNumberFormat,
        });
        onComplete({
          fileName: `numbered_${items[0].name}`,
          bytes: numberedBytes,
        });
      } else if (tool.id === "watermark-pdf") {
        const buffer = await items[0].file.arrayBuffer();
        const watermarkedBytes = await addWatermark(buffer, {
          text: watermarkText,
          opacity: watermarkOpacity,
          rotation: watermarkRotation,
        });
        onComplete({
          fileName: `watermarked_${items[0].name}`,
          bytes: watermarkedBytes,
        });
      } else if (tool.id === "jpg-to-pdf") {
        const images = await Promise.all(
          items.map(async (item) => ({
            buffer: await item.file.arrayBuffer(),
            type: item.file.type.includes("png") ? ("png" as const) : ("jpeg" as const),
            name: item.name,
          }))
        );
        const pdfBytes = await imagesToPDF(images, {
          orientation: imageOrientation,
          pageSize: pageSizeChoice,
        });
        onComplete({
          fileName: "converted_images.pdf",
          bytes: pdfBytes,
        });
      } else if (tool.id === "sign-pdf") {
        const buffer = await items[0].file.arrayBuffer();
        const canvas = sigCanvasRef.current;
        if (!canvas) throw new Error("Signature pad unavailable.");
        const dataUrl = canvas.toDataURL("image/png");
        const signedBytes = await signPDF(buffer, dataUrl, {
          pageNumber: 1,
          x: 50,
          y: 50,
          width: 150,
          height: 60,
        });
        onComplete({
          fileName: `signed_${items[0].name}`,
          bytes: signedBytes,
        });
      } else if (tool.id === "pdf-to-word") {
        const buffer = await items[0].file.arrayBuffer();
        const baseName = items[0].name.replace(/\.[^/.]+$/, "");
        const docxBytes = await convertPdfToDocx(buffer);
        onComplete({
          fileName: `${baseName}.docx`,
          bytes: docxBytes,
          originalSize: items[0].size,
          newSize: docxBytes.byteLength,
        });
      } else if (tool.id === "word-to-pdf") {
        const file = items[0].file;
        const fileName = file.name.toLowerCase();
        if (fileName.endsWith(".doc") && !fileName.endsWith(".docx")) {
          throw new Error(
            "Legacy binary Word (.doc) format detected. Please save your file as modern .docx format in Microsoft Word or Google Docs for instant client-side conversion."
          );
        }
        const buffer = await file.arrayBuffer();
        const baseName = items[0].name.replace(/\.[^/.]+$/, "");
        const pdfBytes = await convertDocxToPdf(buffer);
        onComplete({
          fileName: `${baseName}.pdf`,
          bytes: pdfBytes,
          originalSize: items[0].size,
          newSize: pdfBytes.byteLength,
        });
      } else if (tool.id === "pdf-to-jpg") {
        const buffer = await items[0].file.arrayBuffer();
        const baseName = items[0].name.replace(/\.[^/.]+$/, "");
        const result = await convertPdfToJpg(buffer, baseName, { quality: jpgQuality });
        onComplete({
          fileName: result.fileName,
          bytes: result.bytes,
          multipleFiles: result.multipleFiles,
          originalSize: items[0].size,
          newSize: result.bytes.byteLength,
        });
      } else if (tool.id === "crop-pdf") {
        const buffer = await items[0].file.arrayBuffer();
        const m = cropMarginPercent / 100;
        const cropArea = {
          x: 595.28 * m,
          y: 841.89 * m,
          width: 595.28 * (1 - 2 * m),
          height: 841.89 * (1 - 2 * m),
        };
        const croppedBytes = await cropPDF(buffer, cropArea);
        onComplete({
          fileName: `cropped_${items[0].name}`,
          bytes: croppedBytes,
          originalSize: items[0].size,
          newSize: croppedBytes.byteLength,
        });
      } else if (tool.id === "organize-pdf") {
        const fileBuffers = await Promise.all(
          items.map(async (item) => ({
            buffer: await item.file.arrayBuffer(),
            rotation: item.rotation,
          }))
        );
        const organizedBytes = await organizePDF(fileBuffers);
        onComplete({
          fileName: `organized_${items[0].name}`,
          bytes: organizedBytes,
          originalSize: items[0].size,
          newSize: organizedBytes.byteLength,
        });
      } else if (tool.id === "repair-pdf") {
        const buffer = await items[0].file.arrayBuffer();
        const repairResult = await repairPDFClient(buffer);
        onComplete({
          fileName: `repaired_${items[0].name}`,
          bytes: repairResult.bytes,
          originalSize: repairResult.originalSize,
          newSize: repairResult.newSize,
        });
      } else if (tool.id === "unlock-pdf") {
        const buffer = await items[0].file.arrayBuffer();
        const unlockedBytes = await unlockPDFClient(buffer);
        onComplete({
          fileName: `unlocked_${items[0].name}`,
          bytes: unlockedBytes,
          originalSize: items[0].size,
          newSize: unlockedBytes.byteLength,
        });
      } else if (tool.id === "html-to-pdf") {
        const buffer = await items[0].file.arrayBuffer();
        const baseName = items[0].name.replace(/\.[^/.]+$/, "");
        const pdfBytes = await convertHtmlToPdf(buffer);
        onComplete({
          fileName: `${baseName}.pdf`,
          bytes: pdfBytes,
          originalSize: items[0].size,
          newSize: pdfBytes.byteLength,
        });
      } else if (tool.id === "bates-stamp-pdf") {
        const buffer = await items[0].file.arrayBuffer();
        const batesBytes = await addBatesStamping(buffer, {
          prefix: batesPrefix,
          startNumber: batesStartNumber,
          digitPadding: batesDigits,
          position: batesPosition,
        });
        onComplete({
          fileName: `bates_${items[0].name}`,
          bytes: batesBytes,
          originalSize: items[0].size,
          newSize: batesBytes.byteLength,
        });
      } else if (tool.id === "flatten-pdf") {
        const buffer = await items[0].file.arrayBuffer();
        const flatResult = await flattenPDFClient(buffer);
        onComplete({
          fileName: `flattened_${items[0].name}`,
          bytes: flatResult.bytes,
          originalSize: flatResult.originalSize,
          newSize: flatResult.newSize,
        });
      } else {
        // Cloud-dependent or advanced API tool: display friendly Cloud Modal
        setShowCloudModal(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setProcessing(false);
    }
  };

  const isSelectableTool = tool.id === "remove-pages" || tool.id === "extract-pages";

  return (
    <div className="w-full max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8">
      {/* Top Toolbar with Quick Actions */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="btn-secondary text-xs sm:text-sm px-4 py-2.5 rounded-2xl cursor-pointer flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-600" />
            <span>Add more files</span>
            <input
              type="file"
              multiple={tool.maxFiles > 1}
              onChange={handleAddFiles}
              className="hidden"
            />
          </label>

          {tool.id === "rotate-pdf" && (
            <button
              type="button"
              onClick={() => handleRotateAll(90)}
              className="btn-secondary text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5 text-slate-600" />
              <span>Rotate All</span>
            </button>
          )}

          {isSelectableTool && (
            <div className="flex items-center gap-1.5 border-l border-slate-200 ps-3">
              <button
                type="button"
                onClick={() => handleSelectAll(true)}
                className="btn-secondary text-xs px-3 py-2 rounded-xl"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => handleSelectAll(false)}
                className="btn-secondary text-xs px-3 py-2 rounded-xl"
              >
                Deselect All
              </button>
              <button
                type="button"
                onClick={handleInvertSelect}
                className="btn-secondary text-xs px-3 py-2 rounded-xl"
              >
                Invert
              </button>
            </div>
          )}

          <span className="text-xs text-slate-500 font-semibold hidden md:inline">
            {items.length} {items.length === 1 ? "document" : "documents"} queued
          </span>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-bold text-slate-400 hover:text-slate-700 px-3 py-2 transition-colors"
        >
          Cancel & Reset
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <span>{error}</span>
        </div>
      )}

      {/* Main Workspace Grid & Sticky Options Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left 3 Columns: Visual Sortable Grid */}
        <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 min-h-[480px] shadow-sm">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {items.map((item, idx) => (
                  <SortableCard
                    key={item.id}
                    item={item}
                    index={idx}
                    onRotate={handleRotate}
                    onRemove={handleRemove}
                    onToggleSelect={handleToggleSelect}
                    selectable={isSelectableTool}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Right 1 Column: Contextual Options & Action Button */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-6 sticky top-24">
            <h3 className="font-extrabold text-slate-800 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-600" />
              {tool.name} Settings
            </h3>

            {/* SPLIT OPTIONS */}
            {tool.id === "split-pdf" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSplitMode("range")}
                    className={`py-2.5 px-3 rounded-2xl border text-center transition-all ${
                      splitMode === "range"
                        ? "bg-brand-50 border-brand-500 text-brand-700 shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Custom Range
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitMode("all")}
                    className={`py-2.5 px-3 rounded-2xl border text-center transition-all ${
                      splitMode === "all"
                        ? "bg-brand-50 border-brand-500 text-brand-700 shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Extract All
                  </button>
                </div>

                {splitMode === "range" && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Page Ranges:
                    </label>
                    <input
                      type="text"
                      value={splitRange}
                      onChange={(e) => setSplitRange(e.target.value)}
                      placeholder="e.g. 1-3, 5, 8-10"
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Separate page groups with commas (e.g. 1-4, 7).
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* COMPRESS OPTIONS */}
            {tool.id === "compress-pdf-to-200kb" && (
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/80 space-y-2">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                  <span>Target Limit: Strictly Under 200 KB</span>
                </div>
                <p className="text-[11px] text-teal-700 font-medium leading-relaxed">
                  Calibrated for UPSC, SSC, state PSC, NEET, JEE, and university job portal requirements. Text legibility and official seals are strictly preserved.
                </p>
              </div>
            )}

            {tool.id === "compress-pdf-to-100kb" && (
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/80 space-y-2">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                  <span>Target Limit: Strictly Under 100 KB</span>
                </div>
                <p className="text-[11px] text-teal-700 font-medium leading-relaxed">
                  Engineered for passport portals, visa applications, photo ID scans, and signature uploads where 100 KB is the maximum allowed size.
                </p>
              </div>
            )}

            {tool.id === "compress-pdf-for-online-form" && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block">
                  Select Portal Target Limit:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { kb: 6144, label: "Under 6 MB (USCIS)", sub: "NVC, CEAC & US Immigration Portals" },
                    { kb: 2048, label: "Under 2 MB (College)", sub: "Common App, Coalition & Transcripts" },
                    { kb: 10240, label: "Under 10 MB (ECF)", sub: "US Federal Court Electronic Filing" },
                    { kb: 200, label: "Under 200 KB", sub: "Government Exam Forms & Degree Certificates" },
                    { kb: 100, label: "Under 100 KB", sub: "Passport, Visa & Identity Scans" },
                    { kb: 50, label: "Under 50 KB", sub: "Signatures & Small Photos" },
                  ].map((preset) => (
                    <button
                      key={preset.kb}
                      type="button"
                      onClick={() => setFormTargetKb(preset.kb)}
                      className={`text-left p-3 rounded-2xl border transition-all ${
                        formTargetKb === preset.kb
                          ? "border-teal-500 bg-teal-50/80 ring-2 ring-teal-500/20 shadow-sm"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-800 block">
                        {preset.label}
                      </span>
                      <span className="text-[11px] text-slate-500">{preset.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tool.id === "compress-pdf" && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block">
                  Compression Mode:
                </span>
                <div className="space-y-2">
                  {[
                    { id: "extreme", label: "Extreme Compression", sub: "Less quality, ~75% reduction" },
                    { id: "recommended", label: "Recommended", sub: "Balanced quality & ~60% size" },
                    { id: "low", label: "Less Compression", sub: "Maximum quality, ~30% size" },
                  ].map((lvl) => (
                    <label
                      key={lvl.id}
                      onClick={() => setCompressionLevel(lvl.id as CompressionLevel)}
                      className={`block p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        compressionLevel === lvl.id
                          ? "border-brand-500 bg-brand-50/80 shadow-sm"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-800 block">
                        {lvl.label}
                      </span>
                      <span className="text-[11px] text-slate-500">{lvl.sub}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* WATERMARK OPTIONS */}
            {tool.id === "watermark-pdf" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Watermark Text:
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                    <span>Opacity:</span>
                    <span>{Math.round(watermarkOpacity * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 flex justify-between mb-1">
                    <span>Rotation:</span>
                    <span>{watermarkRotation}°</span>
                  </label>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    step="15"
                    value={watermarkRotation}
                    onChange={(e) => setWatermarkRotation(parseInt(e.target.value, 10))}
                    className="w-full accent-brand-600"
                  />
                </div>
              </div>
            )}

            {/* PAGE NUMBERS OPTIONS */}
            {tool.id === "add-page-numbers" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Number Format:
                  </label>
                  <select
                    value={pageNumberFormat}
                    onChange={(e) => setPageNumberFormat(e.target.value as PageNumberFormat)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="page_n_of_total">Page 1 of N</option>
                    <option value="page_n">Page 1</option>
                    <option value="n_of_total">1 / N</option>
                    <option value="n">1, 2, 3...</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Position on Page:
                  </label>
                  <select
                    value={pageNumberPos}
                    onChange={(e) => setPageNumberPos(e.target.value as PageNumberPosition)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="bottom-center">Bottom Center</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="top-center">Top Center</option>
                    <option value="top-right">Top Right</option>
                  </select>
                </div>
              </div>
            )}

            {/* SIGNATURE PAD */}
            {tool.id === "sign-pdf" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Draw Signature:</span>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-xs font-bold text-brand-600 hover:underline"
                  >
                    Clear
                  </button>
                </div>
                <canvas
                  ref={sigCanvasRef}
                  width={220}
                  height={110}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl cursor-crosshair touch-none shadow-inner"
                />
                <span className="text-[11px] text-slate-400 block text-center">
                  Sign with trackpad, mouse, or touch
                </span>
              </div>
            )}

            {/* JPG TO PDF OPTIONS */}
            {tool.id === "jpg-to-pdf" && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Page Format:</span>
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setPageSizeChoice("letter")}
                      className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                        pageSizeChoice === "letter"
                          ? "bg-brand-50 border-brand-500 text-brand-700 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      US Letter
                    </button>
                    <button
                      type="button"
                      onClick={() => setPageSizeChoice("legal")}
                      className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                        pageSizeChoice === "legal"
                          ? "bg-brand-50 border-brand-500 text-brand-700 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      US Legal
                    </button>
                    <button
                      type="button"
                      onClick={() => setPageSizeChoice("a4")}
                      className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                        pageSizeChoice === "a4"
                          ? "bg-brand-50 border-brand-500 text-brand-700 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      A4
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Orientation:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setImageOrientation("portrait")}
                      className={`py-2.5 px-3 rounded-2xl border text-center transition-all ${
                        imageOrientation === "portrait"
                          ? "bg-brand-50 border-brand-500 text-brand-700 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageOrientation("landscape")}
                      className={`py-2.5 px-3 rounded-2xl border text-center transition-all ${
                        imageOrientation === "landscape"
                          ? "bg-brand-50 border-brand-500 text-brand-700 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Landscape
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PDF TO WORD OPTIONS / INFO */}
            {tool.id === "pdf-to-word" && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Client-Side Word Engine</span>
                </div>
                <p className="text-amber-700/90 leading-relaxed">
                  Your PDF will be converted into an editable Microsoft Word document (.docx) directly in your browser. Text, headings, and formatting will be preserved with complete privacy.
                </p>
              </div>
            )}

            {/* WORD TO PDF OPTIONS / INFO */}
            {tool.id === "word-to-pdf" && (
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-blue-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-blue-800">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>High-Fidelity PDF Engine</span>
                </div>
                <p className="text-blue-700/90 leading-relaxed">
                  Your Word document (.docx) will be parsed and rendered into a standard vector PDF directly on your device. Layout, font styles, and margins are preserved.
                </p>
              </div>
            )}

            {/* PDF TO JPG OPTIONS */}
            {tool.id === "pdf-to-jpg" && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Output Quality:</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setJpgQuality(0.95)}
                    className={`py-2.5 px-3 rounded-2xl border text-center transition-all ${
                      jpgQuality >= 0.9
                        ? "bg-brand-50 border-brand-500 text-brand-700 shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    High (144 DPI)
                  </button>
                  <button
                    type="button"
                    onClick={() => setJpgQuality(0.80)}
                    className={`py-2.5 px-3 rounded-2xl border text-center transition-all ${
                      jpgQuality < 0.9
                        ? "bg-brand-50 border-brand-500 text-brand-700 shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Standard (72 DPI)
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 block text-center">
                  Multi-page documents will be bundled into a ZIP archive.
                </span>
              </div>
            )}

            {/* CROP PDF OPTIONS */}
            {tool.id === "crop-pdf" && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Trim Margins:</span>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  {[5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setCropMarginPercent(pct)}
                      className={`py-2.5 px-2 rounded-2xl border text-center transition-all ${
                        cropMarginPercent === pct
                          ? "bg-brand-50 border-brand-500 text-brand-700 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 block text-center">
                  Trims outer whitespace uniformly on all document pages.
                </span>
              </div>
            )}

            {/* REPAIR PDF INFO */}
            {tool.id === "repair-pdf" && (
              <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200/80 text-teal-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-teal-800">
                  <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Client-Side PDF Sanitizer</span>
                </div>
                <p className="text-teal-700/90 leading-relaxed">
                  Reconstructs damaged cross-reference tables, clears invalid trailer pointers, and re-indexes indirect object streams into a compliant PDF.
                </p>
              </div>
            )}

            {/* ORGANIZE PDF INFO */}
            {tool.id === "organize-pdf" && (
              <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 text-indigo-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-indigo-800">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Interactive Visual Organizer</span>
                </div>
                <p className="text-indigo-700/90 leading-relaxed">
                  Drag and drop document cards to reorder. Use hover buttons to rotate individual cards or remove them before stitching into a unified PDF.
                </p>
              </div>
            )}

            {/* BATES STAMPING OPTIONS */}
            {tool.id === "bates-stamp-pdf" && (
              <div className="space-y-3">
                <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-200/80 text-[11px] text-purple-900 font-medium">
                  <strong>US Legal Discovery Standard:</strong> Sequentially indexes pages for court and litigation filings.
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Bates Prefix:</label>
                  <input
                    type="text"
                    value={batesPrefix}
                    onChange={(e) => setBatesPrefix(e.target.value)}
                    placeholder="e.g. PLAINTIFF_ or CONFIDENTIAL-"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Start Number:</label>
                    <input
                      type="number"
                      min="1"
                      value={batesStartNumber}
                      onChange={(e) => setBatesStartNumber(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Digit Padding:</label>
                    <select
                      value={batesDigits}
                      onChange={(e) => setBatesDigits(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="4">4 Digits (0001)</option>
                      <option value="6">6 Digits (000001)</option>
                      <option value="8">8 Digits (00000001)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Position on Page:</label>
                  <select
                    value={batesPosition}
                    onChange={(e) => setBatesPosition(e.target.value as BatesPosition)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="bottom-right">Bottom Right (Standard)</option>
                    <option value="bottom-center">Bottom Center</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl text-center font-mono text-xs font-bold text-purple-700 border border-slate-200">
                  Preview: {batesPrefix}{String(batesStartNumber).padStart(batesDigits, "0")}
                </div>
              </div>
            )}

            {/* FLATTEN PDF INFO */}
            {tool.id === "flatten-pdf" && (
              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-rose-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-rose-800">
                  <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>US Court CM/ECF & Real Estate Standard</span>
                </div>
                <p className="text-rose-700/90 leading-relaxed">
                  Permanently burns interactive AcroForms, text fields, checkboxes, and signatures into static vector elements. Prevents values from being tampered with or cleared by different PDF viewers.
                </p>
              </div>
            )}

            {/* Big Action Button */}
            <button
              type="button"
              disabled={processing || items.length === 0}
              onClick={handleExecuteTool}
              className="btn-primary w-full text-base py-4 rounded-2xl shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 group mt-6 animate-shimmer"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{tool.name}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Cloud Microservice Notice Modal */}
      {showCloudModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowCloudModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Cloud Service In Rollout
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              <strong>{tool.name}</strong> requires specialized server-side rendering or heavy OCR binaries. Our background cloud microservices are currently in staged rollout.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2 mb-6">
              <p className="font-bold text-slate-800">💡 Free In-Browser Alternatives:</p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-600">
                <li>Export as PDF directly from Microsoft Office or Google Docs via <em>File &gt; Save as PDF</em>.</li>
                <li>Use our 100% in-browser converters: <strong>PDF to Word</strong>, <strong>Word to PDF</strong>, <strong>JPG to PDF</strong>, and <strong>PDF to JPG</strong>.</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/"
                className="btn-primary w-full text-center py-3.5 rounded-2xl font-bold"
              >
                Browse All Tools
              </Link>
              <button
                onClick={() => setShowCloudModal(false)}
                className="btn-secondary w-full py-3.5 rounded-2xl font-bold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
