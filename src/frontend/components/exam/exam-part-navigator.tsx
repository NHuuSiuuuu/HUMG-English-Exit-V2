"use client";

import React from "react";
import type { PartForExamRoom } from "@/shared/types/attempt";

interface ExamPartNavigatorProps {
  parts: PartForExamRoom[];
  answers: Record<string, string>;
  activePartNo: number;
  onSelectPart: (partNo: number) => void;
}

/**
 * Thanh điều hướng nhanh 14 phần trong phòng thi
 * Cho phép thí sinh nhảy trực tiếp đến bất kỳ Part nào và xem trạng thái đã trả lời
 */
export function ExamPartNavigator({
  parts,
  answers,
  activePartNo,
  onSelectPart,
}: ExamPartNavigatorProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0095F6]" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Điều hướng nhanh 14 phần
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Đã làm
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
            Chưa làm
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pt-3 pb-1 scrollbar-thin">
        {parts.map((p) => {
          const questions = p.questionGroup.questions;
          const totalQ = questions.length;
          const answeredQ = questions.filter(
            (q) => (answers[q.id] || "").trim().length > 0
          ).length;

          const isFullyAnswered = totalQ > 0 && answeredQ >= totalQ;
          const isPartiallyAnswered = answeredQ > 0 && answeredQ < totalQ;
          const isActive = activePartNo === p.partNo;
          const isListening = p.partNo >= 10;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPart(p.partNo)}
              className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[48px] sm:min-w-[54px] py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isActive
                  ? "bg-[#0095F6] text-white border-[#0095F6] shadow-sm scale-105"
                  : isFullyAnswered
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  : isPartiallyAnswered
                  ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-800"
              }`}
            >
              <span className="text-[11px] sm:text-xs">P{p.partNo}</span>
              <span
                className={`text-[9px] sm:text-[10px] font-medium mt-0.5 ${
                  isActive ? "text-white/90" : "opacity-75"
                }`}
              >
                {answeredQ}/{totalQ}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
