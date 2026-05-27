"use client";
import { useState } from "react";
import EntityManager from "@/components/admin/EntityManager";
import { FileText } from "lucide-react";

export default function AdminDownloads() {
  const [uploading, setUploading] = useState(false);

  async function handlePdfUpload(file: File, setField: (name: string, value: any) => void) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        alert("PDF upload failed");
        setUploading(false);
        return;
      }

      const data = await res.json();
      setField("url", data.url);
      setField("size", data.size);
    } catch (error) {
      alert("Upload error: " + (error as any).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <EntityManager
      title="Downloads"
      description="Free PDFs — magazines, compilations, notes and PYQs. Upload PDF files and set titles with descriptions."
      entity="downloads"
      defaults={{ type: "Magazine", pages: 0, size: "0 MB", date: new Date().toISOString().slice(0, 10) }}
      columns={[
        {
          key: "preview",
          label: "",
          render: (r) => (
            <div className="flex h-8 w-8 items-center justify-center rounded bg-red-50 text-red-600">
              <FileText className="h-4 w-4" />
            </div>
          )
        },
        { key: "title", label: "Title", render: (r) => <div className="font-semibold max-w-md">{r.title}</div> },
        { key: "type", label: "Type", render: (r) => <span className="badge">{r.type}</span> },
        { key: "size", label: "Size", render: (r) => <span className="text-sm text-gray-600">{r.size}</span> },
        { key: "date", label: "Date", render: (r) => <span className="text-sm text-gray-500">{r.date}</span> },
        { key: "active", label: "Active", render: (r) => r.active ? <span className="badge">Live</span> : <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">Off</span> }
      ]}
      fields={[
        { name: "title", label: "Title", required: true, full: true, placeholder: "e.g., Monthly CA Magazine April 2026" },
        { name: "description", label: "Description", type: "textarea", full: true, placeholder: "Brief description of the PDF content..." },
        { name: "type", label: "Type", type: "select", options: ["Magazine", "Compilation", "Notes", "PYQ"], required: true },
        { name: "pages", label: "Pages", type: "number", required: true },
        { name: "date", label: "Date", type: "date", required: true },
        { name: "pdf_upload", label: "PDF File", type: "file", accept: ".pdf", full: true, hint: "Upload a PDF file (max 100MB). File size will be auto-calculated." },
        { name: "url", label: "PDF URL", placeholder: "Auto-populated after upload", full: true, hint: "This is auto-filled when you upload a PDF" },
        { name: "active", label: "Active", type: "checkbox", placeholder: "Publish" }
      ]}
      pdfUploadHandler={handlePdfUpload}
      pdfUploading={uploading}
    />
  );
}

