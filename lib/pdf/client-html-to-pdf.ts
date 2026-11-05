// In-Browser HTML to PDF Converter
// Parses HTML markup and renders a styled vector A4 PDF with text-wrapping and auto-pagination.

import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from "pdf-lib";

export interface HtmlToPdfOptions {
  fontSize?: number;
  lineHeight?: number;
}

interface HtmlBlock {
  type: "h1" | "h2" | "h3" | "p" | "li" | "table-row";
  text: string;
  isBold?: boolean;
}

function stripAndParseHtml(htmlStr: string): HtmlBlock[] {
  // Strip style and script tags
  const clean = htmlStr
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

  const blocks: HtmlBlock[] = [];

  // Match main structural tags
  const tagRegex = /<(h1|h2|h3|p|li|tr)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(clean)) !== null) {
    const tag = match[1].toLowerCase() as HtmlBlock["type"];
    let inner = match[2];

    // If table row, extract cells
    if (tag === "table-row" || match[1].toLowerCase() === "tr") {
      const cellRegex = /<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
      const cells: string[] = [];
      let cMatch: RegExpExecArray | null;
      while ((cMatch = cellRegex.exec(inner)) !== null) {
        cells.push(cMatch[1].replace(/<[^>]+>/g, "").trim());
      }
      if (cells.length > 0) {
        blocks.push({
          type: "table-row",
          text: cells.join("  |  "),
          isBold: /<th\b/i.test(inner),
        });
      }
      continue;
    }

    // Extract text and remove inner tags
    const plainText = inner
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .trim();

    if (plainText.length > 0) {
      blocks.push({
        type: tag,
        text: plainText,
        isBold: tag === "h1" || tag === "h2" || /<b>|<strong>/i.test(inner),
      });
    }
  }

  // Fallback if no structural tags found: split by lines/paragraphs
  if (blocks.length === 0) {
    const rawText = clean.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (rawText.length > 0) {
      blocks.push({ type: "p", text: rawText });
    }
  }

  return blocks;
}

export async function convertHtmlToPdf(
  htmlContent: string | ArrayBuffer | Uint8Array,
  _options: HtmlToPdfOptions = {}
): Promise<Uint8Array> {
  let htmlString = "";
  if (typeof htmlContent === "string") {
    htmlString = htmlContent;
  } else {
    htmlString = new TextDecoder("utf-8").decode(htmlContent);
  }

  const blocks = stripAndParseHtml(htmlString);

  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const MARGIN_LEFT = 54;
  const MARGIN_RIGHT = 54;
  const MARGIN_TOP = 54;
  const MARGIN_BOTTOM = 54;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

  let currentPage: PDFPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let currentY = PAGE_HEIGHT - MARGIN_TOP;

  function addNewPage(): PDFPage {
    currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    currentY = PAGE_HEIGHT - MARGIN_TOP;
    return currentPage;
  }

  for (const block of blocks) {
    const isH1 = block.type === "h1";
    const isH2 = block.type === "h2";
    const isH3 = block.type === "h3";
    const isLi = block.type === "li";

    const fontSize = isH1 ? 20 : isH2 ? 15 : isH3 ? 13 : 11;
    const font = (block.isBold || isH1 || isH2 || isH3) ? fontBold : fontRegular;
    const lineHeight = fontSize * 1.35;

    // Top spacing
    currentY -= isH1 ? 18 : isH2 ? 12 : 6;
    if (currentY - lineHeight < MARGIN_BOTTOM) {
      addNewPage();
    }

    const textToRender = isLi ? `•  ${block.text}` : block.text;
    const words = textToRender.match(/\S+|\s+/g) || [];

    let currentLine = "";
    let currentLineWidth = 0;

    const flushLine = () => {
      if (currentLine.trim().length === 0) return;
      if (currentY - lineHeight < MARGIN_BOTTOM) {
        addNewPage();
      }
      currentPage.drawText(currentLine, {
        x: MARGIN_LEFT,
        y: currentY - fontSize,
        size: fontSize,
        font,
        color: (isH1 || isH2) ? rgb(0.12, 0.25, 0.45) : rgb(0.15, 0.17, 0.20),
      });
      currentY -= lineHeight;
      currentLine = "";
      currentLineWidth = 0;
    };

    for (const word of words) {
      const sanitized = word.replace(/[^\x00-\x7F]/g, "?");
      const wordWidth = font.widthOfTextAtSize(sanitized, fontSize);

      if (currentLineWidth + wordWidth > CONTENT_WIDTH && currentLine.length > 0) {
        flushLine();
      }

      currentLine += sanitized;
      currentLineWidth += wordWidth;
    }

    flushLine();

    // Bottom margin
    currentY -= isH1 ? 8 : 4;
  }

  if (pdfDoc.getPageCount() === 0) {
    pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  }

  return await pdfDoc.save({ useObjectStreams: true });
}
