"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, BookOpen } from "lucide-react";
import { useLanguage } from "@/frontend/providers/language-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";

export function LatestArticles() {
  const { t } = useLanguage();

  const sampleArticles = [
    {
      id: "1",
      slug: "quy-dinh-chuan-dau-ra-ngoai-ngu-humg-2026",
      title: "Tổng hợp toàn bộ quy định Chuẩn đầu ra Ngoại ngữ HUMG mới nhất",
      excerpt: "Chi tiết các chứng chỉ được công nhận, điểm quy đổi, thời hạn nộp chứng chỉ và các đợt thi đánh giá năng lực tại trường.",
      category: "Quy định & Lịch thi",
      date: "28/09/2026",
      readTime: "5 phút đọc",
    },
    {
      id: "2",
      slug: "meo-lam-reading-writing-ket-a2-dat-diem-cao",
      title: "Chiến thuật làm 9 Phần Reading & Writing không bị thiếu thời gian",
      excerpt: "Cách phân bổ 40 phút cho Reading, 15 phút cho Part 9 và mẹo tránh bẫy các biển báo thông báo trong đề Cambridge KET.",
      category: "Mẹo thi cử",
      date: "24/09/2026",
      readTime: "7 phút đọc",
    },
    {
      id: "3",
      slug: "bi-quyet-nghe-part-10-tranh-hoi-thoai",
      title: "Bí quyết chinh phục 5 câu nghe chọn tranh Part 10 Cambridge KET",
      excerpt: "Nhận biết bẫy gây nhiễu về giờ đồng hồ, giá tiền và hoạt động thường gặp trong các đoạn hội thoại ngắn.",
      category: "Kỹ năng Listening",
      date: "20/09/2026",
      readTime: "6 phút đọc",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-surface border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3 max-w-2xl">
            <Badge variant="default" className="px-3 py-1 font-heading">
              {t("landing.articles.tag", "Tài liệu & Kinh nghiệm")}
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground">
              {t("landing.articles.title", "Bài viết hướng dẫn & Mẹo làm bài mới nhất")}
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              {t(
                "landing.articles.subtitle",
                "Kinh nghiệm thực tế tổng hợp từ các anh chị khóa trước đạt chuẩn đầu ra điểm cao."
              )}
            </p>
          </div>
          <Link href="/bai-viet" className="shrink-0">
            <Button variant="outline" className="gap-2">
              <span>{t("landing.articles.viewAll", "Xem tất cả bài viết")}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleArticles.map((article) => (
            <Card key={article.id} className="flex flex-col justify-between hover:shadow-md hover:border-primary/40 transition-all">
              <CardHeader className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="font-semibold text-xs">
                    {article.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <Link href={`/bai-viet/${article.slug}`}>
                  <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                </Link>

                <CardDescription className="text-sm mt-2 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>

              <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-border mt-auto pt-4 text-xs text-muted">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{article.date}</span>
                </div>
                <Link
                  href={`/bai-viet/${article.slug}`}
                  className="font-heading font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>{t("landing.articles.readMore", "Đọc bài viết")}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
