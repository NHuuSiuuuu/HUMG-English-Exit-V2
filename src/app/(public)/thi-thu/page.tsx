import * as React from "react";
import Link from "next/link";
import { Clock, HelpCircle, ArrowLeft, ArrowRight, Play, AlertCircle } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";

export default function MockExamListPage() {
  const sampleExams = [
    {
      id: "de-thi-thu-so-01",
      title: "Đề thi thử Chuẩn đầu ra HUMG — Đề số 01",
      code: "KET-2026-T1",
      durationMinutes: 60,
      totalParts: 14,
      totalQuestions: "75 câu + 1 bài viết",
      difficulty: "Chuẩn đề thi thật",
      attemptsCount: 342,
    },
    {
      id: "de-thi-thu-so-02",
      title: "Đề thi thử Chuẩn đầu ra HUMG — Đề số 02",
      code: "KET-2026-T2",
      durationMinutes: 60,
      totalParts: 14,
      totalQuestions: "75 câu + 1 bài viết",
      difficulty: "Chuẩn đề thi thật",
      attemptsCount: 198,
    },
    {
      id: "de-thi-thu-so-03",
      title: "Đề thi thử Chuẩn đầu ra HUMG — Đề số 03",
      code: "KET-2026-T3",
      durationMinutes: 60,
      totalParts: 14,
      totalQuestions: "75 câu + 1 bài viết",
      difficulty: "Nâng cao nhẹ",
      attemptsCount: 115,
    },
  ];

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Tiêu đề trang */}
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Về trang chủ</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Thi thử Chuẩn đầu ra 60 Phút
          </h1>
          <p className="text-muted text-base max-w-2xl leading-relaxed">
            Mô phỏng áp lực phòng thi với đầy đủ 14 phần thi liên tục. Đồng hồ đếm ngược được tính toán chính xác trên máy chủ và tự động lưu đáp án sau mỗi câu làm.
          </p>
        </div>

        {/* Cảnh báo quy chế thi */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 sm:p-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm text-muted leading-relaxed">
            <p className="font-bold text-foreground">Quy định phòng thi thử mô phỏng:</p>
            <p>• Bài thi kéo dài đúng 60 phút. Khi hết thời gian, hệ thống tự động chốt và nộp những câu bạn đã làm.</p>
            <p>• Bạn có thể chuyển đổi linh hoạt giữa 14 phần bất cứ lúc nào trong thời gian làm bài.</p>
          </div>
        </div>

        {/* Danh sách đề thi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleExams.map((exam) => (
            <Card key={exam.id} className="flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="default" className="text-xs">{exam.code}</Badge>
                  <span className="text-xs text-muted font-medium">{exam.attemptsCount} lượt thi</span>
                </div>
                <CardTitle className="text-xl">{exam.title}</CardTitle>
                <CardDescription className="space-y-1 text-xs text-muted mt-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Thời gian: {exam.durationMinutes} phút</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-3.5 w-3.5 text-secondary" />
                    <span>Quy mô: {exam.totalParts} phần · {exam.totalQuestions}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Link href={`/thi-thu/${exam.id}`} className="w-full">
                  <Button variant="primary" className="w-full justify-center gap-2">
                    <Play className="h-4 w-4 fill-current" />
                    <span>Bắt đầu thi ngay</span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
