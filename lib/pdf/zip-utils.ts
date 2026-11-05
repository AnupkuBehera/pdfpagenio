// Pure TypeScript ZIP archive generator and extractor
// 100% Client-side compatible using Web APIs (Uint8Array, CompressionStream, DecompressionStream)

export interface ZipEntry {
  name: string;
  data: Uint8Array | string;
}

// Pre-computed CRC32 table for fast IEEE 802.3 checksums
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c >>> 0;
}

export function computeCRC32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ data[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Compress data with raw DEFLATE using Web Stream API
 */
export async function deflateRaw(data: Uint8Array): Promise<Uint8Array> {
  if (typeof CompressionStream !== "undefined") {
    try {
      const cs = new CompressionStream("deflate-raw");
      const writer = cs.writable.getWriter();
      writer.write(data as any);
      writer.close();

      const chunks: Uint8Array[] = [];
      const reader = cs.readable.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }
      return concatUint8Arrays(chunks);
    } catch {
      // fallback to uncompressed if deflate fails
    }
  }
  return data;
}

/**
 * Decompress raw DEFLATE data using Web Stream API
 */
export async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream !== "undefined") {
    const ds = new DecompressionStream("deflate-raw");
    const writer = ds.writable.getWriter();
    writer.write(data as any);
    writer.close();

    const chunks: Uint8Array[] = [];
    const reader = ds.readable.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    return concatUint8Arrays(chunks);
  }
  throw new Error("DecompressionStream is not supported in this browser environment.");
}

export function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

/**
 * Creates a standard ZIP package from an array of files.
 */
export async function createZip(entries: ZipEntry[], compress = true): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const fileParts: Uint8Array[] = [];
  const cdParts: Uint8Array[] = [];
  let currentOffset = 0;

  for (const entry of entries) {
    const rawData =
      typeof entry.data === "string" ? encoder.encode(entry.data) : entry.data;
    const nameBytes = encoder.encode(entry.name.replace(/\\/g, "/"));
    const crc = computeCRC32(rawData);

    let compData = rawData;
    let method = 0; // Stored
    if (compress && typeof CompressionStream !== "undefined") {
      const deflated = await deflateRaw(rawData);
      if (deflated.length < rawData.length) {
        compData = deflated;
        method = 8; // Deflate
      }
    }

    // 1. Local File Header (30 bytes)
    const localHeader = new Uint8Array(30);
    const lv = new DataView(localHeader.buffer, localHeader.byteOffset, 30);
    lv.setUint32(0, 0x04034b50, true); // Signature
    lv.setUint16(4, 20, true);         // Version needed: 2.0
    lv.setUint16(6, 0x0800, true);     // General purpose bit flag: UTF-8
    lv.setUint16(8, method, true);     // Compression method
    lv.setUint16(10, 0, true);         // Mod time
    lv.setUint16(12, 0x5221, true);    // Mod date (2021-01-01)
    lv.setUint32(14, crc, true);       // CRC-32
    lv.setUint32(18, compData.length, true); // Compressed size
    lv.setUint32(22, rawData.length, true);  // Uncompressed size
    lv.setUint16(26, nameBytes.length, true); // File name length
    lv.setUint16(28, 0, true);               // Extra field length

    fileParts.push(localHeader, nameBytes, compData);

    // 2. Central Directory File Header (46 bytes)
    const cdHeader = new Uint8Array(46);
    const cv = new DataView(cdHeader.buffer, cdHeader.byteOffset, 46);
    cv.setUint32(0, 0x02014b50, true); // Signature
    cv.setUint16(4, 20, true);         // Version made by: 2.0
    cv.setUint16(6, 20, true);         // Version needed: 2.0
    cv.setUint16(8, 0x0800, true);     // Flag: UTF-8
    cv.setUint16(10, method, true);    // Compression method
    cv.setUint16(12, 0, true);         // Mod time
    cv.setUint16(14, 0x5221, true);    // Mod date
    cv.setUint32(16, crc, true);       // CRC-32
    cv.setUint32(20, compData.length, true); // Compressed size
    cv.setUint32(24, rawData.length, true);  // Uncompressed size
    cv.setUint16(28, nameBytes.length, true); // File name length
    cv.setUint16(30, 0, true);               // Extra length
    cv.setUint16(32, 0, true);               // Comment length
    cv.setUint16(34, 0, true);               // Disk number start
    cv.setUint16(36, 0, true);               // Internal file attributes
    cv.setUint32(38, 0, true);               // External file attributes
    cv.setUint32(42, currentOffset, true);   // Local header relative offset

    cdParts.push(cdHeader, nameBytes);

    currentOffset += localHeader.length + nameBytes.length + compData.length;
  }

  const cdOffset = currentOffset;
  let cdSize = 0;
  for (const part of cdParts) {
    cdSize += part.length;
  }

  // 3. End of Central Directory Record (22 bytes)
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer, eocd.byteOffset, 22);
  ev.setUint32(0, 0x06054b50, true);      // Signature
  ev.setUint16(4, 0, true);               // Disk number
  ev.setUint16(6, 0, true);               // Central dir disk
  ev.setUint16(8, entries.length, true);  // Records on disk
  ev.setUint16(10, entries.length, true); // Total records
  ev.setUint32(12, cdSize, true);         // Central dir size
  ev.setUint32(16, cdOffset, true);       // Central dir offset
  ev.setUint16(20, 0, true);              // Comment length

  return concatUint8Arrays([...fileParts, ...cdParts, eocd]);
}

