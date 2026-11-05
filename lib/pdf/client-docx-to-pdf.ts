// In-Browser DOCX to PDF Converter
// Extracts word/document.xml from DOCX ZIP archive and renders styled vector PDF using pdf-lib.

import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from "pdf-lib";
import { extractZip } from "./zip-utils";

export interface DocxToPdfProgress {
  stage: "extracting" | "parsing" | "rendering";
  currentPage?: number;
  totalPages?: number;
}

export interface DocxToPdfOptions {
  onProgress?: (progress: DocxToPdfProgress) => void;
}

interface DocxRun {
  text: string;
  isBold: boolean;
  isItalic: boolean;
  fontSize: number; // in points
  isPageBreak?: boolean;
}

interface DocxParagraph {
  isHeading: boolean;
  headingLevel: number;
  runs: DocxRun[];
}

function unescapeXml(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function parseParagraphXmlRegex(paraXml: string): DocxParagraph {
  let isHeading = false;
  let headingLevel = 0;

  const styleMatch = paraXml.match(/<w:pStyle[^>]*w:val="([^"]+)"/i);
  if (styleMatch) {
    const styleVal = styleMatch[1].toLowerCase();
    if (styleVal.includes("heading1") || styleVal === "1") {
      isHeading = true;
      headingLevel = 1;
    } else if (styleVal.includes("heading2") || styleVal === "2") {
      isHeading = true;
      headingLevel = 2;
    } else if (styleVal.includes("heading")) {
      isHeading = true;
      headingLevel = 3;
    }
  }

  const runs: DocxRun[] = [];
  const runRegex = /<w:r\b[^>]*>([\s\S]*?)<\/w:r>/gi;
  let runMatch: RegExpExecArray | null;

  while ((runMatch = runRegex.exec(paraXml)) !== null) {
    const rContent = runMatch[1];
    const isBold = /<w:b\b/i.test(rContent);
    const isItalic = /<w:i\b/i.test(rContent);
    const hasPageBreak = /<w:br[^>]*w:type="page"/i.test(rContent);

    let fontSize = isHeading
      ? headingLevel === 1
        ? 18
        : headingLevel === 2
        ? 14
        : 12
      : 11;

    const szMatch = rContent.match(/<w:sz[^>]*w:val="(\d+)"/i);
    if (szMatch) {
      fontSize = Math.max(7, parseInt(szMatch[1], 10) / 2);
    }

    if (hasPageBreak) {
      runs.push({
        text: "",
        isBold: false,
        isItalic: false,
        fontSize,
        isPageBreak: true,
      });
    }

    // Extract text elements
    const tRegex = /<w:t(?:\s+[^>]*)?>([\s\S]*?)<\/w:t>/gi;
    let tMatch: RegExpExecArray | null;
    let runText = "";

    while ((tMatch = tRegex.exec(rContent)) !== null) {
      runText += unescapeXml(tMatch[1]);
    }

    // Tab element
    if (/<w:tab\b/i.test(rContent)) {
      runText += "    ";
    }

    if (runText.length > 0) {
      runs.push({
        text: runText,
        isBold,
        isItalic,
        fontSize,
      });
    }
  }

  return { isHeading, headingLevel, runs };
}

function parseDocxXml(xmlStr: string): DocxParagraph[] {
  // If DOMParser is available (browsers)
  if (typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlStr, "text/xml");
      const body = xmlDoc.getElementsByTagName("w:body")[0];
      if (body) {
        const paragraphs: DocxParagraph[] = [];
        const children = Array.from(body.children);

        for (const child of children) {
          const nodeName = child.localName || child.nodeName.replace(/^.*:/, "");

          if (nodeName === "p") {
            const pXml = child.outerHTML || new XMLSerializer().serializeToString(child);
            paragraphs.push(parseParagraphXmlRegex(pXml));
          } else if (nodeName === "tbl") {
            // Extract table rows
            const rows = child.getElementsByTagName("w:tr");
            for (let r = 0; r < rows.length; r++) {
              const cells = rows[r].getElementsByTagName("w:tc");
              const cellTexts: string[] = [];
              for (let c = 0; c < cells.length; c++) {
                const cellText = cells[c].textContent?.trim() || "";
                cellTexts.push(cellText);
              }
              if (cellTexts.length > 0) {
                paragraphs.push({
                  isHeading: r === 0,
                  headingLevel: r === 0 ? 3 : 0,
                  runs: [
                    {
                      text: cellTexts.join("  |  "),
                      isBold: r === 0,
                      isItalic: false,
                      fontSize: 10,
                    },
                  ],
                });
              }
            }
          }
        }
        return paragraphs;
      }
    } catch {
      // fallback to regex
    }
  }

  // Regex fallback (Node.js test environment)
  const paragraphs: DocxParagraph[] = [];
  const pRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/gi;
  let pMatch: RegExpExecArray | null;

  while ((pMatch = pRegex.exec(xmlStr)) !== null) {
    paragraphs.push(parseParagraphXmlRegex(pMatch[0]));
  }

  return paragraphs;
}

