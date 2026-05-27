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
  url: string;
};

const TYPE_COLORS: Record<string, string> = {
  Magazine: "bg-rose-50 text-rose-700",
  Compilation: "bg-amber-50 text-amber-700",
  Notes: "bg-emerald-50 text-emerald-700",
  PYQ: "bg-blue-50 text-blue-700"
};

export default function DownloadCard({ download }: { download: Download }) {
  const isLocalPdf = download.url?.startsWith('/pdfs/');

  return (
    <div className="card p-6 flex flex-col sm:flex-row items-start gap-4 hover:shadow-lg transition-shadow">
      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-brand-50 text-brand">
        <FileText className="h-6 w-6" />
      </div>
      <div className="flex-1 w-full">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[download.type]}`}>
          {download.type}
        </span>
        <h3 className="mt-2 font-bold text-gray-900">{download.title}</h3>
        {download.description && (
          <p className="mt-2 text-sm text-gray-600">{download.description}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(download.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span>{download.pages} pages</span>
          <span>{download.size}</span>
        </div>
        <div className="mt-4">
          {download.url && (
            <a
              href={download.url}
              download={isLocalPdf}
              target={!isLocalPdf ? "_blank" : undefined}
              rel={!isLocalPdf ? "noopener noreferrer" : undefined}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium text-sm"
            >
              <Download className="h-4 w-4" />
              {isLocalPdf ? 'Download PDF' : 'Visit Source'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
