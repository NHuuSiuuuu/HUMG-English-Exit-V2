"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Clock,
  Layers,
  FileCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  ExternalLink,
} from "lucide-react";
import { EXAM_PARTS } from "@/shared/constants/exam-parts";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { cn } from "@/frontend/lib/utils";

// Mock danh sách bài có sẵn trong Kho phần để admin chọn ghép vào đề
const MOCK_PART_BANK_ITEMS: Record<number, { id: string; title: string; source: string; questionsCount: number }[]> = {
  1: [
    { id: "p1-ket5-t1", title: "Biển báo trường học & nhà ga", source: "KET 5 · Test 1", questionsCount: 5 },
    { id: "p1-ket5-t2", title: "Thông báo sân bay & bảo tàng", source: "KET 5 · Test 2", questionsCount: 5 },
    { id: "p1-ket6-t1", title: "Bảng tin thư viện & cửa hàng", source: "KET 6 · Test 1", questionsCount: 5 },
  ],
  2: [
    { id: "p2-ket5-t1", title: "Từ vựng về kỳ nghỉ & thời tiết", source: "KET 5 · Test 1", questionsCount: 5 },
    { id: "p2-ket5-t2", title: "Từ vựng về trường đại học & đồ dùng", source: "KET 5 · Test 2", questionsCount: 5 },
  ],
  3: [
    { id: "p3-ket5-t1", title: "Đối đáp hỏi đường & mua sắm", source: "KET 5 · Test 1", questionsCount: 5 },
    { id: "p3-ket5-t2", title: "Đối đáp lên kế hoạch cuối tuần", source: "KET 5 · Test 2", questionsCount: 5 },
  ],
  4: [
    { id: "p4-ket5-t1", title: "Đọc hiểu: Cuộc sống sinh viên quốc tế", source: "KET 5 · Test 1", questionsCount: 7 },
    { id: "p4-ket5-t2", title: "Đọc hiểu: Công việc tình nguyện viên bảo tồn", source: "KET 5 · Test 2", questionsCount: 7 },
  ],
  5: [
    { id: "p5-ket5-t1", title: "Điền đoạn: Lịch sử xe đạp điện", source: "KET 5 · Test 1", questionsCount: 8 },
    { id: "p5-ket5-t2", title: "Điền đoạn: Thói quen ăn sáng lành mạnh", source: "KET 5 · Test 2", questionsCount: 8 },
  ],
  6: [
    { id: "p6-ket5-t1", title: "Đoán từ: Đồ dùng trong bếp & phòng khách", source: "KET 5 · Test 1", questionsCount: 5 },
  ],
  7: [
    { id: "p7-ket5-t1", title: "Điền 1 từ: Email gửi bạn bè về bữa tiệc", source: "KET 5 · Test 1", questionsCount: 10 },
  ],
  8: [
    { id: "p8-ket5-t1", title: "Điền form: Đăng ký câu lạc bộ tiếng Anh", source: "KET 5 · Test 1", questionsCount: 5 },
  ],
  9: [
    { id: "p9-ket5-t1", title: "Viết note ngắn: Trả lời lời mời xem bóng đá", source: "KET 5 · Test 1", questionsCount: 1 },
  ],
  10: [
    { id: "p10-ket5-t1", title: "Listening 1: 5 hội thoại tranh ảnh KET 5", source: "KET 5 · Test 1", questionsCount: 5 },
    { id: "p10-ket5-t2", title: "Listening 1: 5 hội thoại tranh ảnh KET 6", source: "KET 6 · Test 1", questionsCount: 5 },
  ],
  11: [
    { id: "p11-ket5-t1", title: "Listening 2: Ghép tên người với nghề nghiệp", source: "KET 5 · Test 1", questionsCount: 5 },
  ],
  12: [
    { id: "p12-ket5-t1", title: "Listening 3: Hội thoại dài chọn A/B/C", source: "KET 5 · Test 1", questionsCount: 5 },
  ],
  13: [
    { id: "p13-ket5-t1", title: "Listening 4: Điền thông tin chuyến đi du lịch", source: "KET 5 · Test 1", questionsCount: 5 },
  ],
  14: [
    { id: "p14-ket5-t1", title: "Listening 5: Điền thông tin lớp học nấu ăn", source: "KET 5 · Test 1", questionsCount: 5 },
  ],
};

