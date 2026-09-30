"use client";

import React, { useState } from "react";
import type { PracticeItemDetail, PracticeGradeResult } from "@/shared/types/practice";
import { PracticeRoomHeader } from "./practice-room-header";
import { AudioPlayerListening } from "./audio-player-listening";
import { PracticeResultBanner } from "./practice-result-banner";
import { QuestionRendererDispatcher } from "./questions/question-renderer-dispatcher";
import { FileText, Bot, History, Sparkles } from "lucide-react";

interface PracticeWorkspaceProps {
  itemDetail: PracticeItemDetail;
  nextItemId?: string;
}

/**
 * Phòng làm bài luyện tập phong cách TADR OU:
 * Đặt trên nền có lưới mờ bg-grid-pattern, khung bài làm card-soft trắng tinh khiết,
 * thanh công cụ tiện ích (Transcript, Trợ lý AI, Lịch sử) dạng pill buttons màu sắc tươi sáng
 */
export function PracticeWorkspace({ itemDetail, nextItemId }: PracticeWorkspaceProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGraded, setIsGraded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradeResult, setGradeResult] = useState<PracticeGradeResult | null>(null);

  const group = itemDetail.questionGroup;
  const totalQuestions = group.items.length;
  const answeredCount = Object.keys(answers).filter(
    (k) => answers[k] && answers[k].trim().length > 0
  ).length;

  const handleAnswerChange = (questionId: string, value: string) => {
    if (isGraded) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting || isGraded) return;

    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `Bạn mới trả lời ${answeredCount}/${totalQuestions} câu hỏi. Bạn có chắc chắn muốn nộp bài để chấm điểm ngay không?`
      );
      if (!confirmSubmit) return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/practice/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: itemDetail.id,
          answers,
        }),
      });

      if (!res.ok) {
        throw new Error("Không thể gửi bài để chấm điểm");
      }

      const result: PracticeGradeResult = await res.json();
      setGradeResult(result);
      setIsGraded(true);

      // Cuộn mượt lên trên để xem banner kết quả
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Đã xảy ra sự cố khi chấm bài. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setIsGraded(false);
    setGradeResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-[#0B1120] bg-grid-pattern pb-16">
      {/* Header điều hướng và đếm giờ */}
      <PracticeRoomHeader
        title={itemDetail.title}
        sourceLabel={itemDetail.sourceLabel}
        partNo={itemDetail.partNo}
        skill={itemDetail.skill}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        isGraded={isGraded}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Banner kết quả khi đã chấm */}
        {isGraded && gradeResult && (
          <PracticeResultBanner
            result={gradeResult}
            partNo={itemDetail.partNo}
            skill={itemDetail.skill}
            onReset={handleReset}
            nextItemId={nextItemId}
          />
        )}

        {/* Khung bài làm lớn Card trắng tinh khiết phong cách TADR OU */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800/80 space-y-6">
          {/* Thanh công cụ phụ (Transcript, Trợ lý AI, Lịch sử) giống hình mẫu 3 */}
          <div className="flex items-center gap-2 flex-wrap">
            {group.transcript && (
              <button
                type="button"
                onClick={() => alert(`Transcript:\n${group.transcript}`)}
                className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Transcript</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => alert("Trợ lý AI sẵn sàng giải thích ngữ pháp và từ vựng cho câu hỏi này.")}
              className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Trợ lý AI</span>
            </button>

            <button
              type="button"
              onClick={() => alert("Xem lại lịch sử các lần làm bài trước.")}
              className="px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <History className="w-3.5 h-3.5" />
              <span>Lịch sử</span>
            </button>
          </div>

          {/* Hướng dẫn làm bài (Directions) thanh thoát */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal border border-slate-100/60 dark:border-slate-800/60">
            <span className="font-bold text-slate-800 dark:text-slate-100 mr-1">Directions:</span>
            {group.instruction}
          </div>

          {/* Trình phát âm thanh thanh tím (cho Listening) */}
          {group.audioUrl && (
            <AudioPlayerListening
              audioUrl={group.audioUrl}
              transcript={gradeResult?.transcript}
              isGraded={isGraded}
            />
          )}

          {/* Bộ Renderers cho đúng dạng câu hỏi */}
          <div className="pt-2">
            <QuestionRendererDispatcher
              questionGroup={group}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              isGraded={isGraded}
              gradeResult={gradeResult}
            />
          </div>
        </div>

        {/* Chân trang phân chia phần (Pill Tabs) giống hình mẫu 3 */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="px-4 py-1.5 rounded-lg bg-[#0095F6] text-white text-xs font-bold shadow-sm">
            Part {itemDetail.partNo}
          </span>
          {itemDetail.partNo > 1 && (
            <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-500 text-xs font-medium border border-slate-200/60 dark:border-slate-700">
              Part {itemDetail.partNo - 1}
            </span>
          )}
          {itemDetail.partNo < 14 && (
            <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-500 text-xs font-medium border border-slate-200/60 dark:border-slate-700">
              Part {itemDetail.partNo + 1}
            </span>
          )}
        </div>
      </main>
    </div>
  );
}
