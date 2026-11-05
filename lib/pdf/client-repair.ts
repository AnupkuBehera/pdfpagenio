// In-Browser PDF Repair and Sanitization Engine
// Ingests damaged, truncated, or malformed PDFs and reconstructs clean XREFs and object streams.

import { PDFDocument } from "pdf-lib";

export interface RepairResult {
  bytes: Uint8Array;
  originalSize: number;
  newSize: number;
  pageCount: number;
}

export async function repairPDFClient(
  pdfBuffer: ArrayBuffer | Uint8Array
): Promise<RepairResult> {
  const originalSize = pdfBuffer.byteLength;

  const pdfDoc = await PDFDocument.load(pdfBuffer, {
    ignoreEncryption: true,
    updateMetadata: false,
  });

  const pageCount = pdfDoc.getPageCount();

  // Re-save with clean cross-reference streams and object streams
  const cleanBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: pageCount === 0,
  });

  return {
    bytes: cleanBytes,
    originalSize,
    newSize: cleanBytes.byteLength,
    pageCount: Math.max(1, pageCount),
  };
}
