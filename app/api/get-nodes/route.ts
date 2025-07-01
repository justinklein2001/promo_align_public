import { NextResponse } from "next/server";
import { NodeService } from "@/services/nodeService";

export async function GET() {
  
  try {
    const allNodes = await NodeService.getAllNodes();
    return NextResponse.json(allNodes);
  } catch (error) {
    console.error("Failed to fetch nodes:", error);
    return NextResponse.json({ error: "Failed to fetch nodes" }, { status: 500 });
  }
}
