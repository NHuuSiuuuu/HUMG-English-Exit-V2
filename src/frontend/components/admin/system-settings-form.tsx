"use client";

import * as React from "react";
import {
  Save,
  Clock,
  Shield,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  History,
  Mail,
  Phone,
  Globe,
  Headphones,
  Wifi,
  UserCheck,
  Power,
} from "lucide-react";
import type {
  SystemSettingsDTO,
  AdminAuditLogDTO,
} from "@/shared/types/settings";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/frontend/components/ui/card";
import { cn } from "@/frontend/lib/utils";

interface SystemSettingsFormProps {
  initialSettings: SystemSettingsDTO;
  initialLogs: AdminAuditLogDTO[];
}

export function SystemSettingsForm({
  initialSettings,
  initialLogs,
}: SystemSettingsFormProps) {
  // Trạng thái form
  const [settings, setSettings] = React.useState<SystemSettingsDTO>(initialSettings);
  const [logs, setLogs] = React.useState<AdminAuditLogDTO[]>(initialLogs);

  const [isSaving, setIsSaving] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);
  const [showResetModal, setShowResetModal] = React.useState(false);

  const [feedbackMessage, setFeedbackMessage] = React.useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Lưu cài đặt
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể lưu cài đặt");
      }

      setSettings(data.data);
      setFeedbackMessage({
        text: data.message || "Đã lưu cài đặt hệ thống thành công!",
        type: "success",
      });

      // Tải lại nhật ký mới nhất
      const logsRes = await fetch("/api/admin/settings");
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        if (logsData.data?.logs) {
          setLogs(logsData.data.logs);
        }
      }
    } catch (err: unknown) {
      setFeedbackMessage({
        text: err instanceof Error ? err.message : "Đã xảy ra lỗi khi lưu",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Khôi phục cài đặt gốc
  const handleResetToDefault = async () => {
    setIsResetting(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESET_DEFAULT" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể khôi phục cài đặt");
      }

      setSettings(data.data);
      setFeedbackMessage({
        text: "Đã khôi phục toàn bộ cài đặt về chuẩn Cambridge KET ban đầu!",
        type: "success",
      });
      setShowResetModal(false);

      // Tải lại nhật ký
      const logsRes = await fetch("/api/admin/settings");
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        if (logsData.data?.logs) {
          setLogs(logsData.data.logs);
        }
      }
    } catch (err: unknown) {
      setFeedbackMessage({
        text: err instanceof Error ? err.message : "Đã xảy ra lỗi khi khôi phục",
        type: "error",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Tiêu đề & Nút thao tác nhanh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Cài đặt Hệ thống & Tham số
          </h1>
          <p className="text-sm text-muted mt-1">
            Thiết lập thời gian làm bài chuẩn Cambridge KET 60 phút, dung sai mạng, quyền đăng ký và thông tin cổng thi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowResetModal(true)}
            className="gap-1.5 text-xs font-semibold text-muted hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Khôi phục chuẩn KET</span>
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={isSaving}
            onClick={handleSave}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? "Đang lưu..." : "Lưu cài đặt"}</span>
          </Button>
        </div>
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
            <span className="font-medium">{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs underline hover:no-underline font-medium"
          >
            Đóng
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Khối 1: Thời gian & Dung sai thi cử */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Cấu hình Thời gian làm bài & Nghe Listening</CardTitle>
            </div>
            <CardDescription>
              Áp dụng cho toàn bộ các đề thi mô phỏng trừ khi đề có cấu hình thời gian riêng biệt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Thời gian làm bài */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Thời gian thi mặc định</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={10}
                    max={180}
                    value={settings.defaultDurationMinutes}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        defaultDurationMinutes: parseInt(e.target.value) || 60,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-base font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted font-medium">
                    phút
                  </span>
                </div>
                <p className="text-[11px] text-muted">
                  Chuẩn Cambridge KET là <strong>60 phút</strong> (Reading & Writing).
                </p>
              </div>

              {/* Dung sai nộp bài */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Wifi className="h-3.5 w-3.5 text-primary" />
                  <span>Dung sai nộp bài do mạng</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={300}
                    value={settings.networkToleranceSeconds}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        networkToleranceSeconds: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-base font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted font-medium">
                    giây
                  </span>
                </div>
                <p className="text-[11px] text-muted">
                  Bù trừ độ trễ mạng khi nộp bài thi (mặc định: 30 giây).
                </p>
              </div>

              {/* Số lần phát âm thanh */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Headphones className="h-3.5 w-3.5 text-primary" />
                  <span>Số lần phát Audio nghe</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={settings.maxAudioPlays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxAudioPlays: parseInt(e.target.value) || 2,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-base font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted font-medium">
                    lần
                  </span>
                </div>
                <p className="text-[11px] text-muted">
                  Quy chuẩn Cambridge KET: bài thi Listening được nghe <strong>2 lần</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Khối 2: Đăng ký & Bảo mật */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Chính sách Đăng ký tài khoản & Bảo trì</CardTitle>
            </div>
            <CardDescription>
              Kiểm soát việc tạo mới tài khoản sinh viên và kích hoạt trạng thái nâng cấp hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cho phép đăng ký */}
              <div className="p-4 rounded-lg bg-surface border border-border flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">Cho phép đăng ký tài khoản mới</p>
                  <p className="text-xs text-muted leading-relaxed">
                    Khi tắt, sinh viên mới không thể đăng ký tài khoản tự do trên trang chủ.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) =>
                    setSettings({ ...settings, allowRegistration: e.target.checked })
                  }
                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary/20 mt-0.5 cursor-pointer"
                />
              </div>

              {/* Yêu cầu email trường */}
              <div className="p-4 rounded-lg bg-surface border border-border flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">Bắt buộc email trường (@humg.edu.vn)</p>
                  <p className="text-xs text-muted leading-relaxed">
                    Chỉ cho phép tài khoản có đuôi email sinh viên HUMG đăng ký tài khoản thi.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireHumgEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, requireHumgEmail: e.target.checked })
                  }
                  className="h-5 w-5 rounded border-border text-primary focus:ring-primary/20 mt-0.5 cursor-pointer"
                />
              </div>
            </div>

            {/* Chế độ bảo trì */}
            <div className="p-4 rounded-lg bg-surface border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Power className={cn("h-4 w-4", settings.maintenanceMode ? "text-danger" : "text-muted")} />
                  <p className="text-sm font-bold text-foreground">Chế độ bảo trì hệ thống (Maintenance Mode)</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    setSettings({ ...settings, maintenanceMode: e.target.checked })
                  }
                  className="h-5 w-5 rounded border-border text-danger focus:ring-danger/20 cursor-pointer"
                />
              </div>

              {settings.maintenanceMode && (
                <div className="pt-2 border-t border-border/60 space-y-1.5 animate-in fade-in">
                  <label className="text-xs font-semibold text-danger">
                    Lời nhắn hiển thị cho người dùng khi vào web:
                  </label>
                  <textarea
                    rows={2}
                    value={settings.maintenanceNotice}
                    onChange={(e) =>
                      setSettings({ ...settings, maintenanceNotice: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-surface-raised border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary resize-y"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Khối 3: Thông tin Cổng thi & Hỗ trợ kỹ thuật */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Thông tin Cổng thi & Liên hệ hỗ trợ CFI</CardTitle>
            </div>
            <CardDescription>
              Hiển thị trên tiêu đề website, footer và chân trang các bài thi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Tên hiển thị cổng thi
                </label>
                <input
                  type="text"
                  value={settings.siteTitle}
                  onChange={(e) =>
                    setSettings({ ...settings, siteTitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-surface border border-border rounded-lg text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Email hỗ trợ sinh viên
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, supportEmail: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-surface border border-border rounded-lg text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Hotline tư vấn
                </label>
                <input
                  type="text"
                  value={settings.supportHotline}
                  onChange={(e) =>
                    setSettings({ ...settings, supportHotline: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-surface border border-border rounded-lg text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border pt-4 flex items-center justify-between">
            <p className="text-xs text-muted">
              {settings.updatedAt ? `Lần cập nhật gần nhất: ${settings.updatedAt}` : "Đang áp dụng cấu hình mặc định"}
            </p>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSaving}
              className="gap-1.5 font-semibold text-xs shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? "Đang lưu..." : "Lưu cài đặt"}</span>
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Khối 4: Nhật ký thao tác Admin gần đây */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Nhật ký Thao tác Quản trị (Admin Audit Logs)</CardTitle>
          </div>
          <CardDescription>
            Ghi nhận tự động các lần thay đổi tham số cấu hình, khôi phục mặc định và tác vụ quản trị
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface-raised/50 text-xs font-heading text-muted">
                <tr>
                  <th className="py-3 px-4 font-semibold w-40">Thời gian</th>
                  <th className="py-3 px-4 font-semibold w-44">Hành động</th>
                  <th className="py-3 px-4 font-semibold">Nội dung chi tiết</th>
                  <th className="py-3 px-4 font-semibold w-48 text-right">Người thực hiện</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted text-xs italic">
                      Chưa có nhật ký thay đổi cài đặt nào được ghi nhận
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-raised/30 transition-colors">
                      <td className="py-3 px-4 text-xs font-mono text-muted whitespace-nowrap">
                        {log.createdAt}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[11px] font-mono">
                          {log.action}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-foreground max-w-md truncate">
                        {log.details}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-muted text-right truncate">
                        {log.performedBy}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Xác nhận Khôi phục Mặc định */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface border border-border rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-500">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                <RotateCcw className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Khôi phục cài đặt chuẩn KET?
              </h3>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              Thao tác này sẽ đặt lại thời gian thi về <strong>60 phút</strong>, dung sai mạng về <strong>30 giây</strong> và số lần nghe về <strong>2 lần</strong> chuẩn Cambridge KET ban đầu.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResetModal(false)}
              >
                Hủy bỏ
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isResetting}
                onClick={handleResetToDefault}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isResetting ? "Đang xử lý..." : "Xác nhận khôi phục"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
