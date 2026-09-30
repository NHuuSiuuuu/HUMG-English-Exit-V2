"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Award, ShieldCheck, CheckCircle2, Sparkles, BookOpen } from "lucide-react";
import { useLanguage } from "@/frontend/providers/language-provider";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-surface via-background to-background py-12 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Cột trái: Nội dung Hero */}
          <div className="flex flex-col items-start lg:col-span-7 space-y-6">
            <Badge variant="default" className="gap-1.5 py-1 px-3 text-xs sm:text-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {t("landing.hero.badge", "Đề thi chuẩn Cambridge KET (A2 Key)")}
            </Badge>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl leading-[1.15] text-foreground">
              {t("landing.hero.title", "Chinh phục chuẩn đầu ra Tiếng Anh HUMG tự tin & hiệu quả")}
            </h1>

            <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
              {t(
                "landing.hero.subtitle",
                "Nền tảng ôn luyện bám sát 14 dạng bài thi chuẩn đầu ra Trường Đại học Mỏ - Địa chất. Luyện tập theo từng kỹ năng, thi thử 60 phút mô phỏng áp lực thực tế và tra cứu kết quả nhanh chóng."
              )}
            </p>

            {/* Hàng CTA: Desktop ngang, Mobile dọc với nút chính ở trên theo PAGES.md */}
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 pt-2">
              <Link href="/on-luyen" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <BookOpen className="h-5 w-5" />
                  {t("landing.hero.ctaPractice", "Bắt đầu ôn luyện")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/thi-thu" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  {t("landing.hero.ctaExam", "Thi thử 60 phút")}
                </Button>
              </Link>
              <Link href="/tra-cuu" className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto gap-2 text-muted hover:text-foreground">
                  <ShieldCheck className="h-5 w-5 text-secondary" />
                  {t("landing.hero.ctaCheckScore", "Tra cứu điểm CFI")}
                </Button>
              </Link>
            </div>

            {/* Uy tín & Tiêu chuẩn */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs sm:text-sm text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>14 Part chuẩn Cambridge KET</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>Đồng hồ đếm ngược server 60 phút</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>Tự động lưu nháp liên tục</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Mockup bài thi KET thực tế */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-md transition-all">
              {/* Header của thẻ Mockup */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-accent animate-pulse" />
                  <span className="font-heading font-bold text-sm text-foreground">
                    {t("landing.hero.preview.title", "Đề thi thử chuẩn số 01")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{t("landing.hero.preview.time", "60:00")}</span>
                </div>
              </div>

              {/* Tiến độ & Phần thi */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="font-semibold text-foreground">
                    {t("landing.hero.preview.partLabel", "Phần 1/14: Biển báo & Thông báo")}
                  </span>
                  <span>{t("landing.hero.preview.progress", "18/75 câu")}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
                  <div className="h-full w-[24%] rounded-full bg-secondary transition-all" />
                </div>
              </div>

              {/* Câu hỏi mẫu minh họa */}
              <div className="mt-5 rounded-md border border-border bg-surface-raised p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted uppercase">Question 01 · Signs</span>
                  <span className="text-xs text-secondary font-semibold">1 point</span>
                </div>
                {/* Giữ ảnh và nội dung đề trên nền sáng chuẩn WCAG */}
                <div className="rounded border border-border/80 bg-white p-3 text-slate-900 shadow-sm text-center">
                  <p className="font-bold text-xs uppercase tracking-wide text-red-600">NOTICE</p>
                  <p className="font-semibold text-sm mt-1">NO MOBILE PHONES IN READING ROOM</p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {t("landing.hero.preview.questionSample", "Where can you see this notice?")}
                </p>
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 rounded border border-primary/40 bg-primary/10 p-2 text-primary font-medium">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    <span>{t("landing.hero.preview.optionA", "A. In a library")}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded border border-border bg-surface p-2 text-muted">
                    <span className="h-4 w-4 rounded-full border border-muted/50 inline-block shrink-0" />
                    <span>{t("landing.hero.preview.optionB", "B. On a train")}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded border border-border bg-surface p-2 text-muted">
                    <span className="h-4 w-4 rounded-full border border-muted/50 inline-block shrink-0" />
                    <span>{t("landing.hero.preview.optionC", "C. In a museum")}</span>
                  </div>
                </div>
              </div>

              {/* Chân card mockup */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-border text-xs text-muted">
                <span className="flex items-center gap-1.5 font-medium text-success">
                  <Award className="h-3.5 w-3.5" />
                  {t("landing.hero.preview.verifiedBadge", "Chấm tự động tức thì")}
                </span>
                <span className="font-mono text-[11px] bg-surface-raised px-2 py-0.5 rounded">
                  Server Time Sync
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
