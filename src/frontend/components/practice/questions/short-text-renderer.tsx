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
 * Renderer cho dạng Điền từ ngắn (Part 6, 7, 8, 13, 14) phong cách TADR OU:
 * Input thanh thoát bo góc rounded-xl, không viền nặng, gợi ý dạng pill dịu mắt
 */
export function ShortTextRenderer({
  group,
  answers,
  onAnswerChange,
  isGraded = false,
  gradingDetails = {},
}: ShortTextRendererProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {group.items.map((item) => {
        const currentAns = answers[item.id] || "";
        const grade = gradingDetails[item.id];
        const hasSpellingHint = item.firstLetterHint && item.charCountHint;

        const remainingUnderscores = hasSpellingHint
          ? Array(Math.max(0, (item.charCountHint || 1) - 1))
              .fill("_")
              .join(" ")
          : "";

        return (
          <div
            key={item.id}
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 text-sm sm:text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                <span className="text-slate-900 dark:text-white font-bold">
                  Q{item.orderNumber}.
                </span>
                <div>
                  {item.formFieldLabel && (
                    <span className="font-bold text-xs uppercase tracking-wide text-sky-600 dark:text-sky-400 block mb-0.5">
                      {item.formFieldLabel}
                    </span>
                  )}
                  <span>{item.prompt}</span>
                </div>
              </div>
              {isGraded && (
                <div className="shrink-0">
                  {grade?.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500" />
                  )}
                </div>
              )}
            </div>

            {/* Gợi ý chính tả Part 6 */}
            {hasSpellingHint && (
              <div className="flex items-center gap-2 text-xs font-mono bg-sky-50/50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 px-3 py-1.5 rounded-xl border border-sky-100 dark:border-sky-900/50 w-fit">
                <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                <span>
                  Gợi ý:{" "}
                  <strong className="font-bold text-sm">
                    {item.firstLetterHint} {remainingUnderscores}
                  </strong>{" "}
                  ({item.charCountHint} ký tự)
                </span>
              </div>
            )}

            {/* Ô nhập câu trả lời bo góc rounded-xl */}
            <div className="relative max-w-md">
              <input
                type="text"
                value={currentAns}
                disabled={isGraded}
                onChange={(e) => onAnswerChange(item.id, e.target.value)}
                placeholder={
                  hasSpellingHint
                    ? `Bắt đầu bằng '${item.firstLetterHint}'...`
                    : "Nhập câu trả lời..."
                }
                className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-sm transition-all outline-none ${
                  isGraded
                    ? grade?.isCorrect
                      ? "bg-emerald-50/40 border-2 border-emerald-500 text-emerald-700 font-semibold"
                      : "bg-rose-50/40 border-2 border-rose-400 text-rose-700"
                    : "bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:bg-white focus:border-[#0095F6] focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-950/40"
                }`}
              />
              {hasSpellingHint && currentAns.length > 0 && !isGraded && (
                <span className="absolute right-3.5 top-3 text-[11px] font-semibold text-slate-400">
                  {currentAns.trim().length}/{item.charCountHint}
                </span>
              )}
            </div>

            {/* Lời giải thích */}
            {isGraded && grade && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  Đáp án đúng:{" "}
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {Array.isArray(grade.correctAnswer)
                      ? grade.correctAnswer.join(" / ")
                      : grade.correctAnswer}
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
  );
}
