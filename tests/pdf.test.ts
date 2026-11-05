import assert from "node:assert";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { mergePDFs } from "../lib/pdf/client-merge";
import { splitPDFByRanges, extractAllPages, parsePageRanges } from "../lib/pdf/client-split";
import { removePages, extractPages } from "../lib/pdf/client-remove-pages";
import { rotatePDF } from "../lib/pdf/client-rotate";
import { addPageNumbers } from "../lib/pdf/client-pagenumbers";
import { addWatermark } from "../lib/pdf/client-watermark";
import { cropPDF } from "../lib/pdf/client-crop";
import { compressPDFClient } from "../lib/pdf/client-compress";
import { createZip, extractZip, readZipTextFile } from "../lib/pdf/zip-utils";
import { convertPdfToDocx } from "../lib/pdf/client-pdf-to-docx";
import { convertDocxToPdf } from "../lib/pdf/client-docx-to-pdf";
import { convertPdfToJpg } from "../lib/pdf/client-pdf-to-jpg";
import { repairPDFClient } from "../lib/pdf/client-repair";
import { organizePDF } from "../lib/pdf/client-organize";
import { unlockPDFClient } from "../lib/pdf/client-protect";
import { convertHtmlToPdf } from "../lib/pdf/client-html-to-pdf";

async function createTestPDF(numPages = 3, label = "Doc") {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);

  for (let i = 0; i < numPages; i++) {
    const page = doc.addPage([400, 600]);
    page.drawText(`${label} - Page ${i + 1}`, {
      x: 50,
      y: 500,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    });
  }

  const bytes = await doc.save();
  return bytes.buffer as ArrayBuffer;
}

