import * as React from "react";
import { articleService } from "@/backend/services/article.service";
import { ArticleManager } from "@/frontend/components/admin/article-manager";

export const metadata = {
  title: "Quản lý Bài viết & Cẩm nang — Quản trị viên | HUMG English Exit",
  description: "Biên tập tin tức, hướng dẫn quy định chuẩn đầu ra, mẹo làm bài thi KET Cambridge",
};

// Đảm bảo dữ liệu luôn được truy vấn mới nhất khi vào trang
export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  // Lấy danh sách bài viết và số liệu thống kê thực tế từ PostgreSQL
  const [articles, stats] = await Promise.all([
    articleService.getArticles(),
    articleService.getArticleStats(),
  ]);

  return <ArticleManager initialArticles={articles} initialStats={stats} />;
}
