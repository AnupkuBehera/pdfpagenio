import { PDFDocument, PageSizes } from "pdf-lib";

export interface ImageInput {
  buffer: ArrayBuffer;
  type: "jpeg" | "png" | "webp";
  name: string;
}

export interface ImageToPdfOptions {
  orientation?: "portrait" | "landscape" | "fit";
  pageSize?: "a4" | "letter" | "legal" | "fit";
  margin?: number;
}

export async function imagesToPDF(
  images: ImageInput[],
  options: ImageToPdfOptions = {}
): Promise<Uint8Array> {
  const { orientation = "portrait", pageSize = "a4", margin = 20 } = options;
  const pdfDoc = await PDFDocument.create();

  for (const img of images) {
    let embeddedImg;
    if (img.type === "png") {
      embeddedImg = await pdfDoc.embedPng(img.buffer);
    } else {
      embeddedImg = await pdfDoc.embedJpg(img.buffer);
    }

    const imgWidth = embeddedImg.width;
    const imgHeight = embeddedImg.height;

    let targetPageWidth = PageSizes.A4[0];
    let targetPageHeight = PageSizes.A4[1];

    if (pageSize === "letter") {
      targetPageWidth = PageSizes.Letter[0];
      targetPageHeight = PageSizes.Letter[1];
    } else if (pageSize === "legal") {
      targetPageWidth = 612.0;
      targetPageHeight = 1008.0;
    } else if (pageSize === "fit") {
      targetPageWidth = imgWidth + margin * 2;
      targetPageHeight = imgHeight + margin * 2;
    }

    if (orientation === "landscape" && targetPageWidth < targetPageHeight) {
      const temp = targetPageWidth;
      targetPageWidth = targetPageHeight;
      targetPageHeight = temp;
    }

    const page = pdfDoc.addPage([targetPageWidth, targetPageHeight]);

    const maxW = targetPageWidth - margin * 2;
    const maxH = targetPageHeight - margin * 2;

    const scale = Math.min(maxW / imgWidth, maxH / imgHeight, 1);
    const finalW = imgWidth * scale;
    const finalH = imgHeight * scale;

    const x = (targetPageWidth - finalW) / 2;
    const y = (targetPageHeight - finalH) / 2;

    page.drawImage(embeddedImg, {
      x,
      y,
      width: finalW,
      height: finalH,
    });
  }

  return await pdfDoc.save();
}

