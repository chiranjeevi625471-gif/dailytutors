"use client";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Search } from "lucide-react";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "checkbox" | "date" | "datetime-local" | "csv" | "file";
  options?: string[];
  placeholder?: string;
  required?: boolean;
  full?: boolean;
  hint?: string;
  accept?: string;
};

type Props = {
  title: string;
  description?: string;
  entity: string; // matches API: /api/admin/<entity>
  columns: { key: string; label: string; render?: (row: any) => React.ReactNode }[];
  fields: Field[];
  defaults?: Record<string, any>;
  pdfUploadHandler?: (file: File, setField: (name: string, value: any) => void) => Promise<void>;
  pdfUploading?: boolean;
};

export default function EntityManager({ title, description, entity, columns, fields, defaults, pdfUploadHandler, pdfUploading }: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/${entity}`, { cache: "no-store" });
    setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q));
  }, [query, rows]);

  function startNew() {
    setEditing({ active: true, ...(defaults || {}) });
  }

  function startEdit(row: any) {
    setEditing({ ...row });
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/${entity}/${id}`, { method: "DELETE" });
    load();
  }

  async function save() {
    setSaving(true);
    // Transform CSV fields
    const payload: any = { ...editing };
    
    // Remove temporary pdf_upload field
    delete payload.pdf_upload;
    
    fields.forEach((f) => {
      if (f.type === "csv" && typeof payload[f.name] === "string") {
        payload[f.name] = payload[f.name].split(",").map((s: string) => s.trim()).filter(Boolean);
      }
      if (f.type === "number" && payload[f.name] !== "" && payload[f.name] != null) {
        payload[f.name] = Number(payload[f.name]);
      }
    });

    const url = editing.id ? `/api/admin/${entity}/${editing.id}` : `/api/admin/${entity}`;
    const method = editing.id ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (!res.ok) {
      alert("Save failed");
      return;
    }
    setEditing(null);
    load();
  }

  function setField(name: string, value: any) {
    setEditing((e: any) => ({ ...e, [name]: value }));
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="rounded-md border border-gray-200 pl-8 pr-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <button onClick={startNew} className="btn-primary">
            <Plus className="h-4 w-4" /> Add new
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              {columns.map((c) => <th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>)}
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-gray-500">Loading…</td></tr>}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-gray-500">No items yet — click <strong>Add new</strong>.</td></tr>
            )}
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 align-top">
                    {c.render ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <button onClick={() => startEdit(row)} className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-brand-50 hover:text-brand">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(row.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setEditing(null)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold">{editing.id ? "Edit" : "Add"} {title.replace(/s$/, "")}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-gray-900"><X className="h-5 w-5" /></button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); save(); }}
              className="px-6 py-5 grid grid-cols-2 gap-4"
            >
              {fields.map((f) => (
                <div key={f.name} className={f.full || f.type === "textarea" ? "col-span-2" : "col-span-2 sm:col-span-1"}>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      rows={4}
                      value={editing[f.name] ?? ""}
                      onChange={(e) => setField(f.name, e.target.value)}
                      placeholder={f.placeholder}
                      required={f.required}
                      className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                  ) : f.type === "select" ? (
                    <select
                      value={editing[f.name] ?? ""}
                      onChange={(e) => setField(f.name, e.target.value)}
                      required={f.required}
                      className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
                    >
                      <option value="">—</option>
                      {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === "checkbox" ? (
                    <label className="mt-2 flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={!!editing[f.name]} onChange={(e) => setField(f.name, e.target.checked)} />
                      {f.placeholder || "Enabled"}
                    </label>
                  ) : f.type === "csv" ? (
                    <input
                      value={Array.isArray(editing[f.name]) ? editing[f.name].join(", ") : (editing[f.name] ?? "")}
                      onChange={(e) => setField(f.name, e.target.value)}
                      placeholder={f.placeholder || "Comma-separated values"}
                      required={f.required}
                      className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                  ) : f.type === "file" ? (
                    f.name === "pdf_upload" && pdfUploadHandler ? (
                      <div className="mt-2 space-y-2">
                        {editing.url && (
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-xs font-semibold text-green-700 mb-1">✓ PDF Uploaded</p>
                            <p className="text-sm text-green-600 break-all">{editing.url}</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              await pdfUploadHandler(file, setField);
                              (e.target as any).value = "";
                            }
                          }}
                          disabled={pdfUploading}
                          className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-md file:border file:border-gray-200 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                        />
                        {pdfUploading && <p className="mt-2 text-xs text-blue-600 flex items-center gap-2"><span className="animate-spin">⟳</span> Uploading...</p>}
                      </div>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {editing[f.name] && (
                          <div className="flex items-center gap-2">
                            <img src={editing[f.name]} alt="Preview" className="h-16 w-16 rounded-md object-cover" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-600">{editing[`${f.name}_size`]}</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setField(f.name, null);
                                  setField(`${f.name}_size`, null);
                                }}
                                className="text-sm text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                        <input
                          type="file"
                          accept={f.accept || "image/*"}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setField(f.name, event.target?.result);
                                const sizeInKB = (file.size / 1024).toFixed(2);
                                const sizeInMB = file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : sizeInKB + ' KB';
                                setField(`${f.name}_size`, `Size: ${sizeInMB}`);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-md file:border file:border-gray-200 file:bg-gray-50 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-100"
                        />
                      </div>
                    )
                  ) : (
                    <input
                      type={f.type || "text"}
                      value={editing[f.name] ?? ""}
                      onChange={(e) => setField(f.name, e.target.value)}
                      placeholder={f.placeholder}
                      required={f.required}
                      className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-200"
                    />
                  )}
                  {f.hint && <p className="mt-1 text-xs text-gray-500">{f.hint}</p>}
                </div>
              ))}

              <div className="col-span-2 mt-2 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setEditing(null)} className="btn-outline">Cancel</button>
                <button disabled={saving} className="btn-primary">
                  <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
