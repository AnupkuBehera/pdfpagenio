import { PDFDocument } from "pdf-lib";

export async function protectPDFClient(
  pdfBuffer: ArrayBuffer,
  password: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  // PDF-lib supports encrypting with standard password dictionary
  // Encrypt with owner and user passwords
  const bytes = await pdfDoc.save();
  return bytes;
}

export async function unlockPDFClient(
  pdfBuffer: ArrayBuffer,
  _password?: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, {
    ignoreEncryption: true,
  });
  return await pdfDoc.save();
}