/**
 * Extracts all files from a ZIP archive into a Map keyed by normalized file paths.
 */
export async function extractZip(zipBytes: Uint8Array | ArrayBuffer): Promise<Map<string, Uint8Array>> {
  const bytes = zipBytes instanceof Uint8Array ? zipBytes : new Uint8Array(zipBytes);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const decoder = new TextDecoder("utf-8");
  const result = new Map<string, Uint8Array>();

  // Find End of Central Directory (EOCD)
  let eocdOffset = -1;
  const minPos = Math.max(0, bytes.length - 65557);
  for (let i = bytes.length - 22; i >= minPos; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) {
    throw new Error("Invalid ZIP file: End of Central Directory record not found.");
  }

  const totalRecords = view.getUint16(eocdOffset + 10, true);
  const cdOffset = view.getUint32(eocdOffset + 16, true);

  let currentPos = cdOffset;
  for (let i = 0; i < totalRecords; i++) {
    if (currentPos + 46 > bytes.length) break;
    const cdSig = view.getUint32(currentPos, true);
    if (cdSig !== 0x02014b50) {
      throw new Error(`Corrupted ZIP central directory header at offset ${currentPos}`);
    }

    const method = view.getUint16(currentPos + 10, true);
    const compressedSize = view.getUint32(currentPos + 20, true);
    const nameLen = view.getUint16(currentPos + 28, true);
    const extraLen = view.getUint16(currentPos + 30, true);
    const commentLen = view.getUint16(currentPos + 32, true);
    const localOffset = view.getUint32(currentPos + 42, true);

    const nameBytes = bytes.subarray(currentPos + 46, currentPos + 46 + nameLen);
    const fileName = decoder.decode(nameBytes).replace(/\\/g, "/").replace(/^\//, "");

    // Read from local file header
    if (localOffset + 30 <= bytes.length) {
      const localSig = view.getUint32(localOffset, true);
      if (localSig === 0x04034b50) {
        const localNameLen = view.getUint16(localOffset + 26, true);
        const localExtraLen = view.getUint16(localOffset + 28, true);
        const dataStart = localOffset + 30 + localNameLen + localExtraLen;
        const compressedData = bytes.subarray(dataStart, dataStart + compressedSize);

        let uncompressedData: Uint8Array;
        if (method === 0) {
          uncompressedData = compressedData.slice(0);
        } else if (method === 8) {
          uncompressedData = await inflateRaw(compressedData);
        } else {
          throw new Error(`Unsupported ZIP compression method ${method} for file ${fileName}`);
        }

        result.set(fileName, uncompressedData);
      }
    }

    currentPos += 46 + nameLen + extraLen + commentLen;
  }

  return result;
}

/**
 * Helper to read a specific UTF-8 text file from a ZIP archive.
 */
export async function readZipTextFile(zipBytes: Uint8Array | ArrayBuffer, filePath: string): Promise<string | null> {
  const extracted = await extractZip(zipBytes);
  const normalizedTarget = filePath.replace(/\\/g, "/").replace(/^\//, "").toLowerCase();

  for (const [key, val] of extracted.entries()) {
    if (key.toLowerCase() === normalizedTarget) {
      return new TextDecoder("utf-8").decode(val);
    }
  }

  return null;
}

