"use client";

import React from "react";
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

export function ClozeMcqRenderer({
  group,
  answers,
  onAnswerChange,
  isGraded = false,
  gradingDetails = {},
}: ClozeMcqRendererProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cột Đoạn văn (Sticky trên Desktop) */}
        <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 sm:p-6 sticky top-20 max-h-[calc(100vh-140px)] overflow-y-auto border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
            <BookOpen className="w-4 h-4 text-sky-500" />
            <span>Đoạn văn điền khuyết</span>
          </div>
          <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-normal whitespace-pre-line space-y-3">
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

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-2.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    <span className="text-slate-900 dark:text-white font-bold">
                      Câu {item.orderNumber}:
                    </span>
                    <span className="text-xs text-slate-400 font-normal">Chọn từ thích hợp</span>
                  </div>
                  {isGraded && (
                    <div>
                      {grade?.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </div>
                  )}
                </div>

                {/* Các lựa chọn A, B, C (dùng ring-2 để không giật layout) */}
                <div className="grid grid-cols-3 gap-2">
                  {options.map((opt) => {
                    const isSelected = currentAns === opt.label;
                    const isCorrectAnswer = isGraded && grade?.correctAnswer === opt.label;

                    let btnStyle =
                      "border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-400 hover:ring-2 hover:ring-sky-100 dark:hover:ring-sky-950/60 hover:bg-sky-50/20";

                    if (isSelected) {
                      btnStyle =
                        "border-[#0095F6] ring-2 ring-[#0095F6] text-[#0095F6] dark:text-sky-400 font-bold bg-sky-50/40 dark:bg-sky-950/30 shadow-sm";
                    }

                    if (isGraded) {
                      if (isCorrectAnswer) {
                        btnStyle =
                          "border-emerald-500 ring-2 ring-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/40";
                      } else if (isSelected && !grade?.isCorrect) {
                        btnStyle =
                          "border-rose-400 ring-2 ring-rose-400 text-rose-600 line-through bg-rose-50/30";
                      }
                    }

                    return (
                      <button
                        key={opt.label}
                        type="button"
                        disabled={isGraded}
                        onClick={() => onAnswerChange(item.id, opt.label)}
                        className={`min-h-[44px] px-2 py-2 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${btnStyle}`}
                      >
                        <span className="text-[11px] opacity-75 font-semibold">{opt.label}</span>
                        <span className="text-xs sm:text-sm font-semibold truncate max-w-full">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Lời giải thích */}
                {isGraded && grade && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
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
