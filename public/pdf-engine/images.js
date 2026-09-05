import { toBytes } from './runner.js';
/**
 * Build a PDF from JPEG images, one page per image, entirely in
 * TypeScript — no wasm involved. JPEG data is embedded verbatim
 * (DCTDecode), so there is no recompression or quality loss.
 *
 * Only JPEG input is supported; convert other formats to JPEG first
 * (e.g. via canvas) or open an issue.
 */
export async function imagesToPdf(images, options = {}) {
    if (images.length === 0)
        throw new TypeError('imagesToPdf() needs at least one image');
    const dpi = options.dpi ?? 72;
    if (!(dpi > 0))
        throw new TypeError(`dpi must be positive, got ${dpi}`);
    const scale = 72 / dpi;
    const jpegs = await Promise.all(images.map(async (img) => parseJpeg(await toBytes(img))));
    const doc = new PdfWriter();
    // Object layout: 1 catalog, 2 pages tree, then per image i:
    // page (3+3i), content stream (4+3i), image xobject (5+3i).
    const pageRef = (i) => 3 + 3 * i;
    const kids = jpegs.map((_, i) => `${pageRef(i)} 0 R`).join(' ');
    doc.object(1, '<< /Type /Catalog /Pages 2 0 R >>');
    doc.object(2, `<< /Type /Pages /Kids [${kids}] /Count ${jpegs.length} >>`);
    jpegs.forEach((jpeg, i) => {
        const w = round2(jpeg.width * scale);
        const h = round2(jpeg.height * scale);
        doc.object(pageRef(i), `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}]` +
            ` /Resources << /XObject << /Im ${pageRef(i) + 2} 0 R >> >>` +
            ` /Contents ${pageRef(i) + 1} 0 R >>`);
        doc.stream(pageRef(i) + 1, '', ascii(`q ${w} 0 0 ${h} 0 0 cm /Im Do Q`));
        doc.stream(pageRef(i) + 2, `/Type /XObject /Subtype /Image /Width ${jpeg.width} /Height ${jpeg.height}` +
            ` /ColorSpace ${jpeg.colorSpace} /BitsPerComponent ${jpeg.bitsPerComponent}` +
            ` /Filter /DCTDecode`, jpeg.data);
    });
    return doc.finish(1);
}
function parseJpeg(data) {
    if (data.length < 4 || data[0] !== 0xff || data[1] !== 0xd8) {
        throw new TypeError('Not a JPEG image (missing SOI marker)');
    }
    let pos = 2;
    while (pos + 4 <= data.length) {
        if (data[pos] !== 0xff) {
            pos++;
            continue;
        }
        const marker = data[pos + 1];
        // Standalone markers without a length field.
        if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
            pos += 2;
            continue;
        }
        const length = (data[pos + 2] << 8) | data[pos + 3];
        // SOF0–SOF15, excluding DHT (C4), JPG (C8), DAC (CC).
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
            const bitsPerComponent = data[pos + 4];
            const height = (data[pos + 5] << 8) | data[pos + 6];
            const width = (data[pos + 7] << 8) | data[pos + 8];
            const components = data[pos + 9];
            const colorSpace = components === 1 ? '/DeviceGray' : components === 4 ? '/DeviceCMYK' : '/DeviceRGB';
            return { width, height, bitsPerComponent, colorSpace, data };
        }
        pos += 2 + length;
    }
    throw new TypeError('Malformed JPEG: no frame header (SOF) found');
}
/** Assembles a PDF as binary chunks while tracking xref offsets. */
class PdfWriter {
    chunks = [];
    length = 0;
    offsets = new Map();
    constructor() {
        // Binary comment line after the header, per the PDF spec's
        // recommendation, so transfer tools treat the file as binary.
        this.push(ascii('%PDF-1.7\n%\xe2\xe3\xcf\xd3\n'));
    }
    object(num, body) {
        this.offsets.set(num, this.length);
        this.push(ascii(`${num} 0 obj\n${body}\nendobj\n`));
    }
    stream(num, dictEntries, content) {
        this.offsets.set(num, this.length);
        this.push(ascii(`${num} 0 obj\n<< ${dictEntries} /Length ${content.length} >>\nstream\n`));
        this.push(content);
        this.push(ascii('\nendstream\nendobj\n'));
    }
    finish(rootNum) {
        const count = this.offsets.size + 1;
        const xrefPos = this.length;
        let xref = `xref\n0 ${count}\n0000000000 65535 f \n`;
        const ordered = [...this.offsets.entries()].sort(([a], [b]) => a - b);
        for (const [, offset] of ordered) {
            xref += `${String(offset).padStart(10, '0')} 00000 n \n`;
        }
        xref += `trailer\n<< /Size ${count} /Root ${rootNum} 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;
        this.push(ascii(xref));
        const out = new Uint8Array(this.length);
        let pos = 0;
        for (const chunk of this.chunks) {
            out.set(chunk, pos);
            pos += chunk.length;
        }
        return out;
    }
    push(chunk) {
        this.chunks.push(chunk);
        this.length += chunk.length;
    }
}
function ascii(text) {
    const out = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++)
        out[i] = text.charCodeAt(i) & 0xff;
    return out;
}
function round2(n) {
    return Math.round(n * 100) / 100;
}
