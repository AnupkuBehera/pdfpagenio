import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { hasNonLatinCharacters, renderTextToStamp } from "./unicode-stamping";

export type PageNumberPosition =
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "top-left"
  | "top-center"
  | "top-right";

export type PageNumberFormat =
  | "n" // "1"
  | "n_of_total" // "1 / 10"
  | "page_n" // "Page 1"
  | "page_n_of_total"; // "Page 1 of 10" (or localized equivalent)

export interface PageNumberOptions {
  position?: PageNumberPosition;
  format?: PageNumberFormat;
  locale?: string; // e.g. "vi", "ru", "ja", "tr", "ar", "es", "fr", "de"
  startPage?: number; // 1-based page to start numbering on
  fromNumber?: number; // starting integer value (usually 1)
  fontSize?: number;
  margin?: number;
}

function getLocalizedPageLabel(
  currentNum: number,
  totalPages: number,
  format: PageNumberFormat,
  locale?: string
): string {
  if (format === "n") return `${currentNum}`;
  if (format === "n_of_total") return `${currentNum} / ${totalPages}`;

  // Localized formats
  switch (locale?.toLowerCase()) {
    case "vi":
      return format === "page_n"
        ? `Trang ${currentNum}`
        : `Trang ${currentNum} / ${totalPages}`;
    case "ru":
      return format === "page_n"
        ? `Стр. ${currentNum}`
        : `Стр. ${currentNum} из ${totalPages}`;
    case "ja":
      return format === "page_n"
        ? `${currentNum} ページ`
        : `${currentNum} / ${totalPages} ページ`;
    case "tr":
      return format === "page_n"
        ? `Sayfa ${currentNum}`
        : `Sayfa ${currentNum} / ${totalPages}`;
    case "ar":
      return format === "page_n"
        ? `صفحة ${currentNum}`
        : `صفحة ${currentNum} من ${totalPages}`;
    case "es":
      return format === "page_n"
        ? `Página ${currentNum}`
        : `Página ${currentNum} de ${totalPages}`;
    case "fr":
      return format === "page_n"
        ? `Page ${currentNum}`
        : `Page ${currentNum} sur ${totalPages}`;
    case "de":
      return format === "page_n"
        ? `Seite ${currentNum}`
        : `Seite ${currentNum} von ${totalPages}`;
    default:
      return format === "page_n"
        ? `Page ${currentNum}`
        : `Page ${currentNum} of ${totalPages}`;
  }
}

export async function addPageNumbers(
  buffer: ArrayBuffer,
  options: PageNumberOptions = {}
): Promise<Uint8Array> {
  const {
    position = "bottom-center",
    format = "page_n_of_total",
    locale,
    startPage = 1,
    fromNumber = 1,
    fontSize = 10,
    margin = 30,
  } = options;

  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const totalPages = pages.length;

  for (let i = startPage - 1; i < totalPages; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const currentNum = fromNumber + (i - (startPage - 1));

    const text = getLocalizedPageLabel(currentNum, totalPages, format, locale);

    // If text contains non-Latin or complex characters (e.g. Russian Стр., Japanese ページ, Arabic صفحة)
    if (hasNonLatinCharacters(text)) {
      const stamp = await renderTextToStamp(text, {
        fontSize,
        color: { r: 0.2, g: 0.2, b: 0.2 },
      });

      if (stamp) {
        const embeddedImg = await pdfDoc.embedPng(stamp.buffer);
        let x = 0;
        let y = 0;

        switch (position) {
          case "bottom-left":
            x = margin;
            y = margin;
            break;
          case "bottom-center":
            x = (width - stamp.width) / 2;
            y = margin;
            break;
          case "bottom-right":
            x = width - margin - stamp.width;
            y = margin;
            break;
          case "top-left":
            x = margin;
            y = height - margin - stamp.height;
            break;
          case "top-center":
            x = (width - stamp.width) / 2;
            y = height - margin - stamp.height;
            break;
          case "top-right":
            x = width - margin - stamp.width;
            y = height - margin - stamp.height;
            break;
        }

        page.drawImage(embeddedImg, {
          x,
          y,
          width: stamp.width,
          height: stamp.height,
        });
        continue;
      }
    }

    // Standard Latin-1 rendering
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    let x = 0;
    let y = 0;

    switch (position) {
      case "bottom-left":
        x = margin;
        y = margin;
        break;
      case "bottom-center":
        x = (width - textWidth) / 2;
        y = margin;
        break;
      case "bottom-right":
        x = width - margin - textWidth;
        y = margin;
        break;
      case "top-left":
        x = margin;
        y = height - margin - textHeight;
        break;
      case "top-center":
        x = (width - textWidth) / 2;
        y = height - margin - textHeight;
        break;
      case "top-right":
        x = width - margin - textWidth;
        y = height - margin - textHeight;
        break;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  return await pdfDoc.save();
}
