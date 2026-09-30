"use client";

import React from "react";
import type { QuestionGroupDef } from "@/shared/types/question";
import type { QuestionGradingDetail } from "@/shared/types/practice";
import { CheckCircle2, XCircle, Info, Image as ImageIcon } from "lucide-react";

interface Mcq3ImageRendererProps {
  group: QuestionGroupDef;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  isGraded?: boolean;
  gradingDetails?: Record<string, QuestionGradingDetail>;
}

/**
 * Renderer cho trắc nghiệm chọn tranh (Part 10 Listening)
 * Tuân thủ AGENTS.md: Khung tranh luôn giữ nền sáng kể cả ở Dark Mode để không bị đảo màu hoặc khó nhìn.
 */
export function Mcq3ImageRenderer({
  group,
  answers,
  onAnswerChange,
  isGraded = false,
  gradingDetails = {},
}: Mcq3ImageRendererProps) {
  return (
    <div className="space-y-6">
      {/* Khối hướng dẫn */}
      <div className="bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
          {group.instruction}
        </p>
      </div>

      {/* Danh sách các câu hỏi tranh */}
      <div className="space-y-6">
        {group.items.map((item) => {
          const currentAns = answers[item.id] || "";
          const grade = gradingDetails[item.id];
          const options = item.options || [];

          return (
            <div
              key={item.id}
              className={`p-5 rounded-lg border transition-all ${
                isGraded
                  ? grade?.isCorrect
                    ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                    : "bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800"
                  : "bg-[var(--surface-paper)] border-[var(--border-subtle)]"
              }`}
            >
              {/* Tiêu đề câu hỏi */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-2.5">
                  <span className="font-bold text-sm text-[var(--color-navy)] dark:text-sky-400 min-w-[28px]">
                    {item.orderNumber}.
                  </span>
                  <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">
                    {item.prompt}
                  </p>
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

              {/* Lưới 3 tranh A, B, C */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {options.map((opt) => {
                  const isSelected = currentAns === opt.label;
                  const isCorrectAnswer = isGraded && grade?.correctAnswer === opt.label;

                  let borderClass = "border-slate-300 hover:border-slate-400";
                  if (isSelected) {
                    borderClass = "border-[var(--color-navy)] ring-2 ring-[var(--color-navy)] shadow-md";
                  }
                  if (isGraded) {
                    if (isCorrectAnswer) {
                      borderClass = "border-emerald-600 ring-2 ring-emerald-600 bg-emerald-50";
                    } else if (isSelected && !grade?.isCorrect) {
                      borderClass = "border-rose-600 ring-2 ring-rose-600 opacity-70";
                    }
                  }

                  return (
                    <button
                      key={opt.label}
                      type="button"
                      disabled={isGraded}
                      onClick={() => onAnswerChange(item.id, opt.label)}
                      className={`min-h-[140px] flex flex-col items-center justify-between p-3 rounded-lg text-left transition-all border ${borderClass} bg-white text-slate-900 shadow-sm`}
                      aria-label={`Câu ${item.orderNumber} chọn ${opt.label}`}
                    >
                      {/* Huy hiệu A/B/C */}
                      <div className="w-full flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="w-6 h-6 flex items-center justify-center font-bold text-xs rounded bg-[var(--color-navy)] text-white">
                          {opt.label}
                        </span>
                        {isSelected && !isGraded && (
                          <span className="text-[11px] font-bold text-[var(--color-navy)]">
                            Đã chọn
                          </span>
                        )}
                      </div>

                      {/* Khung tranh minh họa - luôn giữ nền sáng chuẩn AGENTS.md */}
                      <div className="my-2.5 flex flex-col items-center justify-center text-center py-2 px-3 bg-slate-50 rounded border border-dashed border-slate-200 w-full min-h-[64px]">
                        <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="text-xs font-semibold text-slate-800 leading-tight">
                          {opt.text}
                        </span>
                      </div>

                      {/* Nút bấm chọn dưới chân thẻ (Touch Target >= 44px) */}
                      <div className="w-full min-h-[36px] flex items-center justify-center rounded text-xs font-bold bg-slate-100 text-slate-800">
                        Phương án {opt.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Giải thích chi tiết */}
              {isGraded && grade && (
                <div className="mt-4 pt-3 text-xs border-t border-[var(--border-subtle)] space-y-1">
                  <p className="font-semibold text-[var(--text-primary)]">
                    Đáp án đúng:{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {grade.correctAnswer}
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
