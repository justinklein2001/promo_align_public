import { NextRequest, NextResponse } from "next/server";
import { handlePromoNode, handleSongNode } from "@/services/handleAddNode";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  // authorization
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const type = formData.get("type");

  if (!type) {
    return NextResponse.json({ error: "Type is required" }, { status: 400 });
  }

  try {
    if (type === "promo") {
      const result = await handlePromoNode(formData);
      return NextResponse.json(result);
    } else if (type === "song") {
      const result = await handleSongNode(formData);
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
