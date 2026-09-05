// Lossless removal of supported JPEG and PNG metadata | TypeScript
export function stripImageMetadata(bytes: Uint8Array): {
  bytes: Uint8Array;
  removed: number;
  type: string;
} {
  const parts: Uint8Array[] = [];
  let removed = 0;
  let type = "";
  const read32 = (at: number) =>
    new DataView(bytes.buffer, bytes.byteOffset + at, 4).getUint32(0);
  if (
    bytes[0] === 137 &&
    bytes[1] === 80 &&
    bytes[2] === 78 &&
    bytes[3] === 71
  ) {
    type = "image/png";
    parts.push(bytes.slice(0, 8));
    let i = 8,
      ended = false;
    while (i + 12 <= bytes.length) {
      const length = read32(i);
      const end = i + 12 + length;
      if (end > bytes.length) throw Error("Invalid PNG chunk length.");
      const name = String.fromCharCode(...bytes.slice(i + 4, i + 8));
      if (["tEXt", "zTXt", "iTXt", "eXIf"].includes(name)) removed++;
      else parts.push(bytes.slice(i, end));
      i = end;
      if (name === "IEND") {
        ended = true;
        break;
      }
    }
    if (!ended) throw Error("Incomplete PNG file.");
  } else if (bytes[0] === 255 && bytes[1] === 216) {
    type = "image/jpeg";
    parts.push(bytes.slice(0, 2));
    let i = 2,
      ended = false;
    while (i < bytes.length) {
      const start = i;
      if (bytes[i++] !== 255) throw Error("Invalid JPEG marker.");
      while (bytes[i] === 255) i++;
      const marker = bytes[i++];
      if (marker === 0xd9) {
        parts.push(bytes.slice(start, i));
        ended = true;
        break;
      }
      if (i + 2 > bytes.length) throw Error("Incomplete JPEG segment.");
      const length = (bytes[i] << 8) | bytes[i + 1];
      if (length < 2 || i + length > bytes.length)
        throw Error("Invalid JPEG segment length.");
      const end = i + length;
      if ([0xe1, 0xed, 0xfe].includes(marker)) removed++;
      else parts.push(bytes.slice(start, end));
      i = end;
      if (marker === 0xda) {
        const scanStart = i;
        while (i < bytes.length) {
          if (
            bytes[i] === 255 &&
            bytes[i + 1] !== 0 &&
            bytes[i + 1] !== 255 &&
            !(bytes[i + 1] >= 0xd0 && bytes[i + 1] <= 0xd7)
          )
            break;
          i++;
        }
        parts.push(bytes.slice(scanStart, i));
      }
    }
    if (!ended) throw Error("Incomplete JPEG file.");
  } else
    throw Error("Choose a JPEG or PNG file. Other formats are not supported.");
  const result = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const p of parts) {
    result.set(p, offset);
    offset += p.length;
  }
  return { bytes: result, removed, type };
}
