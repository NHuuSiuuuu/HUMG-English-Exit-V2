import { NextResponse } from "next/server";
import { AuthService } from "@/backend/services/auth.service";
import { forgotPasswordSchema } from "@/shared/schemas/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Email không hợp lệ";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const origin = request.headers.get("origin") || undefined;
    const result = await AuthService.requestPasswordReset(parsed.data, origin);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Lỗi yêu cầu quên mật khẩu:", error);
    return NextResponse.json(
      { success: false, error: "Đã xảy ra lỗi máy chủ, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}
