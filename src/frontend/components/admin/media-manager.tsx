"use client";

import * as React from "react";
import {
  Upload,
  Search,
  FileAudio,
  FileText,
  Image as ImageIcon,
  Trash2,
  Download,
  Copy,
  Check,
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  HardDrive,
  Headphones,
  FileSpreadsheet,
  RotateCcw,
  ExternalLink,
  Edit2,
  X,
  Plus,
} from "lucide-react";
import type { MediaAssetDTO, MediaStatsDTO, AssetType } from "@/shared/types/media";
import { MEDIA_PART_TAGS } from "@/shared/types/media";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { cn } from "@/frontend/lib/utils";

interface MediaManagerProps {
  initialAssets: MediaAssetDTO[];
  initialStats: MediaStatsDTO;
}

export function MediaManager({ initialAssets, initialStats }: MediaManagerProps) {
  const [assets, setAssets] = React.useState<MediaAssetDTO[]>(initialAssets);
  const [stats, setStats] = React.useState<MediaStatsDTO>(initialStats);

  // Bộ lọc
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedPartTag, setSelectedPartTag] = React.useState<string>("all");

  // Xử lý upload
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadPartTag, setUploadPartTag] = React.useState<string>(MEDIA_PART_TAGS[0]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Trình phát Audio mini
  const [playingAudioId, setPlayingAudioId] = React.useState<string | null>(null);
  const audioPlayerRef = React.useRef<HTMLAudioElement | null>(null);

  // Sao chép liên kết URL
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Quản lý xóa file
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  // Xem ảnh phóng to (Lightbox)
  const [previewImage, setPreviewImage] = React.useState<{ url: string; name: string } | null>(null);

  // Lọc tài nguyên
  const filteredAssets = React.useMemo(() => {
    return assets.filter((asset) => {
      if (searchTerm.trim() !== "") {
        const s = searchTerm.toLowerCase();
        const matchesName = asset.name.toLowerCase().includes(s);
        const matchesTag = asset.partTag?.toLowerCase().includes(s) || false;
        if (!matchesName && !matchesTag) return false;
      }

      if (selectedType !== "all" && asset.type !== selectedType) {
        return false;
      }

      if (selectedPartTag !== "all" && asset.partTag !== selectedPartTag) {
        return false;
      }

      return true;
    });
  }, [assets, searchTerm, selectedType, selectedPartTag]);

  // Xử lý Play/Pause Audio
  const togglePlayAudio = (id: string, url: string) => {
    if (playingAudioId === id) {
      audioPlayerRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = url;
        audioPlayerRef.current.play().catch((err) => {
          console.error("Lỗi phát audio:", err);
        });
        setPlayingAudioId(id);
      }
    }
  };

  // Sao chép URL vào clipboard
  const handleCopyUrl = (id: string, url: string) => {
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Upload file lên API
  const handleUploadFile = async (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      setFeedbackMessage({
        text: "Dung lượng file vượt quá giới hạn cho phép (tối đa 20MB)",
        type: "error",
      });
      return;
    }

    setIsUploading(true);
    setFeedbackMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (uploadPartTag) {
        formData.append("partTag", uploadPartTag);
      }

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Lỗi khi tải file lên máy chủ");
      }

      // Thêm asset mới vào đầu danh sách
      const newAsset: MediaAssetDTO = data.data;
      setAssets((prev) => [newAsset, ...prev]);

      // Cập nhật thống kê
      setStats((prev) => ({
        ...prev,
        totalFiles: prev.totalFiles + 1,
        totalSizeBytes: prev.totalSizeBytes + newAsset.sizeBytes,
        audioCount: newAsset.type === "AUDIO_MP3" ? prev.audioCount + 1 : prev.audioCount,
        imageCount: newAsset.type === "IMAGE" ? prev.imageCount + 1 : prev.imageCount,
        documentCount: newAsset.type === "DOCUMENT_PDF" ? prev.documentCount + 1 : prev.documentCount,
      }));

      setFeedbackMessage({
        text: `Đã tải lên thành công: ${newAsset.name}`,
        type: "success",
      });
    } catch (err: unknown) {
      setFeedbackMessage({
        text: err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải file",
        type: "error",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Xóa tài nguyên
  const handleDeleteAsset = async (id: string) => {
    setDeletingId(id);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Không thể xóa tài nguyên này");
      }

      const deleted = assets.find((a) => a.id === id);
      setAssets((prev) => prev.filter((a) => a.id !== id));

      if (deleted) {
        setStats((prev) => ({
          ...prev,
          totalFiles: Math.max(0, prev.totalFiles - 1),
          totalSizeBytes: Math.max(0, prev.totalSizeBytes - deleted.sizeBytes),
          audioCount: deleted.type === "AUDIO_MP3" ? Math.max(0, prev.audioCount - 1) : prev.audioCount,
          imageCount: deleted.type === "IMAGE" ? Math.max(0, prev.imageCount - 1) : prev.imageCount,
          documentCount: deleted.type === "DOCUMENT_PDF" ? Math.max(0, prev.documentCount - 1) : prev.documentCount,
        }));
      }

      if (playingAudioId === id) {
        audioPlayerRef.current?.pause();
        setPlayingAudioId(null);
      }

      setFeedbackMessage({
        text: `Đã xóa tài nguyên "${deleted?.name || id}" thành công`,
        type: "success",
      });
      setDeleteConfirmId(null);
    } catch (err: unknown) {
      setFeedbackMessage({
        text: err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa tài nguyên",
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedPartTag("all");
  };

  return (
    <div className="space-y-6">
      {/* Audio element ẩn để phát âm thanh */}
      <audio
        ref={audioPlayerRef}
        onEnded={() => setPlayingAudioId(null)}
        onError={() => setPlayingAudioId(null)}
        className="hidden"
      />

      {/* Header & Tiêu đề */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Kho Tài liệu & File nghe Audio
          </h1>
          <p className="text-sm text-muted mt-1">
            Quản lý tập trung file âm thanh Listening (Part 10 - 14), ảnh scan đề thi và tài liệu cẩm nang ôn thi KET.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="gap-2 font-semibold shadow-xs"
        >
          <Upload className="h-4 w-4" />
          <span>{isUploading ? "Đang tải lên..." : "Tải file mới lên"}</span>
        </Button>
      </div>

      {/* Thông báo kết quả thao tác */}
      {feedbackMessage && (
        <div
          className={cn(
            "p-3.5 rounded-lg text-sm flex items-center justify-between border animate-in fade-in duration-200",
            feedbackMessage.type === "success"
              ? "bg-success/10 border-success/30 text-success"
              : "bg-danger/10 border-danger/30 text-danger"
          )}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs underline hover:no-underline font-medium"
          >
            Đóng
          </button>
        </div>
      )}

      {/* 4 Thẻ KPI thống kê số liệu thực */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border hover:border-primary/40 transition-colors">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Tổng số tài nguyên</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold font-heading text-foreground">{stats.totalFiles}</span>
                <span className="text-xs text-muted">files</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-amber-500/40 transition-colors">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Dung lượng lưu trữ</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold font-heading text-foreground">
                  {stats.formattedTotalSize}
                </span>
                <span className="text-xs text-muted">Cloudinary</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-purple-500/40 transition-colors">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Audio Listening</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold font-heading text-foreground">{stats.audioCount}</span>
                <span className="text-xs text-muted">file nghe</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-emerald-500/40 transition-colors">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Ảnh & Tài liệu PDF</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold font-heading text-foreground">
                  {stats.imageCount + stats.documentCount}
                </span>
                <span className="text-xs text-muted">tài liệu</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Khung kéo thả tải file nhanh (Dropzone) */}
      <Card className="border-dashed border-2 border-border/80 bg-surface hover:border-primary/50 transition-colors">
        <CardContent className="p-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleUploadFile(e.dataTransfer.files[0]);
              }
            }}
            className={cn(
              "flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-lg transition-colors",
              isDragging && "bg-primary/5"
            )}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {isUploading ? "Đang tải file lên Cloudinary..." : "Kéo thả file vào đây hoặc bấm nút chọn"}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Hỗ trợ: File Audio MP3/WAV/M4A, Hình ảnh đề thi JPG/PNG/WebP, Tài liệu PDF (Tối đa 20MB)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              {/* Chọn nhãn part trước khi upload */}
              <div className="flex-1 md:flex-initial">
                <select
                  value={uploadPartTag}
                  onChange={(e) => setUploadPartTag(e.target.value)}
                  className="w-full md:w-56 px-3 py-2 bg-surface-raised border border-border rounded-lg text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {MEDIA_PART_TAGS.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="gap-1.5 text-xs font-semibold shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Chọn file</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input file ẩn */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,image/*,application/pdf"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleUploadFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Thanh lọc & tìm kiếm */}
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
                placeholder="Tìm file theo tên, định dạng hoặc nhãn phần bài thi..."
                className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Lọc loại file */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
            >
              <option value="all">Tất cả định dạng</option>
              <option value="AUDIO_MP3">File nghe Audio (MP3/WAV)</option>
              <option value="IMAGE">Hình ảnh đề thi (PNG/JPG)</option>
              <option value="DOCUMENT_PDF">Tài liệu PDF</option>
              <option value="OTHER">Định dạng khác</option>
            </select>

            {/* Lọc nhãn phần */}
            <select
              value={selectedPartTag}
              onChange={(e) => setSelectedPartTag(e.target.value)}
              className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
            >
              <option value="all">Tất cả nhãn phần</option>
              {MEDIA_PART_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            {/* Nút reset */}
            {(searchTerm !== "" || selectedType !== "all" || selectedPartTag !== "all") && (
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

      {/* Bảng danh sách tài nguyên */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-raised/50 text-xs font-heading text-muted">
                <tr>
                  <th className="py-3.5 px-4 font-semibold w-12 text-center">Loại</th>
                  <th className="py-3.5 px-4 font-semibold">Tên file & Ngày tải</th>
                  <th className="py-3.5 px-4 font-semibold">Nghe thử / Xem trước</th>
                  <th className="py-3.5 px-4 font-semibold">Phần sử dụng (Part)</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Dung lượng</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-muted">
                        <HardDrive className="h-10 w-10 text-muted/50 mb-3" />
                        <p className="font-semibold text-foreground text-sm">
                          {assets.length === 0
                            ? "Chưa có tài nguyên nào trong kho"
                            : "Không tìm thấy file phù hợp với bộ lọc"}
                        </p>
                        <p className="text-xs text-muted mt-1 text-center">
                          {assets.length === 0
                            ? "Hãy tải lên file audio nghe hoặc ảnh đề thi đầu tiên."
                            : "Hãy thử xóa bộ lọc tìm kiếm để hiển thị toàn bộ tài nguyên."}
                        </p>
                        {assets.length > 0 && (
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
                  filteredAssets.map((asset) => {
                    const isAudio = asset.type === "AUDIO_MP3";
                    const isImage = asset.type === "IMAGE";
                    const isPDF = asset.type === "DOCUMENT_PDF";
                    const isPlaying = playingAudioId === asset.id;

                    return (
                      <tr key={asset.id} className="hover:bg-surface-raised/40 transition-colors">
                        {/* Icon loại file */}
                        <td className="py-3.5 px-4 text-center">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center mx-auto",
                              isAudio && "bg-purple-500/10 text-purple-500",
                              isImage && "bg-emerald-500/10 text-emerald-500",
                              isPDF && "bg-rose-500/10 text-rose-500",
                              !isAudio && !isImage && !isPDF && "bg-primary/10 text-primary"
                            )}
                          >
                            {isAudio && <FileAudio className="h-4 w-4" />}
                            {isImage && <ImageIcon className="h-4 w-4" />}
                            {isPDF && <FileText className="h-4 w-4" />}
                            {!isAudio && !isImage && !isPDF && <FileText className="h-4 w-4" />}
                          </div>
                        </td>

                        {/* Tên file & Ngày tải */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="font-bold text-foreground text-sm truncate" title={asset.name}>
                            {asset.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                            <span className="font-mono text-[11px] uppercase">{asset.mimeType}</span>
                            <span>•</span>
                            <span className="text-[11px]">{asset.createdAt}</span>
                          </div>
                        </td>

                        {/* Nghe thử / Xem trước */}
                        <td className="py-3.5 px-4">
                          {isAudio && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant={isPlaying ? "primary" : "outline"}
                                size="sm"
                                onClick={() => togglePlayAudio(asset.id, asset.url)}
                                className={cn(
                                  "h-8 px-2.5 text-xs font-semibold gap-1.5 transition-all",
                                  isPlaying && "bg-purple-600 hover:bg-purple-700 text-white"
                                )}
                              >
                                {isPlaying ? (
                                  <>
                                    <Pause className="h-3.5 w-3.5" />
                                    <span>Tạm dừng</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-3.5 w-3.5" />
                                    <span>Nghe thử</span>
                                  </>
                                )}
                              </Button>
                              {isPlaying && (
                                <span className="flex h-2 w-2 relative">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                                </span>
                              )}
                            </div>
                          )}

                          {isImage && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setPreviewImage({ url: asset.url, name: asset.name })}
                                className="w-10 h-8 rounded overflow-hidden border border-border/70 hover:opacity-80 transition-opacity bg-surface-raised shrink-0"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={asset.url}
                                  alt={asset.name}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewImage({ url: asset.url, name: asset.name })}
                                className="text-xs text-primary hover:underline font-semibold"
                              >
                                Xem ảnh
                              </button>
                            </div>
                          )}

                          {isPDF && (
                            <a
                              href={asset.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
                            >
                              <span>Mở file PDF</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}

                          {!isAudio && !isImage && !isPDF && (
                            <a
                              href={asset.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-muted hover:underline"
                            >
                              Xem liên kết
                            </a>
                          )}
                        </td>

                        {/* Phần sử dụng */}
                        <td className="py-3.5 px-4">
                          {asset.partTag ? (
                            <Badge variant="secondary" className="text-[11px] whitespace-nowrap">
                              {asset.partTag}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted italic">Chưa gắn nhãn</span>
                          )}
                        </td>

                        {/* Dung lượng */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-semibold text-xs text-foreground font-mono">
                            {asset.formattedSize}
                          </span>
                        </td>

                        {/* Thao tác */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Nút Sao chép URL */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyUrl(asset.id, asset.url)}
                              className={cn(
                                "h-8 px-2 text-xs font-semibold gap-1",
                                copiedId === asset.id
                                  ? "text-success bg-success/10 hover:bg-success/10"
                                  : "text-muted hover:text-foreground"
                              )}
                              title="Sao chép đường dẫn file để dán vào bài thi hoặc bài viết"
                            >
                              {copiedId === asset.id ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Đã chép</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Chép link</span>
                                </>
                              )}
                            </Button>

                            {/* Tải về */}
                            <a href={asset.url} download={asset.name} target="_blank" rel="noreferrer">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 min-h-0 min-w-0"
                                title="Tải file về máy"
                              >
                                <Download className="h-3.5 w-3.5 text-muted hover:text-foreground" />
                              </Button>
                            </a>

                            {/* Xóa file có confirm */}
                            {deleteConfirmId === asset.id ? (
                              <div className="flex items-center gap-1 bg-surface-raised p-1 rounded-md border border-danger/30 shadow-xs animate-in fade-in">
                                <Button
                                  variant="danger"
                                  size="sm"
                                  disabled={deletingId === asset.id}
                                  onClick={() => handleDeleteAsset(asset.id)}
                                  className="h-7 px-2 text-[11px] font-bold"
                                >
                                  {deletingId === asset.id ? "Đang xóa..." : "Xác nhận xóa"}
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
                                onClick={() => setDeleteConfirmId(asset.id)}
                                title="Xóa tài nguyên"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-muted hover:text-danger" />
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

      {/* Modal Lightbox xem trước ảnh */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-surface rounded-xl overflow-hidden border border-border shadow-2xl flex flex-col"
          >
            <div className="p-3 border-b border-border flex items-center justify-between">
              <span className="text-xs font-bold text-foreground truncate max-w-md">
                {previewImage.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewImage(null)}
                className="h-7 w-7 text-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-2 overflow-auto flex items-center justify-center bg-black/5 max-h-[80vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="max-w-full max-h-[75vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
