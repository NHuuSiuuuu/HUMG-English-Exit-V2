import * as React from "react";
import { ExamBuilderForm } from "@/frontend/components/admin/exam-builder-form";

export const metadata = {
  title: "Ghép đề thi mới — Admin Đề thi | HUMG English Exit",
  description: "Trình ghép đề thi thử 14 phần Cambridge KET 60 phút từ kho phần",
};

export default function AdminCreateExamPage() {
  return <ExamBuilderForm />;
}
