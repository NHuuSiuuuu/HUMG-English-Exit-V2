import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/backend/lib/auth";
import { settingsService } from "@/backend/services/settings.service";
import { updateSettingsSchema } from "@/shared/schemas/settings.schema";

// GET /api/admin/settings: Lấy cấu hình hệ thống và nhật ký thao tác
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập cài đặt hệ thống" },
        { status: 403 }
      );
    }

    const [settings, logs] = await Promise.all([
      settingsService.getSettings(),
      settingsService.getAuditLogs(10),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        settings,
        logs,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy cài đặt hệ thống:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi máy chủ khi truy vấn cài đặt" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings: Cập nhật cấu hình hệ thống
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền cập nhật cài đặt hệ thống" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parseResult = updateSettingsSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError =
        parseResult.error.errors[0]?.message || "Dữ liệu cấu hình không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const updated = await settingsService.updateSettings(
      parseResult.data,
      user.email
    );

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Đã lưu cài đặt hệ thống thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật cài đặt:", error);
    const message =
      error instanceof Error ? error.message : "Đã xảy ra lỗi khi lưu cài đặt";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// POST /api/admin/settings: Khôi phục cấu hình mặc định chuẩn KET
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền khôi phục cài đặt" },
        { status: 403 }
      );
    }

    const body = await request.json();
    if (body.action === "RESET_DEFAULT") {
      const reset = await settingsService.resetToDefault(user.email);
      return NextResponse.json({
        success: true,
        data: reset,
        message: "Đã khôi phục cài đặt về chuẩn KET 60 phút ban đầu!",
      });
    }

    return NextResponse.json(
      { error: "Hành động không hợp lệ" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Lỗi khi khôi phục cài đặt:", error);
    const message =
      error instanceof Error ? error.message : "Đã xảy ra lỗi khi khôi phục";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
