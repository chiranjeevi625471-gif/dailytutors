/**
 * Admin Settings API — MongoDB backed singleton.
 * GET /api/admin/settings  -> the settings document (created with defaults if missing)
 * PUT /api/admin/settings  -> upsert settings
 * Protected by middleware (dt_admin cookie).
 */
import { NextRequest, NextResponse } from "next/server";
import { SettingsModel } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

async function getOrCreate() {
  let settings = await SettingsModel.findOne({});
  if (!settings) settings = await SettingsModel.create({});
  return settings;
}

export async function GET() {
  try {
    await connectDB();
    const settings = await getOrCreate();
    return NextResponse.json(settings.toObject());
  } catch (error: any) {
    console.error("Admin settings GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    delete body._id;
    delete body.id;
    const existing = await getOrCreate();
    const settings = await SettingsModel.findByIdAndUpdate(existing._id, body, {
      new: true,
      runValidators: true,
    });
    return NextResponse.json(settings!.toObject());
  } catch (error: any) {
    console.error("Admin settings PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to save settings" }, { status: 400 });
  }
}
