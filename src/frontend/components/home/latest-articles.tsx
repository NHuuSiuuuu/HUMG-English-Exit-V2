"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export interface ArticleSummaryItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTimeMinutes?: number;
  publishedAt: string | null;
}

interface LatestArticlesProps {
  articles?: ArticleSummaryItem[];
}

export function LatestArticles({ articles = [] }: LatestArticlesProps) {
  // Nếu chưa có bài viết nào được công khai trong DB: ẩn khối bài viết theo docs/PAGES.md
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2.5 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0095F6]">
              Tài liệu & Kinh nghiệm
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Bài viết hướng dẫn & Mẹo làm bài mới nhất
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Kinh nghiệm thực tế tổng hợp từ các anh chị khóa trước đạt chuẩn đầu ra điểm cao.
            </p>
          </div>
          <Link
            href="/bai-viet"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 text-xs font-bold shadow-sm hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
          >
            <span>Xem tất cả bài viết</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800/80 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-[#0095F6] dark:text-sky-300">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{article.readTimeMinutes || 5} phút đọc</span>
                  </div>
                </div>

                <Link href={`/bai-viet/${article.slug}`}>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-[#0095F6] transition-colors duration-300 ease-in-out line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-normal">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-5 border-t border-slate-100 dark:border-slate-800/60 mt-6 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{article.publishedAt || "Mới đăng"}</span>
                </div>
                <Link
                  href={`/bai-viet/${article.slug}`}
                  className="font-bold text-[#0095F6] hover:underline flex items-center gap-1 transition-colors duration-300 ease-in-out"
                >
                  <span>Đọc tiếp</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
