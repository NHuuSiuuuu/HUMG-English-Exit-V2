"use client";

import React, { useState } from "react";
import type { QuestionGroupDef } from "@/shared/types/question";
import type { QuestionGradingDetail } from "@/shared/types/practice";
import { CheckCircle2, XCircle, Info, BookOpen } from "lucide-react";

interface ClozeMcqRendererProps {
  group: QuestionGroupDef;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  isGraded?: boolean;
  gradingDetails?: Record<string, QuestionGradingDetail>;
}

/**
 * Renderer cho dạng Cloze MCQ (Part 5 Điền đoạn văn khuyết 8 chỗ)
 */
export function ClozeMcqRenderer({
  group,
  answers,
  onAnswerChange,
  isGraded = false,
  gradingDetails = {},
}: ClozeMcqRendererProps) {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Khối hướng dẫn */}
      <div className="bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
          {group.instruction}
        </p>
      </div>

      {/* Bố cục 2 cột: Cột trái đoạn văn, Cột phải các câu hỏi điền từ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột Đoạn văn (Sticky trên Desktop) */}
        <div className="lg:col-span-6 bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg p-5 sticky top-24 max-h-[calc(100vh-140px)] overflow-y-auto shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3 pb-2 border-b border-[var(--border-subtle)]">
            <BookOpen className="w-4 h-4 text-sky-500" />
            <span>Đoạn văn hoàn chỉnh (Cloze Passage)</span>
          </div>
          <div className="text-sm leading-relaxed text-[var(--text-primary)] font-normal whitespace-pre-line space-y-3">
            {group.passageText ||
              "London is one of the most exciting cities in the world. Every year, millions of tourists visit London to see its famous museums and historic buildings..."}
          </div>
        </div>

        {/* Cột danh sách các câu hỏi điền từ A/B/C */}
        <div className="lg:col-span-6 space-y-4">
          {group.items.map((item) => {
            const currentAns = answers[item.id] || "";
            const grade = gradingDetails[item.id];
            const options = item.options || [];
            const isActive = activeQuestionId === item.id;

            return (
              <div
                key={item.id}
                id={`question-${item.id}`}
                onFocus={() => setActiveQuestionId(item.id)}
                className={`p-4 rounded-lg border transition-all ${
                  isGraded
                    ? grade?.isCorrect
                      ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                      : "bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800"
                    : isActive
                    ? "bg-[var(--surface-paper)] border-[var(--color-navy)] ring-1 ring-[var(--color-navy)]"
                    : "bg-[var(--surface-paper)] border-[var(--border-subtle)]"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-[var(--color-navy)] dark:text-sky-400 min-w-[28px]">
                      Câu {item.orderNumber}:
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">Chọn từ thích hợp:</span>
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

                {/* Các lựa chọn A, B, C */}
                <div className="grid grid-cols-3 gap-2">
                  {options.map((opt) => {
                    const isSelected = currentAns === opt.label;
                    const isCorrectAnswer = isGraded && grade?.correctAnswer === opt.label;

                    let btnClass =
                      "border-[var(--border-subtle)] bg-[var(--surface-bg)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-primary)]";
                    if (isSelected) {
                      btnClass =
                        "bg-[var(--color-navy)] text-white font-bold border-[var(--color-navy)] shadow-sm";
                    }
                    if (isGraded) {
                      if (isCorrectAnswer) {
                        btnClass = "bg-emerald-600 text-white font-bold border-emerald-700";
                      } else if (isSelected && !grade?.isCorrect) {
                        btnClass = "bg-rose-600 text-white line-through font-bold border-rose-700";
                      }
                    }

                    return (
                      <button
                        key={opt.label}
                        type="button"
                        disabled={isGraded}
                        onClick={() => onAnswerChange(item.id, opt.label)}
                        className={`min-h-[44px] px-2 py-2 rounded border flex flex-col items-center justify-center transition-all ${btnClass}`}
                      >
                        <span className="text-xs opacity-75 font-semibold">{opt.label}</span>
                        <span className="text-sm font-bold truncate max-w-full">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Lời giải thích */}
                {isGraded && grade && (
                  <div className="mt-3 pt-2 text-xs border-t border-[var(--border-subtle)] space-y-1">
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
    </div>
  );
}
