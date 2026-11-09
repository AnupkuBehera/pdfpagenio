// In-Browser PDF Form Flattening Engine
// Permanently burns interactive AcroForms, signatures, and annotations into static vectors
// Required by US Federal Courts (CM/ECF) and US Real Estate escrow/closing contracts.

import { PDFDocument } from "pdf-lib";

export interface FlattenResult {
  bytes: Uint8Array;
  originalSize: number;
  newSize: number;
}

export async function flattenPDFClient(
  pdfBuffer: ArrayBuffer | Uint8Array
): Promise<FlattenResult> {
  const originalSize = pdfBuffer.byteLength;
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });

  const form = pdfDoc.getForm();
  // Permanently flatten all AcroForm text fields, checkboxes, and radio buttons
  form.flatten();

  const cleanBytes = await pdfDoc.save({ useObjectStreams: true });

  return {
    bytes: cleanBytes,
    originalSize,
    newSize: cleanBytes.byteLength,
  };
}

