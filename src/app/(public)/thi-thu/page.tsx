import * as React from "react";
import { examService } from "@/backend/services/exam.service";
import { MockExamListView } from "@/frontend/components/exam/mock-exam-list-view";

export const metadata = {
  title: "Thi thử Chuẩn đầu ra 60 Phút — HUMG English Exit",
  description:
    "Mô phỏng áp lực phòng thi thật với 14 phần thi liên tục và đồng hồ đếm ngược tính toán theo thời gian server.",
};

export default async function MockExamListPage() {
  const exams = await examService.getExams({ status: "PUBLISHED" });

  return <MockExamListView exams={exams} />;
}
