"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ExamDetailDTO } from "@/shared/types/exam";
import {
  Clock,
  HelpCircle,
  ShieldAlert,
  Volume2,
  Wifi,
  Laptop,
  CheckCircle2,
  ArrowLeft,
  Play,
  Layers,
  History,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { toast } from "sonner";
import { fetchUserExamHistory, saveLocalAttemptId } from "@/frontend/lib/attempt-storage";
import type { ExamAttemptHistoryItemDTO } from "@/shared/types/attempt";

interface ExamInstructionViewProps {
  exam: ExamDetailDTO;
}

export function ExamInstructionView({ exam }: ExamInstructionViewProps) {
  const router = useRouter();
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pastAttempts, setPastAttempts] = useState<ExamAttemptHistoryItemDTO[]>([]);

  // Tải các lần thi trước của đề thi này
  React.useEffect(() => {
    fetchUserExamHistory(exam.id)
      .then((data) => {
        if (data?.attempts) {
          setPastAttempts(data.attempts);
        }
      })
      .catch(() => {});
  }, [exam.id]);

  const rwParts = exam.parts.filter(
    (p) => p.skill === "READING_WRITING" || (p.skill as string) === "reading_writing"
  );
  const listeningParts = exam.parts.filter(
    (p) => p.skill === "LISTENING" || (p.skill as string) === "listening"
  );

  const totalQuestions = exam.parts.reduce((sum, p) => sum + p.totalQuestions, 0);

  const handleStartExam = async () => {
    if (!hasAgreed) {
      toast.error("Vui lòng xác nhận bạn đã đọc và đồng ý với quy định phòng thi");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/exam/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId: exam.id }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Không thể khởi tạo lượt thi");
      }

      const data = await res.json();
      saveLocalAttemptId(data.attemptId);
      toast.success("Bắt đầu bài thi! Chúc bạn làm bài tốt.");
      router.push(`/thi-thu/${exam.id}/lam-bai?attemptId=${data.attemptId}`);
    } catch (error: any) {
      toast.error(error?.message || "Đã xảy ra sự cố khi vào phòng thi");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Nút quay lại */}
      <div>
        <Link
          href="/thi-thu"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Danh sách đề thi thử</span>
        </Link>
      </div>

      {/* Tiêu đề & Thông số tổng quan */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0095F6] text-white">
            {exam.code}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {exam.attemptsCount} lượt thi trước đó
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {exam.title}
        </h1>

        {exam.description && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {exam.description}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Thời gian làm bài</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Clock className="w-4 h-4 text-[#0095F6]" />
              <span>{exam.durationMinutes} phút</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Cấu trúc bài thi</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Layers className="w-4 h-4 text-purple-500" />
              <span>{exam.parts.length} phần (Part 1 - 14)</span>
            </div>
          </div>

          <div className="space-y-1 col-span-2 sm:col-span-1">
            <span className="text-xs text-slate-400 font-medium">Tổng số câu hỏi</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              <span>{totalQuestions} câu hỏi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cấu trúc 14 phần đã ghép trong đề thi thật */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800/80 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Cấu trúc các phần thi trong đề
        </h2>

        {/* Khối Reading & Writing */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-5 rounded-full bg-purple-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Khối 1: Reading & Writing (Part 1 – Part 9)
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden text-xs">
            {rwParts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-purple-600 dark:text-purple-400 w-14">
                    Part {p.partNo}
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {p.title}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="hidden sm:inline-block text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {p.sourceLabel}
                  </span>
                  <span>{p.totalQuestions} câu</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Khối Listening */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-5 rounded-full bg-sky-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Khối 2: Listening (Part 10 – Part 14)
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden text-xs">
            {listeningParts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sky-600 dark:text-sky-400 w-14">
                    Part {p.partNo}
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {p.title}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="hidden sm:inline-block text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {p.sourceLabel}
                  </span>
                  <span>{p.totalQuestions} câu</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quy định phòng thi & Yêu cầu kỹ thuật */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quy định phòng thi */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span>Quy định làm bài thi thử</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-[#0095F6] font-bold">•</span>
              <span>
                <strong>Đồng hồ tính giờ độc lập từ máy chủ:</strong> Thời gian 60 phút bắt đầu đếm ngược ngay khi bấm &ldquo;Bắt đầu làm bài&rdquo;.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0095F6] font-bold">•</span>
              <span>
                <strong>Tự động lưu đáp án:</strong> Hệ thống tự động đồng bộ câu trả lời sau mỗi lần chọn để chống mất dữ liệu.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0095F6] font-bold">•</span>
              <span>
                <strong>Hết giờ tự nộp:</strong> Khi hết 60 phút, hệ thống tự động chốt bài và chuyển sang trang kết quả chấm điểm.
              </span>
            </li>
          </ul>
        </div>

        {/* Yêu cầu kỹ thuật */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
            <Laptop className="w-5 h-5 text-[#0095F6]" />
            <span>Yêu cầu thiết bị & Kỹ thuật</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <Volume2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <span>
                <strong>Âm thanh tai nghe:</strong> Đảm bảo loa hoặc tai nghe hoạt động tốt để nghe rõ các đoạn audio ở Part 10 - 14.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Wifi className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Kết nối mạng ổn định:</strong> Duy trì mạng liên tục trong suốt 60 phút thi.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <span>
                <strong>Trình duyệt khuyến nghị:</strong> Chrome, Edge, Safari hoặc Firefox phiên bản mới nhất.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Lịch sử các lần đã thi đề này (nếu có) */}
      {pastAttempts.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#0095F6]" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Lịch sử làm đề này của bạn ({pastAttempts.length} lần)
              </h3>
            </div>
            <Link
              href="/thi-thu/lich-su"
              className="text-xs font-bold text-[#0095F6] hover:underline"
            >
              Xem tất cả lịch sử →
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {pastAttempts.map((item) => {
              const isCompleted = item.status === "COMPLETED";
              const dateStr = item.submittedAt || item.startedAt;
              const formattedDate = new Date(dateStr).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={item.attemptId}
                  className="py-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{formattedDate}</span>
                      {isCompleted ? (
                        item.isPassed ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            Đạt ({item.overallScore}%)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                            Chưa đạt ({item.overallScore}%)
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                          Chưa nộp
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 text-xs">
                      Đúng: {item.totalCorrect}/{item.totalQuestions} câu • Reading: {item.readingScore}% • Listening: {item.listeningScore}%
                    </div>
                  </div>

                  {isCompleted ? (
                    <Link
                      href={`/thi-thu/${exam.id}/ket-qua/${item.attemptId}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Xem lại kết quả</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/thi-thu/${exam.id}/lam-bai?attemptId=${item.attemptId}`}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>Tiếp tục làm</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Xác nhận quy chế & Nút Bắt đầu */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800/80 space-y-6">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasAgreed}
            onChange={(e) => setHasAgreed(e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-[#0095F6] focus:ring-[#0095F6] mt-0.5 cursor-pointer"
          />
          <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
            Tôi đã đọc kỹ quy định thi thử, kiểm tra âm thanh thiết bị và sẵn sàng bước vào bài thi 60 phút mô phỏng chuẩn đầu ra HUMG.
          </span>
        </label>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
          <Button
            type="button"
            disabled={!hasAgreed || isLoading}
            onClick={handleStartExam}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8 gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isLoading ? "Đang chuẩn bị đề thi..." : "Bắt đầu làm bài thi (60 Phút)"}</span>
          </Button>

          <Link
            href="/thi-thu"
            className="w-full sm:w-auto text-center px-6 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            Quay lại danh sách đề
          </Link>
        </div>
      </div>
    </div>
  );
}
