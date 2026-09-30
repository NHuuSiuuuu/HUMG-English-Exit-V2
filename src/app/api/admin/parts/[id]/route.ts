import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/backend/lib/auth";
import { partService } from "@/backend/services/part.service";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền thực hiện thao tác này" },
        { status: 403 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Thiếu ID của Part cần xóa" },
        { status: 400 }
      );
    }

    const success = await partService.deletePart(id);
    if (!success) {
      return NextResponse.json(
        { error: "Không tìm thấy hoặc không thể xóa Part này" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa Part thành công khỏi Kho phần",
    });
  } catch (error) {
    console.error("Lỗi khi xóa Part:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi máy chủ khi xóa Part" },
      { status: 500 }
    );
  }
}
