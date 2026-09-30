import * as React from "react";
import Link from "next/link";
import { Plus, Search, Clock, FileCheck, Edit, Eye, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";

export default function AdminExamsPage() {
  const exams = [
    {
      id: "de-01",
      title: "Đề thi thử Chuẩn đầu ra số 01",
      code: "KET-2026-T1",
      partsCount: 14,
      duration: 60,
      attempts: 1420,
      createdAt: "15/09/2026",
      status: "Công khai",
    },
    {
      id: "de-02",
      title: "Đề thi thử Chuẩn đầu ra số 02",
      code: "KET-2026-T2",
      partsCount: 14,
      duration: 60,
      attempts: 980,
      createdAt: "18/09/2026",
      status: "Công khai",
    },
    {
      id: "de-03",
      title: "Đề thi thử Chuẩn đầu ra số 03",
      code: "KET-2026-T3",
      partsCount: 14,
      duration: 60,
      attempts: 742,
      createdAt: "22/09/2026",
      status: "Công khai",
    },
    {
      id: "de-04",
      title: "Đề thi thử Chuẩn đầu ra số 04",
      code: "KET-2026-T4",
      partsCount: 14,
      duration: 60,
      attempts: 510,
      createdAt: "25/09/2026",
      status: "Công khai",
    },
    {
      id: "de-05",
      title: "Đề thi thử Chuẩn đầu ra số 05",
      code: "KET-2026-T5",
      partsCount: 14,
      duration: 60,
      attempts: 240,
      createdAt: "28/09/2026",
      status: "Công khai",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Quản lý Đề thi thử (14 Parts)
          </h1>
          <p className="text-sm text-muted mt-1">
            Ghép đề thi hoàn chỉnh từ 14 phần trong kho, thiết lập thời gian làm bài mặc định 60 phút và quản lý công khai đề.
          </p>
        </div>
        <Button variant="primary" size="sm" className="gap-1.5 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" />
          <span>Ghép đề thi mới</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-raised/50 text-xs font-heading text-muted">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Mã & Tên đề thi</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Số phần</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Thời gian</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Lượt thi</th>
                  <th className="py-3.5 px-4 font-semibold">Ngày tạo</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-surface-raised/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-foreground text-sm">{exam.title}</p>
                      <span className="text-[11px] font-mono text-muted">{exam.code}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs font-semibold text-foreground">
                      {exam.partsCount} / 14 Parts
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs text-muted">
                      {exam.duration} phút
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs font-semibold text-secondary">
                      {exam.attempts}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted">
                      {exam.createdAt}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="success" className="text-[11px]">
                        {exam.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 min-h-0 min-w-0">
                          <Edit className="h-3.5 w-3.5 text-muted hover:text-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 min-h-0 min-w-0">
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
