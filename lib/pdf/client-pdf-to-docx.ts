// In-Browser PDF to DOCX Converter
// Extracts text, layout, and page structure from PDF and constructs an OpenXML DOCX archive.

import { createZip, ZipEntry } from "./zip-utils";

export interface PdfToDocxProgress {
  currentPage: number;
  totalPages: number;
  stage: "extracting" | "building" | "packaging";
}

export interface PdfToDocxOptions {
  onProgress?: (progress: PdfToDocxProgress) => void;
}

interface ExtractedTextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
  isBold: boolean;
  isItalic: boolean;
}

interface TextLine {
  y: number;
  height: number;
  items: ExtractedTextItem[];
  fullText: string;
}

interface ParagraphBlock {
  type: "heading1" | "heading2" | "paragraph";
  lines: TextLine[];
}

function escapeXml(unsafe: string): string {
  // Strip non-printable ASCII control characters except newline and tab
  const sanitized = unsafe.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function loadPdfJs() {
  if (typeof window === "undefined") {
    // Node.js test environment
    const legacy = await import("pdfjs-dist/legacy/build/pdf.mjs");
    return legacy;
  }
  // Browser environment
  const pdfjsLib = await import("pdfjs-dist");
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }
  return pdfjsLib;
}

export async function convertPdfToDocx(
  pdfBuffer: ArrayBuffer | Uint8Array,
  options: PdfToDocxOptions = {}
): Promise<Uint8Array> {
  const pdfjs = await loadPdfJs();

  const dataArray =
    pdfBuffer instanceof Uint8Array
      ? pdfBuffer
      : new Uint8Array(pdfBuffer);

  const loadingTask = pdfjs.getDocument({
    data: dataArray.slice(0),
    cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/standard_fonts/",
  });

  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  const pageParagraphBlocks: ParagraphBlock[][] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    options.onProgress?.({
      currentPage: pageNum,
      totalPages,
      stage: "extracting",
    });

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items as any[];

    const extractedItems: ExtractedTextItem[] = [];

    for (const item of items) {
      if (!item.str || item.str.trim() === "") continue;

      const transform = item.transform || [1, 0, 0, 1, 0, 0];
      const fontHeight = Math.abs(transform[3] || item.height || 12);
      const fontName = (item.fontName || "").toLowerCase();
      const isBold =
        fontName.includes("bold") ||
        fontName.includes("black") ||
        fontName.includes("heavy");
      const isItalic =
        fontName.includes("italic") ||
        fontName.includes("oblique");

      extractedItems.push({
        str: item.str,
        x: transform[4] || 0,
        y: transform[5] || 0,
        width: item.width || 0,
        height: fontHeight,
        fontSize: fontHeight,
        fontName: item.fontName || "Calibri",
        isBold,
        isItalic,
      });
    }

    // Sort items by Y (top to bottom; note PDF coordinates have Y=0 at bottom, so descending Y)
    // and then by X (left to right)
    extractedItems.sort((a, b) => {
      if (Math.abs(a.y - b.y) > 3) {
        return b.y - a.y; // descending Y
      }
      return a.x - b.x; // ascending X
    });

    // Group items into lines
    const lines: TextLine[] = [];
    for (const item of extractedItems) {
      const existingLine = lines.find((l) => Math.abs(l.y - item.y) <= 4);
      if (existingLine) {
        existingLine.items.push(item);
        existingLine.items.sort((a, b) => a.x - b.x);
      } else {
        lines.push({
          y: item.y,
          height: item.height,
          items: [item],
          fullText: "",
        });
      }
    }

    // Calculate line texts and average font size
    let sumFontSize = 0;
    let countFontSize = 0;
    for (const line of lines) {
      line.fullText = line.items.map((i) => i.str).join(" ");
      for (const it of line.items) {
        sumFontSize += it.fontSize;
        countFontSize++;
      }
    }
    const avgFontSize = countFontSize > 0 ? sumFontSize / countFontSize : 12;

    // Group lines into paragraphs based on vertical proximity and headings
    const paragraphs: ParagraphBlock[] = [];
    let currentPara: ParagraphBlock | null = null;
    let lastY = -1;

    for (const line of lines) {
      const lineMaxFontSize = Math.max(...line.items.map((i) => i.fontSize));
      const isH1 = lineMaxFontSize >= avgFontSize * 1.5 && line.fullText.length < 120;
      const isH2 = lineMaxFontSize >= avgFontSize * 1.25 && lineMaxFontSize < avgFontSize * 1.5 && line.fullText.length < 120;

      if (isH1 || isH2) {
        // Headings start their own paragraph
        paragraphs.push({
          type: isH1 ? "heading1" : "heading2",
          lines: [line],
        });
        currentPara = null;
      } else {
        const lineGap = lastY >= 0 ? Math.abs(lastY - line.y) : 0;
        const lineSpacing = line.height * 1.8;

        if (!currentPara || lineGap > lineSpacing) {
          currentPara = {
            type: "paragraph",
            lines: [line],
          };
          paragraphs.push(currentPara);
        } else {
          currentPara.lines.push(line);
        }
      }
      lastY = line.y;
    }

    pageParagraphBlocks.push(paragraphs);
  }

  options.onProgress?.({
    currentPage: totalPages,
    totalPages,
    stage: "building",
  });

  // Construct word/document.xml
  let bodyXml = "";

  pageParagraphBlocks.forEach((paragraphs, pIndex) => {
    if (paragraphs.length === 0) {
      // Empty page
      bodyXml += `<w:p><w:r><w:t></w:t></w:r></w:p>`;
    } else {
      for (const para of paragraphs) {
        let styleTag = "";
        if (para.type === "heading1") {
          styleTag = `<w:pPr><w:pStyle w:val="Heading1"/></w:pPr>`;
        } else if (para.type === "heading2") {
          styleTag = `<w:pPr><w:pStyle w:val="Heading2"/></w:pPr>`;
        }

        let runsXml = "";
        for (let lIdx = 0; lIdx < para.lines.length; lIdx++) {
          const line = para.lines[lIdx];
          for (let iIdx = 0; iIdx < line.items.length; iIdx++) {
            const item = line.items[iIdx];
            const escaped = escapeXml(item.str);
            const boldTag = item.isBold ? "<w:b/>" : "";
            const italicTag = item.isItalic ? "<w:i/>" : "";
            const halfPoints = Math.round(item.fontSize * 2);
            const sizeTag = halfPoints ? `<w:sz w:val="${halfPoints}"/><w:szCs w:val="${halfPoints}"/>` : "";

            const rPr = (boldTag || italicTag || sizeTag)
              ? `<w:rPr>${boldTag}${italicTag}${sizeTag}</w:rPr>`
              : "";

            runsXml += `<w:r>${rPr}<w:t xml:space="preserve">${escaped}</w:t></w:r>`;

            // Add space between items if needed
            if (iIdx < line.items.length - 1) {
              runsXml += `<w:r><w:t xml:space="preserve"> </w:t></w:r>`;
            }
          }

          // If more lines in this paragraph, add a soft break or space
          if (lIdx < para.lines.length - 1) {
            runsXml += `<w:r><w:t xml:space="preserve"> </w:t></w:r>`;
          }
        }

        bodyXml += `<w:p>${styleTag}${runsXml}</w:p>`;
      }
    }

    // Insert page break between pages (except after the last page)
    if (pIndex < pageParagraphBlocks.length - 1) {
      bodyXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
    }
  });

  // Final section properties (A4 size: 11906 x 16838 twips, 1-inch margins: 1440 twips)
  bodyXml += `
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  `;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${bodyXml}
  </w:body>
</w:document>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
        <w:sz w:val="24"/>
        <w:szCs w:val="24"/>
        <w:lang w:val="en-US"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:after="160" w:line="240" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:spacing w:before="240" w:after="120"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="36"/>
      <w:szCs w:val="36"/>
      <w:color w:val="1F497D"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:spacing w:before="200" w:after="80"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="28"/>
      <w:szCs w:val="28"/>
      <w:color w:val="2E74B5"/>
    </w:rPr>
  </w:style>
</w:styles>`;

  options.onProgress?.({
    currentPage: totalPages,
    totalPages,
    stage: "packaging",
  });

  const entries: ZipEntry[] = [
    { name: "[Content_Types].xml", data: contentTypesXml },
    { name: "_rels/.rels", data: relsXml },
    { name: "word/_rels/document.xml.rels", data: docRelsXml },
    { name: "word/document.xml", data: documentXml },
    { name: "word/styles.xml", data: stylesXml },
  ];

  return await createZip(entries, true);
}
