import * as React from "react";
import { mediaService } from "@/backend/services/media.service";
import { MediaManager } from "@/frontend/components/admin/media-manager";

export const metadata = {
  title: "Quản lý Tài liệu & Audio — Admin | HUMG English Exit",
  description: "Kho lưu trữ tập trung file nghe MP3 bài thi Listening, scan đề thi và cẩm nang PDF ôn thi KET",
};

// Đảm bảo dữ liệu luôn được truy vấn mới nhất khi vào trang
export const dynamic = "force-dynamic";

export default async function AdminDocumentsPage() {
  // Lấy danh sách tài nguyên và số liệu thống kê thực tế từ PostgreSQL
  const [assets, stats] = await Promise.all([
    mediaService.getAssets(),
    mediaService.getAssetStats(),
  ]);

  return <MediaManager initialAssets={assets} initialStats={stats} />;
}
