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
  AlertCircle,
  Sparkles,
  RotateCcw,
  BookOpen,
  FileText,
  TrendingUp,
  Tag,
  ExternalLink,
} from "lucide-react";
import type { ArticleListItemDTO, ArticleStatsDTO } from "@/shared/types/article";
import { ARTICLE_CATEGORIES } from "@/shared/types/article";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { cn } from "@/frontend/lib/utils";
import { toast } from "sonner";

interface ArticleManagerProps {
  initialArticles: ArticleListItemDTO[];
  initialStats: ArticleStatsDTO;
}

export function ArticleManager({ initialArticles, initialStats }: ArticleManagerProps) {
  const [articles, setArticles] = React.useState<ArticleListItemDTO[]>(initialArticles);
  const [stats, setStats] = React.useState<ArticleStatsDTO>(initialStats);

  // Bộ lọc
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  // Quản lý xóa bài viết
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  // Lọc danh sách bài viết
  const filteredArticles = React.useMemo(() => {
    return articles.filter((art) => {
      if (searchTerm.trim() !== "") {
        const s = searchTerm.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(s);
        const matchesSlug = art.slug.toLowerCase().includes(s);
        const matchesAuthor = art.authorName?.toLowerCase().includes(s) || false;
        if (!matchesTitle && !matchesSlug && !matchesAuthor) return false;
      }

      if (selectedCategory !== "all" && art.category !== selectedCategory) {
        return false;
      }

      if (selectedStatus !== "all" && art.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [articles, searchTerm, selectedCategory, selectedStatus]);

  // Xóa bài viết
  const handleDeleteArticle = async (id: string) => {
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Không thể xóa bài viết này");
      }

      // Cập nhật lại state cục bộ
      const deletedArticle = articles.find((a) => a.id === id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setStats((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
        published:
          deletedArticle?.status === "PUBLISHED"
            ? Math.max(0, prev.published - 1)
            : prev.published,
        draft:
          deletedArticle?.status === "DRAFT"
            ? Math.max(0, prev.draft - 1)
            : prev.draft,
        totalViews: Math.max(0, prev.totalViews - (deletedArticle?.viewsCount || 0)),
      }));

      toast.success(`Đã xóa bài viết "${deletedArticle?.title || id}" thành công`);
      setDeleteConfirmId(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa bài viết";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedStatus("all");
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Nút tạo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Quản lý Bài viết & Hướng dẫn
          </h1>
          <p className="text-sm text-muted mt-1">
            Biên tập tin tức, cẩm nang ngữ pháp, mẹo làm bài thi KET và thông báo lịch thi chuẩn đầu ra.
          </p>
        </div>
        <Link href="/admin/bai-viet/tao-moi">
          <Button variant="primary" size="md" className="gap-2 font-semibold shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Soạn bài viết mới</span>
          </Button>
        </Link>
      </div>

      {/* 4 Thẻ KPI thống kê số liệu thực */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border hover:border-primary/40 transition-colors">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Tổng số bài viết</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold font-heading text-foreground">{stats.total}</span>
                <span className="text-xs text-muted">bài</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-success/40 transition-colors">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Đã xuất bản</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold font-heading text-foreground">{stats.published}</span>
                <span className="text-xs text-muted">công khai</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-secondary/40 transition-colors">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Bản nháp</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold font-heading text-foreground">{stats.draft}</span>
                <span className="text-xs text-muted">đang soạn</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-amber-500/40 transition-colors">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Tổng lượt xem</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold font-heading text-foreground">
                  {stats.totalViews.toLocaleString("vi-VN")}
                </span>
                <span className="text-xs text-muted">lượt</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thanh công cụ lọc & tìm kiếm */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Ô tìm kiếm */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm bài viết theo tiêu đề, slug đường dẫn hoặc tác giả..."
                className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Lọc chuyên mục */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
            >
              <option value="all">Tất cả chuyên mục</option>
              {ARTICLE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Lọc trạng thái */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="PUBLISHED">Đã xuất bản (Công khai)</option>
              <option value="DRAFT">Bản nháp (Đang soạn)</option>
            </select>

            {/* Nút reset */}
            {(searchTerm !== "" || selectedCategory !== "all" || selectedStatus !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="gap-1.5 text-muted hover:text-foreground shrink-0 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Đặt lại</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bảng danh sách bài viết */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-raised/50 text-xs font-heading text-muted">
                <tr>
                  <th className="py-3.5 px-4 font-semibold w-16 text-center">Bìa</th>
                  <th className="py-3.5 px-4 font-semibold">Tiêu đề bài viết & Đường dẫn</th>
                  <th className="py-3.5 px-4 font-semibold">Chuyên mục</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Lượt xem</th>
                  <th className="py-3.5 px-4 font-semibold">Ngày tạo / Ngày đăng</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-muted">
                        <BookOpen className="h-10 w-10 text-muted/50 mb-3" />
                        <p className="font-semibold text-foreground text-sm">
                          {articles.length === 0
                            ? "Chưa có bài viết nào trong hệ thống"
                            : "Không tìm thấy bài viết phù hợp với bộ lọc"}
                        </p>
                        <p className="text-xs text-muted mt-1 text-center">
                          {articles.length === 0
                            ? "Hãy bắt đầu soạn bài viết đầu tiên để chia sẻ kinh nghiệm ôn thi cho sinh viên."
                            : "Hãy thử xóa bộ lọc tìm kiếm để hiển thị toàn bộ danh sách bài viết."}
                        </p>
                        {articles.length === 0 ? (
                          <Link href="/admin/bai-viet/tao-moi" className="mt-4">
                            <Button variant="primary" size="sm" className="gap-1.5 text-xs font-semibold">
                              <Plus className="h-3.5 w-3.5" />
                              <span>Soạn bài viết mới</span>
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={resetFilters}
                            className="mt-4 gap-1.5 text-xs font-semibold"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Xóa bộ lọc</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-raised/40 transition-colors">
                      {/* Ảnh bìa thumbnail */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="w-12 h-10 rounded overflow-hidden bg-surface-raised border border-border/60 flex items-center justify-center mx-auto shrink-0 shadow-xs">
                          {item.coverImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.coverImageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="h-5 w-5 text-muted/60" />
                          )}
                        </div>
                      </td>

                      {/* Tiêu đề & slug */}
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="space-y-0.5">
                          <Link
                            href={`/admin/bai-viet/tao-moi?edit=${item.id}`}
                            className="font-bold text-foreground hover:text-primary transition-colors text-sm line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-muted">
                            <span className="font-mono text-[11px] text-muted truncate max-w-xs">
                              /{item.slug}
                            </span>
                            {item.authorName && (
                              <>
                                <span>•</span>
                                <span className="text-[11px]">{item.authorName}</span>
                              </>
                            )}
                          </div>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center text-[10px] px-1.5 py-0.2 rounded bg-surface border border-border text-muted font-normal"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {item.tags.length > 3 && (
                                <span className="text-[10px] text-muted">+{item.tags.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Chuyên mục */}
                      <td className="py-3.5 px-4">
                        <Badge variant="secondary" className="text-[11px] font-medium whitespace-nowrap">
                          {item.category}
                        </Badge>
                      </td>

                      {/* Lượt xem */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-semibold text-xs text-foreground">
                          {item.viewsCount.toLocaleString("vi-VN")}
                        </span>
                      </td>

                      {/* Ngày đăng / tạo */}
                      <td className="py-3.5 px-4 text-xs text-muted whitespace-nowrap">
                        <div>
                          {item.publishedAt ? (
                            <p className="font-medium text-foreground">{item.publishedAt}</p>
                          ) : (
                            <p className="italic text-muted">Chưa công khai</p>
                          )}
                          <p className="text-[11px] text-muted/70">Tạo: {item.createdAt}</p>
                        </div>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-4 text-center">
                        {item.status === "PUBLISHED" ? (
                          <Badge variant="success" className="text-[11px] gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Đã xuất bản</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[11px] gap-1 text-muted border-dashed">
                            <Clock className="h-3 w-3" />
                            <span>Bản nháp</span>
                          </Badge>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Sửa bài viết */}
                          <Link href={`/admin/bai-viet/tao-moi?edit=${item.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 min-h-0 min-w-0"
                              title="Chỉnh sửa bài viết"
                            >
                              <Edit className="h-3.5 w-3.5 text-muted hover:text-foreground" />
                            </Button>
                          </Link>

                          {/* Xem công khai nếu đã publish */}
                          {item.status === "PUBLISHED" && (
                            <Link href={`/bai-viet/${item.slug}`} target="_blank">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 min-h-0 min-w-0"
                                title="Xem bài viết trên web công khai"
                              >
                                <ExternalLink className="h-3.5 w-3.5 text-muted hover:text-foreground" />
                              </Button>
                            </Link>
                          )}

                          {/* Nút xóa */}
                          {deleteConfirmId === item.id ? (
                            <div className="flex items-center gap-1 bg-surface-raised p-1 rounded-md border border-danger/30 shadow-xs animate-in fade-in">
                              <Button
                                variant="danger"
                                size="sm"
                                disabled={deletingId === item.id}
                                onClick={() => handleDeleteArticle(item.id)}
                                className="h-7 px-2 text-[11px] font-bold"
                              >
                                {deletingId === item.id ? "Đang xóa..." : "Xác nhận xóa"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteConfirmId(null)}
                                className="h-7 px-1.5 text-[11px] text-muted hover:text-foreground"
                              >
                                Hủy
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 min-h-0 min-w-0 hover:bg-danger/10 hover:text-danger"
                              onClick={() => setDeleteConfirmId(item.id)}
                              title="Xóa bài viết"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-muted hover:text-danger" />
                            </Button>
                          )}
                        </div>
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
