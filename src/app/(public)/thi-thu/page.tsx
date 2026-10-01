import * as React from "react";
import Link from "next/link";
import { Clock, HelpCircle, ArrowLeft, Play, AlertCircle, FileSpreadsheet } from "lucide-react";
import { examService } from "@/backend/services/exam.service";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";

export const metadata = {
  title: "Thi thử Chuẩn đầu ra 60 Phút — HUMG English Exit",
  description: "Mô phỏng áp lực phòng thi thật với 14 phần thi liên tục và đồng hồ đếm ngược tính toán theo thời gian server.",
};

export default async function MockExamListPage() {
  const exams = await examService.getExams({ status: "PUBLISHED" });

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
        <div className="rounded-2xl border border-sky-200/80 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/30 p-5 sm:p-6 flex items-start gap-3.5 shadow-sm">
          <AlertCircle className="h-5 w-5 text-[#0095F6] shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p className="font-bold text-slate-900 dark:text-white">Quy định phòng thi thử mô phỏng:</p>
            <p>• Bài thi kéo dài đúng 60 phút. Khi hết thời gian, hệ thống tự động chốt và nộp những câu bạn đã làm.</p>
            <p>• Bạn có thể chuyển đổi linh hoạt giữa 14 phần bất cứ lúc nào trong thời gian làm bài.</p>
          </div>
        </div>

        {/* Danh sách đề thi hoặc Trạng thái rỗng */}
        {exams.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
            <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-foreground">Chưa có đề thi thử</h3>
            <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
              Các bộ đề thi thử mô phỏng 60 phút đang được ban chuyên môn thẩm định và sẽ sớm được công bố.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card key={exam.id} className="flex flex-col justify-between hover:ring-2 hover:ring-[#0095F6]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-in-out">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="default" className="text-xs bg-[#0095F6] text-white hover:bg-sky-600">{exam.code}</Badge>
                    <span className="text-xs text-muted font-medium">{exam.attemptsCount} lượt thi</span>
                  </div>
                  <CardTitle className="text-xl">{exam.title}</CardTitle>
                  <CardDescription className="space-y-1.5 text-xs text-muted mt-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#0095F6]" />
                      <span>Thời gian: {exam.durationMinutes} phút</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-3.5 w-3.5 text-purple-500" />
                      <span>Quy mô: {exam.partsCount} phần · {exam.totalQuestions} câu</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <Link href={`/thi-thu/${exam.id}`} className="w-full">
                    <Button variant="primary" className="w-full justify-center gap-2 bg-[#0095F6] hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl shadow-sm">
                      <Play className="h-4 w-4 fill-current" />
                      <span>Xem hướng dẫn & Vào thi</span>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
