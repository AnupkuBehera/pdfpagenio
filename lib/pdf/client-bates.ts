// In-Browser US Legal Bates Stamping Engine
// Sequentially indexes PDF pages for US court discovery, litigation, and trial filings.

import { PDFDocument, rgb, StandardFonts, PDFFont } from "pdf-lib";

export type BatesPosition =
  | "bottom-right"
  | "bottom-center"
  | "bottom-left"
  | "top-right"
  | "top-left";

export interface BatesOptions {
  prefix?: string;        // e.g. "PLAINTIFF_" or "CONFIDENTIAL-"
  suffix?: string;        // e.g. "-PROD"
  startNumber?: number;   // e.g. 1
  digitPadding?: number;  // e.g. 6 -> 000001
  position?: BatesPosition;
  fontSize?: number;
  drawBox?: boolean;
}

export function formatBatesNumber(
  pageIndex: number,
  prefix = "BATES-",
  suffix = "",
  startNumber = 1,
  digitPadding = 6
): string {
  const currentNum = startNumber + pageIndex;
  const numStr = String(currentNum).padStart(digitPadding, "0");
  return `${prefix}${numStr}${suffix}`;
}

export async function addBatesStamping(
  pdfBuffer: ArrayBuffer | Uint8Array,
  options: BatesOptions = {}
): Promise<Uint8Array> {
  const prefix = options.prefix ?? "BATES-";
  const suffix = options.suffix ?? "";
  const startNumber = options.startNumber ?? 1;
  const digitPadding = options.digitPadding ?? 6;
  const position = options.position ?? "bottom-right";
  const fontSize = options.fontSize ?? 10;
  const drawBox = options.drawBox ?? true;

  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  // Standard US legal discovery typography uses Courier or HelveticaBold
  const fontCourier = await pdfDoc.embedFont(StandardFonts.CourierBold);

  const pages = pdfDoc.getPages();

  pages.forEach((page, idx) => {
    const { width, height } = page.getSize();
    const batesText = formatBatesNumber(idx, prefix, suffix, startNumber, digitPadding);
    const textWidth = fontCourier.widthOfTextAtSize(batesText, fontSize);
    const textHeight = fontSize;

    let x = 36;
    let y = 24;

    switch (position) {
      case "bottom-right":
        x = width - textWidth - 36;
        y = 24;
        break;
      case "bottom-center":
        x = (width - textWidth) / 2;
        y = 24;
        break;
      case "bottom-left":
        x = 36;
        y = 24;
        break;
      case "top-right":
        x = width - textWidth - 36;
        y = height - textHeight - 24;
        break;
      case "top-left":
        x = 36;
        y = height - textHeight - 24;
        break;
    }

    // Optional protective background badge so legal bates stamps are 100% legible over dark content
    if (drawBox) {
      const paddingH = 6;
      const paddingV = 3;
      page.drawRectangle({
        x: x - paddingH,
        y: y - paddingV,
        width: textWidth + paddingH * 2,
        height: textHeight + paddingV * 2 + 1,
        color: rgb(1, 1, 1),
        borderColor: rgb(0.2, 0.2, 0.2),
        borderWidth: 0.75,
        opacity: 0.95,
      });
    }

    page.drawText(batesText, {
      x,
      y,
      size: fontSize,
      font: fontCourier,
      color: rgb(0.1, 0.1, 0.1),
    });
  });

  return await pdfDoc.save({ useObjectStreams: true });
}
