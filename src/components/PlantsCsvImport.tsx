"use client";
import Papa from "papaparse";
import { useMemo, useState } from "react";

type Row = Record<string, string>;

export function PlantsCsvImport() {
  const [rows, setRows] = useState<Row[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<{ imported: number; updated: number } | null>(null);
  const [uploading, setUploading] = useState(false);

  function onFile(file: File) {
    setErrors([]);
    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (r) => {
        const data = (r.data || []).filter(Boolean);
        setRows(data);
        const required = ["Category", "Name"]; // Native optional but parsed
        const errs: string[] = [];
        data.forEach((row, i) => {
          for (const key of required) {
            if (!row[key]) errs.push(`Row ${i + 1}: Missing ${key}`);
          }
        });
        setErrors(errs);
      },
    });
  }

  const previewCount = useMemo(() => Math.min(rows.length, 10), [rows]);

  async function submit() {
    setUploading(true);
    try {
      const res = await fetch("/api/plants/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setResult({ imported: data.imported, updated: data.updated });
    } catch (e: any) {
      setErrors((prev) => [...prev, e.message || "Upload error"]);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="brand-btn px-3 py-1.5 rounded-md inline-flex items-center gap-2 cursor-pointer">
        <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => e.target.files && onFile(e.target.files[0])} />
        Upload CSV
      </label>
      {rows.length > 0 && (
        <div className="brand-card p-3 space-y-2">
          <div className="text-sm opacity-70">Previewing {previewCount} of {rows.length} rows</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="opacity-70 text-left">
                <tr>
                  {Object.keys(rows[0]).map((k) => (
                    <th key={k} className="pr-4">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, previewCount).map((r, i) => (
                  <tr key={i} className="border-t">
                    {Object.keys(rows[0]).map((k) => (
                      <td key={k} className="pr-4 py-1">{r[k]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={submit} disabled={uploading || !!errors.length} className="brand-btn px-3 py-1.5 rounded-md">
            {uploading ? "Importing…" : "Import"}
          </button>
          {!!errors.length && (
            <div className="text-red-700 text-xs space-y-1">
              {errors.map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </div>
          )}
          {result && (
            <div className="text-sm">
              Imported: {result.imported}, Updated: {result.updated}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


