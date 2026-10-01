"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Trash2,
  Eye,
  Edit,
  CheckCircle2,
  Clock,
  Layers,
  AlertCircle,
  FileCheck,
  Sparkles,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import type { ExamListItemDTO, ExamStatsDTO } from "@/shared/types/exam";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { cn } from "@/frontend/lib/utils";
import { toast } from "sonner";

interface ExamBankManagerProps {
  initialExams: ExamListItemDTO[];
  initialStats: ExamStatsDTO;
}

export function ExamBankManager({ initialExams, initialStats }: ExamBankManagerProps) {
  const [exams, setExams] = React.useState<ExamListItemDTO[]>(initialExams);
  const [stats, setStats] = React.useState<ExamStatsDTO>(initialStats);

  // Bộ lọc
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  // Quản lý xóa đề thi
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  // Lọc danh sách đề thi
  const filteredExams = React.useMemo(() => {
    return exams.filter((ex) => {
      if (searchTerm.trim() !== "") {
        const s = searchTerm.toLowerCase();
        const matchesCode = ex.code.toLowerCase().includes(s);
        const matchesTitle = ex.title.toLowerCase().includes(s);
        if (!matchesCode && !matchesTitle) return false;
      }

      if (selectedStatus !== "all" && ex.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [exams, searchTerm, selectedStatus]);

  // Xóa đề thi
  const handleDeleteExam = async (id: string) => {
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/exams/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Không thể xóa đề thi này");
      }

      // Cập nhật lại state cục bộ
      const deletedExam = exams.find((e) => e.id === id);
      setExams((prev) => prev.filter((e) => e.id !== id));
      setStats((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        published: deletedExam?.status === "PUBLISHED" ? Math.max(0, prev.published - 1) : prev.published,
        draft: deletedExam?.status === "DRAFT" ? Math.max(0, prev.draft - 1) : prev.draft,
      }));

      toast.success(`Đã xóa đề thi "${deletedExam?.code || id}" thành công!`);
      setDeleteConfirmId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa đề thi");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Nút Tạo mới */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Quản lý Đề thi thử (14 Parts)
          </h1>
          <p className="text-sm text-muted mt-1">
            Ghép đề thi hoàn chỉnh từ 14 phần trong Kho phần, thiết lập thời gian làm bài chuẩn 60 phút và quản lý công khai.
          </p>
        </div>
        <Link href="/admin/de-thi/tao-moi">
          <Button
            variant="primary"
            size="sm"
            className="gap-1.5 text-xs font-semibold shadow-[0_4px_12px_rgba(0,149,246,0.25)]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Ghép đề thi mới</span>
          </Button>
        </Link>
      </div>

      {/* 4 Thẻ KPI thống kê số liệu thực */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tổng số đề thi */}
        <Card className="rounded-3xl p-5 border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted">Tổng số đề thi</p>
              <h3 className="text-2xl font-black font-heading text-foreground mt-1">
                {stats.total}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted mt-2">Toàn bộ đề thi trong hệ thống</p>
        </Card>

        {/* Đề đã công khai */}
        <Card className="rounded-3xl p-5 border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted">Đã công khai</p>
              <h3 className="text-2xl font-black font-heading text-success mt-1">
                {stats.published}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-success/10 text-success flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted mt-2">Sẵn sàng cho sinh viên thi thử</p>
        </Card>

        {/* Bản nháp đang ghép */}
        <Card className="rounded-3xl p-5 border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted">Bản nháp đang ghép</p>
              <h3 className="text-2xl font-black font-heading text-warning mt-1">
                {stats.draft}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-warning/10 text-warning flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted mt-2">Chưa đủ 14 phần hoặc đang biên tập</p>
        </Card>

        {/* Tổng lượt thi thử */}
        <Card className="rounded-3xl p-5 border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted">Lượt sinh viên thi</p>
              <h3 className="text-2xl font-black font-heading text-secondary mt-1">
                {stats.totalAttempts}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted mt-2">Tổng số lượt làm bài kiểm tra</p>
        </Card>
      </div>

      {/* Thanh lọc & Tìm kiếm */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-3xl bg-surface border border-border shadow-sm">
        {/* Ô tìm kiếm */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã đề (KET-2026-T1), tên đề thi..."
            className="w-full min-h-[40px] pl-9 pr-3.5 rounded-xl border border-border bg-surface-raised text-xs text-foreground outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Bộ lọc trạng thái */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted">Trạng thái:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="min-h-[40px] px-3 rounded-xl border border-border bg-surface-raised text-xs text-foreground outline-none focus:ring-2 focus:ring-primary font-medium"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="PUBLISHED">Đã công khai</option>
            <option value="DRAFT">Bản nháp</option>
          </select>

          {(searchTerm !== "" || selectedStatus !== "all") && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("all");
              }}
              className="text-xs"
              title="Đặt lại bộ lọc"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Đặt lại</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bảng danh sách đề thi */}
      <Card className="rounded-3xl border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-raised/50 text-xs font-heading text-muted">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Mã & Tên đề thi</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Tiến độ ghép</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Tổng câu</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Thời lượng</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Lượt thi</th>
                  <th className="py-3.5 px-4 font-semibold">Ngày tạo</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredExams.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted">
                      <div className="max-w-sm mx-auto space-y-3">
                        <FileCheck className="w-10 h-10 mx-auto text-muted opacity-40" />
                        <p className="text-sm font-semibold text-foreground">
                          {exams.length === 0
                            ? "Chưa có đề thi thử nào trong cơ sở dữ liệu"
                            : "Không tìm thấy đề thi phù hợp với bộ lọc"}
                        </p>
                        <p className="text-xs text-muted">
                          {exams.length === 0
                            ? "Hãy ghép đề thi đầu tiên bằng cách kết hợp 14 phần từ Kho phần."
                            : "Vui lòng thử tìm kiếm với từ khóa khác hoặc đặt lại bộ lọc."}
                        </p>
                        {exams.length === 0 && (
                          <Link href="/admin/de-thi/tao-moi" className="inline-block pt-1">
                            <Button variant="primary" size="sm" className="text-xs font-semibold">
                              <Plus className="w-3.5 h-3.5 mr-1.5" />
                              <span>Ghép đề thi mới ngay</span>
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-surface-raised/40 transition-colors">
                      {/* Mã & Tên đề */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-foreground text-sm">{exam.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-mono font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">
                            {exam.code}
                          </span>
                          {exam.description && (
                            <span className="text-xs text-muted truncate max-w-xs">
                              {exam.description}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Tiến độ ghép: x / 14 Parts */}
                      <td className="py-3.5 px-4 text-center">
                        <Badge
                          variant={exam.partsCount === 14 ? "success" : "default"}
                          className="text-[11px]"
                        >
                          {exam.partsCount === 14 ? (
                            <span className="flex items-center gap-1 font-semibold">
                              <CheckCircle2 className="w-3 h-3" /> 14/14 Đủ chuẩn
                            </span>
                          ) : (
                            <span className="font-semibold">
                              {exam.partsCount} / 14 Parts
                            </span>
                          )}
                        </Badge>
                      </td>

                      {/* Tổng số câu */}
                      <td className="py-3.5 px-4 text-center text-xs font-semibold text-foreground">
                        {exam.totalQuestions} câu
                      </td>

                      {/* Thời lượng */}
                      <td className="py-3.5 px-4 text-center text-xs text-muted">
                        {exam.durationMinutes} phút
                      </td>

                      {/* Lượt thi */}
                      <td className="py-3.5 px-4 text-center text-xs font-semibold text-secondary">
                        {exam.attemptsCount}
                      </td>

                      {/* Ngày tạo */}
                      <td className="py-3.5 px-4 text-xs text-muted whitespace-nowrap">
                        {exam.createdAt}
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-4 text-center">
                        <Badge
                          variant={exam.status === "PUBLISHED" ? "success" : "outline"}
                          className="text-[11px]"
                        >
                          {exam.status === "PUBLISHED" ? "Công khai" : "Bản nháp"}
                        </Badge>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 px-4 text-right">
                        {deleteConfirmId === exam.id ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-[11px] text-destructive font-semibold">
                              Xác nhận xóa?
                            </span>
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={deletingId === exam.id}
                              onClick={() => handleDeleteExam(exam.id)}
                              className="h-7 px-2 text-xs"
                            >
                              Xóa
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteConfirmId(null)}
                              className="h-7 px-2 text-xs"
                            >
                              Hủy
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/admin/de-thi/tao-moi?edit=${exam.id}`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 min-h-0 min-w-0"
                                title="Chỉnh sửa & Ghép lại các Part"
                              >
                                <Edit className="h-3.5 w-3.5 text-muted hover:text-foreground" />
                              </Button>
                            </Link>

                            <Link href={`/thi-thu`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 min-h-0 min-w-0"
                                title="Xem trước màn hình thi"
                              >
                                <Eye className="h-3.5 w-3.5 text-muted hover:text-foreground" />
                              </Button>
                            </Link>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteConfirmId(exam.id)}
                              className="h-8 w-8 min-h-0 min-w-0 text-muted hover:text-destructive hover:bg-destructive/10"
                              title="Xóa đề thi này"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
