import { PDFDocument } from "pdf-lib";

export interface SignaturePlacement {
  pageNumber: number; // 1-based
  x: number; // in PDF points
  y: number; // in PDF points
  width: number;
  height: number;
}

export async function signPDF(
  pdfBuffer: ArrayBuffer,
  signaturePngDataUrl: string,
  placement: SignaturePlacement
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const pageIdx = placement.pageNumber - 1;

  if (pageIdx < 0 || pageIdx >= pages.length) {
    throw new Error(`Invalid page number ${placement.pageNumber}. Document has ${pages.length} pages.`);
  }

  // Convert dataURL to Uint8Array
  const base64Data = signaturePngDataUrl.split(",")[1];
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const sigImage = await pdfDoc.embedPng(bytes);
  const targetPage = pages[pageIdx];

  targetPage.drawImage(sigImage, {
    x: placement.x,
    y: placement.y,
    width: placement.width,
    height: placement.height,
  });

  return await pdfDoc.save();
}

