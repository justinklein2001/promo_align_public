import { NextRequest, NextResponse } from "next/server";
import { NodeService } from "@/services/nodeService";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {

  // authorization
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { edges: edgesToSave } = await request.json();
    await NodeService.saveEdges(edgesToSave);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save edges:", error);
    return NextResponse.json({ error: "Failed to save edges" }, { status: 500 });
  }
}
