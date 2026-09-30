"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Headphones, Clock, HelpCircle, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/frontend/providers/language-provider";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";

export function ExamStructure() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = React.useState<"all" | "rw" | "listening">("all");

  const readingWritingParts = [
    { no: "Part 1", name: t("landing.structure.parts.p1", "Phần 1: Biển báo (Nối câu với 8 biển báo/thông báo A-H)"), q: "5 câu", type: "Ghép 1 trong 8" },
    { no: "Part 2", name: t("landing.structure.parts.p2", "Phần 2: Từ vựng (Điền từ A/B/C vào chỗ trống đoạn ngắn)"), q: "5 câu", type: "Trắc nghiệm 3 lựa chọn" },
    { no: "Part 3", name: t("landing.structure.parts.p3", "Phần 3: Hội thoại (Chọn câu đối đáp phù hợp A/B/C)"), q: "5 câu", type: "Trắc nghiệm 3 lựa chọn" },
    { no: "Part 4", name: t("landing.structure.parts.p4", "Phần 4: Đọc hiểu (Bài đọc kèm câu hỏi Right/Wrong/Doesn't say)"), q: "7 câu", type: "Chọn 1 trong 3" },
    { no: "Part 5", name: t("landing.structure.parts.p5", "Phần 5: Điền đoạn (Đoạn văn khuyết 8 chỗ chọn A/B/C)"), q: "8 câu", type: "Trắc nghiệm 3 lựa chọn" },
    { no: "Part 6", name: t("landing.structure.parts.p6", "Phần 6: Đoán từ (Định nghĩa từ, cho chữ cái đầu và số ký tự)"), q: "5 câu", type: "Ô nhập text" },
    { no: "Part 7", name: t("landing.structure.parts.p7", "Phần 7: Điền từ vào thư/email (Viết đúng 1 từ mỗi ô)"), q: "10 câu", type: "Ô nhập text" },
    { no: "Part 8", name: t("landing.structure.parts.p8", "Phần 8: Điền form thông tin (Đọc thư, điền phiếu thông tin)"), q: "5 câu", type: "Ô nhập text" },
    { no: "Part 9", name: t("landing.structure.parts.p9", "Phần 9: Viết note ngắn (Viết note 25-35 từ đủ 3 ý yêu cầu)"), q: "1 bài viết", type: "Tự luận văn bản ngắn" },
  ];

  const listeningParts = [
    { no: "Part 10", name: t("landing.structure.parts.p10", "Phần 10: Listening 1 (5 hội thoại ngắn chọn tranh A/B/C)"), q: "5 câu", type: "Chọn 1 trong 3 tranh" },
    { no: "Part 11", name: t("landing.structure.parts.p11", "Phần 11: Listening 2 (Nối món đồ/sự kiện với lý do A-H)"), q: "5 câu", type: "Ghép 1 trong 8" },
    { no: "Part 12", name: t("landing.structure.parts.p12", "Phần 12: Listening 3 (Trắc nghiệm A/B/C theo hội thoại)"), q: "5 câu", type: "Trắc nghiệm 3 lựa chọn" },
    { no: "Part 13", name: t("landing.structure.parts.p13", "Phần 13: Listening 4 (Nghe và điền thông tin vào phiếu)"), q: "5 câu", type: "Ô nhập text" },
    { no: "Part 14", name: t("landing.structure.parts.p14", "Phần 14: Listening 5 (Nghe và điền chi tiết vào tờ ghi chú)"), q: "5 câu", type: "Ô nhập text" },
  ];

  return (
    <section className="py-16 sm:py-20 bg-surface border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <Badge variant="secondary" className="px-3 py-1 font-heading">
            {t("landing.structure.tag", "Cấu trúc đề chuẩn")}
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground">
            {t("landing.structure.title", "Cấu trúc 14 Phần bài thi chuẩn đầu ra HUMG")}
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            {t(
              "landing.structure.subtitle",
              "Đề thi bám sát định dạng bài thi Cambridge KET (A2 Key) với 2 khối kỹ năng làm liên tục trong 60 phút."
            )}
          </p>

          {/* Thanh tóm tắt nhanh thời gian và tổng câu */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="inline-flex items-center gap-2 rounded-lg bg-surface-raised px-4 py-2 text-sm font-semibold text-foreground border border-border">
              <Clock className="h-4 w-4 text-primary" />
              <span>Thời gian làm bài: <strong>60 phút</strong></span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-surface-raised px-4 py-2 text-sm font-semibold text-foreground border border-border">
              <HelpCircle className="h-4 w-4 text-secondary" />
              <span>Tổng số câu: <strong>75 câu + 1 bài viết</strong></span>
            </div>
          </div>
        </div>

        {/* Tab chuyển đổi khối */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-surface-raised rounded-lg border border-border">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-heading font-bold rounded-md transition-colors ${
                activeTab === "all"
                  ? "bg-surface text-primary shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Tất cả (14 Parts)
            </button>
            <button
              onClick={() => setActiveTab("rw")}
              className={`px-4 py-2 text-sm font-heading font-bold rounded-md transition-colors ${
                activeTab === "rw"
                  ? "bg-surface text-primary shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Reading & Writing (9 Parts)
            </button>
            <button
              onClick={() => setActiveTab("listening")}
              className={`px-4 py-2 text-sm font-heading font-bold rounded-md transition-colors ${
                activeTab === "listening"
                  ? "bg-surface text-primary shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Listening (5 Parts)
            </button>
          </div>
        </div>

        {/* Danh sách các Part */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cột 1: Reading & Writing */}
          {(activeTab === "all" || activeTab === "rw") && (
            <div className={`space-y-4 ${activeTab === "rw" ? "lg:col-span-2 max-w-4xl mx-auto w-full" : ""}`}>
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground">
                    {t("landing.structure.readingWritingTitle", "Khối Reading & Writing (Phần 1 – 9)")}
                  </h3>
                  <p className="text-xs text-muted">
                    {t("landing.structure.readingWritingMeta", "50 câu hỏi trắc nghiệm & điền từ · 1 bài viết ngắn")}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {readingWritingParts.map((part) => (
                  <div
                    key={part.no}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border bg-surface hover:bg-surface-raised/60 transition-colors gap-2"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-heading font-extrabold text-xs px-2 py-1 rounded bg-primary/10 text-primary whitespace-nowrap mt-0.5 sm:mt-0">
                        {part.no}
                      </span>
                      <span className="text-sm font-medium text-foreground">{part.name}</span>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className="text-xs text-muted bg-surface-raised px-2 py-0.5 rounded border border-border">
                        {part.type}
                      </span>
                      <span className="text-xs font-semibold text-secondary min-w-[50px] text-right">
                        {part.q}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cột 2: Listening */}
          {(activeTab === "all" || activeTab === "listening") && (
            <div className={`space-y-4 ${activeTab === "listening" ? "lg:col-span-2 max-w-4xl mx-auto w-full" : ""}`}>
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="p-2 rounded-lg bg-secondary/15 text-secondary">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-foreground">
                    {t("landing.structure.listeningTitle", "Khối Listening (Phần 10 – 14)")}
                  </h3>
                  <p className="text-xs text-muted">
                    {t("landing.structure.listeningMeta", "25 câu hỏi trắc nghiệm chọn tranh, nối ý & điền thông tin")}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {listeningParts.map((part) => (
                  <div
                    key={part.no}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border bg-surface hover:bg-surface-raised/60 transition-colors gap-2"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-heading font-extrabold text-xs px-2 py-1 rounded bg-secondary/15 text-secondary whitespace-nowrap mt-0.5 sm:mt-0">
                        {part.no}
                      </span>
                      <span className="text-sm font-medium text-foreground">{part.name}</span>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className="text-xs text-muted bg-surface-raised px-2 py-0.5 rounded border border-border">
                        {part.type}
                      </span>
                      <span className="text-xs font-semibold text-secondary min-w-[50px] text-right">
                        {part.q}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Box hướng dẫn Listening audio */}
              <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4 text-xs text-muted leading-relaxed space-y-1">
                <p className="font-semibold text-secondary">Lưu ý phần thi Nghe (Listening):</p>
                <p>• Phần 10 (Listening 1) gồm tranh minh họa mức giá, giờ đồng hồ, hoạt động, họa tiết áo.</p>
                <p>• Toàn bộ audio nghe 2 lần theo đúng quy chế bài thi Cambridge KET.</p>
              </div>
            </div>
          )}
        </div>

        {/* Nút hành động */}
        <div className="mt-10 text-center">
          <Link href="/on-luyen">
            <Button size="lg" className="gap-2">
              <span>Bắt đầu ôn tập 14 phần</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
