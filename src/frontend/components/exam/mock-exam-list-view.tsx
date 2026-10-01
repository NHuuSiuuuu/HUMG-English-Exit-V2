"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { ExamListItemDTO } from "@/shared/types/exam";
import {
  Clock,
  HelpCircle,
  ArrowLeft,
  Play,
  FileSpreadsheet,
  History,
  BookOpen,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { ExamGuideModal } from "./exam-guide-modal";

interface MockExamListViewProps {
  exams: ExamListItemDTO[];
}

/**
 * Giao diện danh sách đề thi thử có nút xem Hướng dẫn quy chế (Modal Blur) và Lịch sử thi
 */
export function MockExamListView({ exams }: MockExamListViewProps) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Tiêu đề trang & Thanh công cụ hành động */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Về trang chủ</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl tracking-tight">
              Thi thử Chuẩn đầu ra 60 Phút
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Mô phỏng áp lực phòng thi với đầy đủ 14 phần thi liên tục. Đồng hồ đếm ngược được tính toán chính xác trên máy chủ và tự động lưu đáp án sau mỗi câu làm.
            </p>
          </div>

          {/* Cụm 2 nút hành động phong cách 3D xúc giác */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Nút Xem hướng dẫn & Quy chế thi */}
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-bold flex items-center gap-2 border border-slate-200/80 dark:border-slate-800 shadow-[0_3px_0_0_#cbd5e1] dark:shadow-[0_3px_0_0_#334155] active:translate-y-[2px] active:shadow-[0_1px_0_0_#cbd5e1] transition-all cursor-pointer min-h-[42px]"
            >
              <BookOpen className="w-4 h-4 text-[#0095F6]" />
              <span>Xem hướng dẫn & Quy chế</span>
            </button>

            {/* Nút Lịch sử thi */}
            <Link
              href="/thi-thu/lich-su"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-bold flex items-center gap-2 border border-slate-200/80 dark:border-slate-800 shadow-[0_3px_0_0_#cbd5e1] dark:shadow-[0_3px_0_0_#334155] active:translate-y-[2px] active:shadow-[0_1px_0_0_#cbd5e1] transition-all cursor-pointer min-h-[42px]"
            >
              <History className="w-4 h-4 text-purple-600" />
              <span>Lịch sử thi của tôi</span>
            </Link>
          </div>
        </div>

        {/* Danh sách đề thi hoặc Trạng thái rỗng */}
        {exams.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
            <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Chưa có đề thi thử
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Các bộ đề thi thử mô phỏng 60 phút đang được ban chuyên môn thẩm định và sẽ sớm được công bố.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card
                key={exam.id}
                className="flex flex-col justify-between hover:ring-2 hover:ring-[#0095F6]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-in-out bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="default"
                      className="text-xs bg-[#0095F6] text-white hover:bg-sky-600 font-extrabold"
                    >
                      {exam.code}
                    </Badge>
                    <span className="text-xs text-slate-400 font-medium">
                      {exam.attemptsCount} lượt thi
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {exam.title}
                  </CardTitle>
                  <CardDescription className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mt-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#0095F6]" />
                      <span>Thời gian: {exam.durationMinutes} phút</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-3.5 w-3.5 text-purple-500" />
                      <span>
                        Quy mô: {exam.partsCount} phần · {exam.totalQuestions} câu
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <Link href={`/thi-thu/${exam.id}`} className="w-full">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full justify-center gap-2"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      <span>Vào thi ngay</span>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal hướng dẫn quy chế thi với backdrop-blur */}
      <ExamGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
