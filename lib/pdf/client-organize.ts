// In-Browser PDF Organization Engine
// Supports visual page/document re-ordering, individual page rotation, and duplicate/removal.

import { PDFDocument, degrees } from "pdf-lib";

export interface OrganizeItem {
  buffer: ArrayBuffer | Uint8Array;
  rotation?: number; // 0, 90, 180, 270
}

/**
 * Merges multiple documents in the specified card order, applying each document's rotation.
 */
export async function organizePDF(items: OrganizeItem[]): Promise<Uint8Array> {
  const mergedDoc = await PDFDocument.create();

  for (const item of items) {
    const srcDoc = await PDFDocument.load(item.buffer, { ignoreEncryption: true });
    const pageIndices = srcDoc.getPageIndices();
    const copiedPages = await mergedDoc.copyPages(srcDoc, pageIndices);

    for (const page of copiedPages) {
      if (item.rotation) {
        const currentAngle = page.getRotation().angle;
        page.setRotation(degrees((currentAngle + item.rotation) % 360));
      }
      mergedDoc.addPage(page);
    }
  }

  return await mergedDoc.save({ useObjectStreams: true });
}

/**
 * Reorders pages within a single PDF document.
 * @param pageOrder Array of 0-based page indices in the desired target order.
 */
export async function reorderSinglePDFPages(
  pdfBuffer: ArrayBuffer | Uint8Array,
  pageOrder: number[],
  rotations: Record<number, number> = {}
): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  const totalPages = srcDoc.getPageCount();
  const validIndices = pageOrder.filter((idx) => idx >= 0 && idx < totalPages);

  const copiedPages = await newDoc.copyPages(srcDoc, validIndices);

  copiedPages.forEach((page, index) => {
    const originalIdx = validIndices[index];
    const addRotation = rotations[originalIdx] || 0;
    if (addRotation) {
      const currentAngle = page.getRotation().angle;
      page.setRotation(degrees((currentAngle + addRotation) % 360));
    }
    newDoc.addPage(page);
  });

  return await newDoc.save({ useObjectStreams: true });
}
