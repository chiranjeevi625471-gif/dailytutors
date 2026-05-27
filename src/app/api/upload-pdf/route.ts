import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { newId } from "@/lib/db";

// Note: bodyParser limits are handled automatically in App Router
// For large files (up to 500mb by default), Next.js handles it automatically

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const filename = `${newId()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const pdfDir = path.join(process.cwd(), "public", "pdfs");
    
    await mkdir(pdfDir, { recursive: true });
    await writeFile(path.join(pdfDir, filename), Buffer.from(buffer));

    const fileSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    
    return NextResponse.json({
      filename,
      url: `/pdfs/${filename}`,
      size: fileSize,
      originalName: file.name
    });
  } catch (error) {
    console.error("PDF upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
