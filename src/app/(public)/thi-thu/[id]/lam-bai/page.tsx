import * as React from "react";
import { notFound, redirect } from "next/navigation";
import { attemptService } from "@/backend/services/attempt.service";
import { ExamRoomWorkspace } from "@/frontend/components/exam/exam-room-workspace";

interface ExamRoomPageProps {
  params: {
    id: string;
  };
  searchParams: {
    attemptId?: string;
  };
}

export async function generateMetadata({ params }: ExamRoomPageProps) {
  return {
    title: `Phòng thi thử 60 phút — HUMG English Exit`,
    description: `Làm bài thi thử mô phỏng đề thi chuẩn đầu ra tiếng Anh HUMG`,
  };
}

export default async function ExamRoomPage({
  params,
  searchParams,
}: ExamRoomPageProps) {
  const attemptId = searchParams.attemptId;

  if (!attemptId) {
    // Nếu chưa có attemptId thì quay lại trang hướng dẫn đề thi
    redirect(`/thi-thu/${params.id}`);
  }

  try {
    const session = await attemptService.getAttemptForExamRoom(attemptId);

    // Nếu bài thi đã hoàn thành thì chuyển sang trang kết quả
    if (session.status === "COMPLETED") {
      redirect(`/thi-thu/${params.id}/ket-qua/${attemptId}`);
    }

    return <ExamRoomWorkspace session={session} />;
  } catch (error) {
    console.error("Lỗi khi mở phòng thi:", error);
    notFound();
  }
}
