import * as React from "react";
import { partService } from "@/backend/services/part.service";
import { examService } from "@/backend/services/exam.service";
import { ExamBuilderForm } from "@/frontend/components/admin/exam-builder-form";

export const metadata = {
  title: "Ghép đề thi mới — Admin Đề thi | HUMG English Exit",
  description: "Trình ghép đề thi thử 14 phần Cambridge KET 60 phút từ kho phần",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: {
    edit?: string;
  };
}

export default async function AdminCreateExamPage({ searchParams }: PageProps) {
  const editId = searchParams?.edit;

  // Lấy danh sách toàn bộ Part có trong Kho phần và thông tin đề cần sửa nếu có
  const [parts, initialExam] = await Promise.all([
    partService.getParts(),
    editId ? examService.getExamById(editId) : Promise.resolve(null),
  ]);

  return <ExamBuilderForm availableParts={parts} initialExam={initialExam} />;
}
