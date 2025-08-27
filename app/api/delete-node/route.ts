import { NextRequest, NextResponse } from "next/server";
import { NodeService } from "@/services/nodeService";
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
    const nodeId = searchParams.get('id');
    const nodeType = searchParams.get('type');
    
    if (!nodeId || !nodeType) {
      return NextResponse.json({ error: "Node ID and type are required" }, { status: 400 });
    }

    await NodeService.deleteNode(nodeId, nodeType);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete node:", error);
    return NextResponse.json({ error: "Failed to delete node" }, { status: 500 });
  }
}
