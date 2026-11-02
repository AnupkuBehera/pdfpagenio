import { PDFDocument } from "pdf-lib";

export interface CropBoxCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function cropPDF(
  buffer: ArrayBuffer,
  cropArea: CropBoxCoordinates,
  targetPages?: number[] // 1-based page numbers; all if undefined
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const allPages = pdfDoc.getPages();
  const indices = targetPages && targetPages.length > 0
    ? targetPages.map((p) => p - 1).filter((idx) => idx >= 0 && idx < allPages.length)
    : allPages.map((_, i) => i);

  for (const idx of indices) {
    const page = allPages[idx];
    const { width: origWidth, height: origHeight } = page.getSize();

    const clampX = Math.max(0, Math.min(cropArea.x, origWidth));
    const clampY = Math.max(0, Math.min(cropArea.y, origHeight));
    const clampW = Math.max(10, Math.min(cropArea.width, origWidth - clampX));
    const clampH = Math.max(10, Math.min(cropArea.height, origHeight - clampY));

    page.setCropBox(clampX, clampY, clampW, clampH);
    page.setMediaBox(clampX, clampY, clampW, clampH);
  }

  return await pdfDoc.save();
}

