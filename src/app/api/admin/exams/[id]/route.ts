import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/backend/lib/auth";
import { examService, ExamValidationError } from "@/backend/services/exam.service";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập dữ liệu đề thi" },
        { status: 403 }
      );
    }

    const exam = await examService.getExamById(params.id);
    if (!exam) {
      return NextResponse.json(
        { error: "Không tìm thấy đề thi yêu cầu" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: exam,
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đề thi:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy thông tin đề thi" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền cập nhật đề thi" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updated = await examService.updateExam({
      ...body,
      id: params.id,
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Cập nhật đề thi thành công!",
    });
  } catch (error) {
    if (error instanceof ExamValidationError) {
      return NextResponse.json(
        {
          error: error.message,
          issues: error.issues,
        },
        { status: 422 }
      );
    }

    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi khi cập nhật đề thi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa đề thi" },
        { status: 403 }
      );
    }

    await examService.deleteExam(params.id);

    return NextResponse.json({
      success: true,
      message: "Đã xóa đề thi thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi xóa đề thi:", error);
    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi khi xóa đề thi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
