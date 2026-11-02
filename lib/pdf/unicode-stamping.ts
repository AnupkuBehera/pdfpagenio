/**
 * Unicode Stamping Engine for PDF Pagenio
 * 
 * Provides crisp, resolution-independent rendering of non-Latin, CJK, and RTL scripts
 * (Japanese, Vietnamese, Russian, Arabic) to bypass PDF WinAnsi font limitations
 * without requiring 20MB+ CJK font downloads over mobile connections.
 */

export interface TextStampOptions {
  fontSize?: number; // Size in PDF points (default 48)
  color?: { r: number; g: number; b: number }; // RGB from 0 to 1
  fontFamily?: string;
}

export interface TextStampResult {
  buffer: ArrayBuffer;
  width: number; // Width in PDF points
  height: number; // Height in PDF points
}

/**
 * Checks whether a text string contains characters outside the standard
 * WinAnsi / Latin-1 encoding set (e.g. Japanese, Vietnamese, Cyrillic, Arabic).
 */
export function hasNonLatinCharacters(text: string): boolean {
  if (!text) return false;
  // Characters beyond Latin-1 (code > 255)
  return /[^\u0000-\u00FF]/.test(text);
}

/**
 * Renders text to an offscreen high-DPI (300 DPI) canvas and returns
 * a transparent PNG ArrayBuffer with exact PDF point dimensions.
 */
export async function renderTextToStamp(
  text: string,
  options: TextStampOptions = {}
): Promise<TextStampResult | null> {
  if (!text) return null;

  const {
    fontSize = 48,
    color = { r: 0.8, g: 0.1, b: 0.1 },
    fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Hiragino Sans", "Meiryo", "Cairo", "Tahoma", sans-serif',
  } = options;

  // If in a non-browser environment (e.g. Node tests / SSR without Canvas)
  if (typeof document === "undefined") {
    // Generate a minimal mock 1x1 PNG buffer for headless Node test environments
    return createHeadlessStampFallback(text, fontSize);
  }

  try {
    const scale = 300 / 72; // 300 DPI print-ready resolution factor
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Initial font setting to measure width
    ctx.font = `bold ${fontSize * scale}px ${fontFamily}`;
    const metrics = ctx.measureText(text);

    const textWidth = metrics.width;
    const textHeight = fontSize * 1.3 * scale;
    const padding = 16 * scale;

    const canvasWidth = Math.ceil(textWidth + padding * 2);
    const canvasHeight = Math.ceil(textHeight + padding * 2);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Reapply font and rendering hints after canvas resize
    ctx.font = `bold ${fontSize * scale}px ${fontFamily}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    // Set text color
    const red = Math.round(Math.max(0, Math.min(1, color.r)) * 255);
    const green = Math.round(Math.max(0, Math.min(1, color.g)) * 255);
    const blue = Math.round(Math.max(0, Math.min(1, color.b)) * 255);
    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;

    // Draw centered text
    ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

    // Export to PNG blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/png");
    });

    if (!blob) return null;

    const buffer = await blob.arrayBuffer();
    return {
      buffer,
      width: canvasWidth / scale,
      height: canvasHeight / scale,
    };
  } catch (err) {
    console.error("Error creating unicode canvas stamp:", err);
    return null;
  }
}

/**
 * Creates a minimal 1x1 transparent PNG fallback for headless Node.js testing environments
 */
function createHeadlessStampFallback(text: string, fontSize: number): TextStampResult {
  // Minimal valid 1x1 RGBA PNG byte array
  const png1x1 = new Uint8Array([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
    0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196,
    137, 0, 0, 0, 11, 73, 68, 65, 84, 120, 156, 99, 96, 0, 0, 0,
    2, 0, 1, 226, 33, 188, 51, 0, 0, 0, 0, 73, 69, 78, 68,
    174, 66, 96, 130
  ]);

  const approxWidth = text.length * (fontSize * 0.6);
  return {
    buffer: png1x1.buffer as ArrayBuffer,
    width: approxWidth,
    height: fontSize * 1.3,
  };
}

