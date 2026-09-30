import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/backend/lib/auth";
import { articleService, ArticleValidationError } from "@/backend/services/article.service";
import { createArticleSchema } from "@/shared/schemas/article.schema";

// GET /api/admin/articles: Lấy danh sách bài viết & thống kê
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập dữ liệu bài viết quản trị" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");
    const statusParam = searchParams.get("status");
    const searchParam = searchParams.get("search");

    const filters: { category?: string; status?: string; search?: string } = {};
    if (categoryParam && categoryParam !== "all") {
      filters.category = categoryParam;
    }
    if (statusParam && (statusParam === "DRAFT" || statusParam === "PUBLISHED")) {
      filters.status = statusParam;
    }
    if (searchParam) {
      filters.search = searchParam;
    }

    const [articles, stats] = await Promise.all([
      articleService.getArticles(filters),
      articleService.getArticleStats(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        articles,
        stats,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi máy chủ khi truy vấn danh sách bài viết" },
      { status: 500 }
    );
  }
}

// POST /api/admin/articles: Tạo bài viết mới
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền tạo bài viết" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parseResult = createArticleSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Dữ liệu bài viết không hợp lệ";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const created = await articleService.createArticle(parseResult.data);

    return NextResponse.json(
      {
        success: true,
        data: created,
        message:
          created.status === "PUBLISHED"
            ? "Đã xuất bản bài viết thành công!"
            : "Đã lưu bản nháp bài viết thành công!",
      },
      { status: 201 }
    );
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

    const message = error instanceof Error ? error.message : "Đã xảy ra lỗi khi tạo bài viết";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
