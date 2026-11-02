import { PDFDocument } from "pdf-lib";

export interface SplitResult {
  fileName: string;
  bytes: Uint8Array;
}

export function parsePageRanges(rangeStr: string, totalPages: number): number[][] {
  // Returns array of page index arrays (0-based)
  // e.g. "1-3, 5" => [[0, 1, 2], [4]]
  const parts = rangeStr.split(",").map((p) => p.trim()).filter(Boolean);
  const result: number[][] = [];

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(totalPages, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        const indices: number[] = [];
        for (let i = start; i <= end; i++) {
          indices.push(i - 1);
        }
        result.push(indices);
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        result.push([page - 1]);
      }
    }
  }

  return result;
}

export async function splitPDFByRanges(
  buffer: ArrayBuffer,
  rangeStr: string,
  baseFileName: string = "document"
): Promise<SplitResult[]> {
  const srcPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcPdf.getPageCount();
  const rangeGroups = parsePageRanges(rangeStr, totalPages);

  if (rangeGroups.length === 0) {
    throw new Error(`Invalid page range. The document has ${totalPages} pages.`);
  }

  const results: SplitResult[] = [];
  const cleanBase = baseFileName.replace(/\.pdf$/i, "");

  for (let i = 0; i < rangeGroups.length; i++) {
    const indices = rangeGroups[i];
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(srcPdf, indices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const bytes = await newPdf.save();
    const rangeLabel = indices.length === 1 ? `page-${indices[0] + 1}` : `pages-${indices[0] + 1}-to-${indices[indices.length - 1] + 1}`;
    results.push({
      fileName: `${cleanBase}_${rangeLabel}.pdf`,
      bytes,
    });
  }

  return results;
}

export async function extractAllPages(
  buffer: ArrayBuffer,
  baseFileName: string = "document"
): Promise<SplitResult[]> {
  const srcPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcPdf.getPageCount();
  const results: SplitResult[] = [];
  const cleanBase = baseFileName.replace(/\.pdf$/i, "");

  for (let i = 0; i < totalPages; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(srcPdf, [i]);
    newPdf.addPage(copiedPage);
    const bytes = await newPdf.save();
    results.push({
      fileName: `${cleanBase}_page_${i + 1}.pdf`,
      bytes,
    });
  }

  return results;
}

