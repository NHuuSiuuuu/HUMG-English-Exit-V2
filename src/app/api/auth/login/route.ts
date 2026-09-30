import { NextResponse } from "next/server";
import { AuthService } from "@/backend/services/auth.service";
import { loginSchema } from "@/shared/schemas/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Thông tin đăng nhập không hợp lệ";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const result = await AuthService.login(parsed.data);

    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return NextResponse.json(
      { success: false, error: "Đã xảy ra lỗi máy chủ, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}
