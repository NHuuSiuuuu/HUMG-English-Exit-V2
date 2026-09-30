import * as React from "react";
import { Plus, Search, Edit, Eye, Trash2, Calendar, FileText } from "lucide-react";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";

export default function AdminArticlesPage() {
  const articles = [
    {
      id: "1",
      title: "Tổng hợp toàn bộ quy định Chuẩn đầu ra Ngoại ngữ HUMG mới nhất",
      category: "Quy định & Lịch thi",
      views: 1840,
      publishedAt: "28/09/2026",
      status: "Đã xuất bản",
    },
    {
      id: "2",
      title: "Chiến thuật làm 9 Phần Reading & Writing không bị thiếu thời gian",
      category: "Mẹo thi cử",
      views: 1220,
      publishedAt: "24/09/2026",
      status: "Đã xuất bản",
    },
    {
      id: "3",
      title: "Bí quyết chinh phục 5 câu nghe chọn tranh Part 10 Cambridge KET",
      category: "Kỹ năng Listening",
      views: 950,
      publishedAt: "20/09/2026",
      status: "Đã xuất bản",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Quản lý Bài viết & Hướng dẫn
          </h1>
          <p className="text-sm text-muted mt-1">
            Biên tập tin tức, cẩm nang ngữ pháp, mẹo làm bài thi KET và thông báo lịch thi cho sinh viên.
          </p>
        </div>
        <Button variant="primary" size="sm" className="gap-1.5 text-xs font-semibold">
          <Plus className="h-3.5 w-3.5" />
          <span>Viết bài mới</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-raised/50 text-xs font-heading text-muted">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Tiêu đề bài viết</th>
                  <th className="py-3.5 px-4 font-semibold">Chuyên mục</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Lượt xem</th>
                  <th className="py-3.5 px-4 font-semibold">Ngày đăng</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {articles.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-raised/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-foreground text-sm">{item.title}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="secondary" className="text-[11px]">{item.category}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs font-semibold text-secondary">
                      {item.views}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted">
                      {item.publishedAt}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="success" className="text-[11px]">{item.status}</Badge>
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
