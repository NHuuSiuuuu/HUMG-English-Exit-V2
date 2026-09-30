"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  BookOpen,
  Headphones,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { EXAM_PARTS, type ExamPartDef } from "@/shared/constants/exam-parts";
import { validateExamForPublish } from "@/shared/schemas/exam.schema";
import type {
  CreateExamInput,
  ExamDetailDTO,
  ExamCompletenessIssue,
} from "@/shared/types/exam";
import type { PartListItemDTO } from "@/shared/types/part";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { cn } from "@/frontend/lib/utils";

interface ExamBuilderFormProps {
  availableParts: PartListItemDTO[];
  initialExam?: ExamDetailDTO | null;
}

export function ExamBuilderForm({ availableParts, initialExam }: ExamBuilderFormProps) {
  const router = useRouter();

  const isEditing = Boolean(initialExam?.id);

  // 1. Thông số thiết lập đề thi
  const [examCode, setExamCode] = React.useState(initialExam?.code || "KET-2026-T1");
  const [examTitle, setExamTitle] = React.useState(
    initialExam?.title || "Đề thi thử Chuẩn đầu ra số 01"
  );
  const [durationMinutes, setDurationMinutes] = React.useState(
    initialExam?.durationMinutes || 60
  );
  const [difficulty, setDifficulty] = React.useState(initialExam?.difficulty || "MEDIUM");
  const [description, setDescription] = React.useState(
    initialExam?.description ||
      "Bài thi chuẩn Cambridge KET gồm 14 phần liên tục trong 60 phút. Hệ thống tự động tính giờ và lưu đáp án."
  );

  // 2. Mảng lưu PartId được ghép cho từng PartNo (từ 1 đến 14)
  const [selectedParts, setSelectedParts] = React.useState<Record<number, string>>(() => {
    const initMap: Record<number, string> = {};
    if (initialExam?.parts) {
      initialExam.parts.forEach((p) => {
        initMap[p.partNo] = p.partId;
      });
    }
    return initMap;
  });

  // Trạng thái lưu & thông báo
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = React.useState<string | null>(null);
  const [validationIssues, setValidationIssues] = React.useState<ExamCompletenessIssue[]>([]);

  // Gom nhóm các bài có trong Kho phần theo PartNo
  const partsByNo = React.useMemo(() => {
    const map: Record<number, PartListItemDTO[]> = {};
    for (let i = 1; i <= 14; i++) map[i] = [];
    availableParts.forEach((p) => {
      if (map[p.partNo]) {
        map[p.partNo].push(p);
      }
    });
    return map;
  }, [availableParts]);

  // Danh sách các bộ đề gom nhóm (Group set) có trong kho
  const availableGroupSets = React.useMemo(() => {
    const sets = new Set<string>();
    availableParts.forEach((p) => {
      if (p.groupSet && p.groupSet.trim() !== "") {
        sets.add(p.groupSet.trim());
      }
    });
    return Array.from(sets);
  }, [availableParts]);

  // Tính số lượng Part đã gán
  const assignedPartsCount = Object.values(selectedParts).filter(Boolean).length;
  const isFull14Parts = assignedPartsCount === 14;

  // Tính tổng số câu hỏi từ các part đã chọn
  const totalQuestionsCalculated = React.useMemo(() => {
    let count = 0;
    Object.entries(selectedParts).forEach(([partNoStr, partId]) => {
      if (!partId) return;
      const part = availableParts.find((p) => p.id === partId);
      if (part) {
        count += part.totalQuestions;
      }
    });
    return count;
  }, [selectedParts, availableParts]);

  // Danh sách các Part còn thiếu
  const missingPartNos = React.useMemo(() => {
    const missing: number[] = [];
    for (let i = 1; i <= 14; i++) {
      if (!selectedParts[i]) {
        missing.push(i);
      }
    }
    return missing;
  }, [selectedParts]);

  // Thao tác chọn part cho một vị trí
  const handleSelectPart = (partNo: number, partId: string) => {
    setSelectedParts((prev) => ({
      ...prev,
      [partNo]: partId,
    }));
  };

  // Tính năng: Tự động ghép các bài cùng bộ đề (ví dụ KET 5)
  const handleAutoAssignByGroup = (groupName: string) => {
    const newAssignments = { ...selectedParts };
    for (let i = 1; i <= 14; i++) {
      const match = partsByNo[i]?.find((p) => p.groupSet === groupName);
      if (match) {
        newAssignments[i] = match.id;
      }
    }
    setSelectedParts(newAssignments);
  };

  // Tính toán kiểm tra thẩm định Realtime
  const realtimeIssues = React.useMemo<ExamCompletenessIssue[]>(() => {
    const payload: Partial<CreateExamInput> = {
      code: examCode.trim(),
      title: examTitle.trim(),
      partSelections: Object.entries(selectedParts)
        .filter(([_, partId]) => Boolean(partId))
        .map(([pNo, partId]) => ({
          partNo: Number(pNo),
          partId,
        })),
    };
    return validateExamForPublish(payload);
  }, [examCode, examTitle, selectedParts]);

  // Xử lý gửi dữ liệu lên Backend API
  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    setServerError(null);
    setSaveSuccessMessage(null);

    // Nếu bấm công khai: kiểm tra đủ 14 phần trước
    if (status === "PUBLISHED") {
      if (realtimeIssues.length > 0) {
        setValidationIssues(realtimeIssues);
        setServerError(
          "Đề thi chưa đủ 14 phần hoặc chưa đạt tiêu chuẩn để công khai. Vui lòng xem danh sách điểm cần sửa bên phải."
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload: CreateExamInput = {
        code: examCode.trim(),
        title: examTitle.trim(),
        description: description.trim() || null,
        durationMinutes,
        difficulty,
        status,
        partSelections: Object.entries(selectedParts)
          .filter(([_, partId]) => Boolean(partId))
          .map(([pNo, partId]) => ({
            partNo: Number(pNo),
            partId,
          })),
      };

      const url = isEditing
        ? `/api/admin/exams/${initialExam?.id}`
        : "/api/admin/exams";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Không thể lưu đề thi. Vui lòng kiểm tra lại dữ liệu.");
        if (data.issues) {
          setValidationIssues(data.issues);
        }
        return;
      }

      setSaveSuccessMessage(
        status === "PUBLISHED"
          ? `Đã công khai đề thi "${examCode}" thành công! Sinh viên đã có thể bắt đầu thi thử.`
          : `Đã lưu bản nháp đề thi "${examCode}" thành công!`
      );

      // Chuyển hướng sau 1.5 giây
      setTimeout(() => {
        router.push("/admin/de-thi");
        router.refresh();
      }, 1500);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Thanh điều hướng & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/de-thi"
            className="w-9 h-9 rounded-xl border border-border bg-surface flex items-center justify-center text-muted hover:text-foreground transition-colors shadow-sm"
            title="Quay lại danh sách đề thi"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Quản lý đề thi thử
              </span>
              <span className="text-muted">•</span>
              <Badge variant="default" className="text-[11px]">
                {examCode} · {assignedPartsCount}/14 Parts
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5">
              {isEditing ? "Chỉnh sửa & Ghép lại Đề thi" : "Ghép đề thi thử chuẩn đầu ra 60 Phút"}
            </h1>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2">
          {/* Ghép tự động nếu có bộ gom nhóm */}
          {availableGroupSets.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-xs text-muted font-medium">Ghép nhanh:</span>
              {availableGroupSets.slice(0, 2).map((setName) => (
                <Button
                  key={setName}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAutoAssignByGroup(setName)}
                  className="text-xs font-semibold"
                  title={`Tự động ghép tất cả các part thuộc bộ ${setName}`}
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  <span>{setName}</span>
                </Button>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleSave("DRAFT")}
            className="text-xs font-semibold"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 mr-1.5" />
            )}
            <span>Lưu bản nháp</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleSave("PUBLISHED")}
            className="text-xs font-bold shadow-[0_4px_12px_rgba(0,149,246,0.25)]"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            )}
            <span>Công khai đề thi</span>
          </Button>
        </div>
      </div>

      {/* Thông báo lỗi server hoặc thành công */}
      {serverError && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {saveSuccessMessage && (
        <div className="p-4 rounded-2xl bg-success/10 border border-success/20 text-success text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Cấu trúc 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột chính (2/3): Thông số đề & Bảng ghép 14 Part */}
        <div className="lg:col-span-2 space-y-6">
          {/* Khối 1: Thông số thiết lập đề thi */}
          <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground pb-3 border-b border-border flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary" />
              <span>1. Thông số thiết lập đề thi</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Mã đề thi */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Mã đề thi (Code) *
                </label>
                <input
                  type="text"
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value.toUpperCase())}
                  placeholder="VD: KET-2026-T1"
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-border bg-surface-raised text-xs sm:text-sm font-mono font-bold text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Tên hiển thị đề thi */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Tên hiển thị đề thi *
                </label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="VD: Đề thi thử Chuẩn đầu ra số 01"
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-border bg-surface-raised text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Thời lượng */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Thời lượng làm bài (Phút) *
                </label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  min={15}
                  max={180}
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-border bg-surface-raised text-xs sm:text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Mức độ */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Độ khó</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-xl border border-border bg-surface-raised text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary font-medium"
                >
                  <option value="EASY">Dễ (Ôn tập làm quen)</option>
                  <option value="MEDIUM">Tiêu chuẩn Cambridge KET (Đề xuất)</option>
                  <option value="HARD">Nâng cao</option>
                </select>
              </div>

              {/* Hướng dẫn thí sinh */}
              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Mô tả / Hướng dẫn thí sinh
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Hướng dẫn chung khi bắt đầu làm đề..."
                  className="w-full min-h-[42px] px-3.5 rounded-xl border border-border bg-surface-raised text-xs sm:text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Khối 2: Ghép 14 Phần từ Kho phần */}
          <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                  2. Chọn bài ghép cho 14 phần đề thi ({assignedPartsCount}/14 đã chọn)
                </h2>
              </div>
              <span className="text-xs text-muted">
                Tổng cộng: <strong className="text-foreground">{totalQuestionsCalculated}</strong> câu hỏi
              </span>
            </div>

            {/* PHẦN 1: KHỐI READING & WRITING (PART 1 - 9) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 p-2.5 rounded-xl border border-purple-200 dark:border-purple-900/50">
                <BookOpen className="w-4 h-4" />
                <span>Khối Reading & Writing (Part 1 đến Part 9 — 50 câu + 1 bài viết note)</span>
              </div>

              <div className="space-y-2.5">
                {EXAM_PARTS.slice(0, 9).map((def) => {
                  const partList = partsByNo[def.partNo] || [];
                  const selectedId = selectedParts[def.partNo] || "";
                  const selectedItem = partList.find((p) => p.id === selectedId);

                  return (
                    <div
                      key={def.partNo}
                      className={cn(
                        "p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                        selectedId
                          ? "border-border bg-surface-raised/40"
                          : "border-warning/30 bg-warning/5"
                      )}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                            P{def.partNo}
                          </span>
                          <span className="font-bold text-foreground text-xs sm:text-sm">
                            Part {def.partNo}: {def.titleVi}
                          </span>
                          <span className="text-[11px] text-muted hidden sm:inline">
                            ({def.totalQuestions} câu · {def.questionType})
                          </span>
                        </div>

                        {selectedItem ? (
                          <div className="flex items-center gap-2 pl-8 text-xs text-muted">
                            <span className="text-success font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" /> {selectedItem.title}
                            </span>
                            <span className="text-foreground/40">•</span>
                            <span className="font-mono text-[11px] text-primary">
                              {selectedItem.sourceLabel}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-warning pl-8">
                            Chưa chọn bài cho Part {def.partNo}
                          </p>
                        )}
                      </div>

                      {/* Dropdown chọn bài có trong kho */}
                      <div className="flex items-center gap-2 sm:max-w-xs w-full shrink-0">
                        {partList.length > 0 ? (
                          <select
                            value={selectedId}
                            onChange={(e) => handleSelectPart(def.partNo, e.target.value)}
                            className={cn(
                              "w-full min-h-[38px] px-3 rounded-xl border text-xs outline-none transition-colors font-medium",
                              selectedId
                                ? "border-border bg-surface text-foreground"
                                : "border-warning/50 bg-surface text-warning font-bold"
                            )}
                          >
                            <option value="">-- Chọn bài từ Kho phần --</option>
                            {partList.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.title} ({p.sourceLabel}) - {p.totalQuestions} câu
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center justify-between w-full p-2 rounded-xl bg-surface border border-dashed border-border text-[11px] text-muted">
                            <span>Chưa có bài Part {def.partNo}</span>
                            <Link
                              href="/admin/part-bank/tao-moi"
                              className="text-primary hover:underline font-semibold flex items-center gap-1"
                              target="_blank"
                            >
                              <span>Tạo mới</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PHẦN 2: KHỐI LISTENING (PART 10 - 14) */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                <Headphones className="w-4 h-4" />
                <span>Khối Listening (Part 10 đến Part 14 — 25 câu nghe audio)</span>
              </div>

              <div className="space-y-2.5">
                {EXAM_PARTS.slice(9, 14).map((def) => {
                  const partList = partsByNo[def.partNo] || [];
                  const selectedId = selectedParts[def.partNo] || "";
                  const selectedItem = partList.find((p) => p.id === selectedId);

                  return (
                    <div
                      key={def.partNo}
                      className={cn(
                        "p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                        selectedId
                          ? "border-border bg-surface-raised/40"
                          : "border-warning/30 bg-warning/5"
                      )}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
                            P{def.partNo}
                          </span>
                          <span className="font-bold text-foreground text-xs sm:text-sm">
                            Part {def.partNo}: {def.titleVi}
                          </span>
                          <span className="text-[11px] text-muted hidden sm:inline">
                            ({def.totalQuestions} câu · {def.questionType})
                          </span>
                        </div>

                        {selectedItem ? (
                          <div className="flex items-center gap-2 pl-8 text-xs text-muted">
                            <span className="text-success font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" /> {selectedItem.title}
                            </span>
                            <span className="text-foreground/40">•</span>
                            <span className="font-mono text-[11px] text-primary">
                              {selectedItem.sourceLabel}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-warning pl-8">
                            Chưa chọn bài nghe cho Part {def.partNo}
                          </p>
                        )}
                      </div>

                      {/* Dropdown chọn bài có trong kho */}
                      <div className="flex items-center gap-2 sm:max-w-xs w-full shrink-0">
                        {partList.length > 0 ? (
                          <select
                            value={selectedId}
                            onChange={(e) => handleSelectPart(def.partNo, e.target.value)}
                            className={cn(
                              "w-full min-h-[38px] px-3 rounded-xl border text-xs outline-none transition-colors font-medium",
                              selectedId
                                ? "border-border bg-surface text-foreground"
                                : "border-warning/50 bg-surface text-warning font-bold"
                            )}
                          >
                            <option value="">-- Chọn bài nghe từ Kho --</option>
                            {partList.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.title} ({p.sourceLabel}) - {p.totalQuestions} câu
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center justify-between w-full p-2 rounded-xl bg-surface border border-dashed border-border text-[11px] text-muted">
                            <span>Chưa có bài Part {def.partNo}</span>
                            <Link
                              href="/admin/part-bank/tao-moi"
                              className="text-primary hover:underline font-semibold flex items-center gap-1"
                              target="_blank"
                            >
                              <span>Tạo mới</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Cột phụ bên phải (1/3): Bảng tiến độ thẩm định 14 Parts */}
        <div className="space-y-6">
          <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm space-y-4 sticky top-20">
            <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Tiến độ ghép 14 phần (KET)</span>
            </h3>

            {/* Tiến độ x/14 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted font-medium">Số phần đã hoàn thành:</span>
                <span
                  className={cn(
                    "font-bold px-2 py-0.5 rounded-full text-[11px]",
                    isFull14Parts
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  )}
                >
                  {assignedPartsCount} / 14 Parts
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-surface-raised overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300 rounded-full",
                    isFull14Parts ? "bg-success" : "bg-primary"
                  )}
                  style={{ width: `${(assignedPartsCount / 14) * 100}%` }}
                />
              </div>
            </div>

            {/* Thống kê chi tiết */}
            <div className="space-y-2.5 pt-2 text-xs border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-muted">Tổng số câu hỏi:</span>
                <span className="font-bold text-foreground">
                  {totalQuestionsCalculated} câu
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Thời lượng làm bài:</span>
                <span className="font-bold text-foreground">{durationMinutes} phút</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Trạng thái thẩm định:</span>
                {isFull14Parts ? (
                  <span className="font-bold text-success flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đủ điều kiện công khai
                  </span>
                ) : (
                  <span className="font-bold text-warning flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Chưa đủ 14 phần
                  </span>
                )}
              </div>
            </div>

            {/* Danh sách các Part còn thiếu nếu có */}
            {missingPartNos.length > 0 && (
              <div className="pt-3 border-t border-border space-y-2">
                <span className="text-[11px] font-bold text-warning uppercase tracking-wider">
                  Các Part còn thiếu ({missingPartNos.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {missingPartNos.map((pNo) => (
                    <span
                      key={pNo}
                      className="px-2 py-0.5 rounded-lg bg-warning/10 text-warning text-xs font-semibold"
                    >
                      Part {pNo}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Danh sách lỗi thẩm định từ server nếu có */}
            {validationIssues.length > 0 && (
              <div className="pt-3 border-t border-border space-y-2">
                <span className="text-[11px] font-bold text-destructive uppercase tracking-wider">
                  Điểm cần khắc phục:
                </span>
                <ul className="space-y-1 text-[11px] text-destructive list-disc pl-4">
                  {validationIssues.map((issue, idx) => (
                    <li key={idx}>{issue.message}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-border space-y-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleSave("PUBLISHED")}
                className="w-full text-xs font-bold"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                )}
                <span>Công khai đề thi ngay</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleSave("DRAFT")}
                className="w-full text-xs font-semibold"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                <span>Lưu nháp để ghép tiếp sau</span>
              </Button>

              <p className="text-[11px] text-muted text-center pt-1 leading-relaxed">
                Nút <strong>Công khai</strong> chỉ mở khi bạn ghép đủ 14 phần theo tiêu chuẩn Cambridge KET.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
