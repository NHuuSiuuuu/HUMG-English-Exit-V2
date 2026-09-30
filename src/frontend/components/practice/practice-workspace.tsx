"use client";

import React, { useState } from "react";
import type { PracticeItemDetail, PracticeGradeResult } from "@/shared/types/practice";
import { PracticeRoomHeader } from "./practice-room-header";
import { AudioPlayerListening } from "./audio-player-listening";
import { PracticeResultBanner } from "./practice-result-banner";
import { QuestionRendererDispatcher } from "./questions/question-renderer-dispatcher";

interface PracticeWorkspaceProps {
  itemDetail: PracticeItemDetail;
  nextItemId?: string;
}

/**
 * Phòng làm bài luyện tập tương tác cao phía Client
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

      // Cuộn mượt lên trên để người học nhìn thấy banner kết quả
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
    <div className="space-y-6 pb-16">
      {/* Header điều hướng và nộp bài */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Banner kết quả nổi bật khi đã nộp bài */}
        {isGraded && gradeResult && (
          <PracticeResultBanner
            result={gradeResult}
            partNo={itemDetail.partNo}
            skill={itemDetail.skill}
            onReset={handleReset}
            nextItemId={nextItemId}
          />
        )}

        {/* Trình phát âm thanh cho phần Listening */}
        {group.audioUrl && (
          <AudioPlayerListening
            audioUrl={group.audioUrl}
            transcript={gradeResult?.transcript}
            isGraded={isGraded}
          />
        )}

        {/* Bộ Renderers cho đúng dạng câu hỏi */}
        <div className="bg-[var(--surface-bg)] rounded-lg">
          <QuestionRendererDispatcher
            questionGroup={group}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            isGraded={isGraded}
            gradeResult={gradeResult}
          />
        </div>
      </div>
    </div>
  );
}
