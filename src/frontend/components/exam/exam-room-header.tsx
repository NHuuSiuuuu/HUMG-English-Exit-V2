"use client";

import React from "react";
import Link from "next/link";
import { Clock, Send, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

interface ExamRoomHeaderProps {
  examTitle: string;
  examCode: string;
  remainingSeconds: number;
  answeredCount: number;
  totalQuestions: number;
  isSaving: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

/**
 * Header cố định cho phòng thi thử mô phỏng 60 phút
 * Đồng hồ đếm ngược server-synchronized, hiển thị tiến độ và nút Nộp bài 3D xúc giác
 */
export function ExamRoomHeader({
  examTitle,
  examCode,
  remainingSeconds,
  answeredCount,
  totalQuestions,
  isSaving,
  isSubmitting,
  onSubmit,
}: ExamRoomHeaderProps) {
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const formattedTime =
    hours > 0
      ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      : `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const isUrgent = remainingSeconds > 0 && remainingSeconds <= 300; // Còn dưới 5 phút

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3">
        {/* Thông tin đề thi */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/thi-thu"
            className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Thoát ra danh sách đề"
          >
            ← Thoát
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-[#0095F6]/10 text-[#0095F6] dark:bg-[#0095F6]/20">
                {examCode}
              </span>
              <span className="hidden sm:inline-block text-xs font-medium text-slate-400">
                Thi thử chuẩn đầu ra
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {examTitle}
            </h1>
          </div>
        </div>

        {/* Khối giữa: Đồng hồ đếm ngược server & Autosave */}
        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
          {/* Trạng thái tự động lưu */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0095F6]" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Đã lưu bài</span>
              </>
            )}
          </div>

          {/* Đồng hồ đếm ngược */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl border transition-all ${
              isUrgent
                ? "bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400 animate-pulse"
                : "bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100"
            }`}
          >
            {isUrgent ? (
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 animate-bounce" />
            ) : (
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#0095F6]" />
            )}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 leading-none">
                Thời gian
              </span>
              <span className="text-sm sm:text-lg font-black font-mono tracking-tight leading-none mt-0.5">
                {formattedTime}
              </span>
            </div>
          </div>

          {/* Tiến độ số câu */}
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-[11px] font-medium text-slate-400">Tiến độ</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              <span className="text-[#0095F6]">{answeredCount}</span> / {totalQuestions} câu
            </span>
          </div>

          {/* Nút nộp bài phong cách 3D xúc giác */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onSubmit}
            className="px-4 sm:px-6 py-2 rounded-xl bg-[#0095F6] hover:bg-[#008be5] text-white text-sm sm:text-base font-bold flex items-center gap-2 shadow-[0_3.5px_0_0_#0275ba] active:translate-y-[2px] active:shadow-[0_1px_0_0_#0275ba] transition-all cursor-pointer min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang nộp...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Nộp bài</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
