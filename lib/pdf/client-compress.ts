import { PDFDocument } from "pdf-lib";

export type CompressionLevel = "extreme" | "recommended" | "low";

export interface CompressOptions {
  level?: CompressionLevel;
  targetMaxKb?: number;
}

export interface CompressionResult {
  bytes: Uint8Array;
  originalSize: number;
  newSize: number;
  savingsPercentage: number;
  targetMet?: boolean;
  targetKb?: number;
}

export async function compressPDFClient(
  pdfBuffer: ArrayBuffer,
  levelOrOptions: CompressionLevel | CompressOptions = "recommended"
): Promise<CompressionResult> {
  const originalSize = pdfBuffer.byteLength;
  const options: CompressOptions =
    typeof levelOrOptions === "string"
      ? { level: levelOrOptions }
      : levelOrOptions || {};

  const level = options.level || "recommended";
  const targetMaxKb = options.targetMaxKb;
  const targetMaxBytes = targetMaxKb ? targetMaxKb * 1024 : undefined;

  if (typeof window === "undefined") {
    // Fallback if executed in node
    const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    const bytes = await pdfDoc.save({ useObjectStreams: true });
    const newSize = bytes.byteLength;
    return {
      bytes,
      originalSize,
      newSize,
      savingsPercentage: Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100)),
      targetMet: targetMaxBytes ? newSize <= targetMaxBytes : undefined,
      targetKb: targetMaxKb,
    };
  }

  const pdfjsLib = await import("pdfjs-dist");
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(pdfBuffer.slice(0)),
  });

  const srcPdf = await loadingTask.promise;
  const numPages = srcPdf.numPages;

  // Determine initial scale and quality
  let scale = 1.5;
  let quality = 0.75;

  if (targetMaxKb) {
    if (targetMaxKb <= 50) {
      scale = 0.85;
      quality = 0.48;
    } else if (targetMaxKb <= 100) {
      scale = 1.05;
      quality = 0.58;
    } else if (targetMaxKb <= 200) {
      scale = 1.25;
      quality = 0.68;
    } else {
      scale = 1.4;
      quality = 0.75;
    }
  } else if (level === "extreme") {
    scale = 1.0;
    quality = 0.55;
  } else if (level === "low") {
    scale = 2.0;
    quality = 0.88;
  }

  async function renderPass(passScale: number, passQuality: number): Promise<Uint8Array> {
    const outputPdf = await PDFDocument.create();

    for (let i = 1; i <= numPages; i++) {
      const page = await srcPdf.getPage(i);
      const viewport = page.getViewport({ scale: passScale });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (ctx) {
        await page.render({
          canvasContext: ctx,
          viewport,
        } as unknown as Parameters<typeof page.render>[0]).promise;

        const dataUrl = canvas.toDataURL("image/jpeg", passQuality);
        const base64 = dataUrl.split(",")[1];
        const binaryString = atob(base64);
        const imgBytes = new Uint8Array(binaryString.length);
        for (let j = 0; j < binaryString.length; j++) {
          imgBytes[j] = binaryString.charCodeAt(j);
        }

        const embeddedImg = await outputPdf.embedJpg(imgBytes);
        const origViewport = page.getViewport({ scale: 1.0 });
        const newPage = outputPdf.addPage([origViewport.width, origViewport.height]);

        newPage.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: origViewport.width,
          height: origViewport.height,
        });
      }
    }

    return await outputPdf.save({ useObjectStreams: true });
  }

  let bytes = await renderPass(scale, quality);

  // If a target size was requested and the first pass exceeded it, do an aggressive single adjustment pass
  if (targetMaxBytes && bytes.byteLength > targetMaxBytes && numPages <= 10) {
    const ratio = targetMaxBytes / bytes.byteLength;
    const adjustedScale = Math.max(0.65, scale * Math.sqrt(ratio) * 0.95);
    const adjustedQuality = Math.max(0.38, quality * 0.85);
    bytes = await renderPass(adjustedScale, adjustedQuality);
  }

  const newSize = bytes.byteLength;
  const savings = Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100));

  return {
    bytes,
    originalSize,
    newSize,
    savingsPercentage: savings,
    targetMet: targetMaxBytes ? newSize <= targetMaxBytes : undefined,
    targetKb: targetMaxKb,
  };
}
