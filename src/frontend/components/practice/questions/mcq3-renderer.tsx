"use client";

import React from "react";
import type { QuestionGroupDef } from "@/shared/types/question";
import type { QuestionGradingDetail } from "@/shared/types/practice";
import { CheckCircle2, XCircle, Info, FileText } from "lucide-react";

interface Mcq3RendererProps {
  group: QuestionGroupDef;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  isGraded?: boolean;
  gradingDetails?: Record<string, QuestionGradingDetail>;
}

/**
 * Renderer trắc nghiệm phong cách TADR OU:
 * Triệt tiêu hiện tượng giật (layout shift / jitter) 100%:
 * - Độ dày border cố định, dùng ring-2 cho trạng thái hover/active thay vì đổi border-width.
 * - transition-all duration-300 ease-in-out trên tất cả lựa chọn.
 * - Không thay đổi font-weight khi hover.
 */
export function Mcq3Renderer({
  group,
  answers,
  onAnswerChange,
  isGraded = false,
  gradingDetails = {},
}: Mcq3RendererProps) {
  const hasPassage = Boolean(group.passageText);

  return (
    <div className="space-y-6">
      {/* Bố cục: Nếu có bài đọc dài (Part 4) thì 2 cột, còn lại 1 cột thoáng */}
      <div className={`grid grid-cols-1 ${hasPassage ? "lg:grid-cols-12 gap-8" : "gap-6"} items-start`}>
        {/* Cột Bài đọc (nếu có) */}
        {hasPassage && (
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 sm:p-6 sticky top-20 max-h-[calc(100vh-140px)] overflow-y-auto border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
              <FileText className="w-4 h-4 text-sky-500" />
              <span>Nội dung bài đọc</span>
            </div>
            <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-line space-y-3 font-normal">
              {group.passageText}
            </div>
          </div>
        )}

        {/* Danh sách các câu hỏi trắc nghiệm */}
        <div className={`${hasPassage ? "lg:col-span-7" : "max-w-4xl mx-auto w-full"} space-y-6`}>
          {group.items.map((item) => {
            const currentAns = answers[item.id] || "";
            const grade = gradingDetails[item.id];
            const options = item.options || [];

            return (
              <div key={item.id} className="space-y-3">
                {/* Tiêu đề câu hỏi: Q1. ... */}
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                    <span>Q{item.orderNumber}. </span>
                    <span>{item.prompt}</span>
                  </div>
                  {isGraded && (
                    <div className="shrink-0">
                      {grade?.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </div>
                  )}
                </div>

                {/* Các phương án A, B, C, D (Lưới 2 cột đồng bộ với ảnh mẫu) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  {options.map((opt) => {
                    const isSelected = currentAns === opt.label;
                    const isCorrectAnswer = isGraded && grade?.correctAnswer === opt.label;

                    // Mặc định: thẻ bo góc viền rõ nét có bóng đổ đáy nhẹ giống ảnh mẫu
                    let optionStyle =
                      "border-2 border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-[0_2px_0_0_#e2e8f0] dark:shadow-[0_2px_0_0_#334155] hover:border-sky-400 hover:shadow-[0_2px_0_0_#38bdf8] dark:hover:border-sky-400";

                    // Khi được chọn: viền xanh #0095F6, chữ xanh đậm và bóng đổ đồng màu
                    if (isSelected) {
                      optionStyle =
                        "border-2 border-[#0095F6] dark:border-sky-400 bg-white dark:bg-slate-900 text-[#0095F6] dark:text-sky-400 font-bold shadow-[0_2px_0_0_#0095F6] dark:shadow-[0_2px_0_0_#38bdf8]";
                    }

                    // Trạng thái đã chấm điểm
                    if (isGraded) {
                      if (isCorrectAnswer) {
                        optionStyle =
                          "border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/20 dark:bg-emerald-950/20 shadow-[0_2px_0_0_#10b981]";
                      } else if (isSelected && !grade?.isCorrect) {
                        optionStyle =
                          "border-2 border-rose-500 text-rose-600 dark:text-rose-400 font-bold bg-rose-50/20 dark:bg-rose-950/20 shadow-[0_2px_0_0_#f43f5e] line-through";
                      } else {
                        optionStyle =
                          "border-2 border-slate-200/60 dark:border-slate-800 text-slate-400 opacity-60 shadow-none";
                      }
                    }

                    return (
                      <button
                        key={opt.label}
                        type="button"
                        disabled={isGraded}
                        onClick={() => onAnswerChange(item.id, opt.label)}
                        className={`w-full min-h-[48px] sm:min-h-[50px] px-5 py-3 rounded-2xl text-left text-sm sm:text-base font-semibold transition-all duration-200 ease-in-out flex items-center gap-2 ${optionStyle}`}
                      >
                        <span className="font-bold shrink-0">
                          {opt.label}.
                        </span>
                        <span className="leading-snug">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Phần giải thích chi tiết sau khi nộp */}
                {isGraded && grade && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      Đáp án đúng:{" "}
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {grade.correctAnswer}
                      </span>
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0 text-sky-500 mt-0.5" />
                      <span>{grade.explanation}</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
