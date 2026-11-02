import { PDFDocument, rgb, degrees, StandardFonts, PDFImage } from "pdf-lib";
import { hasNonLatinCharacters, renderTextToStamp } from "./unicode-stamping";

export interface WatermarkOptions {
  text?: string;
  imageBuffer?: ArrayBuffer;
  imageType?: "png" | "jpeg";
  opacity?: number; // 0.1 to 1.0
  rotation?: number; // angle in degrees (e.g. 45)
  fontSize?: number;
  color?: { r: number; g: number; b: number };
  pages?: number[]; // 1-based page numbers; if empty or omitted, applies to all pages
}

export async function addWatermark(
  buffer: ArrayBuffer,
  options: WatermarkOptions
): Promise<Uint8Array> {
  const {
    text = "CONFIDENTIAL",
    imageBuffer,
    imageType = "png",
    opacity = 0.35,
    rotation = 45,
    fontSize = 48,
    color = { r: 0.8, g: 0.1, b: 0.1 },
    pages,
  } = options;

  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const allPages = pdfDoc.getPages();
  const targetIndices = pages && pages.length > 0
    ? pages.map((p) => p - 1).filter((idx) => idx >= 0 && idx < allPages.length)
    : allPages.map((_, i) => i);

  let embeddedImage: PDFImage | null = null;
  let imageWidth = 0;
  let imageHeight = 0;

  // 1. Explicit image watermark passed by user
  if (imageBuffer) {
    if (imageType === "png") {
      embeddedImage = await pdfDoc.embedPng(imageBuffer);
    } else {
      embeddedImage = await pdfDoc.embedJpg(imageBuffer);
    }
    const dims = embeddedImage.scale(0.5);
    imageWidth = dims.width;
    imageHeight = dims.height;
  }
  // 2. Non-Latin / CJK / RTL script detected (Japanese, Vietnamese, Russian, Arabic)
  else if (hasNonLatinCharacters(text)) {
    const stamp = await renderTextToStamp(text, { fontSize, color });
    if (stamp) {
      embeddedImage = await pdfDoc.embedPng(stamp.buffer);
      imageWidth = stamp.width;
      imageHeight = stamp.height;
    }
  }

  // 3. Fallback standard Latin-1 font if no image stamp was created
  let standardFont: import("pdf-lib").PDFFont | null = null;
  if (!embeddedImage) {
    standardFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  }

  for (const idx of targetIndices) {
    const page = allPages[idx];
    const { width, height } = page.getSize();

    if (embeddedImage) {
      const x = (width - imageWidth) / 2;
      const y = (height - imageHeight) / 2;

      page.drawImage(embeddedImage, {
        x,
        y,
        width: imageWidth,
        height: imageHeight,
        opacity,
        rotate: degrees(rotation),
      });
    } else if (standardFont) {
      const textWidth = standardFont.widthOfTextAtSize(text, fontSize);
      const textHeight = standardFont.heightAtSize(fontSize);
      const x = (width - textWidth) / 2;
      const y = (height - textHeight) / 2;

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font: standardFont,
        color: rgb(color.r, color.g, color.b),
        opacity,
        rotate: degrees(rotation),
      });
    }
  }

  return await pdfDoc.save();
}
