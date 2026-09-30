import { NextResponse } from "next/server";
import { AuthService } from "@/backend/services/auth.service";

export async function POST() {
  try {
    const result = await AuthService.logout();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
    return NextResponse.json(
      { success: false, error: "Đã xảy ra lỗi khi đăng xuất" },
      { status: 500 }
    );
  }
}
