"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { ExamResultDTO, PartResultDTO } from "@/shared/types/attempt";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Headphones,
  RotateCcw,
  ListFilter,
  FileText,
  Volume2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ExamResultViewProps {
  result: ExamResultDTO;
}

/**
 * Màn hình bảng điểm và kết quả chi tiết bài thi thử 14 phần
 * Hiển thị điểm số tổng hợp, phân tách Reading vs Listening, tự đánh giá Writing, và giải thích từng câu
 */
export function ExamResultView({ result }: ExamResultViewProps) {
  const [expandedParts, setExpandedParts] = useState<Record<number, boolean>>({
    1: true,
  });

  const togglePart = (partNo: number) => {
    setExpandedParts((prev) => ({
      ...prev,
      [partNo]: !prev[partNo],
    }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    result.parts.forEach((p) => {
      all[p.partNo] = true;
    });
    setExpandedParts(all);
  };

  const collapseAll = () => {
    setExpandedParts({});
  };

  const timeMinutes = Math.floor(result.timeSpentSeconds / 60);
  const timeSecs = result.timeSpentSeconds % 60;
  const timeFormatted = `${timeMinutes} phút ${timeSecs.toString().padStart(2, "0")} giây`;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Banner tổng kết điểm số */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.06)] border border-slate-200/80 dark:border-slate-800 text-center relative overflow-hidden">
        {/* Nền trang trí */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-[#0095F6] to-emerald-500" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 mb-4">
          <span>Mã đề: {result.examCode}</span>
          <span>•</span>
          <span>{result.examTitle}</span>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center shadow-lg transition-transform ${
              result.isPassed
                ? "bg-emerald-500 text-white shadow-emerald-200 dark:shadow-emerald-950"
                : "bg-amber-500 text-white shadow-amber-200 dark:shadow-amber-950"
            }`}
          >
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div className="space-y-1">
            <div className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              {result.overallScore}%
            </div>
            <p className="text-sm sm:text-base font-semibold text-slate-500 dark:text-slate-400">
              Đúng {result.totalCorrect} / {result.totalQuestions} câu trắc nghiệm
            </p>
          </div>

          {/* Huy hiệu Đạt / Chưa đạt chuẩn đầu ra */}
          <div className="pt-2">
            {result.isPassed ? (
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-extrabold text-sm sm:text-base shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ĐẠT CHUẨN ĐẦU RA TIẾNG ANH HUMG
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-extrabold text-sm sm:text-base shadow-sm">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                CHƯA ĐẠT CHUẨN ĐẦU RA (DƯỚI 50%)
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              Thời gian làm bài: <strong className="text-slate-700 dark:text-slate-200">{timeFormatted}</strong>
            </span>
          </div>
        </div>

        {/* Thanh nút hành động nhanh 3D xúc giác */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/thi-thu/${result.examId}`}
            className="px-6 py-2.5 rounded-xl bg-[#0095F6] hover:bg-[#008be5] text-white text-sm font-bold flex items-center gap-2 shadow-[0_3.5px_0_0_#0275ba] active:translate-y-[2px] active:shadow-[0_1px_0_0_#0275ba] transition-all cursor-pointer min-h-[42px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thi lại đề này</span>
          </Link>
          <Link
            href="/thi-thu"
            className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold flex items-center gap-2 shadow-[0_3.5px_0_0_#cbd5e1] dark:shadow-[0_3.5px_0_0_#334155] active:translate-y-[2px] active:shadow-[0_1px_0_0_#cbd5e1] transition-all cursor-pointer min-h-[42px]"
          >
            <ListFilter className="w-4 h-4" />
            <span>Chọn đề thi khác</span>
          </Link>
          <Link
            href="/on-luyen"
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold flex items-center gap-2 shadow-[0_3.5px_0_0_#6b21a8] active:translate-y-[2px] active:shadow-[0_1px_0_0_#6b21a8] transition-all cursor-pointer min-h-[42px]"
          >
            <BookOpen className="w-4 h-4" />
            <span>Ôn luyện từng phần</span>
          </Link>
        </div>
      </div>

      {/* Thẻ phân tích kỹ năng: Reading vs Listening */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Khối Reading & Writing */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Reading & Writing
                </h3>
                <p className="text-xs text-slate-400">Part 1 – Part 8 (50 câu)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                {result.readingScore}%
              </span>
              <p className="text-xs font-semibold text-slate-400">
                {result.readingCorrect} / {result.readingTotal} câu
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${result.readingScore}%` }}
            />
          </div>
        </div>

        {/* Khối Listening */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Listening
                </h3>
                <p className="text-xs text-slate-400">Part 10 – Part 14 (25 câu)</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
                {result.listeningScore}%
              </span>
              <p className="text-xs font-semibold text-slate-400">
                {result.listeningCorrect} / {result.listeningTotal} câu
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${result.listeningScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tự đối chiếu Part 9 Writing (Quy định PRD mục 13) */}
      {result.writingEvaluation && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                P9
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Tự đối chiếu tự luận
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Part 9: Viết Note (25 – 35 từ)
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                  result.writingEvaluation.isWordCountValid
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                    : "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                }`}
              >
                Số từ: {result.writingEvaluation.wordCount} / (25-35 từ) •{" "}
                {result.writingEvaluation.isWordCountValid
                  ? "Đạt độ dài ✓"
                  : "Chưa đạt độ dài"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bài làm của thí sinh */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Bài làm của bạn:
              </span>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed min-h-[120px]">
                {result.writingEvaluation.userAnswer || (
                  <span className="text-slate-400 italic">Thí sinh để trống câu này</span>
                )}
              </div>
            </div>

            {/* Bài viết mẫu tham khảo */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Bài viết mẫu chuẩn tham khảo:
              </span>
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-900 dark:text-emerald-200 whitespace-pre-wrap leading-relaxed min-h-[120px]">
                {result.writingEvaluation.sampleWriting ||
                  "Hi Sam, I would love to meet you at the library tomorrow at 3 p.m. We can study for our exam and then get some drinks."}
              </div>
            </div>
          </div>

          {/* Tiêu chí chấm điểm (Rubric) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-100">
              Tiêu chuẩn tự đánh giá (Rubric):
            </span>
            <ul className="list-disc pl-5 space-y-1">
              <li>Trả lời đủ cả 3 thông tin mà đề bài yêu cầu.</li>
              <li>Sử dụng đúng thì và cấu trúc câu rõ ràng, không sai ngữ pháp cơ bản.</li>
              <li>Độ dài trong khoảng từ 25 đến 35 từ.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Chi tiết từng câu hỏi trong 14 phần */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Chi tiết đáp án & lời giải 14 phần
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Mở tất cả
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Thu gọn
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {result.parts.map((part) => {
            const isExpanded = !!expandedParts[part.partNo];
            const isListening = part.partNo >= 10;

            return (
              <div
                key={part.partNo}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                {/* Header thanh Part */}
                <button
                  type="button"
                  onClick={() => togglePart(part.partNo)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white ${
                        isListening ? "bg-sky-500" : "bg-purple-600"
                      }`}
                    >
                      {part.partNo}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Part {part.partNo}: {part.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {part.isObjective
                          ? `Đúng ${part.correctCount}/${part.totalQuestions} câu (${part.scorePercent}%)`
                          : "Phần tự luận Writing (Tự đối chiếu)"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {part.isObjective && (
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          (part.scorePercent || 0) >= 50
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                        }`}
                      >
                        {part.scorePercent}%
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Nội dung chi tiết các câu khi mở */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                    {/* Transcript nếu có */}
                    {part.transcript && (
                      <div className="mt-4 p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/40 text-xs sm:text-sm text-sky-900 dark:text-sky-200 space-y-1">
                        <span className="font-bold flex items-center gap-1.5 text-sky-700 dark:text-sky-300">
                          <Volume2 className="w-4 h-4" />
                          Audio Transcript:
                        </span>
                        <p className="whitespace-pre-wrap leading-relaxed">{part.transcript}</p>
                      </div>
                    )}

                    {/* Danh sách câu hỏi và đối chiếu đáp án */}
                    {part.details && part.details.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {part.details.map((q) => (
                          <div
                            key={q.questionId}
                            className={`p-4 rounded-2xl border transition-all ${
                              q.isCorrect
                                ? "bg-emerald-50/40 border-2 border-emerald-500/80 dark:bg-emerald-950/20"
                                : "bg-rose-50/40 border-2 border-rose-500/80 dark:bg-rose-950/20"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                                  Câu {q.orderNumber}
                                </span>
                                {q.isCorrect ? (
                                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="w-4 h-4" /> Đúng
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                                    <XCircle className="w-4 h-4" /> Sai
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                              <div>
                                <span className="text-slate-400">Bạn đã chọn: </span>
                                <strong
                                  className={
                                    q.isCorrect
                                      ? "text-emerald-700 dark:text-emerald-300"
                                      : "text-rose-700 dark:text-rose-300 line-through"
                                  }
                                >
                                  {q.userAnswer || "(bỏ trống)"}
                                </strong>
                              </div>
                              <div>
                                <span className="text-slate-400">Đáp án chuẩn: </span>
                                <strong className="text-emerald-700 dark:text-emerald-300">
                                  {q.correctAnswer}
                                </strong>
                              </div>
                            </div>

                            {q.explanation && (
                              <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                                <strong className="text-slate-700 dark:text-slate-200 mr-1">
                                  Giải thích:
                                </strong>
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
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
