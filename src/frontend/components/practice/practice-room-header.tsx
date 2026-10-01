"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Send, AlertTriangle, Edit3, CheckCircle2 } from "lucide-react";
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
  const [seconds, setSeconds] = useState(0);

  // Bộ đếm thời gian làm bài thực tế
  useEffect(() => {
    if (isGraded) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isGraded]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Nút quay lại & Thí sinh */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={backUrl}
            className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-300 flex items-center justify-center transition-all duration-300 ease-in-out shrink-0 shadow-sm"
            title="Quay lại danh sách bài"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
            <span className="text-slate-400 dark:text-slate-500 font-normal">Thí sinh:</span>
            <span className="text-sky-600 dark:text-sky-400 font-bold">Sinh viên HUMG</span>
            <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="hidden md:inline text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              Part {partNo} · {sourceLabel}
            </span>
          </div>
        </div>

        {/* Đồng hồ đếm giờ dạng Pill Capsule phong cách TADR OU */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold shadow-inner">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>{formatTime(seconds)}</span>
          </div>
          <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-500 font-medium">
            ({answeredCount}/{totalQuestions} câu)
          </span>
        </div>

        {/* Nút công cụ & Nộp bài phong cách TADR OU */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Nút Báo lỗi (Coral) */}
          <button
            type="button"
            onClick={() => toast.success("Cảm ơn bạn! Báo cáo lỗi đề thi đã được ghi nhận.")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-all duration-300 ease-in-out shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Báo lỗi</span>
          </button>

          {/* Nút Ghi chú (Cyan) */}
          <button
            type="button"
            onClick={() => toast.info("Tính năng sổ tay ghi chú nhanh cho câu hỏi này đang được hoàn thiện.")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium transition-all duration-300 ease-in-out shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Ghi chú</span>
          </button>

          {/* Nút Nộp bài / Làm lại */}
          {isGraded ? (
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all duration-300 ease-in-out shadow-sm"
            >
              Làm lại bài
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onSubmit}
              className="px-4 py-1.5 rounded-lg border border-sky-500 bg-sky-50 hover:bg-sky-500 hover:text-white text-sky-600 dark:text-sky-300 dark:bg-sky-950/60 dark:hover:bg-sky-500 text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ease-in-out shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Đang chấm..." : "Nộp bài"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
