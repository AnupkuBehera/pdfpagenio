// Dynamic browser-only PDF.js thumbnail renderer

export interface PageThumbnailInfo {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

export async function renderPDFPageThumbnail(
  pdfBuffer: ArrayBuffer,
  pageNumber: number,
  targetWidth: number = 240
): Promise<PageThumbnailInfo> {
  if (typeof window === "undefined") {
    throw new Error("Thumbnail rendering is only supported in browser environments.");
  }

  const pdfjsLib = await import("pdfjs-dist");

  // Configure worker
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }

  // Load document
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(pdfBuffer.slice(0)),
    cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
    cMapPacked: true,
  });

  const pdfDoc = await loadingTask.promise;
  const page = await pdfDoc.getPage(pageNumber);

  const unscaledViewport = page.getViewport({ scale: 1.0 });
  const scale = targetWidth / unscaledViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  if (!context) {
    throw new Error("Could not get 2D canvas context.");
  }

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext as unknown as Parameters<typeof page.render>[0]).promise;

  const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

  return {
    pageNumber,
    dataUrl,
    width: viewport.width,
    height: viewport.height,
  };
}

export async function getPDFPageCount(pdfBuffer: ArrayBuffer): Promise<number> {
  const pdfjsLib = await import("pdfjs-dist");
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(pdfBuffer.slice(0)),
  });

  const pdfDoc = await loadingTask.promise;
  return pdfDoc.numPages;
}

