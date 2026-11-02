import { PDFDocument } from "pdf-lib";

export async function removePages(
  buffer: ArrayBuffer,
  pagesToRemove: number[] // 1-based page numbers
): Promise<Uint8Array> {
  const srcPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcPdf.getPageCount();
  const removeSet = new Set(pagesToRemove.map((p) => p - 1));

  const keepIndices: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    if (!removeSet.has(i)) {
      keepIndices.push(i);
    }
  }

  if (keepIndices.length === 0) {
    throw new Error("You cannot remove all pages from the document.");
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(srcPdf, keepIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

export async function extractPages(
  buffer: ArrayBuffer,
  pagesToKeep: number[] // 1-based page numbers
): Promise<Uint8Array> {
  const srcPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = srcPdf.getPageCount();
  const keepIndices = pagesToKeep
    .map((p) => p - 1)
    .filter((idx) => idx >= 0 && idx < totalPages);

  if (keepIndices.length === 0) {
    throw new Error("Please select at least one valid page to extract.");
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(srcPdf, keepIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

