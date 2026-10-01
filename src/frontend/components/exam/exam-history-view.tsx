"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type {
  ExamAttemptHistoryItemDTO,
  ExamHistorySummaryDTO,
} from "@/shared/types/attempt";
import { fetchUserExamHistory } from "@/frontend/lib/attempt-storage";
import {
  History,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Play,
  RotateCcw,
  ExternalLink,
  BookOpen,
  Headphones,
  Award,
  Loader2,
  Calendar,
} from "lucide-react";

interface ExamHistoryViewProps {
  initialSummary?: ExamHistorySummaryDTO | null;
}

/**
 * Giao diện xem lại lịch sử các lần thi thử của thí sinh
 * Hiển thị điểm số, tỷ lệ đạt, so sánh giữa các lần thi và nút xem lại chi tiết bài làm
 */
export function ExamHistoryView({ initialSummary }: ExamHistoryViewProps) {
  const [summary, setSummary] = useState<ExamHistorySummaryDTO | null>(
    initialSummary || null
  );
  const [isLoading, setIsLoading] = useState(!initialSummary);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PASSED" | "FAILED">("ALL");

  useEffect(() => {
    let isMounted = true;

    async function loadClientHistory() {
      try {
        const data = await fetchUserExamHistory();
        if (isMounted) {
          setSummary(data);
        }
      } catch (err) {
        console.error("Lỗi khi tải lịch sử thi:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadClientHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#0095F6] mx-auto" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Đang tải lịch sử các lần thi thử của bạn...
        </p>
      </div>
    );
  }

  const attempts = summary?.attempts || [];
  const completedAttempts = attempts.filter((a) => a.status === "COMPLETED");

  const filteredAttempts = attempts.filter((a) => {
    if (filterStatus === "PASSED") return a.isPassed;
    if (filterStatus === "FAILED") return a.status === "COMPLETED" && !a.isPassed;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Tiêu đề & Điều hướng */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Link
            href="/thi-thu"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Danh sách đề thi</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-xs sm:text-sm font-bold text-[#0095F6]">
            Lịch sử thi của tôi
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <History className="w-7 h-7 text-[#0095F6]" />
              Lịch sử làm bài thi thử
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Xem lại kết quả, so sánh điểm số giữa các lần thi và kiểm tra lại lời giải chi tiết từng câu.
            </p>
          </div>

          <Link
            href="/thi-thu"
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[#0095F6] hover:bg-[#008be5] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_3px_0_0_#0275ba] active:translate-y-[2px] active:shadow-[0_1px_0_0_#0275ba] transition-all cursor-pointer min-h-[40px]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Làm đề mới</span>
          </Link>
        </div>
      </div>

      {/* 4 Thẻ chỉ số tổng quan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Tổng lượt thi */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">Tổng lượt thi</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {summary?.totalAttempts || 0}
          </div>
          <p className="text-[11px] text-slate-500">
            {completedAttempts.length} lần đã nộp bài
          </p>
        </div>

        {/* Điểm cao nhất */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">Điểm cao nhất</span>
          <div className="text-2xl sm:text-3xl font-black text-[#0095F6]">
            {summary?.bestScore || 0}%
          </div>
          <p className="text-[11px] text-slate-500">Kỷ lục bài thi cá nhân</p>
        </div>

        {/* Số lần Đạt chuẩn */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">Lượt Đạt chuẩn</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-500">
            {summary?.passCount || 0}
          </div>
          <p className="text-[11px] text-slate-500">Điểm trắc nghiệm ≥ 50%</p>
        </div>

        {/* Tỷ lệ Đạt */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">Tỷ lệ Đạt</span>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
            {summary?.passRate || 0}%
          </div>
          <p className="text-[11px] text-slate-500">Trên tổng các lần nộp</p>
        </div>
      </div>

      {/* Bộ lọc trạng thái */}
      {attempts.length > 0 && (
        <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setFilterStatus("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === "ALL"
                ? "bg-[#0095F6] text-white shadow-sm"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            }`}
          >
            Tất cả ({attempts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("PASSED")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === "PASSED"
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            }`}
          >
            Đạt chuẩn ({summary?.passCount || 0})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus("FAILED")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === "FAILED"
                ? "bg-rose-500 text-white shadow-sm"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            }`}
          >
            Chưa đạt ({Math.max(0, completedAttempts.length - (summary?.passCount || 0))})
          </button>
        </div>
      )}

      {/* Danh sách các lần thi */}
      {filteredAttempts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-8 h-8 opacity-60" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {attempts.length === 0
                ? "Bạn chưa có lần thi thử nào"
                : "Không tìm thấy lượt thi phù hợp với bộ lọc"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              {attempts.length === 0
                ? "Hãy bắt đầu một đề thi thử mô phỏng 60 phút với đầy đủ 14 phần để kiểm tra trình độ chuẩn đầu ra HUMG."
                : "Hãy chọn tab khác để xem danh sách các lần thi đã thực hiện."}
            </p>
          </div>
          {attempts.length === 0 && (
            <div className="pt-2">
              <Link
                href="/thi-thu"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0095F6] hover:bg-[#008be5] text-white text-sm font-bold shadow-[0_3.5px_0_0_#0275ba] active:translate-y-[2px] active:shadow-[0_1px_0_0_#0275ba] transition-all cursor-pointer min-h-[42px]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Bắt đầu thi thử ngay</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAttempts.map((item, idx) => {
            const isCompleted = item.status === "COMPLETED";
            const dateStr = item.submittedAt || item.startedAt;
            const formattedDate = new Date(dateStr).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            const timeMin = Math.floor(item.timeSpentSeconds / 60);
            const timeSec = item.timeSpentSeconds % 60;
            const formattedTimeSpent = `${timeMin}p ${timeSec}s`;

            return (
              <div
                key={item.attemptId}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-[#0095F6]/50 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Thông tin đề thi & thời gian */}
                <div className="space-y-2.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-[#0095F6]/10 text-[#0095F6] dark:bg-[#0095F6]/20">
                      {item.examCode}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>
                    {isCompleted ? (
                      item.isPassed ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Đạt chuẩn
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-rose-500" />
                          Chưa đạt
                        </span>
                      )
                    ) : (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300">
                        Đang làm dở
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                    {item.examTitle}
                  </h3>

                  {/* Chi tiết điểm số kỹ năng */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                      <BookOpen className="w-3.5 h-3.5" />
                      Reading: {item.readingScore}% ({item.readingCorrect}/{item.readingTotal})
                    </span>
                    <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
                      <Headphones className="w-3.5 h-3.5" />
                      Listening: {item.listeningScore}% ({item.listeningCorrect}/{item.listeningTotal})
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {formattedTimeSpent}
                    </span>
                  </div>
                </div>

                {/* Điểm tổng quan & Nút hành động */}
                <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 flex-shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] font-semibold text-slate-400 block">
                      Tổng điểm
                    </span>
                    <span
                      className={`text-2xl sm:text-3xl font-black ${
                        item.isPassed
                          ? "text-emerald-500"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {item.overallScore}%
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 block">
                      {item.totalCorrect}/{item.totalQuestions} câu
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <Link
                        href={`/thi-thu/${item.examId}/ket-qua/${item.attemptId}`}
                        className="px-4 sm:px-5 py-2 rounded-xl bg-[#0095F6] hover:bg-[#008be5] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-[0_3px_0_0_#0275ba] active:translate-y-[2px] active:shadow-[0_1px_0_0_#0275ba] transition-all cursor-pointer min-h-[38px]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Xem chi tiết</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/thi-thu/${item.examId}/lam-bai?attemptId=${item.attemptId}`}
                        className="px-4 sm:px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-[0_3px_0_0_#b45309] active:translate-y-[2px] active:shadow-[0_1px_0_0_#b45309] transition-all cursor-pointer min-h-[38px]"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Tiếp tục làm</span>
                      </Link>
                    )}

                    <Link
                      href={`/thi-thu/${item.examId}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      title="Thi lại đề này"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
