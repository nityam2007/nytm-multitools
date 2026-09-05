// CSV import, cleanup, column editing, and export | TypeScript
"use client";
import { useEffect, useRef, useState } from "react";
import { Workspace, Field, Choice, Notice } from "./ToolUI";
import { writeCSV } from "@/lib/csv-workbench";
import { downloadText } from "@/lib/browser-files";

export default function CSVWorkbench() {
  const [text, setText] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [trim, setTrim] = useState(true);
  const [blank, setBlank] = useState(true);
  const [dedupe, setDedupe] = useState(true);
  const [header, setHeader] = useState(true);
  const [safe, setSafe] = useState(true);
  const [rows, setRows] = useState<string[][]>([]);
  const [columns, setColumns] = useState<boolean[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [key, setKey] = useState(-1);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const worker = useRef<Worker | null>(null);
  useEffect(() => () => worker.current?.terminate(), []);
  const clearResult = () => {
    setRows([]);
    setNames([]);
    setColumns([]);
  };
  function process() {
    setBusy(true);
    clearResult();
    setNotice("Cleaning your CSV...");
    worker.current?.terminate();
    try {
      const w = new Worker(
        new URL("../../lib/csv-workbench.worker.ts", import.meta.url),
      );
      worker.current = w;
      w.onmessage = (e) => {
        setBusy(false);
        w.terminate();
        if (e.data.error) {
          setNotice(e.data.error);
          return;
        }
        const result = e.data.result as { rows: string[][]; removed: number };
        setRows(result.rows);
        setColumns(result.rows[0]?.map(() => true) || []);
        setNames(
          header
            ? result.rows[0] || []
            : result.rows[0]?.map((_, i) => `Column ${i + 1}`) || [],
        );
        setNotice(
          `${result.rows.length} rows remain. ${result.removed} rows removed.`,
        );
      };
      w.onerror = () => {
        setNotice("CSV worker failed. Try a smaller input.");
        setBusy(false);
        w.terminate();
      };
      w.postMessage({
        text,
        options: { delimiter, trim, removeBlank: blank, dedupe, header, key },
      });
    } catch {
      setBusy(false);
      setNotice("Could not start the CSV worker in this browser.");
    }
  }
  const exportRows = (header ? [names, ...rows.slice(1)] : rows).map((row) =>
    row.filter((_, i) => columns[i]),
  );
  return (
    <Workspace
      slug="csv-cleanup"
      help="Supports up to 100,000 rows and 200 columns of UTF-8 CSV with quoted delimiters, escaped quotes, and line breaks inside fields. Preview shows the first 15 rows; export includes all rows. Spreadsheet-safe export prefixes potentially executable formulas with an apostrophe, which can also change negative numeric cells to text."
    >
      <label className="block text-sm font-medium">
        Import CSV (up to 10 MB)
        <input
          type="file"
          accept=".csv,.tsv,text/csv,text/tab-separated-values"
          disabled={busy}
          className="block mt-2"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            clearResult();
            if (file.size > 10 * 1024 * 1024) {
              setNotice("Choose a file smaller than 10 MB.");
              return;
            }
            try {
              setText(await file.text());
              setNotice("");
            } catch {
              setNotice("Could not read this file.");
            }
          }}
        />
      </label>
      <fieldset disabled={busy} className="space-y-5">
        <Field
          label="CSV input"
          value={text}
          onChange={(v) => {
            setText(v);
            clearResult();
          }}
          multiline
        />
        <div className="grid sm:grid-cols-2 gap-5">
          <Choice
            label="Delimiter"
            value={delimiter}
            onChange={(v) => {
              setDelimiter(v);
              setKey(-1);
              clearResult();
            }}
            options={[
              [",", "Comma"],
              [";", "Semicolon"],
              ["\t", "Tab"],
            ]}
          />
          <Field
            label="Dedupe column (0 = whole row, 1 = first column)"
            type="number"
            min={0}
            value={key + 1}
            onChange={(v) => {
              setKey(Math.max(-1, Math.trunc(Number(v)) - 1));
              clearResult();
            }}
          />
        </div>
        <div className="flex flex-wrap gap-4">
          {[
            ["Trim cells", trim, setTrim],
            ["Remove blank rows", blank, setBlank],
            ["Remove duplicates", dedupe, setDedupe],
            ["First row is header", header, setHeader],
          ].map(([label, checked, setter]) => (
            <label
              key={label as string}
              className="flex items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={checked as boolean}
                onChange={(e) => {
                  (setter as (v: boolean) => void)(e.target.checked);
                  clearResult();
                }}
              />
              {label as string}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex gap-3">
        <button
          className="btn btn-primary"
          disabled={busy || !text || text.length > 10 * 1024 * 1024}
          onClick={process}
        >
          {busy ? "Processing..." : "Clean CSV"}
        </button>
        {busy && (
          <button
            className="btn btn-secondary"
            onClick={() => {
              worker.current?.terminate();
              setBusy(false);
              setNotice("Cancelled.");
            }}
          >
            Cancel
          </button>
        )}
      </div>
      <Notice>{notice}</Notice>
      {rows.length > 0 && (
        <>
          <section>
            <h2 className="text-lg font-semibold mb-3">
              Keep and rename columns
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {names.map((name, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    aria-label={`Keep column ${i + 1}`}
                    checked={columns[i]}
                    onChange={(e) =>
                      setColumns(
                        columns.map((v, j) => (i === j ? e.target.checked : v)),
                      )
                    }
                  />
                  <Field
                    label={`Column ${i + 1}`}
                    value={name}
                    onChange={(v) =>
                      setNames(names.map((n, j) => (j === i ? v : n)))
                    }
                  />
                </div>
              ))}
            </div>
          </section>
          <div className="overflow-auto max-h-80 border border-[var(--border)]">
            <table className="text-sm w-full">
              <tbody>
                {exportRows.slice(0, 15).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td
                        className="p-3 border-b border-[var(--border)] max-w-64 truncate"
                        key={j}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <label className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={safe}
              onChange={(e) => setSafe(e.target.checked)}
            />
            Spreadsheet-safe export
          </label>
          <button
            className="btn btn-primary"
            disabled={!columns.some(Boolean)}
            onClick={() =>
              downloadText(
                writeCSV(exportRows, delimiter, safe),
                "cleaned.csv",
                "text/csv;charset=utf-8",
              )
            }
          >
            Download cleaned CSV
          </button>
        </>
      )}
    </Workspace>
  );
}
