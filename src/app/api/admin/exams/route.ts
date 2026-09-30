import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/backend/lib/auth";
import { examService, ExamValidationError } from "@/backend/services/exam.service";
import { createExamSchema } from "@/shared/schemas/exam.schema";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập dữ liệu đề thi quản trị" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const searchParam = searchParams.get("search");

    const filters: { status?: string; search?: string } = {};
    if (statusParam && (statusParam === "DRAFT" || statusParam === "PUBLISHED")) {
      filters.status = statusParam;
    }
    if (searchParam) {
      filters.search = searchParam;
    }

    const [exams, stats] = await Promise.all([
      examService.getExams(filters),
      examService.getExamStats(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        exams,
        stats,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đề thi:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi máy chủ khi truy vấn danh sách đề thi" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền tạo đề thi" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parseResult = createExamSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const created = await examService.createExam(parseResult.data);

    return NextResponse.json(
      {
        success: true,
        data: created,
        message:
          created.status === "PUBLISHED"
            ? "Đã tạo và công khai đề thi thành công!"
            : "Đã lưu bản nháp đề thi thành công!",
      },
      { status: 201 }
    );
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

    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi khi tạo đề thi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
