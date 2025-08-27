import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    
    if (!filePath) {
      return NextResponse.json({ error: "File path is required" }, { status: 400 });
    }

    // Security check: ensure the file path is within the uploads directory
    if (!filePath.startsWith('/uploads/')) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // Convert URL path to filesystem path
    const fullPath = path.join(process.cwd(), 'public', filePath.replace(/^\//, ''));
    
    try {
      await unlink(fullPath);
      console.log(`Deleted file: ${fullPath}`);
      return NextResponse.json({ success: true });
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, consider it already deleted
        return NextResponse.json({ success: true });
      }
      throw error;
    }
  } catch (error) {
    console.error("Failed to delete file:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
