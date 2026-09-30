import { NextResponse } from "next/server";
import { AuthService } from "@/backend/services/auth.service";
import { resetPasswordSchema } from "@/shared/schemas/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Thông tin đặt lại mật khẩu không hợp lệ";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const result = await AuthService.resetPassword(parsed.data);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Lỗi đặt lại mật khẩu:", error);
    return NextResponse.json(
      { success: false, error: "Đã xảy ra lỗi máy chủ, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}