export function ExamBuilderForm() {
  const [examCode, setExamCode] = React.useState("KET-2026-T6");
  const [examTitle, setExamTitle] = React.useState("Đề thi thử Chuẩn đầu ra số 06");
  const [durationMinutes, setDurationMinutes] = React.useState(60);
  const [difficulty, setDifficulty] = React.useState("Tiêu chuẩn KET");
  const [instructions, setInstructions] = React.useState(
    "Bài thi gồm 14 phần liên tục trong 60 phút. Hệ thống tự động tính giờ và lưu đáp án sau mỗi câu làm."
  );

  // Mảng lưu ID bài được ghép cho từng Part (từ Part 1 đến Part 14)
  const [selectedParts, setSelectedParts] = React.useState<Record<number, string>>({
    1: "p1-ket5-t1",
    2: "p2-ket5-t1",
    3: "p3-ket5-t1",
    4: "p4-ket5-t1",
    5: "p5-ket5-t1",
    6: "p6-ket5-t1",
    7: "p7-ket5-t1",
    8: "p8-ket5-t1",
    9: "p9-ket5-t1",
    10: "p10-ket5-t1",
    11: "p11-ket5-t1",
    12: "p12-ket5-t1",
    13: "p13-ket5-t1",
    14: "p14-ket5-t1",
  });

  const [isSaved, setIsSaved] = React.useState(false);

  // Tính số lượng Part đã ghép
  const totalPartsAttached = Object.keys(selectedParts).length;
  const isFull = totalPartsAttached === 14;

  const handleSelectPart = (partNo: number, itemId: string) => {
    setSelectedParts((prev) => ({
      ...prev,
      [partNo]: itemId,
    }));
  };

  const handleResetToDefault = () => {
    const defaults: Record<number, string> = {};
    for (let i = 1; i <= 14; i++) {
      defaults[i] = MOCK_PART_BANK_ITEMS[i]?.[0]?.id || "";
    }
    setSelectedParts(defaults);
  };

  const handleSave = (status: "draft" | "published") => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Thanh điều hướng & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/de-thi"
            className="w-9 h-9 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors shadow-sm"
            title="Quay lại danh sách đề thi"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Quản lý đề thi thử
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Badge variant="default" className="text-[11px]">
                {examCode} · 14 Parts
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              Ghép đề thi thử chuẩn đầu ra 60 Phút
            </h1>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetToDefault}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Ghép tự động KET 5</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSave("draft")}
            className="text-xs font-semibold"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            <span>Lưu bản nháp</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleSave("published")}
            className="text-xs font-bold shadow-[0_4px_12px_rgba(0,149,246,0.25)]"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            <span>Công khai đề thi</span>
          </Button>
        </div>
      </div>

      {/* Thông báo lưu thành công */}
      {isSaved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>Đề thi thử {examCode} đã được lưu thành công và sẵn sàng phục vụ sinh viên thi thử!</span>
        </div>
      )}

      {/* Cấu trúc 2 cột: Cột trái (Thông tin & Danh sách 14 Part) - Cột phải (Tiến độ & Tổng hợp) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột chính (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Khối 1: Thông tin cấu hình đề */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#0095F6]" />
              <span>1. Thông số thiết lập đề thi</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Mã đề thi *
                </label>
                <input
                  type="text"
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value)}
                  placeholder="VD: KET-2026-T1"
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0095F6]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Tên hiển thị đề thi *
                </label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="VD: Đề thi thử Chuẩn đầu ra số 06"
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0095F6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Thời lượng làm bài (Phút) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    min={15}
                    max={120}
                    className="w-full min-h-[42px] px-3.5 pr-14 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0095F6]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    Phút
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Mức độ khó
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0095F6]"
                >
                  <option value="Dễ - Cơ bản">Dễ - Cơ bản</option>
                  <option value="Tiêu chuẩn KET">Tiêu chuẩn KET A2</option>
                  <option value="Nâng cao nhẹ">Nâng cao nhẹ</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Trạng thái
                </label>
                <select className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0095F6]">
                  <option value="published">Công khai (Sinh viên thấy)</option>
                  <option value="draft">Bản nháp (Chỉ Admin)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Khối 2: Danh sách 14 Slot ghép Part */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-500" />
                <span>2. Chọn ghép 14 Part từ Kho ({totalPartsAttached} / 14 Parts)</span>
              </h2>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Ghép từ nhiều nguồn khác nhau
              </span>
            </div>

            {/* Danh sách 14 Part Slot */}
            <div className="space-y-3">
              {EXAM_PARTS.map((part) => {
                const availableOptions = MOCK_PART_BANK_ITEMS[part.partNo] || [];
                const currentSelectedId = selectedParts[part.partNo];
                const isSelected = Boolean(currentSelectedId);
                const isListening = part.skill === "listening";

                return (
                  <div
                    key={part.partNo}
                    className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    {/* Cột trái: Thông tin vị trí Part */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={cn(
                          "w-10 h-10 rounded-xl font-heading font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm",
                          isListening
                            ? "bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300"
                            : "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300"
                        )}
                      >
                        P{part.partNo}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white truncate">
                            {part.titleVi}
                          </p>
                          <span className="text-[11px] text-slate-400 font-normal">
                            ({part.totalQuestions} câu)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {part.questionType}
                        </p>
                      </div>
                    </div>

                    {/* Cột phải: Bộ chọn bài từ kho phần */}
                    <div className="flex items-center gap-2 shrink-0">
                      {availableOptions.length > 0 ? (
                        <select
                          value={currentSelectedId || ""}
                          onChange={(e) => handleSelectPart(part.partNo, e.target.value)}
                          className={cn(
                            "min-h-[38px] px-3 rounded-xl border text-xs font-semibold outline-none focus:ring-2 focus:ring-[#0095F6]",
                            isSelected
                              ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                              : "border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                          )}
                        >
                          <option value="">-- Chưa chọn bài từ kho --</option>
                          {availableOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.source} · {opt.title} ({opt.questionsCount} câu)
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs text-rose-500 font-medium bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-lg">
                          Chưa có bài trong kho
                        </span>
                      )}

                      <Link
                        href={`/admin/part-bank/tao-moi`}
                        target="_blank"
                        className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        title="Tạo thêm bài mới cho Part này"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cột phụ bên phải (1/3): Dashboard thống kê đề */}
        <div className="space-y-6">
          {/* Card trạng thái ghép đề */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0095F6]" />
              <span>Tiến độ hoàn thiện đề</span>
            </h3>

            {/* Thanh tiến độ */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Số phần đã ghép:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {totalPartsAttached} / 14 Parts
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-[#0095F6] transition-all duration-500 rounded-full"
                  style={{ width: `${(totalPartsAttached / 14) * 100}%` }}
                />
              </div>
            </div>

            {/* Chỉ số tổng hợp */}
            <div className="space-y-2.5 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Thời gian làm bài:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-500" /> {durationMinutes} phút
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Quy mô câu hỏi:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  75 câu trắc nghiệm + 1 bài viết
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Khối Reading & Writing:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  9 Parts (P1 – P9)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Khối Listening:</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">
                  5 Parts (P10 – P14)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Trạng thái sẵn sàng:</span>
                {isFull ? (
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đủ 14 Parts
                  </span>
                ) : (
                  <span className="font-bold text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Còn thiếu Part
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Quy tắc PRD.md: Đề thi thử được ghép từ 14 phần độc lập trong kho. Mỗi phần có thể lấy từ các bộ KET khác nhau để tạo nên một mã đề hoàn toàn mới.
              </p>
            </div>
          </div>

          {/* Nút hành động nhanh */}
          <div className="space-y-2.5">
            <Button
              type="button"
              variant="primary"
              onClick={() => handleSave("published")}
              className="w-full justify-center gap-2 min-h-[46px] shadow-[0_4px_12px_rgba(0,149,246,0.25)]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Phát hành đề thi ngay</span>
            </Button>

            <Link href="/thi-thu" target="_blank" className="block w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-2 min-h-[44px]"
              >
                <span>Xem phòng thi thử của thí sinh</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
