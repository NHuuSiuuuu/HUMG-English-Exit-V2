import { NextResponse } from "next/server";
import { AuthService } from "@/backend/services/auth.service";

export async function GET() {
  try {
    const result = await AuthService.getMe();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Lỗi lấy thông tin phiên:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
