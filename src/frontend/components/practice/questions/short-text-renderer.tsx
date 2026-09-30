"use client";

import React from "react";
import type { QuestionGroupDef } from "@/shared/types/question";
import type { QuestionGradingDetail } from "@/shared/types/practice";
import { CheckCircle2, XCircle, Info, HelpCircle } from "lucide-react";

interface ShortTextRendererProps {
  group: QuestionGroupDef;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  isGraded?: boolean;
  gradingDetails?: Record<string, QuestionGradingDetail>;
}

/**
 * Renderer cho dạng Điền từ ngắn (Part 6 Đoán từ vựng, Part 7 Điền từ, Part 8, 13, 14 Biểu mẫu thông tin)
 */
export function ShortTextRenderer({
  group,
  answers,
  onAnswerChange,
  isGraded = false,
  gradingDetails = {},
}: ShortTextRendererProps) {
  const isPart6Spelling = group.items.some((it) => it.firstLetterHint && it.charCountHint);

  return (
    <div className="space-y-6">
      {/* Khối hướng dẫn và ví dụ câu 0 */}
      <div className="bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
          {group.instruction}
        </p>
        {group.example && (
          <div className="bg-[var(--surface-bg)] border border-[var(--border-subtle)] rounded p-3 text-sm flex items-start gap-2.5">
            <span className="font-bold text-[var(--color-navy)] bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-[var(--border-subtle)]">
              Ví dụ 0:
            </span>
            <div className="flex-1">
              <span className="text-[var(--text-primary)]">{group.example.question}</span>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  Đáp án: {group.example.correctAnswer} ✓
                </span>
                <span className="text-[var(--text-secondary)]">{group.example.explanation}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Danh sách câu hỏi */}
      <div className="max-w-3xl space-y-4">
        {group.items.map((item) => {
          const currentAns = answers[item.id] || "";
          const grade = gradingDetails[item.id];
          const hasSpellingHint = item.firstLetterHint && item.charCountHint;

          // Tạo chuỗi gạch dưới hiển thị gợi ý độ dài từ (Part 6)
          const remainingUnderscores = hasSpellingHint
            ? Array(Math.max(0, (item.charCountHint || 1) - 1))
                .fill("_")
                .join(" ")
            : "";

          return (
            <div
              key={item.id}
              className={`p-4 rounded-lg border transition-all ${
                isGraded
                  ? grade?.isCorrect
                    ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                    : "bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800"
                  : "bg-[var(--surface-paper)] border-[var(--border-subtle)] hover:border-slate-400"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="font-bold text-sm text-[var(--color-navy)] dark:text-sky-400 min-w-[28px]">
                    {item.orderNumber}.
                  </span>
                  <div>
                    {item.formFieldLabel && (
                      <span className="font-bold text-xs uppercase text-[var(--color-navy)] dark:text-sky-300 block mb-1">
                        {item.formFieldLabel}
                      </span>
                    )}
                    <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">
                      {item.prompt}
                    </p>
                  </div>
                </div>
                {isGraded && (
                  <div>
                    {grade?.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                  </div>
                )}
              </div>

              {/* Gợi ý chính tả Part 6 */}
              {hasSpellingHint && (
                <div className="mb-2.5 flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono bg-[var(--surface-bg)] px-3 py-1.5 rounded border border-[var(--border-subtle)] w-fit">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                  <span>
                    Gợi ý:{" "}
                    <strong className="text-[var(--color-navy)] dark:text-sky-300 font-bold text-sm">
                      {item.firstLetterHint} {remainingUnderscores}
                    </strong>{" "}
                    ({item.charCountHint} chữ cái)
                  </span>
                </div>
              )}

              {/* Ô nhập câu trả lời (min-height >= 44px) */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={currentAns}
                    disabled={isGraded}
                    onChange={(e) => onAnswerChange(item.id, e.target.value)}
                    placeholder={
                      hasSpellingHint
                        ? `Bắt đầu bằng '${item.firstLetterHint}'...`
                        : "Nhập câu trả lời của bạn..."
                    }
                    className={`w-full min-h-[44px] px-3.5 py-2 rounded border text-sm font-medium transition-all outline-none ${
                      isGraded
                        ? grade?.isCorrect
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200"
                          : "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200"
                        : "bg-[var(--surface-bg)] border-[var(--border-subtle)] text-[var(--text-primary)] focus:border-[var(--color-navy)] focus:ring-1 focus:ring-[var(--color-navy)]"
                    }`}
                  />
                  {hasSpellingHint && currentAns.length > 0 && !isGraded && (
                    <span className="absolute right-3 top-3 text-[11px] font-semibold text-[var(--text-secondary)]">
                      {currentAns.trim().length}/{item.charCountHint}
                    </span>
                  )}
                </div>
              </div>

              {/* Lời giải thích khi đã chấm điểm */}
              {isGraded && grade && (
                <div className="mt-3.5 pt-2.5 text-xs border-t border-[var(--border-subtle)] space-y-1">
                  <p className="font-semibold text-[var(--text-primary)]">
                    Đáp án đúng:{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {Array.isArray(grade.correctAnswer)
                        ? grade.correctAnswer.join(" / ")
                        : grade.correctAnswer}
                    </span>
                  </p>
                  <p className="text-[var(--text-secondary)] leading-relaxed flex items-start gap-1.5">
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
  );
}
