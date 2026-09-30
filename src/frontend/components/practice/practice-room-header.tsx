"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Check, Send } from "lucide-react";

interface PracticeRoomHeaderProps {
  title: string;
  sourceLabel: string;
  partNo: number;
  skill: string;
  answeredCount: number;
  totalQuestions: number;
  isGraded: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  onReset: () => void;
}

/**
 * Thanh tiêu đề phòng luyện tập: Điều hướng, hiển thị số câu đã làm, nút nộp bài
 */
export function PracticeRoomHeader({
  title,
  sourceLabel,
  partNo,
  skill,
  answeredCount,
  totalQuestions,
  isGraded,
  isSubmitting,
  onSubmit,
  onReset,
}: PracticeRoomHeaderProps) {
  const backUrl = `/on-luyen/${skill}/${partNo}`;
  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0;

  return (
    <div className="bg-[var(--surface-paper)] border-b border-[var(--border-subtle)] sticky top-16 z-20 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Nút quay lại & thông tin bài */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={backUrl}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-[var(--border-subtle)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-primary)] transition-all shrink-0"
            title="Quay lại danh sách bài"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[var(--color-navy)] text-white">
                Part {partNo}
              </span>
              <span className="text-xs font-semibold text-[var(--text-secondary)]">
                {sourceLabel}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-[var(--text-primary)] truncate mt-0.5">
              {title}
            </h1>
          </div>
        </div>

        {/* Trạng thái làm bài & Nút nộp / làm lại */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end text-xs">
            <span className="text-[var(--text-secondary)]">Tiến độ làm bài</span>
            <span className="font-bold text-[var(--text-primary)]">
              {answeredCount} / {totalQuestions} câu
            </span>
          </div>

          {isGraded ? (
            <button
              type="button"
              onClick={onReset}
              className="min-h-[44px] px-4 py-2 rounded-lg border border-[var(--border-subtle)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-primary)] font-bold text-xs sm:text-sm transition-all"
            >
              Làm lại bài này
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onSubmit}
              className={`min-h-[44px] px-5 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 text-white shadow-sm transition-all ${
                allAnswered
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-[var(--color-navy)] hover:opacity-95"
              }`}
            >
              {isSubmitting ? (
                <span>Đang chấm...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Nộp bài & Chấm điểm</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
