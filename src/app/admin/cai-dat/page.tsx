import * as React from "react";
import { Save, Clock, Shield, Sliders } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
          Cài đặt hệ thống
        </h1>
        <p className="text-sm text-muted mt-1">
          Thiết lập thời gian làm bài thi thử mặc định, cấu hình dung sai mạng và các tham số toàn hệ thống.
        </p>
      </div>

      <div className="space-y-6">
        {/* Thời gian thi */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Cấu hình thời gian thi thử</CardTitle>
            </div>
            <CardDescription>
              Áp dụng cho toàn bộ các đề thi mô phỏng trừ khi có cài đặt riêng từng đề
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Thời gian làm bài mặc định (phút)
                </label>
                <input
                  type="number"
                  defaultValue={60}
                  className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Dung sai trễ mạng cho phép (giây)
                </label>
                <input
                  type="number"
                  defaultValue={30}
                  className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border pt-4">
            <Button size="sm" className="gap-1.5">
              <Save className="h-4 w-4" />
              <span>Lưu cài đặt</span>
            </Button>
          </CardFooter>
        </Card>

        {/* Thiết lập hiển thị & tra cứu */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-secondary" />
              <CardTitle className="text-lg">Tích hợp tra cứu điểm CFI</CardTitle>
            </div>
            <CardDescription>
              Đường dẫn cổng thông tin CFI HUMG phục vụ tra cứu kết quả
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                URL cổng kết quả thi chính thức
              </label>
              <input
                type="text"
                defaultValue="https://kqt.cfi.humg.edu.vn"
                disabled
                className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-foreground opacity-75 font-mono min-h-[44px]"
              />
              <p className="text-[11px] text-muted">
                Theo quy tắc AGENTS.md: Luôn nhúng trực tiếp kqt.cfi.humg.edu.vn, không thu thập dữ liệu điểm của sinh viên.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
