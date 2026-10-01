import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, Eye, Tag, Share2, Bookmark } from "lucide-react";
import { articleService } from "@/backend/services/article.service";
import { db } from "@/backend/lib/db";
import { Badge } from "@/frontend/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/frontend/components/ui/card";

interface ArticleDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const article = await articleService.getArticleBySlug(params.slug);
  if (!article || article.status !== "PUBLISHED") {
    return { title: "Không tìm thấy bài viết — HUMG English Exit" };
  }
  return {
    title: `${article.title} — HUMG English Exit`,
    description: article.excerpt || article.title,
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const article = await articleService.getArticleBySlug(params.slug);

  if (!article || article.status !== "PUBLISHED") {
    notFound();
  }

  // Tăng lượt xem (view count) bất đồng bộ trong nền
  try {
    await db.article.update({
      where: { id: article.id },
      data: { viewsCount: { increment: 1 } },
    });
  } catch (err) {
    // Không làm gián đoạn việc tải trang nếu tăng view thất bại
    console.error("Lỗi cập nhật viewsCount:", err);
  }

  // Lấy các bài viết liên quan
  const allLatest = await articleService.getLatestArticles(4);
  const relatedArticles = allLatest.filter((a) => a.slug !== article.slug).slice(0, 3);

  // Tính thời gian đọc ước tính
  const wordCount = article.content.trim().split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="py-10 md:py-16">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Điều hướng quay lại */}
        <div>
          <Link
            href="/bai-viet"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tất cả bài viết & Cẩm nang</span>
          </Link>
        </div>

        {/* Header bài viết */}
        <header className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-[#0095F6] dark:text-sky-300">
              {article.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{readTimeMinutes} phút đọc</span>
            </div>
            <span className="text-xs text-slate-400">•</span>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Eye className="h-3.5 w-3.5" />
              <span>{article.viewsCount + 1} lượt xem</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed border-l-4 border-[#0095F6] pl-4 py-1 italic bg-slate-50/50 dark:bg-slate-900/50 rounded-r-xl">
              {article.excerpt}
            </p>
          )}

          <div className="pt-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <User className="h-4 w-4 text-[#0095F6]" />
                <span>{article.authorName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{article.publishedAt || article.createdAt}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Ảnh bìa đại diện nếu có */}
        {article.coverImageUrl && (
          <div className="rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full h-auto max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* Thân bài viết */}
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed space-y-5 text-sm sm:text-base">
          {article.content.split("\n\n").map((paragraph, index) => {
            const p = paragraph.trim();
            if (!p) return null;

            // Xử lý tiêu đề H2
            if (p.startsWith("## ")) {
              return (
                <h2
                  key={index}
                  className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-6 pb-2 border-b border-slate-100 dark:border-slate-800"
                >
                  {p.replace("## ", "")}
                </h2>
              );
            }

            // Xử lý tiêu đề H3
            if (p.startsWith("### ")) {
              return (
                <h3
                  key={index}
                  className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 pt-4"
                >
                  {p.replace("### ", "")}
                </h3>
              );
            }

            // Xử lý trích dẫn blockquote
            if (p.startsWith("> ")) {
              return (
                <blockquote
                  key={index}
                  className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border-l-4 border-[#0095F6] text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
                >
                  {p.replace(/^>\s*/, "")}
                </blockquote>
              );
            }

            // Xử lý danh sách gạch đầu dòng
            if (p.startsWith("- ") || p.startsWith("* ")) {
              const lines = p.split("\n");
              return (
                <ul key={index} className="list-disc list-inside space-y-1.5 pl-2">
                  {lines.map((line, lIdx) => (
                    <li key={lIdx} className="text-slate-700 dark:text-slate-300">
                      {line.replace(/^[-*]\s*/, "")}
                    </li>
                  ))}
                </ul>
              );
            }

            // Xử lý danh sách đánh số
            if (/^\d+\.\s/.test(p)) {
              const lines = p.split("\n");
              return (
                <ol key={index} className="list-decimal list-inside space-y-1.5 pl-2">
                  {lines.map((line, lIdx) => (
                    <li key={lIdx} className="text-slate-700 dark:text-slate-300">
                      {line.replace(/^\d+\.\s*/, "")}
                    </li>
                  ))}
                </ol>
              );
            }

            // Đoạn văn thông thường
            return (
              <p key={index} className="leading-relaxed">
                {p}
              </p>
            );
          })}
        </div>

        {/* Tags nhãn bài viết */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
            <Tag className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500">Chủ đề:</span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Các bài viết liên quan */}
        {relatedArticles.length > 0 && (
          <section className="pt-12 border-t border-slate-100 dark:border-slate-800 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Bài viết cùng chuyên mục ôn thi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedArticles.map((rel) => (
                <Card
                  key={rel.id}
                  className="flex flex-col justify-between hover:ring-2 hover:ring-[#0095F6]/40 hover:-translate-y-1 hover:shadow-md transition-all duration-300 ease-in-out"
                >
                  <CardHeader className="p-5">
                    <span className="text-[11px] font-bold text-[#0095F6] mb-1">
                      {rel.category}
                    </span>
                    <Link href={`/bai-viet/${rel.slug}`}>
                      <CardTitle className="text-sm font-bold hover:text-primary transition-colors line-clamp-2">
                        {rel.title}
                      </CardTitle>
                    </Link>
                  </CardHeader>
                  <CardFooter className="p-5 pt-0 text-xs text-muted flex items-center justify-between">
                    <span>{rel.publishedAt}</span>
                    <Link
                      href={`/bai-viet/${rel.slug}`}
                      className="font-bold text-primary hover:underline text-xs"
                    >
                      Đọc tiếp →
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
