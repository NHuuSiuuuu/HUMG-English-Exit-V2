import * as React from "react";
import { notFound } from "next/navigation";
import { examService } from "@/backend/services/exam.service";
import { ExamInstructionView } from "@/frontend/components/exam/exam-instruction-view";

interface ExamInstructionPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ExamInstructionPageProps) {
  const exam = await examService.getExamById(params.id);
  if (!exam || exam.status !== "PUBLISHED") {
    return { title: "Không tìm thấy đề thi — HUMG English Exit" };
  }
  return {
    title: `${exam.title} (${exam.code}) — Hướng dẫn thi thử HUMG`,
    description: `Chuẩn bị thi thử 60 phút mô phỏng đề thi chuẩn đầu ra HUMG với 14 phần: ${exam.title}`,
  };
}

export default async function ExamInstructionPage({ params }: ExamInstructionPageProps) {
  const exam = await examService.getExamById(params.id);

  if (!exam || exam.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ExamInstructionView exam={exam} />
      </div>
    </div>
  );
}
