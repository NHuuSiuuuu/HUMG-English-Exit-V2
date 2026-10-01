import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/backend/lib/auth";
import { partService, PartValidationError } from "@/backend/services/part.service";
import { updatePartSchema } from "@/shared/schemas/part.schema";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/admin/parts/[id]: Lấy chi tiết Part kèm danh sách câu hỏi
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập dữ liệu Part này" },
        { status: 403 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Thiếu ID của Part" },
        { status: 400 }
      );
    }

    const part = await partService.getPartById(id);
    if (!part) {
      return NextResponse.json(
        { error: "Không tìm thấy Part yêu cầu" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: part,
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết Part:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi máy chủ khi lấy chi tiết Part" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/parts/[id]: Cập nhật thông tin và câu hỏi của Part
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
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
        { error: "Thiếu ID của Part cần cập nhật" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parseResult = updatePartSchema.safeParse({
      ...body,
      id,
    });

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Dữ liệu cập nhật Part không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const updated = await partService.updatePart(parseResult.data, user.id);

    return NextResponse.json({
      success: true,
      data: updated,
      message:
        updated.status === "PUBLISHED"
          ? `Đã cập nhật và công khai Part ${updated.partNo} thành công!`
          : `Đã lưu các thay đổi cho bản nháp Part ${updated.partNo}!`,
    });
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

    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi khi cập nhật Part";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// PATCH /api/admin/parts/[id]: Đổi nhanh trạng thái Part (DRAFT <-> PUBLISHED)
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
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
        { error: "Thiếu ID của Part" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const status = body?.status;
    if (status !== "DRAFT" && status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Trạng thái không hợp lệ. Chỉ chấp nhận DRAFT hoặc PUBLISHED" },
        { status: 400 }
      );
    }

    const result = await partService.updatePartStatus(id, status);

    return NextResponse.json({
      success: true,
      data: result,
      message:
        status === "PUBLISHED"
          ? "Đã chuyển Part sang trạng thái Công khai!"
          : "Đã chuyển Part về Bản nháp thành công!",
    });
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

    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi khi đổi trạng thái Part";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/admin/parts/[id]: Xóa Part khỏi kho phần
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
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
