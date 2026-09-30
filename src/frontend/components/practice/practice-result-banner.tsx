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
 * Banner tổng kết kết quả chấm điểm bài luyện tập
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
      className={`p-5 rounded-lg border transition-all ${
        isPassed
          ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
          : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Kết quả & Lời nhận xét */}
        <div className="flex items-start gap-3.5">
          {isPassed ? (
            <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-extrabold text-[var(--text-primary)]">
                Điểm số: {result.scorePercent}%
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-[var(--color-navy)] dark:text-sky-300 border border-[var(--border-subtle)]">
                Đúng {result.correctCount}/{result.totalQuestions} câu
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {isPassed
                ? "Kết quả rất tốt! Bạn đã nắm chắc kỹ năng và từ vựng của bài luyện này."
                : "Cố gắng lên nhé! Xem kỹ các câu sai và đọc phần giải thích chi tiết bên dưới để rút kinh nghiệm."}
            </p>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="min-h-[44px] px-3.5 py-2 rounded-lg border border-[var(--border-subtle)] hover:bg-white dark:hover:bg-slate-800 text-[var(--text-primary)] font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại</span>
          </button>

          {nextItemId ? (
            <Link
              href={`/on-luyen/${skill}/${partNo}/${nextItemId}`}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-[var(--color-navy)] hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Bài tiếp theo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href={`/on-luyen/${skill}/${partNo}`}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-[var(--color-navy)] hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
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
