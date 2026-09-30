"use client";

import React, { useState } from "react";
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
 * Renderer cho trắc nghiệm 3 lựa chọn (A/B/C hoặc Right/Wrong/Doesn't say)
 * Hỗ trợ bài đọc dài (Part 4) và câu hỏi đơn lẻ (Part 2, 3, 12)
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

      {/* Bố cục: Nếu có bài đọc thì 2 cột, không thì 1 cột */}
      <div className={`grid grid-cols-1 ${hasPassage ? "lg:grid-cols-12" : ""} gap-6 items-start`}>
        {hasPassage && (
          <div className="lg:col-span-6 bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg p-5 sticky top-24 max-h-[calc(100vh-140px)] overflow-y-auto">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3 pb-2 border-b border-[var(--border-subtle)]">
              <FileText className="w-4 h-4 text-sky-500" />
              <span>Nội dung bài đọc (Reading Passage)</span>
            </div>
            <div className="text-sm leading-relaxed text-[var(--text-primary)] whitespace-pre-line space-y-3 font-normal">
              {group.passageText}
            </div>
          </div>
        )}

        {/* Danh sách câu hỏi MCQ3 */}
        <div className={`${hasPassage ? "lg:col-span-6" : "max-w-3xl"} space-y-4`}>
          {group.items.map((item) => {
            const currentAns = answers[item.id] || "";
            const grade = gradingDetails[item.id];
            const options = item.options || [];

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
                <div className="flex items-start justify-between gap-3 mb-3">
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

                {/* Các phương án A, B, C */}
                <div className="space-y-2">
                  {options.map((opt) => {
                    const isSelected = currentAns === opt.label;
                    const isCorrectAnswer = isGraded && grade?.correctAnswer === opt.label;

                    let cardClass =
                      "border-[var(--border-subtle)] bg-[var(--surface-bg)] hover:bg-slate-100 dark:hover:bg-slate-800/80";
                    let badgeClass = "bg-slate-200 dark:bg-slate-700 text-[var(--text-primary)]";

                    if (isSelected) {
                      cardClass =
                        "border-[var(--color-navy)] bg-sky-50/60 dark:bg-sky-950/40 ring-1 ring-[var(--color-navy)]";
                      badgeClass = "bg-[var(--color-navy)] text-white";
                    }

                    if (isGraded) {
                      if (isCorrectAnswer) {
                        cardClass =
                          "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 ring-1 ring-emerald-500";
                        badgeClass = "bg-emerald-600 text-white";
                      } else if (isSelected && !grade?.isCorrect) {
                        cardClass =
                          "border-rose-500 bg-rose-50 dark:bg-rose-950/50 line-through opacity-80";
                        badgeClass = "bg-rose-600 text-white";
                      }
                    }

                    return (
                      <label
                        key={opt.label}
                        className={`min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded border cursor-pointer transition-all ${cardClass}`}
                      >
                        <input
                          type="radio"
                          name={`question-${item.id}`}
                          value={opt.label}
                          checked={isSelected}
                          disabled={isGraded}
                          onChange={() => onAnswerChange(item.id, opt.label)}
                          className="sr-only"
                        />
                        <span
                          className={`w-6 h-6 shrink-0 flex items-center justify-center font-bold text-xs rounded transition-colors ${badgeClass}`}
                        >
                          {opt.label}
                        </span>
                        <span className="text-sm text-[var(--text-primary)] font-medium leading-snug">
                          {opt.text}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Phần giải thích chi tiết */}
                {isGraded && grade && (
                  <div className="mt-3.5 pt-2.5 text-xs border-t border-[var(--border-subtle)] space-y-1">
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
