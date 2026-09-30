import * as React from "react";
import { examService } from "@/backend/services/exam.service";
import { ExamBankManager } from "@/frontend/components/admin/exam-bank-manager";

export const metadata = {
  title: "Quản lý Đề thi thử (14 Parts) — Quản trị viên | HUMG English Exit",
  description: "Ghép đề thi hoàn chỉnh từ 14 phần trong Kho phần, thiết lập thời gian làm bài chuẩn 60 phút",
};

// Đảm bảo dữ liệu luôn được truy vấn mới nhất khi vào trang
export const dynamic = "force-dynamic";

export default async function AdminExamsPage() {
  // Lấy danh sách đề thi và số liệu thống kê thực tế từ PostgreSQL
  const [exams, stats] = await Promise.all([
    examService.getExams(),
    examService.getExamStats(),
  ]);

  return <ExamBankManager initialExams={exams} initialStats={stats} />;
}
