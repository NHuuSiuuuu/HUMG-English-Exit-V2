"use client";

import React from "react";
import Link from "next/link";
import type { PracticeGradeResult } from "@/shared/types/practice";
import { CheckCircle2, AlertCircle, ArrowRight, RotateCcw, List } from "lucide-react";

interface PracticeResultBannerProps {
  result: PracticeGradeResult;
  partNo: number;
  skill: string;
  onReset: () => void;
  nextItemId?: string;
}

/**
 * Banner tổng kết kết quả chấm điểm bài luyện tập phong cách TADR OU:
 * Bo tròn lớn rounded-2xl, màu pastel êm dịu, không dùng viền tương phản cao
 */
export function PracticeResultBanner({
  result,
  partNo,
  skill,
  onReset,
  nextItemId,
}: PracticeResultBannerProps) {
  const isPassed = result.scorePercent >= 70;

  return (
    <div
      className={`p-6 rounded-2xl transition-all shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] border ${
        isPassed
          ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-800/60"
          : "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-800/60"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        {/* Kết quả & Nhận xét */}
        <div className="flex items-start gap-3.5">
          {isPassed ? (
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white">
                {result.scorePercent}%
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                Đúng {result.correctCount}/{result.totalQuestions} câu
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {isPassed
                ? "Kết quả rất tốt! Bạn đã nắm chắc kỹ năng và từ vựng của bài luyện này."
                : "Xem lại các câu chưa đúng và đọc phần giải thích chi tiết bên dưới để rút kinh nghiệm nhé."}
            </p>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại</span>
          </button>

          {nextItemId ? (
            <Link
              href={`/on-luyen/${skill}/${partNo}/${nextItemId}`}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#0095F6] hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Bài tiếp theo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href={`/on-luyen/${skill}/${partNo}`}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#0095F6] hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <List className="w-3.5 h-3.5" />
              <span>Về danh sách Part {partNo}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
