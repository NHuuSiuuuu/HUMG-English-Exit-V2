import * as React from "react";
import { partService } from "@/backend/services/part.service";
import { PartBankManager } from "@/frontend/components/admin/part-bank-manager";

export const metadata = {
  title: "Kho phần đề thi (Part bank) — Quản trị viên | HUMG English Exit",
  description: "Quản lý ngân hàng 14 dạng bài Cambridge KET trong cơ sở dữ liệu",
};

// Đảm bảo dữ liệu luôn được truy vấn mới nhất khi vào trang
export const dynamic = "force-dynamic";

export default async function AdminPartBankPage() {
  // Lấy danh sách Part và số liệu thống kê thực tế từ PostgreSQL
  const [parts, stats] = await Promise.all([
    partService.getParts(),
    partService.getPartStats(),
  ]);

  return <PartBankManager initialParts={parts} initialStats={stats} />;
}
