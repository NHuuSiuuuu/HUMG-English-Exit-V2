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

export function Mcq3ImageRenderer({
  group,
  answers,
  onAnswerChange,
  isGraded = false,
  gradingDetails = {},
}: Mcq3ImageRendererProps) {
  return (
    <div className="space-y-6">
      {group.items.map((item) => {
        const currentAns = answers[item.id] || "";
        const grade = gradingDetails[item.id];
        const options = item.options || [];

        return (
          <div key={item.id} className="space-y-3.5">
            {/* Tiêu đề câu hỏi */}
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
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500" />
                  )}
                </div>
              )}
            </div>

            {/* Lưới 3 tranh A, B, C */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {options.map((opt) => {
                const isSelected = currentAns === opt.label;
                const isCorrectAnswer = isGraded && grade?.correctAnswer === opt.label;

                let cardStyle =
                  "border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-[0_3px_0_0_#e2e8f0] dark:shadow-[0_3px_0_0_#1e293b] hover:border-sky-300 dark:hover:border-sky-700 active:translate-y-[2px] active:shadow-[0_1px_0_0_#e2e8f0]";

                if (isSelected) {
                  cardStyle =
                    "border-2 border-[#0095F6] dark:border-sky-400 bg-sky-50/40 dark:bg-sky-950/30 text-[#0095F6] dark:text-sky-400 shadow-[0_3.5px_0_0_#0095F6] dark:shadow-[0_3.5px_0_0_#38bdf8] font-bold";
                }

                if (isGraded) {
                  if (isCorrectAnswer) {
                    cardStyle =
                      "border-2 border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 shadow-[0_3.5px_0_0_#10b981] dark:shadow-[0_3.5px_0_0_#059669]";
                  } else if (isSelected && !grade?.isCorrect) {
                    cardStyle =
                      "border-2 border-rose-400 text-rose-600 line-through bg-rose-50/30 shadow-[0_3px_0_0_#f43f5e]";
                  }
                }

                return (
                  <button
                    key={opt.label}
                    type="button"
                    disabled={isGraded}
                    onClick={() => onAnswerChange(item.id, opt.label)}
                    className={`p-3.5 rounded-2xl text-left transition-all duration-150 ease-out flex flex-col justify-between min-h-[140px] cursor-pointer select-none ${cardStyle}`}
                    aria-label={`Câu ${item.orderNumber} chọn ${opt.label}`}
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                        {opt.label}
                      </span>
                      {isSelected && !isGraded && (
                        <span className="text-[11px] font-semibold text-[#0095F6] dark:text-sky-400">
                          Đã chọn
                        </span>
                      )}
                    </div>

                    <div className="my-3 flex flex-col items-center justify-center text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 w-full min-h-[64px]">
                      <ImageIcon className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-xs font-medium leading-tight">
                        {opt.text}
                      </span>
                    </div>

                    <div className="w-full text-center text-xs font-semibold py-1 rounded-lg bg-slate-100/60 dark:bg-slate-800/60">
                      Phương án {opt.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Giải thích chi tiết */}
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
  );
}
