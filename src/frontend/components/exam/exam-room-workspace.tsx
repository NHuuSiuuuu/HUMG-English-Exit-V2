"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ExamRoomSessionDTO } from "@/shared/types/attempt";
import { ExamRoomHeader } from "./exam-room-header";
import { ExamPartNavigator } from "./exam-part-navigator";
import { ExamPartCard } from "./exam-part-card";

interface ExamRoomWorkspaceProps {
  session: ExamRoomSessionDTO;
}

/**
 * Không gian làm bài thi thử chính thức (60 phút)
 * Quản lý đồng hồ đếm ngược server, tự động lưu nháp liên tục, tự động nộp khi hết giờ
 */
export function ExamRoomWorkspace({ session }: ExamRoomWorkspaceProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>(session.savedAnswers || {});
  const [remainingSeconds, setRemainingSeconds] = useState<number>(session.remainingSeconds);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePartNo, setActivePartNo] = useState<number>(1);

  const dirtyRef = useRef(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  // Tính tổng số câu hỏi trong toàn bộ 14 phần
  const allQuestions = session.parts.flatMap((p) => p.questionGroup.questions);
  const totalQuestions = allQuestions.length;
  const answeredCount = allQuestions.filter(
    (q) => (answers[q.id] || "").trim().length > 0
  ).length;

  // Nộp bài thi
  const handleSubmit = useCallback(
    async (isAuto = false) => {
      if (isSubmitting) return;

      if (!isAuto && answeredCount < totalQuestions) {
        const confirmSubmit = window.confirm(
          `Bạn mới trả lời ${answeredCount}/${totalQuestions} câu hỏi. Bạn có chắc chắn muốn nộp bài thi ngay không?`
        );
        if (!confirmSubmit) return;
      }

      try {
        setIsSubmitting(true);
        const res = await fetch(`/api/exam/attempts/${session.attemptId}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: answersRef.current }),
        });

        if (!res.ok) {
          throw new Error("Không thể nộp bài thi. Vui lòng thử lại!");
        }

        toast.success(
          isAuto
            ? "Đã hết giờ làm bài! Hệ thống đã tự động thu bài."
            : "Nộp bài thi thành công! Đang chuyển đến bảng điểm..."
        );

        // Chuyển hướng tới trang kết quả
        router.push(`/thi-thu/${session.examId}/ket-qua/${session.attemptId}`);
      } catch (error: any) {
        toast.error(error?.message || "Đã xảy ra sự cố khi nộp bài");
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      answeredCount,
      totalQuestions,
      session.attemptId,
      session.examId,
      router,
    ]
  );

  const handleSubmitRef = useRef(handleSubmit);
  handleSubmitRef.current = handleSubmit;

  // Đồng hồ đếm ngược server
  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitRef.current(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]);

  // Cập nhật câu trả lời và đánh dấu cần lưu
  const handleAnswerChange = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    dirtyRef.current = true;
  }, []);

  // Tự động lưu đáp án sau mỗi 4 giây nếu có thay đổi
  useEffect(() => {
    const saveInterval = setInterval(async () => {
      if (!dirtyRef.current || isSubmitting) return;

      try {
        setIsSaving(true);
        dirtyRef.current = false;

        const res = await fetch(`/api/exam/attempts/${session.attemptId}/save`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: answersRef.current }),
        });

        if (!res.ok) {
          dirtyRef.current = true;
        }
      } catch (err) {
        dirtyRef.current = true;
      } finally {
        setIsSaving(false);
      }
    }, 4000);

    return () => clearInterval(saveInterval);
  }, [session.attemptId, isSubmitting]);

  // Nhảy mượt đến Part được chọn
  const handleSelectPart = (partNo: number) => {
    setActivePartNo(partNo);
    const element = document.getElementById(`part-${partNo}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-24">
      {/* Header cố định */}
      <ExamRoomHeader
        examTitle={session.examTitle}
        examCode={session.examCode}
        remainingSeconds={remainingSeconds}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        isSaving={isSaving}
        isSubmitting={isSubmitting}
        onSubmit={() => handleSubmit(false)}
      />

      {/* Nội dung làm bài 14 phần cuộn liên tục */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Thanh điều hướng 14 phần */}
        <ExamPartNavigator
          parts={session.parts}
          answers={answers}
          activePartNo={activePartNo}
          onSelectPart={handleSelectPart}
        />

        {/* Danh sách 14 phần bài thi */}
        <div className="space-y-8">
          {session.parts.map((part) => (
            <ExamPartCard
              key={part.id}
              part={part}
              answers={answers}
              onAnswerChange={handleAnswerChange}
            />
          ))}
        </div>

        {/* Nút nộp bài lớn ở cuối trang */}
        <div className="mt-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Bạn đã xem lại hết toàn bộ 14 phần chưa?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Hệ thống đã lưu:{" "}
            <span className="font-bold text-[#0095F6]">{answeredCount}</span>/
            {totalQuestions} câu hỏi. Sau khi nộp bài, hệ thống sẽ tự động chấm điểm và hiển thị kết quả phân tích chi tiết.
          </p>
          <div className="pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(false)}
              className="px-8 py-3.5 rounded-2xl bg-[#0095F6] hover:bg-[#008be5] text-white text-base font-bold shadow-[0_4px_0_0_#0275ba] active:translate-y-[2px] active:shadow-[0_1px_0_0_#0275ba] transition-all cursor-pointer min-h-[48px] disabled:opacity-50"
            >
              {isSubmitting ? "Đang nộp bài..." : "Nộp bài thi & Xem bảng điểm"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
