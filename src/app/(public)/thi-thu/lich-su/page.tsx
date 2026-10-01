import * as React from "react";
import { getCurrentUser } from "@/backend/lib/auth";
import { attemptService } from "@/backend/services/attempt.service";
import { ExamHistoryView } from "@/frontend/components/exam/exam-history-view";

export const metadata = {
  title: "Lịch sử thi thử — HUMG English Exit",
  description: "Xem lại toàn bộ kết quả, so sánh điểm số và lời giải chi tiết các lần thi thử chuẩn đầu ra tiếng Anh HUMG.",
};

export default async function ExamHistoryPage() {
  const user = await getCurrentUser();

  let initialSummary = null;
  if (user?.id) {
    try {
      initialSummary = await attemptService.getUserExamHistory({
        userId: user.id,
      });
    } catch (err) {
      console.error("Lỗi khi tải lịch sử người dùng từ server:", err);
    }
  }

  return (
    <div className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <ExamHistoryView initialSummary={initialSummary} />
    </div>
  );
}
