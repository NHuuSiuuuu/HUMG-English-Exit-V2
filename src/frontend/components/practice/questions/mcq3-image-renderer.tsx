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
 * Renderer trắc nghiệm chọn tranh (Part 10 Listening) phong cách TADR OU:
 * Khung tranh sáng sủa, bo góc rounded-2xl, viền siêu nhẹ mượt mà
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
                  "border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:border-sky-300 hover:bg-sky-50/20";

                if (isSelected) {
                  cardStyle =
                    "border-2 border-[#0095F6] text-[#0095F6] dark:text-sky-400 bg-sky-50/30 dark:bg-sky-950/20 shadow-sm";
                }

                if (isGraded) {
                  if (isCorrectAnswer) {
                    cardStyle =
                      "border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/40";
                  } else if (isSelected && !grade?.isCorrect) {
                    cardStyle =
                      "border-2 border-rose-400 text-rose-600 line-through bg-rose-50/30";
                  }
                }

                return (
                  <button
                    key={opt.label}
                    type="button"
                    disabled={isGraded}
                    onClick={() => onAnswerChange(item.id, opt.label)}
                    className={`p-3.5 rounded-2xl text-left transition-all flex flex-col justify-between min-h-[140px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] ${cardStyle}`}
                    aria-label={`Câu ${item.orderNumber} chọn ${opt.label}`}
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                        {opt.label}
                      </span>
                      {isSelected && !isGraded && (
                        <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
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
