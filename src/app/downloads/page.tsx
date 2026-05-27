import { db } from "@/lib/db";
import Link from "next/link";
import DownloadCard from "@/components/DownloadCard";

export const metadata = { title: "Downloads · Daily Tutors" };
export const dynamic = "force-dynamic";

export default async function DownloadsPage() {
  const all = await db.downloads.list();
  const downloads = all.filter((d) => d.active);

  return (
    <div className="container-page py-12">
      <h1 className="section-title">Free PDF Downloads</h1>
      <p className="mt-3 max-w-2xl text-sm text-gray-600">
        Monthly current affairs magazines, PIB compilations, revision notes and previous year question papers — all free. Preview before downloading.
      </p>

      <div className="mt-10 grid gap-5">
        {downloads.map((d) => (
          <DownloadCard key={d.id} download={d as any} />
        ))}
      </div>

      {downloads.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
          No downloads yet. Add PDFs from the <Link href="/admin/downloads" className="text-brand font-semibold">admin panel</Link>.
        </div>
      )}
    </div>
  );
}
