import * as React from "react";
import { settingsService } from "@/backend/services/settings.service";
import { SystemSettingsForm } from "@/frontend/components/admin/system-settings-form";

export const metadata = {
  title: "Cài đặt Hệ thống — Admin | HUMG English Exit",
  description: "Thiết lập thời gian làm bài chuẩn Cambridge KET 60 phút, dung sai mạng và thông tin cổng thi",
};

// Đảm bảo dữ liệu luôn được truy vấn mới nhất khi vào trang
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settings, logs] = await Promise.all([
    settingsService.getSettings(),
    settingsService.getAuditLogs(10),
  ]);

  return <SystemSettingsForm initialSettings={settings} initialLogs={logs} />;
}
