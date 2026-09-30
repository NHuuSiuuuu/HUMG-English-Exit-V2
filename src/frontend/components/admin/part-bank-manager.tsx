"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Eye,
  Edit,
  Database,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  AlertCircle,
  FileQuestion,
  Headphones,
  BookOpen,
} from "lucide-react";
import { EXAM_PARTS } from "@/shared/constants/exam-parts";
import type { PartListItemDTO, PartBankStatsDTO } from "@/shared/types/part";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { cn } from "@/frontend/lib/utils";

interface PartBankManagerProps {
  initialParts: PartListItemDTO[];
  initialStats: PartBankStatsDTO;
}

export function PartBankManager({ initialParts, initialStats }: PartBankManagerProps) {
  const [parts, setParts] = React.useState<PartListItemDTO[]>(initialParts);
  const [stats, setStats] = React.useState<PartBankStatsDTO>(initialStats);
  const [activeTab, setActiveTab] = React.useState<"list" | "matrix">("list");

  // Bộ lọc
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSkill, setSelectedSkill] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [selectedPartNo, setSelectedPartNo] = React.useState<string>("all");

  // Xóa Part
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  // Lọc dữ liệu client-side nhanh
  const filteredParts = React.useMemo(() => {
    return parts.filter((p) => {
      // Tìm kiếm
      if (searchTerm.trim() !== "") {
        const s = searchTerm.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(s);
        const matchesSource = p.sourceLabel.toLowerCase().includes(s);
        const matchesGroup = p.groupSet.toLowerCase().includes(s);
        if (!matchesTitle && !matchesSource && !matchesGroup) return false;
      }

      // Kỹ năng
      if (selectedSkill !== "all" && p.skill !== selectedSkill) return false;

      // Trạng thái
      if (selectedStatus !== "all" && p.status !== selectedStatus) return false;

      // PartNo
      if (selectedPartNo !== "all" && p.partNo !== Number(selectedPartNo)) return false;

      return true;
    });
  }, [parts, searchTerm, selectedSkill, selectedStatus, selectedPartNo]);

  // Xử lý xóa Part
  const handleDeletePart = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/parts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Không thể xóa Part này");
      }

      // Cập nhật lại danh sách state
      const updated = parts.filter((p) => p.id !== id);
      setParts(updated);

      // Cập nhật stats
      setStats((prev) => ({
        ...prev,
        totalParts: Math.max(0, prev.totalParts - 1),
      }));

      setFeedbackMessage({ text: "Đã xóa bài luyện khỏi Kho phần thành công!", type: "success" });
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch {
      setFeedbackMessage({ text: "Lỗi khi xóa bài luyện. Vui lòng thử lại.", type: "error" });
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Hành động */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Kho phần đề thi (Part bank)
          </h1>
          <p className="text-sm text-muted mt-1">
            Quản lý ngân hàng 14 dạng bài Cambridge KET trong cơ sở dữ liệu. Mỗi phần là một đơn vị độc lập dùng cho cả ôn luyện và ghép đề.
          </p>
        </div>
        <Link href="/admin/part-bank/tao-moi">
          <Button
            variant="primary"
            size="sm"
            className="gap-1.5 text-xs font-semibold shadow-[0_4px_12px_rgba(0,149,246,0.25)]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tạo Part mới</span>
          </Button>
        </Link>
      </div>

      {/* Thông báo thao tác */}
      {feedbackMessage && (
        <div
          className={cn(
            "p-3.5 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in",
            feedbackMessage.type === "success"
              ? "bg-success/10 border border-success/20 text-success"
              : "bg-destructive/10 border border-destructive/20 text-destructive"
          )}
        >
          {feedbackMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* 4 Thẻ thống kê số liệu thực tế từ Database */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Thẻ 1: Tổng số bài */}
        <div className="p-4 rounded-2xl border border-border bg-surface shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold">Tổng số bài trong kho</span>
            <Database className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{stats.totalParts}</div>
          <p className="text-[11px] text-muted">Bao gồm nháp & công khai</p>
        </div>

        {/* Thẻ 2: Đã công khai */}
        <div className="p-4 rounded-2xl border border-border bg-surface shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold">Đã công khai</span>
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-extrabold text-success">{stats.publishedCount}</div>
          <p className="text-[11px] text-muted">Sẵn sàng để sinh viên luyện & ghép đề</p>
        </div>

        {/* Thẻ 3: Bản nháp */}
        <div className="p-4 rounded-2xl border border-border bg-surface shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold">Bản nháp</span>
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-extrabold text-warning">{stats.draftCount}</div>
          <p className="text-[11px] text-muted">Đang soạn dở, chưa mở cho sinh viên</p>
        </div>

        {/* Thẻ 4: Độ phủ dạng bài */}
        <div className="p-4 rounded-2xl border border-border bg-surface shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold">Độ phủ Part KET</span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            {stats.coveredPartTypesCount} <span className="text-sm font-normal text-muted">/ 14 Part</span>
          </div>
          <p className="text-[11px] text-muted">Dạng bài đã có ít nhất 1 đề</p>
        </div>
      </div>

      {/* Switch Tab: Danh sách bài chi tiết vs Tổng quan 14 dạng bài */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("list")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
              activeTab === "list"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted hover:text-foreground hover:bg-surface-raised"
            )}
          >
            Danh sách bài trong kho ({filteredParts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("matrix")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
              activeTab === "matrix"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted hover:text-foreground hover:bg-surface-raised"
            )}
          >
            Tổng quan 14 dạng bài KET
          </button>
        </div>
      </div>

      {/* TAB 1: DANH SÁCH BÀI LUYỆN TRONG KHO */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {/* Thanh tìm kiếm & Bộ lọc */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-surface shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tiêu đề, nguồn đề, bộ đề..."
                className="w-full rounded-xl border border-border bg-surface-raised pl-9 pr-3 py-2 text-xs sm:text-sm text-foreground focus-visible:ring-2 focus-visible:ring-primary outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Lọc theo Kỹ năng */}
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="rounded-xl border border-border bg-surface-raised px-3 py-2 text-xs text-foreground font-medium outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">Tất cả kỹ năng</option>
                <option value="READING_WRITING">Reading & Writing (Part 1-9)</option>
                <option value="LISTENING">Listening (Part 10-14)</option>
              </select>

              {/* Lọc theo Part cụ thể */}
              <select
                value={selectedPartNo}
                onChange={(e) => setSelectedPartNo(e.target.value)}
                className="rounded-xl border border-border bg-surface-raised px-3 py-2 text-xs text-foreground font-medium outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">Tất cả Part (1–14)</option>
                {EXAM_PARTS.map((p) => (
                  <option key={p.partNo} value={p.partNo}>
                    Part {p.partNo}: {p.titleVi}
                  </option>
                ))}
              </select>

              {/* Lọc theo Trạng thái */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-xl border border-border bg-surface-raised px-3 py-2 text-xs text-foreground font-medium outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="PUBLISHED">Đã công khai</option>
                <option value="DRAFT">Bản nháp</option>
              </select>
            </div>
          </div>

          {/* Bảng dữ liệu Part thực tế */}
          <Card className="rounded-3xl border border-border shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-surface-raised/50 text-xs font-semibold text-muted">
                    <tr>
                      <th className="py-3.5 px-4">Part</th>
                      <th className="py-3.5 px-4">Tiêu đề bài & Nhãn nguồn</th>
                      <th className="py-3.5 px-4">Kỹ năng</th>
                      <th className="py-3.5 px-4">Dạng câu hỏi</th>
                      <th className="py-3.5 px-4 text-center">Số câu</th>
                      <th className="py-3.5 px-4 text-center">Trạng thái</th>
                      <th className="py-3.5 px-4">Ngày tạo</th>
                      <th className="py-3.5 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredParts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-muted space-y-3">
                          <FileQuestion className="w-10 h-10 text-muted mx-auto stroke-[1.5]" />
                          <div>
                            <p className="text-sm font-bold text-foreground">Không tìm thấy bài luyện nào</p>
                            <p className="text-xs text-muted mt-0.5">
                              {parts.length === 0
                                ? "Kho phần hiện tại chưa có đề. Bạn hãy bấm 'Tạo Part mới' để bắt đầu thêm bài!"
                                : "Không có bài nào phù hợp với bộ lọc hiện tại. Thử đổi điều kiện tìm kiếm xem nhé."}
                            </p>
                          </div>
                          {parts.length === 0 && (
                            <Link href="/admin/part-bank/tao-moi">
                              <Button variant="primary" size="sm" className="mt-2 text-xs font-semibold">
                                <Plus className="w-3.5 h-3.5 mr-1" />
                                <span>Tạo Part đầu tiên</span>
                              </Button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredParts.map((part) => {
                        const isListening = part.skill === "LISTENING";
                        return (
                          <tr key={part.id} className="hover:bg-surface-raised/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <span className="font-heading font-extrabold text-xs px-2.5 py-1 rounded-xl bg-primary/10 text-primary">
                                Part {part.partNo}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 max-w-xs">
                              <p className="font-bold text-foreground text-sm truncate" title={part.title}>
                                {part.title}
                              </p>
                              <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
                                <span className="font-semibold text-primary">{part.sourceLabel}</span>
                                <span>•</span>
                                <span>{part.groupSet}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <Badge variant={isListening ? "secondary" : "default"} className="text-[11px]">
                                {isListening ? "Listening" : "Reading & Writing"}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4 text-xs font-mono text-muted">
                              {part.questionType}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="text-xs font-bold text-foreground bg-surface-raised px-2 py-0.5 rounded-lg border border-border">
                                {part.totalQuestions} câu
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {part.status === "PUBLISHED" ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3 h-3" /> Công khai
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-warning bg-warning/10 px-2 py-0.5 rounded-full">
                                  <Clock className="w-3 h-3" /> Bản nháp
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-xs text-muted whitespace-nowrap">
                              {new Date(part.createdAt).toLocaleDateString("vi-VN")}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Link href="/admin/part-bank/tao-moi">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 min-h-0 min-w-0"
                                    title="Soạn thêm Part"
                                  >
                                    <Plus className="h-3.5 w-3.5 text-muted hover:text-foreground" />
                                  </Button>
                                </Link>

                                {/* Nút xóa có xác nhận */}
                                {deleteConfirmId === part.id ? (
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      className="h-7 px-2 text-[10px]"
                                      disabled={deletingId === part.id}
                                      onClick={() => handleDeletePart(part.id)}
                                    >
                                      Xóa ngay
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-1.5 text-[10px]"
                                      onClick={() => setDeleteConfirmId(null)}
                                    >
                                      Hủy
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 min-h-0 min-w-0 text-destructive hover:bg-destructive/10"
                                    title="Xóa Part này"
                                    onClick={() => setDeleteConfirmId(part.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: MA TRẬN 14 PART CHUẨN KET */}
      {activeTab === "matrix" && (
        <Card className="rounded-3xl border border-border shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-raised/50 text-xs font-semibold text-muted">
                  <tr>
                    <th className="py-3.5 px-4">STT Part</th>
                    <th className="py-3.5 px-4">Tên dạng bài chuẩn KET</th>
                    <th className="py-3.5 px-4">Kỹ năng</th>
                    <th className="py-3.5 px-4">Dạng câu hỏi</th>
                    <th className="py-3.5 px-4 text-center">Số câu chuẩn</th>
                    <th className="py-3.5 px-4 text-center">Số đề thực tế trong kho</th>
                    <th className="py-3.5 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {EXAM_PARTS.map((part) => {
                    const count = stats.countsByPartNo[part.partNo] || 0;
                    return (
                      <tr key={part.partNo} className="hover:bg-surface-raised/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-heading font-extrabold text-xs px-2.5 py-1 rounded-xl bg-primary/10 text-primary">
                            Part {part.partNo}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-foreground text-sm">{part.titleVi}</p>
                          <p className="text-xs text-muted font-sans">{part.titleEn}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            variant={part.skill === "reading_writing" ? "default" : "secondary"}
                            className="text-[11px]"
                          >
                            {part.skill === "reading_writing" ? "Reading & Writing" : "Listening"}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-muted">{part.questionType}</td>
                        <td className="py-3.5 px-4 text-center text-xs font-semibold text-foreground">
                          {part.totalQuestions}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={cn(
                              "text-xs font-bold px-2.5 py-1 rounded-xl",
                              count > 0
                                ? "bg-success/10 text-success border border-success/20"
                                : "bg-surface-raised text-muted border border-border"
                            )}
                          >
                            {count} đề
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link href="/admin/part-bank/tao-moi">
                            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs font-semibold">
                              <Plus className="h-3 w-3" />
                              <span>Thêm đề</span>
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
