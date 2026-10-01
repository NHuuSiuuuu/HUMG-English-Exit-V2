import * as React from "react";
import { notFound } from "next/navigation";
import { attemptService } from "@/backend/services/attempt.service";
import { ExamResultView } from "@/frontend/components/exam/exam-result-view";

interface ExamResultPageProps {
  params: {
    id: string;
    attemptId: string;
  };
}

export async function generateMetadata({ params }: ExamResultPageProps) {
  try {
    const result = await attemptService.getAttemptResult(params.attemptId);
    return {
      title: `Kết quả thi thử: ${result.overallScore}% — ${result.examTitle}`,
      description: `Bảng điểm chi tiết và lời giải thích đề thi thử ${result.examTitle}`,
    };
  } catch {
    return {
      title: `Kết quả thi thử — HUMG English Exit`,
    };
  }
}

export default async function ExamResultPage({
  params,
}: ExamResultPageProps) {
  try {
    const result = await attemptService.getAttemptResult(params.attemptId);
    return (
      <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <ExamResultView result={result} />
      </div>
    );
  } catch (error) {
    console.error("Lỗi khi tải kết quả thi:", error);
    notFound();
  }
}
