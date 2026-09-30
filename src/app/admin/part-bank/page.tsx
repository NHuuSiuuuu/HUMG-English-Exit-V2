import * as React from "react";
import Link from "next/link";
import { Plus, Search, Filter, Database, Edit, Eye, Trash2 } from "lucide-react";
import { EXAM_PARTS } from "@/shared/constants/exam-parts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";

export default function AdminPartBankPage() {
  return (
    <div className="space-y-6">
      {/* Tiêu đề & Hành động */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Kho phần đề thi (Part bank)
          </h1>
          <p className="text-sm text-muted mt-1">
            Quản lý ngân hàng 14 dạng bài Cambridge KET. Mỗi phần là một đơn vị độc lập dùng cho cả ôn luyện và ghép đề.
          </p>
        </div>
        <Button variant="primary" size="sm" className="gap-1.5 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" />
          <span>Tạo Part mới</span>
        </Button>
      </div>

      {/* Bộ lọc & Tìm kiếm */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-lg border border-border bg-surface">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Tìm theo tên part, nguồn KET..."
            className="w-full rounded-md border border-border bg-surface-raised pl-9 pr-3 py-2 text-xs sm:text-sm text-foreground focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select className="rounded-md border border-border bg-surface-raised px-3 py-2 text-xs text-foreground font-heading font-medium">
            <option value="all">Tất cả kỹ năng</option>
            <option value="rw">Reading & Writing (Part 1-9)</option>
            <option value="listening">Listening (Part 10-14)</option>
          </select>
          <select className="rounded-md border border-border bg-surface-raised px-3 py-2 text-xs text-foreground font-heading font-medium">
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã công khai</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách Part */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-raised/50 text-xs font-heading text-muted">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">STT Part</th>
                  <th className="py-3.5 px-4 font-semibold">Tên dạng bài</th>
                  <th className="py-3.5 px-4 font-semibold">Kỹ năng</th>
                  <th className="py-3.5 px-4 font-semibold">Dạng câu hỏi</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Số câu</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Số bài có sẵn</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {EXAM_PARTS.map((part) => (
                  <tr key={part.partNo} className="hover:bg-surface-raised/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-heading font-extrabold text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                        Part {part.partNo}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-foreground text-sm">{part.titleVi}</p>
                      <p className="text-xs text-muted font-sans">{part.titleEn}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={part.skill === "reading_writing" ? "default" : "secondary"} className="text-[11px]">
                        {part.skill === "reading_writing" ? "Reading & Writing" : "Listening"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted">
                      {part.questionType}
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs font-semibold text-foreground">
                      {part.totalQuestions}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                        {part.partNo * 3 + 2} đề
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 min-h-0 min-w-0" title="Chỉnh sửa">
                          <Edit className="h-3.5 w-3.5 text-muted hover:text-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 min-h-0 min-w-0" title="Xem trước">
                          <Eye className="h-3.5 w-3.5 text-muted hover:text-foreground" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
