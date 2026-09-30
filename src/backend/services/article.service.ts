import "server-only";
import { db } from "@/backend/lib/db";
import {
  createArticleSchema,
  updateArticleSchema,
  validateArticleForPublish,
  slugify,
} from "@/shared/schemas/article.schema";
import type {
  CreateArticleInput,
  UpdateArticleInput,
  ArticleListItemDTO,
  ArticleDetailDTO,
  ArticleStatsDTO,
  ArticleCompletenessIssue,
} from "@/shared/types/article";
import type { Prisma } from "@prisma/client";

export class ArticleValidationError extends Error {
  constructor(
    public issues: ArticleCompletenessIssue[],
    message = "Bài viết chưa đạt tiêu chuẩn để xuất bản"
  ) {
    super(message);
    this.name = "ArticleValidationError";
  }
}

/**
 * Service quản lý bài viết, cẩm nang và hướng dẫn ôn thi KET
 */
export const articleService = {
  /**
   * Lấy danh sách bài viết theo bộ lọc
   */
  async getArticles(filters?: {
    category?: string;
    status?: string;
    search?: string;
  }): Promise<ArticleListItemDTO[]> {
    const where: Prisma.ArticleWhereInput = {};

    if (filters?.status === "DRAFT" || filters?.status === "PUBLISHED") {
      where.status = filters.status;
    }

    if (filters?.category && filters.category !== "all") {
      where.category = filters.category;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { slug: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const articles = await db.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return articles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      coverImageUrl: a.coverImageUrl,
      category: a.category,
      tags: a.tags,
      authorName: a.authorName,
      status: a.status,
      viewsCount: a.viewsCount,
      publishedAt: a.publishedAt ? a.publishedAt.toLocaleDateString("vi-VN") : null,
      createdAt: a.createdAt.toLocaleDateString("vi-VN"),
      updatedAt: a.updatedAt.toLocaleDateString("vi-VN"),
    }));
  },

  /**
   * Thống kê số lượng bài viết và lượt xem
   */
  async getArticleStats(): Promise<ArticleStatsDTO> {
    const [total, published, draft, aggregate] = await Promise.all([
      db.article.count(),
      db.article.count({ where: { status: "PUBLISHED" } }),
      db.article.count({ where: { status: "DRAFT" } }),
      db.article.aggregate({
        _sum: { viewsCount: true },
      }),
    ]);

    return {
      total,
      published,
      draft,
      totalViews: aggregate._sum.viewsCount || 0,
    };
  },

  /**
   * Lấy chi tiết bài viết theo ID
   */
  async getArticleById(id: string): Promise<ArticleDetailDTO | null> {
    const a = await db.article.findUnique({
      where: { id },
    });

    if (!a) return null;

    return {
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      coverImageUrl: a.coverImageUrl,
      category: a.category,
      tags: a.tags,
      authorName: a.authorName,
      status: a.status,
      viewsCount: a.viewsCount,
      publishedAt: a.publishedAt ? a.publishedAt.toLocaleDateString("vi-VN") : null,
      createdAt: a.createdAt.toLocaleDateString("vi-VN"),
      updatedAt: a.updatedAt.toLocaleDateString("vi-VN"),
    };
  },

  /**
   * Lấy chi tiết bài viết theo slug
   */
  async getArticleBySlug(slug: string): Promise<ArticleDetailDTO | null> {
    const a = await db.article.findUnique({
      where: { slug },
    });

    if (!a) return null;

    return {
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      coverImageUrl: a.coverImageUrl,
      category: a.category,
      tags: a.tags,
      authorName: a.authorName,
      status: a.status,
      viewsCount: a.viewsCount,
      publishedAt: a.publishedAt ? a.publishedAt.toLocaleDateString("vi-VN") : null,
      createdAt: a.createdAt.toLocaleDateString("vi-VN"),
      updatedAt: a.updatedAt.toLocaleDateString("vi-VN"),
    };
  },

  /**
   * Tạo bài viết mới
   */
  async createArticle(rawInput: CreateArticleInput) {
    const validated = createArticleSchema.parse(rawInput);

    if (validated.status === "PUBLISHED") {
      const issues = validateArticleForPublish(validated);
      if (issues.length > 0) {
        throw new ArticleValidationError(issues);
      }
    }

    // Tự động sinh slug nếu chưa có
    let finalSlug = validated.slug && validated.slug.trim() !== ""
      ? validated.slug.trim()
      : slugify(validated.title);

    // Đảm bảo slug là duy nhất
    let count = 0;
    let uniqueSlug = finalSlug;
    while (await db.article.findUnique({ where: { slug: uniqueSlug } })) {
      count++;
      uniqueSlug = `${finalSlug}-${count}`;
    }

    return db.article.create({
      data: {
        title: validated.title.trim(),
        slug: uniqueSlug,
        excerpt: validated.excerpt?.trim() || null,
        content: validated.content.trim(),
        coverImageUrl: validated.coverImageUrl?.trim() || null,
        category: validated.category.trim(),
        tags: validated.tags || [],
        authorName: validated.authorName?.trim() || "Ban Quản trị",
        status: validated.status,
        publishedAt: validated.status === "PUBLISHED" ? new Date() : null,
      },
    });
  },

  /**
   * Cập nhật bài viết
   */
  async updateArticle(rawInput: UpdateArticleInput) {
    const validated = updateArticleSchema.parse(rawInput);

    const existing = await db.article.findUnique({
      where: { id: validated.id },
    });
    if (!existing) {
      throw new Error("Không tìm thấy bài viết cần cập nhật");
    }

    if (validated.status === "PUBLISHED") {
      const issues = validateArticleForPublish(validated);
      if (issues.length > 0) {
        throw new ArticleValidationError(issues);
      }
    }

    // Nếu có đổi slug, kiểm tra trùng
    let slugToUpdate = undefined;
    if (validated.slug && validated.slug !== existing.slug) {
      const slugExist = await db.article.findUnique({
        where: { slug: validated.slug },
      });
      if (slugExist && slugExist.id !== existing.id) {
        throw new Error(`Đường dẫn slug "${validated.slug}" đã được sử dụng bởi bài viết khác.`);
      }
      slugToUpdate = validated.slug;
    }

    return db.article.update({
      where: { id: validated.id },
      data: {
        ...(validated.title && { title: validated.title.trim() }),
        ...(slugToUpdate && { slug: slugToUpdate }),
        ...(validated.excerpt !== undefined && { excerpt: validated.excerpt?.trim() || null }),
        ...(validated.content && { content: validated.content.trim() }),
        ...(validated.coverImageUrl !== undefined && {
          coverImageUrl: validated.coverImageUrl?.trim() || null,
        }),
        ...(validated.category && { category: validated.category.trim() }),
        ...(validated.tags && { tags: validated.tags }),
        ...(validated.authorName && { authorName: validated.authorName.trim() }),
        ...(validated.status && {
          status: validated.status,
          publishedAt:
            validated.status === "PUBLISHED" && !existing.publishedAt
              ? new Date()
              : existing.publishedAt,
        }),
      },
    });
  },

  /**
   * Xóa bài viết
   */
  async deleteArticle(id: string) {
    const existing = await db.article.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new Error("Không tìm thấy bài viết cần xóa");
    }

    return db.article.delete({
      where: { id },
    });
  },

  /**
   * Lấy danh sách bài viết mới nhất đã xuất bản cho trang công khai
   */
  async getLatestArticles(limit: number = 6) {
    const articles = await db.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    return articles.map((a) => {
      const wordCount = a.content.trim().split(/\s+/).length;
      const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

      return {
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt || "",
        category: a.category,
        authorName: a.authorName,
        readTimeMinutes,
        publishedAt: a.publishedAt ? a.publishedAt.toLocaleDateString("vi-VN") : a.createdAt.toLocaleDateString("vi-VN"),
      };
    });
  },
};

