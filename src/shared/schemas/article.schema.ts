import { z } from "zod";
import type { CreateArticleInput, ArticleCompletenessIssue } from "@/shared/types/article";

/**
 * Chuyển tiêu đề tiếng Việt thành slug URL an toàn
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(5, "Tiêu đề bài viết phải có ít nhất 5 ký tự")
    .max(255, "Tiêu đề không được vượt quá 255 ký tự"),
  slug: z
    .string()
    .min(3, "Slug bài viết phải có ít nhất 3 ký tự")
    .max(120, "Slug không được vượt quá 120 ký tự")
    .regex(/^[a-z0-9-]+$/, "Slug chỉ chứa chữ thường không dấu, số và dấu gạch nối")
    .optional(),
  excerpt: z.string().max(500, "Mô tả tóm tắt không quá 500 ký tự").nullable().optional(),
  content: z.string().min(20, "Nội dung bài viết tối thiểu 20 ký tự"),
  coverImageUrl: z.string().url("Đường dẫn ảnh bìa không hợp lệ").nullable().optional().or(z.literal("")),
  category: z.string().min(2, "Vui lòng chọn chuyên mục bài viết"),
  tags: z.array(z.string()).default([]),
  authorName: z.string().min(2).default("Ban Quản trị"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export const updateArticleSchema = createArticleSchema.partial().extend({
  id: z.string().min(1, "Thiếu ID bài viết"),
});

/**
 * Kiểm tra tính đầy đủ của bài viết trước khi xuất bản
 */
export function validateArticleForPublish(
  input: Partial<CreateArticleInput>
): ArticleCompletenessIssue[] {
  const issues: ArticleCompletenessIssue[] = [];

  if (!input.title || input.title.trim().length < 5) {
    issues.push({
      field: "title",
      message: "Tiêu đề bài viết bắt buộc phải có ít nhất 5 ký tự",
      severity: "error",
    });
  }

  if (!input.content || input.content.trim().length < 50) {
    issues.push({
      field: "content",
      message: "Nội dung bài viết xuất bản phải có ít nhất 50 ký tự",
      severity: "error",
    });
  }

  if (!input.category || input.category.trim() === "") {
    issues.push({
      field: "category",
      message: "Vui lòng chọn chuyên mục cho bài viết",
      severity: "error",
    });
  }

  return issues;
}
