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
      {/* Bố cục 2 cột trên Desktop: Trái câu hỏi, Phải kho biển báo A-H (Sticky) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Mobile toggle kho đáp án A-H */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setMobilePoolOpen(!mobilePoolOpen)}
            className="w-full min-h-[44px] flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-300 border border-slate-100 dark:border-slate-800 transition-colors duration-300 ease-in-out"
          >
            <span>Kho biển báo / Lựa chọn (A–H)</span>
            {mobilePoolOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {mobilePoolOpen && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in duration-300">
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
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 text-sm sm:text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-snug">
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

                {/* Các nút chọn đáp án A–H (dùng ring-2 thay vì đổi border để không giật layout) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500 mr-1 font-medium">Chọn:</span>
                  {pool.map((opt) => {
                    const isSelected = currentAns === opt.letter;
                    const isCorrectAnswer = isGraded && grade?.correctAnswer === opt.letter;

                    let btnStyle =
                      "border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-[0_2.5px_0_0_#cbd5e1] dark:shadow-[0_2.5px_0_0_#334155] hover:border-sky-300 dark:hover:border-sky-600 active:translate-y-[1.5px] active:shadow-[0_1px_0_0_#cbd5e1]";

                    if (isSelected) {
                      btnStyle =
                        "border-2 border-[#0095F6] dark:border-sky-400 text-white font-bold bg-[#0095F6] shadow-[0_2.5px_0_0_#0275ba] active:translate-y-[1.5px] active:shadow-[0_1px_0_0_#0275ba]";
                    }

                    if (isGraded) {
                      if (isCorrectAnswer) {
                        btnStyle =
                          "border-2 border-emerald-500 text-white font-bold bg-emerald-500 shadow-[0_2.5px_0_0_#047857]";
                      } else if (isSelected && !grade?.isCorrect) {
                        btnStyle =
                          "border-2 border-rose-400 text-white line-through bg-rose-500 shadow-[0_2.5px_0_0_#c92a2a]";
                      }
                    }

                    return (
                      <button
                        key={opt.letter}
                        type="button"
                        disabled={isGraded}
                        onClick={() => onAnswerChange(item.id, opt.letter)}
                        aria-label={`Câu ${item.orderNumber} chọn ${opt.letter}`}
                        className={`w-9 h-9 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 ease-out flex items-center justify-center cursor-pointer select-none ${btnStyle}`}
                      >
                        {opt.letter}
                      </button>
                    );
                  })}
                </div>

                {/* Phần giải thích chi tiết */}
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

        {/* Cột Kho 8 Biển báo A–H trên Desktop (Sticky) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24 space-y-3">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Kho biển báo / Lựa chọn (A–H)
            </h3>
            <div className="space-y-2.5 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
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

function PoolOptionCard({ option }: { option: MatchPoolOption }) {
  return (
    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-xs flex items-start gap-2.5 transition-all duration-300 ease-in-out hover:shadow-soft">
      <span className="w-6 h-6 shrink-0 flex items-center justify-center font-bold text-xs rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 border border-sky-100 dark:border-sky-900">
        {option.letter}
      </span>
      <div className="flex-1">
        {option.title && (
          <p className="font-bold text-[11px] uppercase tracking-wide text-sky-600 dark:text-sky-400 mb-0.5">
            {option.title}
          </p>
        )}
        <p className="font-medium text-slate-700 dark:text-slate-200 leading-snug">
          {option.text}
        </p>
      </div>
    </div>
  );
}
