import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/backend/lib/auth";
import { articleService, ArticleValidationError } from "@/backend/services/article.service";
import { updateArticleSchema } from "@/shared/schemas/article.schema";

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/admin/articles/[id]: Lấy chi tiết bài viết (kèm nội dung)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập dữ liệu bài viết" },
        { status: 403 }
      );
    }

    const article = await articleService.getArticleById(params.id);
    if (!article) {
      return NextResponse.json(
        { error: "Không tìm thấy bài viết yêu cầu" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết bài viết:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy thông tin bài viết" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/articles/[id]: Cập nhật bài viết
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền cập nhật bài viết" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parseResult = updateArticleSchema.safeParse({
      ...body,
      id: params.id,
    });

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Dữ liệu cập nhật không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const updated = await articleService.updateArticle(parseResult.data);

    return NextResponse.json({
      success: true,
      data: updated,
      message:
        updated.status === "PUBLISHED"
          ? "Đã cập nhật và xuất bản bài viết thành công!"
          : "Đã lưu thay đổi bài viết thành công!",
    });
  } catch (error) {
    if (error instanceof ArticleValidationError) {
      return NextResponse.json(
        {
          error: error.message,
          issues: error.issues,
        },
        { status: 422 }
      );
    }

    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi khi cập nhật bài viết";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE /api/admin/articles/[id]: Xóa bài viết
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa bài viết" },
        { status: 403 }
      );
    }

    await articleService.deleteArticle(params.id);

    return NextResponse.json({
      success: true,
      message: "Đã xóa bài viết thành công",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi khi xóa bài viết";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
