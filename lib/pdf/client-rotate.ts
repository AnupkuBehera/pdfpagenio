import { PDFDocument, degrees } from "pdf-lib";

export interface PageRotationConfig {
  [pageNumber: number]: number; // pageNumber (1-based) -> additional rotation (0, 90, 180, 270)
}

export async function rotatePDF(
  buffer: ArrayBuffer,
  rotations: PageRotationConfig | number // either per-page map or global angle
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    const pageNum = i + 1;
    let addAngle = 0;

    if (typeof rotations === "number") {
      addAngle = rotations;
    } else if (rotations[pageNum] !== undefined) {
      addAngle = rotations[pageNum];
    }

    if (addAngle !== 0) {
      const currentRotation = pages[i].getRotation().angle;
      const newRotation = (currentRotation + addAngle) % 360;
      pages[i].setRotation(degrees(newRotation));
    }
  }

  return await pdfDoc.save();
}

