import { PDFDocument } from "pdf-lib";

export interface MergeInputFile {
  buffer: ArrayBuffer;
  name: string;
}

export async function mergePDFs(files: MergeInputFile[]): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error("No files provided for merging.");
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    try {
      const pdf = await PDFDocument.load(file.buffer, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to load "${file.name}": ${msg}`);
    }
  }

  return await mergedPdf.save();
}