async function runTests() {
  console.log("--- Starting PDF Processing Logic Tests ---");

  // 1. Range Parser Test
  console.log("1. Testing range parser...");
  const ranges = parsePageRanges("1-2, 4, 6-7", 10);
  assert.deepStrictEqual(ranges, [[0, 1], [3], [5, 6]]);
  console.log("  ✓ Range parser passed");

  // 2. Merge PDFs Test
  console.log("2. Testing Merge PDF...");
  const pdf1 = await createTestPDF(2, "DocA");
  const pdf2 = await createTestPDF(3, "DocB");
  const mergedBytes = await mergePDFs([
    { buffer: pdf1, name: "docA.pdf" },
    { buffer: pdf2, name: "docB.pdf" },
  ]);
  const loadedMerged = await PDFDocument.load(mergedBytes);
  assert.strictEqual(loadedMerged.getPageCount(), 5, "Merged PDF should have 5 pages");
  console.log("  ✓ Merge PDF passed (2 + 3 = 5 pages)");

  // 3. Split PDF by Ranges Test
  console.log("3. Testing Split PDF by Ranges...");
  const testDoc = await createTestPDF(5, "Source");
  const splitResults = await splitPDFByRanges(testDoc, "1-2, 4-5", "test.pdf");
  assert.strictEqual(splitResults.length, 2, "Should return 2 split documents");
  const splitDoc1 = await PDFDocument.load(splitResults[0].bytes);
  const splitDoc2 = await PDFDocument.load(splitResults[1].bytes);
  assert.strictEqual(splitDoc1.getPageCount(), 2);
  assert.strictEqual(splitDoc2.getPageCount(), 2);
  console.log("  ✓ Split PDF passed");

  // 4. Extract All Pages Test
  console.log("4. Testing Extract All Pages...");
  const extractAllResults = await extractAllPages(testDoc, "all.pdf");
  assert.strictEqual(extractAllResults.length, 5, "Should extract 5 separate pages");
  console.log("  ✓ Extract All Pages passed");

  // 5. Remove Pages Test
  console.log("5. Testing Remove Pages...");
  const cleanedBytes = await removePages(testDoc, [2]);
  const cleanedDoc = await PDFDocument.load(cleanedBytes);
  assert.strictEqual(cleanedDoc.getPageCount(), 4, "Cleaned doc should have 4 pages");
  console.log("  ✓ Remove Pages passed");

  // 6. Extract Pages Test
  console.log("6. Testing Extract Selected Pages...");
  const extractedBytes = await extractPages(testDoc, [1, 3]);
  const extractedDoc = await PDFDocument.load(extractedBytes);
  assert.strictEqual(extractedDoc.getPageCount(), 2, "Extracted doc should have 2 pages");
  console.log("  ✓ Extract Pages passed");

  // 7. Rotate PDF Test
  console.log("7. Testing Rotate PDF...");
  const rotatedBytes = await rotatePDF(testDoc, 90);
  const rotatedDoc = await PDFDocument.load(rotatedBytes);
  assert.strictEqual(rotatedDoc.getPages()[0].getRotation().angle, 90, "Page 1 should be rotated by 90 degrees");
  console.log("  ✓ Rotate PDF passed");

  // 8. Add Page Numbers Test
  console.log("8. Testing Page Numbers...");
  const numberedBytes = await addPageNumbers(testDoc, {
    position: "bottom-center",
    format: "page_n_of_total",
  });
  const numberedDoc = await PDFDocument.load(numberedBytes);
  assert.strictEqual(numberedDoc.getPageCount(), 5);
  console.log("  ✓ Page Numbers passed");

  // 9. Watermark PDF Test
  console.log("9. Testing Watermark PDF...");
  const watermarkedBytes = await addWatermark(testDoc, {
    text: "TOP SECRET",
    opacity: 0.5,
    rotation: 45,
  });
  const watermarkedDoc = await PDFDocument.load(watermarkedBytes);
  assert.strictEqual(watermarkedDoc.getPageCount(), 5);
  console.log("  ✓ Watermark PDF passed");

  // 10. Crop PDF Test
  console.log("10. Testing Crop PDF...");
  const croppedBytes = await cropPDF(testDoc, {
    x: 20,
    y: 20,
    width: 300,
    height: 500,
  });
  const croppedDoc = await PDFDocument.load(croppedBytes);
  const cropBox = croppedDoc.getPages()[0].getCropBox();
  assert.strictEqual(cropBox.width, 300);
  assert.strictEqual(cropBox.height, 500);
  console.log("  ✓ Crop PDF passed");

  // 11. Unicode & Non-Latin Watermarking Test (Japanese, Vietnamese, Russian, Arabic)
  console.log("11. Testing Non-Latin Watermark (CJK / Cyrillic / Vietnamese / Arabic)...");
  const nonLatinTexts = [
    "社外秘 - 承認済", // Japanese
    "Bản quyền thuộc PDF Pagenio", // Vietnamese
    "Конфиденциально - Копия", // Russian
    "سري للغاية", // Arabic
  ];

  for (const text of nonLatinTexts) {
    const nonLatinBytes = await addWatermark(testDoc, {
      text,
      opacity: 0.4,
      rotation: 45,
    });
    const nonLatinDoc = await PDFDocument.load(nonLatinBytes);
    assert.strictEqual(nonLatinDoc.getPageCount(), 5);
  }
  console.log("  ✓ Non-Latin Watermarking passed (0 WinAnsi crashes across JA, VI, RU, AR)");

  // 12. Localized Page Numbering Test
  console.log("12. Testing Localized Page Numbers...");
  const localesToTest = ["vi", "ru", "ja", "tr", "ar", "es", "fr", "de"];
  for (const loc of localesToTest) {
    const locBytes = await addPageNumbers(testDoc, {
      position: "bottom-center",
      format: "page_n_of_total",
      locale: loc,
    });
    const locDoc = await PDFDocument.load(locBytes);
    assert.strictEqual(locDoc.getPageCount(), 5);
  }
  console.log("  ✓ Localized Page Numbers passed across all 8 tested locales");

  // 13. Target-Size Compression Test (200 KB & 100 KB Limits for Exam/Govt Forms)
  console.log("13. Testing Target-Size Compression (200 KB & 100 KB Limits)...");
  const compress200Result = await compressPDFClient(testDoc, { targetMaxKb: 200 });
  assert.strictEqual(compress200Result.targetKb, 200);
  assert.ok(compress200Result.newSize > 0);
  assert.strictEqual(compress200Result.targetMet, true, "File must be strictly under 200 KB");

  const compress100Result = await compressPDFClient(testDoc, { targetMaxKb: 100 });
  assert.strictEqual(compress100Result.targetKb, 100);
  assert.ok(compress100Result.newSize > 0);
  assert.strictEqual(compress100Result.targetMet, true, "File must be strictly under 100 KB");
  console.log("  ✓ Target-Size Compression passed (Under 200 KB and 100 KB guaranteed)");

  // 14. ZIP Utilities Test (Pack and Unpack)
  console.log("14. Testing ZIP Utilities (Packaging & Extraction)...");
  const testFiles = [
    { name: "[Content_Types].xml", data: '<?xml version="1.0"?><Types/>' },
    { name: "word/document.xml", data: '<w:document><w:body><w:p><w:r><w:t>Hello Unit Test</w:t></w:r></w:p></w:body></w:document>' },
  ];
  const zipBytes = await createZip(testFiles);
  assert.ok(zipBytes.byteLength > 50, "ZIP buffer should contain data");
  const extractedFiles = await extractZip(zipBytes);
  assert.strictEqual(extractedFiles.size, 2, "Should extract exactly 2 files");
  const docXml = await readZipTextFile(zipBytes, "word/document.xml");
  assert.ok(docXml && docXml.includes("Hello Unit Test"), "Extracted text must match original");
  console.log("  ✓ ZIP creation and extraction passed");

  // 15. PDF to DOCX In-Browser Converter Test
  console.log("15. Testing PDF to Word (DOCX) Conversion...");
  const samplePdf = await createTestPDF(2, "TestReport");
  const docxResult = await convertPdfToDocx(samplePdf);
  assert.ok(docxResult.byteLength > 100, "DOCX buffer must be generated");
  const docxDocXml = await readZipTextFile(docxResult, "word/document.xml");
  assert.ok(docxDocXml !== null, "DOCX must contain word/document.xml");
  assert.ok(docxDocXml.includes("TestReport"), "Extracted text in DOCX must contain original PDF words");
  console.log("  ✓ PDF to Word (DOCX) conversion passed");

  // 16. DOCX to PDF In-Browser Converter Test
  console.log("16. Testing Word (DOCX) to PDF Conversion...");
  const convertedPdfBytes = await convertDocxToPdf(docxResult);
  assert.ok(convertedPdfBytes.byteLength > 100, "PDF buffer must be generated");
  const loadedPdfFromDocx = await PDFDocument.load(convertedPdfBytes);
  assert.ok(loadedPdfFromDocx.getPageCount() >= 1, "PDF converted from Word must have at least 1 page");
  console.log("  ✓ Word (DOCX) to PDF conversion passed");

  // 17. PDF to JPG In-Browser Converter Test
  console.log("17. Testing PDF to JPG Conversion...");
  const jpgResult = await convertPdfToJpg(samplePdf, "sample");
  assert.ok(jpgResult.bytes.byteLength > 50, "JPG/ZIP bytes must be generated");
  assert.strictEqual(jpgResult.pageCount, 2, "Page count must match");
  console.log("  ✓ PDF to JPG conversion passed");

  // 18. PDF Repair Engine Test
  console.log("18. Testing PDF Repair & Re-indexing...");
  const repairResult = await repairPDFClient(samplePdf);
  assert.ok(repairResult.bytes.byteLength > 100, "Repaired bytes must be generated");
  const repairedDoc = await PDFDocument.load(repairResult.bytes);
  assert.strictEqual(repairedDoc.getPageCount(), 2, "Page count must be preserved after repair");
  console.log("  ✓ PDF Repair passed");

  // 19. PDF Organize & Stitch Test
  console.log("19. Testing PDF Organization...");
  const organizedBytes = await organizePDF([
    { buffer: samplePdf, rotation: 90 },
    { buffer: samplePdf, rotation: 0 },
  ]);
  const organizedDoc = await PDFDocument.load(organizedBytes);
  assert.strictEqual(organizedDoc.getPageCount(), 4, "Organized PDF should concatenate 2 + 2 = 4 pages");
  console.log("  ✓ PDF Organization passed");

  // 20. PDF Crop Bounds Test
  console.log("20. Testing PDF Cropping...");
  const croppedBytes20 = await cropPDF(samplePdf, { x: 50, y: 50, width: 300, height: 500 });
  const croppedDoc20 = await PDFDocument.load(croppedBytes20);
  const cropBox20 = croppedDoc20.getPages()[0].getCropBox();
  assert.strictEqual(cropBox20.width, 300);
  assert.strictEqual(cropBox20.height, 500);
  console.log("  ✓ PDF Cropping passed");

  // 21. PDF Unlock Test
  console.log("21. Testing PDF Unlock...");
  const unlockedBytes = await unlockPDFClient(samplePdf);
  assert.ok(unlockedBytes.byteLength > 100);
  console.log("  ✓ PDF Unlock passed");

  // 22. HTML to PDF Conversion Test
  console.log("22. Testing HTML to PDF Conversion...");
  const sampleHtml = `
    <!DOCTYPE html>
    <html>
      <head><title>Test</title></head>
      <body>
        <h1>Document Title</h1>
        <p>This is a paragraph with <b>bold</b> text.</p>
        <ul>
          <li>Bullet 1</li>
          <li>Bullet 2</li>
        </ul>
      </body>
    </html>
  `;
  const htmlPdfBytes = await convertHtmlToPdf(sampleHtml);
  assert.ok(htmlPdfBytes.byteLength > 100, "HTML to PDF buffer must be generated");
  const htmlDoc = await PDFDocument.load(htmlPdfBytes);
  assert.strictEqual(htmlDoc.getPageCount(), 1, "HTML PDF should have 1 page");
  console.log("  ✓ HTML to PDF conversion passed");

  console.log("\n=========================================");
  console.log("  ALL 22 PDF & CONVERSION TESTS PASSED! ");
  console.log("=========================================\n");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

