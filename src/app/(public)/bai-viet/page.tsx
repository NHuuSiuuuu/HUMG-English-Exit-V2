import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, ArrowRight, FileText } from "lucide-react";
import { articleService } from "@/backend/services/article.service";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";

export const metadata = {
  title: "Bài viết & Cẩm nang ôn thi — HUMG English Exit",
  description: "Tổng hợp kinh nghiệm làm bài, mẹo phân bổ thời gian và hướng dẫn quy chế thi chuẩn đầu ra tiếng Anh HUMG.",
};

export default async function ArticlesHubPage() {
  const articles = await articleService.getArticles({ status: "PUBLISHED" });

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Tiêu đề trang */}
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Về trang chủ</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Bài viết & Cẩm nang ôn thi
          </h1>
          <p className="text-muted text-base max-w-2xl leading-relaxed">
            Tổng hợp kinh nghiệm làm bài, mẹo phân bổ thời gian và hướng dẫn quy chế thi chuẩn đầu ra tiếng Anh HUMG từ các bạn sinh viên đạt điểm xuất sắc.
          </p>
        </div>

        {/* Danh sách bài viết hoặc Trạng thái rỗng */}
        {articles.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-foreground">Chưa có bài viết nào</h3>
            <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
              Các bài viết chia sẻ kinh nghiệm, mẹo làm bài và quy định thi sẽ sớm được ban quản trị công bố tại đây.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="flex flex-col justify-between hover:ring-2 hover:ring-[#0095F6]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-in-out">
                <CardHeader className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="font-semibold text-xs bg-sky-50 dark:bg-sky-950/60 text-[#0095F6] dark:text-sky-300">
                      {article.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <Clock className="h-3.5 w-3.5" />
                      <span>5 phút đọc</span>
                    </div>
                  </div>

                  <Link href={`/bai-viet/${article.slug}`}>
                    <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </Link>

                  <CardDescription className="text-sm mt-2 line-clamp-3 leading-relaxed">
                    {article.excerpt || "Xem chi tiết nội dung bài viết..."}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-border mt-auto pt-4 text-xs text-muted">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{article.publishedAt || article.createdAt}</span>
                  </div>
                  <Link
                    href={`/bai-viet/${article.slug}`}
                    className="font-heading font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Đọc bài</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