interface LayoutToken {
  text: string;
  font: PDFFont;
  fontSize: number;
  width: number;
  isPageBreak?: boolean;
}

export async function convertDocxToPdf(
  docxBuffer: ArrayBuffer | Uint8Array,
  options: DocxToPdfOptions = {}
): Promise<Uint8Array> {
  options.onProgress?.({ stage: "extracting" });

  const files = await extractZip(docxBuffer);

  // Find document.xml
  let documentXml: string | null = null;
  for (const [name, data] of files.entries()) {
    if (name.toLowerCase() === "word/document.xml") {
      documentXml = new TextDecoder("utf-8").decode(data);
      break;
    }
  }

  if (!documentXml) {
    throw new Error(
      "Invalid DOCX file: word/document.xml not found inside document package."
    );
  }

  options.onProgress?.({ stage: "parsing" });
  const paragraphs = parseDocxXml(documentXml);

  options.onProgress?.({ stage: "rendering" });

  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontBoldItalic = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

  const PAGE_WIDTH = 595.28; // Standard A4 points
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

  for (const para of paragraphs) {
    if (para.runs.length === 0) {
      // Empty line / paragraph spacing
      currentY -= 12;
      if (currentY < MARGIN_BOTTOM) {
        addNewPage();
      }
      continue;
    }

    // Space before headings
    if (para.isHeading) {
      currentY -= para.headingLevel === 1 ? 16 : 10;
      if (currentY < MARGIN_BOTTOM + 30) {
        addNewPage();
      }
    }

    // Break runs into layout tokens (words and spaces)
    const tokens: LayoutToken[] = [];

    for (const run of para.runs) {
      if (run.isPageBreak) {
        tokens.push({
          text: "",
          font: fontRegular,
          fontSize: run.fontSize,
          width: 0,
          isPageBreak: true,
        });
        continue;
      }

      const font = run.isBold && run.isItalic
        ? fontBoldItalic
        : run.isBold
        ? fontBold
        : run.isItalic
        ? fontItalic
        : fontRegular;

      // Split text into words and delimiters, preserving spaces
      const words = run.text.match(/\S+|\s+/g) || [];

      for (const word of words) {
        // Clean characters unsupported by WinAnsi
        const sanitizedWord = word.replace(/[^\x00-\x7F]/g, "?");
        const tokenWidth = font.widthOfTextAtSize(sanitizedWord, run.fontSize);

        // If a single word is wider than CONTENT_WIDTH, chop it
        if (tokenWidth > CONTENT_WIDTH) {
          let chunk = "";
          for (const char of sanitizedWord) {
            const nextChunk = chunk + char;
            if (font.widthOfTextAtSize(nextChunk, run.fontSize) > CONTENT_WIDTH) {
              tokens.push({
                text: chunk,
                font,
                fontSize: run.fontSize,
                width: font.widthOfTextAtSize(chunk, run.fontSize),
              });
              chunk = char;
            } else {
              chunk = nextChunk;
            }
          }
          if (chunk.length > 0) {
            tokens.push({
              text: chunk,
              font,
              fontSize: run.fontSize,
              width: font.widthOfTextAtSize(chunk, run.fontSize),
            });
          }
        } else {
          tokens.push({
            text: sanitizedWord,
            font,
            fontSize: run.fontSize,
            width: tokenWidth,
          });
        }
      }
    }

    // Layout tokens into lines
    let lineTokens: LayoutToken[] = [];
    let lineWidth = 0;
    let lineMaxHeight = 12;

    const flushLine = () => {
      if (lineTokens.length === 0) return;

      const lineHeight = lineMaxHeight * 1.35;
      if (currentY - lineHeight < MARGIN_BOTTOM) {
        addNewPage();
      }

      let currentX = MARGIN_LEFT;
      for (const tok of lineTokens) {
        if (tok.text.length > 0) {
          currentPage.drawText(tok.text, {
            x: currentX,
            y: currentY - lineMaxHeight,
            size: tok.fontSize,
            font: tok.font,
            color: para.isHeading
              ? rgb(0.12, 0.29, 0.49)
              : rgb(0.12, 0.14, 0.17),
          });
        }
        currentX += tok.width;
      }

      currentY -= lineHeight;
      lineTokens = [];
      lineWidth = 0;
      lineMaxHeight = 12;
    };

    for (const token of tokens) {
      if (token.isPageBreak) {
        flushLine();
        addNewPage();
        continue;
      }

      // Check if word would overflow line
      if (lineWidth + token.width > CONTENT_WIDTH && lineTokens.length > 0) {
        // If trailing token is whitespace, skip it before flushing
        flushLine();
        if (token.text.trim() === "") continue; // skip leading space on new line
      }

      lineTokens.push(token);
      lineWidth += token.width;
      if (token.fontSize > lineMaxHeight) {
        lineMaxHeight = token.fontSize;
      }
    }

    flushLine();

    // After paragraph spacing
    currentY -= para.isHeading ? 8 : 4;
  }

  // Ensure at least 1 page exists
  if (pdfDoc.getPageCount() === 0) {
    pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  }

  return await pdfDoc.save({ useObjectStreams: true });
}

