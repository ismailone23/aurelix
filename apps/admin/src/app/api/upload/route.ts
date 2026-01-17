import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase, STORAGE_BUCKET, getPublicUrl } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    // Verify admin auth
    const authorization = req.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const token = authorization.substring(7);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key",
      ) as { role: string };
      if (decoded.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 },
      );
    }

    // Return the public URL
    const publicUrl = getPublicUrl(data.path);
    return NextResponse.json({ url: publicUrl, path: data.path });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Verify admin auth
    const authorization = req.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const token = authorization.substring(7);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key",
      ) as { role: string };
      if (decoded.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "Path required" }, { status: 400 });
    }

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path]);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete image" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
