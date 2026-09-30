"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Edit3,
  Upload,
  Image as ImageIcon,
  X,
  Plus,
  Tag,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  FileText,
  CloudUpload,
  Trash2,
} from "lucide-react";
import type {
  ArticleDetailDTO,
  ArticleStatus,
  ArticleCompletenessIssue,
} from "@/shared/types/article";
import { ARTICLE_CATEGORIES } from "@/shared/types/article";
import { slugify, validateArticleForPublish } from "@/shared/schemas/article.schema";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { cn } from "@/frontend/lib/utils";

interface ArticleEditorFormProps {
  initialData?: ArticleDetailDTO | null;
  isEditing?: boolean;
}

export function ArticleEditorForm({
  initialData,
  isEditing = false,
}: ArticleEditorFormProps) {
  const router = useRouter();

  // Trạng thái form
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [slug, setSlug] = React.useState(initialData?.slug || "");
  const [isSlugCustomized, setIsSlugCustomized] = React.useState(!!initialData?.slug);
  const [category, setCategory] = React.useState(
    initialData?.category || ARTICLE_CATEGORIES[0]
  );
  const [excerpt, setExcerpt] = React.useState(initialData?.excerpt || "");
  const [content, setContent] = React.useState(initialData?.content || "");
  const [coverImageUrl, setCoverImageUrl] = React.useState(
    initialData?.coverImageUrl || ""
  );
  const [tags, setTags] = React.useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = React.useState("");
  const [authorName, setAuthorName] = React.useState(
    initialData?.authorName || "Ban Quản trị HUMG"
  );
  const [status, setStatus] = React.useState<ArticleStatus>(
    initialData?.status || "DRAFT"
  );

  // Tab giao diện (Soạn thảo vs Xem trước)
  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">("edit");

  // Xử lý Upload ảnh bìa
  const [isUploadingCover, setIsUploadingCover] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const coverInputRef = React.useRef<HTMLInputElement | null>(null);

  // Thao tác textarea
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Trạng thái lưu
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [validationIssues, setValidationIssues] = React.useState<
    ArticleCompletenessIssue[]
  >([]);

  // Tự động sinh slug khi đổi title (nếu người dùng chưa tự chỉnh sửa slug)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustomized) {
      setSlug(slugify(val));
    }
  };

  // Quản lý tags
  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Tải ảnh bìa lên Cloudinary
  const handleUploadCoverImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Vui lòng chỉ tải lên file hình ảnh (JPG, PNG, WEBP, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Dung lượng file ảnh bìa không được vượt quá 5MB");
      return;
    }

    setIsUploadingCover(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "articles");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Lỗi khi tải ảnh lên máy chủ");
      }

      setCoverImageUrl(data.url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Không thể tải ảnh");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadCoverImage(e.dataTransfer.files[0]);
    }
  };

  // Chèn cú pháp Markdown vào ô textarea
  const insertSyntax = (before: string, after: string = "", placeholder: string = "") => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = el.value.substring(start, end);
    const replacement = selectedText ? `${before}${selectedText}${after}` : `${before}${placeholder}${after}`;

    const newContent = el.value.substring(0, start) + replacement + el.value.substring(end);
    setContent(newContent);

    setTimeout(() => {
      el.focus();
      const newCursorPos = start + before.length + (selectedText ? selectedText.length : placeholder.length);
      el.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  // Kiểm tra tính hợp lệ trước khi gửi
  const validateBeforeSubmit = (targetStatus: ArticleStatus): boolean => {
    if (!title.trim()) {
      setFeedbackMessage({ text: "Vui lòng nhập tiêu đề bài viết", type: "error" });
      return false;
    }

    if (targetStatus === "PUBLISHED") {
      const issues = validateArticleForPublish({
        title,
        slug,
        excerpt,
        content,
        coverImageUrl,
        category,
      });

      setValidationIssues(issues);

      if (issues.length > 0) {
        setFeedbackMessage({
          text: "Bài viết chưa đạt đủ tiêu chuẩn để xuất bản. Vui lòng kiểm tra danh sách bên dưới.",
          type: "error",
        });
        return false;
      }
    }

    return true;
  };

  // Lưu bài viết (DRAFT hoặc PUBLISHED)
  const handleSubmit = async (targetStatus: ArticleStatus) => {
    if (!validateBeforeSubmit(targetStatus)) {
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage(null);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      coverImageUrl: coverImageUrl.trim() || null,
      category,
      tags,
      authorName: authorName.trim() || "Ban Quản trị HUMG",
      status: targetStatus,
    };

    try {
      const endpoint = isEditing && initialData?.id
        ? `/api/admin/articles/${initialData.id}`
        : "/api/admin/articles";
      const method = isEditing && initialData?.id ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.issues && Array.isArray(data.issues)) {
          setValidationIssues(data.issues);
        }
        throw new Error(data.error || "Không thể lưu bài viết");
      }

      setStatus(targetStatus);
      setFeedbackMessage({
        text: data.message || (targetStatus === "PUBLISHED" ? "Đã xuất bản bài viết thành công!" : "Đã lưu bản nháp thành công!"),
        type: "success",
      });

      // Nếu tạo mới thành công, chuyển hướng về danh sách sau 1.2s
      if (!isEditing) {
        setTimeout(() => {
          router.push("/admin/bai-viet");
          router.refresh();
        }, 1200);
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      setFeedbackMessage({
        text: err instanceof Error ? err.message : "Đã xảy ra lỗi khi lưu bài viết",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper render markdown preview đơn giản và an toàn
  const renderMarkdownContent = (text: string) => {
    if (!text.trim()) {
      return <p className="text-muted italic">Nội dung bài viết đang để trống...</p>;
    }

    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Heading 2
      if (line.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-bold font-heading text-foreground mt-6 mb-3 pt-2 border-b border-border/50 pb-1">
            {line.replace("## ", "")}
          </h2>
        );
      }
      // Heading 3
      if (line.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-bold font-heading text-foreground mt-4 mb-2">
            {line.replace("### ", "")}
          </h3>
        );
      }
      // Blockquote
      if (line.startsWith("> ")) {
        return (
          <blockquote key={idx} className="border-l-4 border-primary pl-4 py-2 my-3 bg-surface-raised/40 text-foreground italic rounded-r text-sm">
            {line.replace("> ", "")}
          </blockquote>
        );
      }
      // Bullet list
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="ml-5 list-disc text-foreground text-sm sm:text-base leading-relaxed my-1">
            {line.substring(2)}
          </li>
        );
      }
      // Number list
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-5 list-decimal text-foreground text-sm sm:text-base leading-relaxed my-1">
            {line.replace(/^\d+\.\s/, "")}
          </li>
        );
      }
      // Image ![alt](url)
      const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        return (
          <figure key={idx} className="my-5 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgMatch[2]}
              alt={imgMatch[1]}
              className="rounded-lg border border-border max-w-full mx-auto shadow-xs"
            />
            {imgMatch[1] && (
              <figcaption className="text-xs text-muted mt-2 italic">
                {imgMatch[1]}
              </figcaption>
            )}
          </figure>
        );
      }
      // Dòng trống
      if (!line.trim()) {
        return <div key={idx} className="h-3" />;
      }
      // Đoạn văn thường
      return (
        <p key={idx} className="text-foreground text-sm sm:text-base leading-relaxed my-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Thanh điều hướng trên cùng & Các nút thao tác */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/bai-viet">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground">
                {isEditing ? "Chỉnh sửa bài viết" : "Soạn bài viết mới"}
              </h1>
              {status === "PUBLISHED" ? (
                <Badge variant="success" className="text-xs">Đã xuất bản</Badge>
              ) : (
                <Badge variant="outline" className="text-xs border-dashed text-muted">Bản nháp</Badge>
              )}
            </div>
            <p className="text-xs text-muted mt-0.5">
              Soạn cẩm nang hướng dẫn ôn thi KET, tin tức chuẩn đầu ra HUMG
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Nút lưu bản nháp */}
          <Button
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleSubmit("DRAFT")}
            className="gap-1.5 font-semibold text-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Lưu bản nháp</span>
          </Button>

          {/* Nút xuất bản */}
          <Button
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleSubmit("PUBLISHED")}
            className="gap-1.5 font-semibold text-xs shadow-xs"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{isEditing && status === "PUBLISHED" ? "Cập nhật công khai" : "Xuất bản bài viết"}</span>
          </Button>
        </div>
      </div>

      {/* Thông báo kết quả thao tác */}
      {feedbackMessage && (
        <div
          className={cn(
            "p-4 rounded-lg text-sm flex items-center justify-between border",
            feedbackMessage.type === "success"
              ? "bg-success/10 border-success/30 text-success"
              : "bg-danger/10 border-danger/30 text-danger"
          )}
        >
          <div className="flex items-center gap-2.5">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span className="font-medium">{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs underline hover:no-underline font-semibold"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Cảnh báo checklist xuất bản (nếu có lỗi) */}
      {validationIssues.length > 0 && (
        <Card className="border-danger/30 bg-danger/5">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-danger font-bold text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Các tiêu chuẩn xuất bản chưa đạt ({validationIssues.length}):</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-danger/90 pl-2">
              {validationIssues.map((issue, i) => (
                <li key={i}>{issue.message}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Chuyển đổi Tab Soạn thảo & Xem trước */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("edit")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors",
            activeTab === "edit"
              ? "bg-primary text-white shadow-xs"
              : "text-muted hover:text-foreground hover:bg-surface-raised"
          )}
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Biên tập nội dung</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors",
            activeTab === "preview"
              ? "bg-primary text-white shadow-xs"
              : "text-muted hover:text-foreground hover:bg-surface-raised"
          )}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Xem trước bài viết (Live Preview)</span>
        </button>
      </div>

      {activeTab === "edit" ? (
        /* ================= TAB SOẠN THẢO ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái: Nội dung chính bài viết (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Tiêu đề & Slug */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Tiêu đề bài viết <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="VD: Bí quyết chinh phục 5 câu nghe chọn tranh Part 10 Cambridge KET..."
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-base font-bold text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted">
                      Đường dẫn tĩnh (Slug URL) <span className="text-danger">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSlugCustomized(false);
                        setSlug(slugify(title));
                      }}
                      className="text-[11px] text-primary hover:underline font-semibold"
                    >
                      Tự động tạo từ tiêu đề
                    </button>
                  </div>
                  <div className="flex items-center rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                    <span className="text-xs text-muted select-none mr-1">/bai-viet/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setIsSlugCustomized(true);
                        setSlug(slugify(e.target.value));
                      }}
                      placeholder="bi-quyet-chinh-phuc-part-10-ket"
                      className="w-full bg-transparent text-xs sm:text-sm font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {/* Tóm tắt bài viết */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Đoạn tóm tắt / Lời dẫn (Excerpt)
                  </label>
                  <textarea
                    rows={3}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Mô tả ngắn gọn 1-2 câu nội dung cốt lõi của bài viết, dùng để hiển thị ngoài danh sách bài viết..."
                    className="w-full px-3.5 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Trình soạn thảo Nội dung & Toolbar */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">
                    Nội dung chi tiết bài viết (Markdown) <span className="text-danger">*</span>
                  </label>
                  <span className="text-xs text-muted font-mono">
                    {content.length} ký tự
                  </span>
                </div>

                {/* Thanh công cụ định dạng Markdown */}
                <div className="flex flex-wrap items-center gap-1 p-1.5 bg-surface-raised/70 border border-border rounded-lg text-xs">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertSyntax("**", "**", "chữ in đậm")}
                    className="h-7 w-7 p-0"
                    title="In đậm"
                  >
                    <Bold className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertSyntax("*", "*", "chữ in nghiêng")}
                    className="h-7 w-7 p-0"
                    title="In nghiêng"
                  >
                    <Italic className="h-3.5 w-3.5" />
                  </Button>

                  <div className="w-px h-4 bg-border mx-1" />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertSyntax("\n## ", "\n", "Tiêu đề mục")}
                    className="h-7 px-2 text-xs font-bold"
                    title="Tiêu đề H2"
                  >
                    H2
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertSyntax("\n### ", "\n", "Tiêu đề con")}
                    className="h-7 px-2 text-xs font-bold"
                    title="Tiêu đề H3"
                  >
                    H3
                  </Button>

                  <div className="w-px h-4 bg-border mx-1" />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertSyntax("\n- ", "", "Mục danh sách")}
                    className="h-7 w-7 p-0"
                    title="Danh sách gạch đầu dòng"
                  >
                    <List className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertSyntax("\n1. ", "", "Mục có thứ tự")}
                    className="h-7 w-7 p-0"
                    title="Danh sách đánh số"
                  >
                    <ListOrdered className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertSyntax("\n> ", "\n", "Nội dung trích dẫn hoặc lưu ý quan trọng")}
                    className="h-7 w-7 p-0"
                    title="Trích dẫn / Khối ghi chú"
                  >
                    <Quote className="h-3.5 w-3.5" />
                  </Button>

                  <div className="w-px h-4 bg-border mx-1" />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertSyntax("[", "](https://...)", "tên liên kết")}
                    className="h-7 w-7 p-0"
                    title="Chèn liên kết URL"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertSyntax("\n![Chú thích ảnh](", ")\n", "https://url-anh-minh-hoa.jpg")}
                    className="h-7 w-7 p-0"
                    title="Chèn ảnh minh họa"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Textarea nhập nội dung */}
                <textarea
                  ref={textareaRef}
                  rows={16}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Soạn nội dung bài viết bằng Markdown...&#10;&#10;## 1. Giới thiệu tổng quan&#10;Viết nội dung tại đây...&#10;&#10;## 2. Các mẹo quan trọng&#10;- Mẹo 1...&#10;- Mẹo 2...&#10;&#10;> Lưu ý: Sinh viên cần chuẩn bị đầy đủ giấy tờ khi vào phòng thi."
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-sm text-foreground font-mono leading-relaxed placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                />

                <p className="text-[11px] text-muted flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Hỗ trợ định dạng Markdown: ## Tiêu đề lớn, ### Tiêu đề nhỏ, - Gạch đầu dòng, &gt; Trích dẫn, **In đậm**.
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cột phải: Thuộc tính bài viết & Ảnh bìa (1 col) */}
          <div className="space-y-5">
            {/* Ảnh bìa bài viết (Cover Image) */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">
                    Ảnh bìa bài viết
                  </label>
                  {coverImageUrl && (
                    <button
                      type="button"
                      onClick={() => setCoverImageUrl("")}
                      className="text-[11px] text-danger hover:underline font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Xóa ảnh</span>
                    </button>
                  )}
                </div>

                {coverImageUrl ? (
                  /* Hiển thị xem trước ảnh bìa */
                  <div className="space-y-2">
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-surface-raised group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverImageUrl}
                        alt="Ảnh bìa bài viết"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => coverInputRef.current?.click()}
                          className="h-8 text-xs font-semibold"
                        >
                          Thay ảnh khác
                        </Button>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted truncate">
                      URL: {coverImageUrl}
                    </p>
                  </div>
                ) : (
                  /* Khung kéo thả tải ảnh bìa lên Cloudinary */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => coverInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 bg-surface",
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-surface-raised/40",
                      isUploadingCover && "opacity-60 pointer-events-none"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <CloudUpload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {isUploadingCover ? "Đang tải ảnh lên Cloudinary..." : "Kéo thả ảnh bìa hoặc bấm để chọn"}
                      </p>
                      <p className="text-[11px] text-muted mt-0.5">
                        Tỷ lệ khuyến nghị 16:9, tối đa 5MB (JPG, PNG, WEBP)
                      </p>
                    </div>
                  </div>
                )}

                {/* Input file ẩn */}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleUploadCoverImage(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {uploadError && (
                  <p className="text-xs text-danger font-medium flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{uploadError}</span>
                  </p>
                )}

                {/* Hoặc dán trực tiếp URL */}
                <div className="pt-2 border-t border-border/60">
                  <label className="block text-[11px] font-semibold text-muted mb-1">
                    Hoặc dán URL ảnh trực tiếp:
                  </label>
                  <input
                    type="url"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 bg-surface border border-border rounded text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-primary"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Chuyên mục & Tác giả */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Chuyên mục <span className="text-danger">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {ARTICLE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Tác giả hiển thị
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ban Quản trị HUMG"
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {/* Thẻ bài viết (Tags) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
                    Thẻ bài viết (Tags)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Thêm tag (nhấn Enter)..."
                      className="flex-1 px-3 py-1.5 bg-surface border border-border rounded-lg text-xs text-foreground placeholder:text-muted/60 focus:outline-none focus:border-primary"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddTag}
                      className="h-8 px-2.5 text-xs font-semibold"
                    >
                      Thêm
                    </Button>
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-surface-raised border border-border text-foreground font-medium"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-muted hover:text-danger"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* ================= TAB XEM TRƯỚC (LIVE PREVIEW) ================= */
        <Card className="border-border">
          <CardContent className="p-6 sm:p-10">
            {/* Khung bài viết chuẩn 720px theo quy định PAGES.md */}
            <article className="max-w-[720px] mx-auto space-y-6">
              {/* Ảnh bìa lớn */}
              {coverImageUrl ? (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-border shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImageUrl}
                    alt={title || "Ảnh bìa"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-xl bg-surface-raised border border-dashed border-border flex flex-col items-center justify-center text-muted gap-2">
                  <ImageIcon className="h-10 w-10 text-muted/40" />
                  <span className="text-xs italic">Chưa chọn ảnh bìa cho bài viết</span>
                </div>
              )}

              {/* Thông tin metadata bài viết */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs font-semibold">
                    {category}
                  </Badge>
                  {tags.map((t) => (
                    <span key={t} className="text-xs text-muted font-normal">
                      #{t}
                    </span>
                  ))}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-foreground leading-tight">
                  {title || "Tiêu đề bài viết sẽ hiển thị tại đây"}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-1 border-b border-border pb-4">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <User className="h-3.5 w-3.5 text-muted" />
                    {authorName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date().toLocaleDateString("vi-VN")}
                  </span>
                  <span>• 5 phút đọc</span>
                </div>
              </div>

              {/* Lời dẫn / Excerpt */}
              {excerpt && (
                <div className="p-4 rounded-lg bg-surface-raised/70 border-l-4 border-primary text-sm sm:text-base font-medium text-foreground italic leading-relaxed">
                  {excerpt}
                </div>
              )}

              {/* Nội dung chi tiết */}
              <div className="prose prose-slate dark:prose-invert max-w-none pt-2">
                {renderMarkdownContent(content)}
              </div>
            </article>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
