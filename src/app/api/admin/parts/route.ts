import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/backend/lib/auth";
import { partService, PartValidationError } from "@/backend/services/part.service";
import { createPartSchema } from "@/shared/schemas/part.schema";

export async function POST(request: NextRequest) {
  try {
    // 1. Kiểm tra xác thực quyền Admin
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để thực hiện thao tác này" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền quản trị để tạo Part mới" },
        { status: 403 }
      );
    }

    // 2. Đọc và parse dữ liệu gửi lên
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Dữ liệu gửi lên không đúng định dạng JSON" },
        { status: 400 }
      );
    }

    // 3. Validate dữ liệu qua Zod schema
    const parseResult = createPartSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Dữ liệu tạo Part không hợp lệ",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    // 4. Gọi backend service để tạo Part
    const newPart = await partService.createPart(parseResult.data, user.id);

    return NextResponse.json(
      {
        success: true,
        message:
          parseResult.data.status === "PUBLISHED"
            ? "Đã tạo và công khai Part thành công"
            : "Đã lưu bản nháp Part thành công",
        data: newPart,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof PartValidationError) {
      return NextResponse.json(
        {
          error: error.message,
          issues: error.issues,
        },
        { status: 422 }
      );
    }

    console.error("Lỗi khi tạo Part mới:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi máy chủ nội bộ khi tạo Part" },
      { status: 500 }
    );
  }
}
