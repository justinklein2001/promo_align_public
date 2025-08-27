import { NextResponse } from "next/server";
import { NodeService } from "@/services/nodeService";

export async function GET() {
  
  try {
    const allEdges = await NodeService.getAllEdges();
    return NextResponse.json(allEdges);
  } catch (error) {
    console.error("Failed to fetch edges:", error);
    return NextResponse.json({ error: "Failed to fetch edges" }, { status: 500 });
  }
}
