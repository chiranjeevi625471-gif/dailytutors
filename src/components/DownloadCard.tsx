'use client';

import { FileText, Calendar, Download } from 'lucide-react';

type Download = {
  id: string;
  title: string;
  description?: string;
  type: string;
  size: string;
  pages: number;
  date: string;
  url?: string;
};

const TYPE_COLORS: Record<string, string> = {
  Magazine: "bg-rose-50 text-rose-700",
  Compilation: "bg-amber-50 text-amber-700",
  Notes: "bg-emerald-50 text-emerald-700",
  PYQ: "bg-blue-50 text-blue-700"
};

export default function DownloadCard({ download }: { download: Download }) {
  // Generate default URL if missing (e.g., for old seeded data)
  // Replace spaces and special characters with single dash, then clean up multiple dashes
  const sanitizedTitle = download.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except dash and space
    .replace(/\s+/g, '-') // Replace spaces with dash
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
  
  const url = download.url || `/pdfs/${download.id}-${sanitizedTitle}.pdf`;
  const isLocalPdf = url?.startsWith('/pdfs/');

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-brand-50 text-brand">
          <FileText className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[download.type]}`}>
            {download.type}
          </span>
          <h3 className="mt-2 font-bold text-gray-900">{download.title}</h3>
          {download.description && (
            <p className="mt-2 text-sm text-gray-600">{download.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(download.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span>{download.pages} pages</span>
            <span>{download.size}</span>
          </div>
          {url && (
            <div className="mt-4">
              <a
                href={url}
                download={isLocalPdf}
                target={!isLocalPdf ? "_blank" : undefined}
                rel={!isLocalPdf ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-semibold text-sm"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
