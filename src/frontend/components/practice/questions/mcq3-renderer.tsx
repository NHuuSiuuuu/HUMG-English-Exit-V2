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
                  <div className="flex items-start gap-1.5 text-sm sm:text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                    <span className="text-slate-900 dark:text-white font-bold">
                      Q{item.orderNumber}.
                    </span>
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

                {/* Các phương án A, B, C, D (Lưới 2 cột) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {options.map((opt) => {
                    const isSelected = currentAns === opt.label;
                    const isCorrectAnswer = isGraded && grade?.correctAnswer === opt.label;

                    // Giữ border 1px cố định, dùng ring-2 cho hiệu ứng viền để không bao giờ bị giật kích thước vật lý
                    let optionStyle =
                      "border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-400 hover:ring-2 hover:ring-sky-100 dark:hover:ring-sky-950/60 hover:bg-sky-50/20";

                    if (isSelected) {
                      optionStyle =
                        "border-[#0095F6] ring-2 ring-[#0095F6] text-[#0095F6] dark:text-sky-400 bg-sky-50/40 dark:bg-sky-950/30 font-semibold shadow-sm";
                    }

                    if (isGraded) {
                      if (isCorrectAnswer) {
                        optionStyle =
                          "border-emerald-500 ring-2 ring-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/40";
                      } else if (isSelected && !grade?.isCorrect) {
                        optionStyle =
                          "border-rose-400 ring-2 ring-rose-400 text-rose-600 line-through bg-rose-50/30";
                      }
                    }

                    return (
                      <button
                        key={opt.label}
                        type="button"
                        disabled={isGraded}
                        onClick={() => onAnswerChange(item.id, opt.label)}
                        className={`min-h-[44px] px-4 py-2.5 rounded-xl text-left text-xs sm:text-sm transition-all duration-300 ease-in-out flex items-center gap-2.5 ${optionStyle}`}
                      >
                        <span className="font-bold opacity-80 shrink-0">
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
