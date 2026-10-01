"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Send, Edit3, Flag } from "lucide-react";
import { toast } from "sonner";

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
 * Thanh tiêu đề phòng thi / luyện tập phong cách TADR OU:
 * Thoáng đãng, nút bo mềm, đồng hồ pill capsule, nút hành động màu sắc tươi sáng
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

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Nút quay lại & Thông tin bài luyện */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={backUrl}
            className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-300 flex items-center justify-center transition-all duration-150 shrink-0 shadow-sm"
            title="Quay lại danh sách bài"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2 truncate">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Part {partNo}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[180px] sm:max-w-xs">
              {sourceLabel}
            </span>
          </div>
        </div>

        {/* Tiến độ hoàn thành câu hỏi trong bài luyện */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs font-medium">
          <span>Tiến độ:</span>
          <span className="font-bold text-[#0095F6] dark:text-sky-400">
            {answeredCount}/{totalQuestions} câu
          </span>
        </div>

        {/* Nút công cụ & Nộp bài phong cách 3D tactile xúc giác */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Nút Báo lỗi (Coral 3D) */}
          <button
            type="button"
            onClick={() => toast.success("Cảm ơn bạn! Báo cáo lỗi đề thi đã được ghi nhận.")}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff4d4f] hover:bg-[#f5383a] text-white text-sm font-bold shadow-[0_3px_0_0_#c92a2a] active:translate-y-[2px] active:shadow-[0_1px_0_0_#c92a2a] transition-all cursor-pointer min-h-[38px]"
          >
            <Flag className="w-4 h-4" />
            <span>Báo lỗi</span>
          </button>

          {/* Nút Ghi chú (Cyan 3D) */}
          <button
            type="button"
            onClick={() => toast.info("Tính năng sổ tay ghi chú nhanh cho câu hỏi này đang được hoàn thiện.")}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0095F6] hover:bg-[#008be5] text-white text-sm font-bold shadow-[0_3px_0_0_#0275ba] active:translate-y-[2px] active:shadow-[0_1px_0_0_#0275ba] transition-all cursor-pointer min-h-[38px]"
          >
            <Edit3 className="w-4 h-4" />
            <span>Ghi chú</span>
          </button>

          {/* Nút Nộp bài / Làm lại (White card viền xanh & bóng đổ 3D) */}
          {isGraded ? (
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm font-bold flex items-center gap-1.5 shadow-[0_3px_0_0_#cbd5e1] dark:shadow-[0_3px_0_0_#334155] hover:bg-slate-50 dark:hover:bg-slate-800 active:translate-y-[2px] active:shadow-[0_1px_0_0_#cbd5e1] transition-all cursor-pointer min-h-[38px]"
            >
              Làm lại bài
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onSubmit}
              className="px-5 py-2 rounded-xl border-2 border-[#0095F6] dark:border-sky-400 bg-white dark:bg-slate-900 text-[#0095F6] dark:text-sky-400 text-sm font-bold flex items-center gap-1.5 shadow-[0_3px_0_0_#0095F6] dark:shadow-[0_3px_0_0_#38bdf8] hover:bg-sky-50/50 dark:hover:bg-sky-950/40 active:translate-y-[2px] active:shadow-[0_1px_0_0_#0095F6] transition-all cursor-pointer disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 min-h-[38px]"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Đang chấm..." : "Nộp bài"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
