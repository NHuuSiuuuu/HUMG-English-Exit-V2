"use client";

import React, { useState } from "react";
import type { QuestionGroupDef, MatchPoolOption } from "@/shared/types/question";
import type { QuestionGradingDetail } from "@/shared/types/practice";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Info } from "lucide-react";

interface MatchPoolRendererProps {
  group: QuestionGroupDef;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  isGraded?: boolean;
  gradingDetails?: Record<string, QuestionGradingDetail>;
}

/**
 * Renderer cho dạng Match Pool (Part 1 Biển báo, Part 11 Nghe nối lý do)
 * Giao diện gồm kho 8 đáp án A–H (sticky desktop, collapsible drawer mobile)
 * và danh sách các câu hỏi nối đáp án.
 */
export function MatchPoolRenderer({
  group,
  answers,
  onAnswerChange,
  isGraded = false,
  gradingDetails = {},
}: MatchPoolRendererProps) {
  const [mobilePoolOpen, setMobilePoolOpen] = useState(false);
  const pool = group.poolOptions || [];

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

      {/* Bố cục 2 cột trên Desktop: Trái câu hỏi, Phải kho biển báo A-H (Sticky) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mobile toggle kho đáp án A-H */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMobilePoolOpen(!mobilePoolOpen)}
            className="w-full min-h-[44px] flex items-center justify-between px-4 py-2.5 bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg text-sm font-semibold text-[var(--color-navy)] dark:text-sky-300"
          >
            <span>Kho biển báo / Lựa chọn (A–H)</span>
            {mobilePoolOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {mobilePoolOpen && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 bg-[var(--surface-bg)] border border-[var(--border-subtle)] rounded-lg">
              {pool.map((opt) => (
                <PoolOptionCard key={opt.letter} option={opt} />
              ))}
            </div>
          )}
        </div>

        {/* Cột danh sách câu hỏi 1 - 5 */}
        <div className="lg:col-span-7 space-y-4">
          {group.items.map((item) => {
            const currentAns = answers[item.id] || "";
            const grade = gradingDetails[item.id];

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
                <div className="flex items-start justify-between gap-3">
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
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      )}
                    </div>
                  )}
                </div>

                {/* Các nút chọn đáp án A–H */}
                <div className="mt-3.5 flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-xs text-[var(--text-secondary)] mr-1">Chọn:</span>
                  {pool.map((opt) => {
                    const isSelected = currentAns === opt.letter;
                    const isCorrectAnswer = isGraded && grade?.correctAnswer === opt.letter;

                    let btnClass = "border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-slate-100 dark:hover:bg-slate-800";
                    if (isSelected) {
                      btnClass = "bg-[var(--color-navy)] text-white font-bold border-[var(--color-navy)] shadow-sm";
                    }
                    if (isGraded) {
                      if (isCorrectAnswer) {
                        btnClass = "bg-emerald-600 text-white font-bold border-emerald-700 shadow";
                      } else if (isSelected && !grade?.isCorrect) {
                        btnClass = "bg-rose-600 text-white line-through font-bold border-rose-700";
                      }
                    }

                    return (
                      <button
                        key={opt.letter}
                        type="button"
                        disabled={isGraded}
                        onClick={() => onAnswerChange(item.id, opt.letter)}
                        aria-label={`Câu ${item.orderNumber} chọn ${opt.letter}`}
                        className={`min-w-[44px] min-h-[44px] rounded font-semibold text-sm transition-all border ${btnClass}`}
                      >
                        {opt.letter}
                      </button>
                    );
                  })}
                </div>

                {/* Phần giải thích chi tiết khi đã nộp bài */}
                {isGraded && grade && (
                  <div className="mt-3 pt-2 text-xs border-t border-[var(--border-subtle)] space-y-1">
                    <p className="font-semibold text-[var(--text-primary)]">
                      Đáp án đúng: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{grade.correctAnswer}</span>
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

        {/* Cột Kho 8 Biển báo A–H trên Desktop (Sticky) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24 space-y-3">
          <div className="p-3 bg-[var(--surface-paper)] border border-[var(--border-subtle)] rounded-lg shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2.5">
              Kho biển báo / Lựa chọn (A–H)
            </h3>
            <div className="space-y-2 max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
              {pool.map((opt) => (
                <PoolOptionCard key={opt.letter} option={opt} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Thẻ hiển thị biển báo chuẩn: khung viền rõ, chữ đậm, giữ tương phản cao
 */
function PoolOptionCard({ option }: { option: MatchPoolOption }) {
  return (
    <div className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--surface-bg)] text-xs flex items-start gap-2.5">
      <span className="w-6 h-6 shrink-0 flex items-center justify-center font-bold text-xs rounded bg-[var(--color-navy)] text-white">
        {option.letter}
      </span>
      <div className="flex-1">
        {option.title && (
          <p className="font-bold text-[11px] tracking-wide uppercase text-[var(--color-navy)] dark:text-sky-300">
            {option.title}
          </p>
        )}
        <p className="font-medium text-[var(--text-primary)] leading-snug mt-0.5">
          {option.text}
        </p>
      </div>
    </div>
  );
}
