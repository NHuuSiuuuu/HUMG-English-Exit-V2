import { NextResponse } from "next/server";
import { AuthService } from "@/backend/services/auth.service";
import { registerSchema } from "@/shared/schemas/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Dữ liệu đăng ký không hợp lệ";
      return NextResponse.json(
        { success: false, error: firstError, errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const result = await AuthService.register(parsed.data);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return NextResponse.json(
      { success: false, error: "Đã xảy ra lỗi máy chủ, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}
