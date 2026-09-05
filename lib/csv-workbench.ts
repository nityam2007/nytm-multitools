// Quoted CSV parsing, cleanup, and spreadsheet-safe export | TypeScript
export function parseCSV(text: string, delimiter = ","): string[][] {
  if (!text) return [];
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  let closed = false;
  text = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
          closed = true;
        }
      } else field += c;
      continue;
    }
    if (c === delimiter) {
      row.push(field);
      field = "";
      closed = false;
    } else if (c === "\n" || c === "\r") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      closed = false;
      if (c === "\r" && text[i + 1] === "\n") i++;
    } else if (c === '"') {
      if (field || closed)
        throw Error(
          "Unexpected quote. Quote the entire field and double any inner quotes.",
        );
      quoted = true;
    } else {
      if (closed) throw Error("Unexpected text after a closing quote.");
      field += c;
    }
  }
  if (quoted)
    throw Error("Unclosed quoted field. Check the last row or delimiter.");
  if (field || row.length || closed) rows.push([...row, field]);
  return rows;
}
export function writeCSV(rows: string[][], delimiter = ",", safe = true) {
  return rows
    .map((row) =>
      row
        .map((value) => {
          let s = value;
          if (safe && /^\s*[=+@-]/.test(s)) s = "'" + s;
          return /["\r\n]/.test(s) || s.includes(delimiter)
            ? '"' + s.replaceAll('"', '""') + '"'
            : s;
        })
        .join(delimiter),
    )
    .join("\r\n");
}
export interface CleanupOptions {
  delimiter: string;
  trim: boolean;
  removeBlank: boolean;
  dedupe: boolean;
  header: boolean;
  key: number;
}
export function cleanCSV(text: string, options: CleanupOptions) {
  let rows = parseCSV(text, options.delimiter);
  const original = rows.length;
  if (rows.length > 100000)
    throw Error("Please use a file with at most 100,000 rows.");
  if (options.trim) rows = rows.map((row) => row.map((cell) => cell.trim()));
  if (options.removeBlank)
    rows = rows.filter((row) => row.some((cell) => cell.trim()));
  if (!rows.length) return { rows, removed: original };
  const width = rows[0].length;
  if (width > 200) throw Error("Please use a CSV with at most 200 columns.");
  if (options.key >= width)
    throw Error(`Dedupe column must be between 0 and ${width}.`);
  if (rows.some((row) => row.length !== width))
    throw Error(
      "Rows have different column counts. Check the delimiter or repair the source file.",
    );
  const first = options.header ? rows.slice(0, 1) : [];
  let body = options.header ? rows.slice(1) : rows;
  if (options.dedupe) {
    const seen = new Set<string>();
    body = body.filter((row) => {
      const key =
        options.key >= 0
          ? JSON.stringify(row[options.key] ?? "")
          : JSON.stringify(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  rows = [...first, ...body];
  return { rows, removed: original - rows.length };
}
